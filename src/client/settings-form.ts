/**
 * 节点着色配置卡片的暂存表单.
 *
 * 官方 SettingsFormModel 只按顶层字段名寻址, 而本插件的配色挂在 `colors.<类别>` 与
 * `toolColors.<工具名>` 这类嵌套路径上, 所以这里自己实现同语义的暂存层: 草稿只留在卡片页,
 * 保存时把整批路径操作交给 Host 的 configForms.mutate 一次原子写入, 页面离开即丢弃草稿.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { SettingsFormActions, SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  CATEGORIES, COLORS_FIELD, DEFAULT_SETTINGS, PAINT_ICON_FIELD, PAINT_TITLE_FIELD, TOOL_COLORS_FIELD,
  isCssColor,
  type AccentCategory, type NodeAccentSettings,
} from '../shared.ts'
import type { FieldPath, PathOp, SettingsScope } from './scope.ts'

/** 一个字段在卡片上的状态. */
export interface FieldView<T> {
  /** 草稿生效后的值. */
  value: T
  /** user 层是否带着这个字段. */
  overridden: boolean
}

/** 卡片读到的状态. */
export interface NodeAccentCardState extends SettingsFormShell {
  /** 图标是否着色. */
  paintIcon: FieldView<boolean>
  /** 标题是否着色. */
  paintTitle: FieldView<boolean>
  /** 每个类别的颜色. */
  colors: Record<AccentCategory, FieldView<string>>
  /** 按工具名覆盖的颜色, 含尚未保存的新增项. */
  toolColors: FieldView<Record<string, string>>
}

/** 卡片注册时注入给组件的面. */
export interface NodeAccentCardFace extends SettingsFormActions {
  /** 暂存一条路径的写入. */
  setPath: (path: FieldPath, value: unknown) => void
  /** 暂存一条路径的清空, 保存后回落到组合层. */
  clearPath: (path: FieldPath) => void
  hooks: {
    /** 组件通过它读快照 (useNodeAccentCard). */
    nodeAccentCard: SnapshotStore<NodeAccentCardState>
  }
}

/** 一条草稿. */
interface Draft {
  /** 是否清空该路径. */
  clear: boolean
  /** 草稿值. */
  value?: unknown
}

/** 路径的稳定键. */
function pathKey(path: FieldPath): string {
  return path.join('.')
}

/**
 * 沿路径读一个嵌套值.
 * @param source - 原始对象.
 * @param path - 字段路径.
 * @returns 读到的值, 缺失时为 undefined.
 */
function readPath(source: unknown, path: FieldPath): unknown {
  let current: unknown = source
  for (const segment of path) {
    if (typeof current !== 'object' || current === null) return undefined
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

/** 把本插件条目的配置表单桥接成卡片的暂存表单. */
export class NodeAccentSettingsForm {
  private readonly drafts = new Map<string, Draft>()
  private readonly store: SnapshotStore<NodeAccentCardState>
  private readonly unsubscribe: () => void
  private saving = false
  private failed = false
  private baseline: number | undefined

  /**
   * @param scope - 本插件 profile 条目的共享配置表单 (ctx.configForms.get).
   */
  constructor(private readonly scope: SettingsScope<NodeAccentSettings>) {
    this.store = createSnapshotStore(this.projection())
    this.unsubscribe = scope.subscribe(() => { this.publish() })
  }

  /**
   * 构造 slot 注册要注入的面.
   * @returns 快照 hook, 路径写入动作与表单动作.
   */
  inject(): NodeAccentCardFace {
    return {
      hooks: { nodeAccentCard: this.store },
      setPath: (path, value) => { this.stage(path, { clear: false, value }) },
      clearPath: (path) => { this.stage(path, { clear: true }) },
      ...this.actions(),
    }
  }

  /** 释放对配置表单的订阅. */
  dispose(): void {
    this.unsubscribe()
  }

  /** 暂存一条路径, 首次暂存记下当时的修订号作为写入栅栏. */
  private stage(path: FieldPath, draft: Draft): void {
    this.baseline ??= this.scope.getSnapshot().revision
    this.drafts.set(pathKey(path), draft)
    this.failed = false
    this.publish()
  }

  /** 把全部草稿写成一次原子写入, 然后按 Host 接受的结果重新播种. */
  private async save(): Promise<void> {
    const ops = this.plannedOps()
    if (ops === undefined || ops.length === 0 || this.saving || !this.scope.getSnapshot().writable) return
    this.saving = true
    this.failed = false
    this.publish()
    try {
      const landed = await this.scope.mutate(ops, this.baseline)
      if (landed) {
        this.drafts.clear()
        this.baseline = undefined
      }
      this.failed = !landed
    } catch {
      this.failed = true
    } finally {
      this.saving = false
      this.publish()
    }
  }

  /**
   * 把草稿翻成路径操作.
   * @returns 操作列表; 有非法草稿时返回 undefined, 保存被拦下.
   */
  private plannedOps(): PathOp[] | undefined {
    const ops: PathOp[] = []
    for (const [key, draft] of this.drafts) {
      const path = key.split('.')
      if (draft.clear) {
        ops.push({ op: 'unset', path })
        continue
      }
      if (typeof draft.value === 'string' && !isCssColor(draft.value)) return undefined
      ops.push({ op: 'set', path, value: draft.value })
    }
    return ops
  }

  /** 表单框架要的四个动作. */
  private actions(): SettingsFormActions {
    return {
      // 本卡片的控件都直接给路径, 不用官方模型的单字段编辑入口.
      edit: () => {},
      resetField: (field) => { this.stage([field], { clear: true }) },
      save: () => { void this.save() },
      discard: () => {
        if (this.drafts.size === 0 && !this.failed) return
        this.drafts.clear()
        this.baseline = undefined
        this.failed = false
        this.publish()
      },
    }
  }

  /** 读一条路径的草稿生效值. */
  private viewOf<T>(path: FieldPath, fallback: T): FieldView<T> {
    const draft = this.drafts.get(pathKey(path))
    const snapshot = this.scope.getSnapshot()
    const overridden = readPath(snapshot.user, path) !== undefined
      || (draft !== undefined && !draft.clear)
    if (draft === undefined) {
      const value = readPath(snapshot.value, path)
      return { value: (value === undefined ? fallback : value) as T, overridden }
    }
    if (draft.clear) {
      const base = readPath(snapshot.base, path)
      return { value: (base === undefined ? fallback : base) as T, overridden: false }
    }
    return { value: draft.value as T, overridden: true }
  }

  /** 组装卡片读到的整块状态. */
  private projection(): NodeAccentCardState {
    const snapshot = this.scope.getSnapshot()
    const colors = Object.fromEntries(CATEGORIES.map(category => [
      category,
      this.viewOf<string>([COLORS_FIELD, category], DEFAULT_SETTINGS.colors[category]),
    ])) as Record<AccentCategory, FieldView<string>>

    // 工具级覆盖的键来自有效值与草稿的并集, 新增但尚未保存的工具也要显示出来.
    const tools = new Set<string>(Object.keys(this.viewOf<Record<string, string>>([TOOL_COLORS_FIELD], {}).value))
    for (const key of this.drafts.keys()) {
      if (key.startsWith(`${TOOL_COLORS_FIELD}.`)) tools.add(key.slice(TOOL_COLORS_FIELD.length + 1))
    }
    const toolColors: Record<string, string> = {}
    for (const tool of tools) {
      const view = this.viewOf<string>([TOOL_COLORS_FIELD, tool], '#64748b')
      if (!view.overridden && this.drafts.get(pathKey([TOOL_COLORS_FIELD, tool]))?.clear === true) continue
      toolColors[tool] = view.value
    }

    const invalid = this.plannedOps() === undefined
    return {
      available: snapshot.status === 'ready',
      writable: snapshot.writable,
      dirty: this.drafts.size > 0,
      invalid,
      saving: this.saving,
      failed: this.failed,
      paintIcon: this.viewOf<boolean>([PAINT_ICON_FIELD], DEFAULT_SETTINGS.paintIcon),
      paintTitle: this.viewOf<boolean>([PAINT_TITLE_FIELD], DEFAULT_SETTINGS.paintTitle),
      colors,
      toolColors: { value: toolColors, overridden: Object.keys(toolColors).length > 0 },
    }
  }

  /** 通知订阅者. */
  private publish(): void {
    this.store.set(this.projection())
  }
}
