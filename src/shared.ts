/**
 * Host 与 Client 共用的插件标识, 配色契约与值校验.
 *
 * 两个半区都从这里取标识, 避免把同一批字符串写两遍; 本文件不依赖任何
 * DSH 运行时包, 因此可以同时被 Node 半区和浏览器 bundle 引用.
 */

/** 插件包名, Client loader 注册 id, Loader row 名共用. */
export const PLUGIN_ID = 'dsh-node-accent'

/** Host Cordis 插件名. */
export const PLUGIN_NAME = PLUGIN_ID

/** 配色规则样式标签的标记属性. */
export const STYLE_ATTR = 'data-plugin-css'

/** 配色规则样式标签的 id. */
export const STYLE_ID = 'dsh-node-accent/rules'

/** 承载当前行配色的 CSS 变量, 由行根节点声明, 图标和标题消费. */
export const ACCENT_VAR = '--naccent'

/** 按工具名着色的类别, 不含兜底. */
export const TOOL_FAMILIES = [
  'search',
  'agent',
  'execute',
  'file',
  'task',
  'goal',
  'ask',
  'deliver',
  'skill',
] as const

/** 兜底类别: 未列入类别表的工具都用它. */
export const OTHER_CATEGORY = 'other' as const

/** 按工具名着色的类别, 含兜底. */
export const TOOL_CATEGORIES = [...TOOL_FAMILIES, OTHER_CATEGORY] as const

/** 按会话节点着色的类别. */
export const ROW_CATEGORIES = [
  'command',
  'thinking',
  'context',
  'system',
  'compaction',
  'trigger',
] as const

/** 按事件类别着色的可选类别, 工具类别在前, 节点类别在后. */
export const CATEGORIES = [...TOOL_CATEGORIES, ...ROW_CATEGORIES] as const

/** 一个按工具名着色的类别. */
export type ToolFamily = (typeof TOOL_FAMILIES)[number]

/** 一个按工具名着色的类别, 含兜底. */
export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

/** 一个按会话节点着色的类别. */
export type RowCategory = (typeof ROW_CATEGORIES)[number]

/** 一个可着色的事件类别. */
export type AccentCategory = (typeof CATEGORIES)[number]

/** 每个类别一个 CSS 颜色值. */
export type AccentColors = Record<AccentCategory, string>

/** 初始配色: 中等明度, 深浅主题下都保持可读. */
export const DEFAULT_COLORS: AccentColors = {
  search: '#3b82f6',
  agent: '#a855f7',
  execute: '#f59e0b',
  file: '#22c55e',
  task: '#ec4899',
  goal: '#14b8a6',
  ask: '#06b6d4',
  deliver: '#84cc16',
  skill: '#d946ef',
  other: '#64748b',
  command: '#f97316',
  thinking: '#c4b5fd',
  context: '#8a9bb5',
  system: '#38bdf8',
  compaction: '#94a3b8',
  trigger: '#fb7185',
}

/** 是否给图标上色的字段名. */
export const PAINT_ICON_FIELD = 'paintIcon'

/** 是否给标题文字上色的字段名. */
export const PAINT_TITLE_FIELD = 'paintTitle'

/** 类别配色字段名. */
export const COLORS_FIELD = 'colors'

/** 工具级覆盖字段名. */
export const TOOL_COLORS_FIELD = 'toolColors'

/** 用户可调的着色设置. */
export interface NodeAccentSettings {
  /** 是否给行首图标上色. */
  paintIcon: boolean
  /** 是否给行标题文字上色. */
  paintTitle: boolean
  /** 每个事件类别的颜色. */
  colors: AccentColors
  /** 按 wire 工具名逐个覆盖的颜色, 优先级高于类别色. */
  toolColors: Record<string, string>
}

/** 全部字段的初始值. */
export const DEFAULT_SETTINGS: NodeAccentSettings = {
  paintIcon: true,
  paintTitle: true,
  colors: DEFAULT_COLORS,
  toolColors: {},
}

/**
 * 判断一个配置值是否是可信的 CSS 颜色字面量.
 *
 * 只做白名单式前缀检查: 配置值直接拼进样式表, 非法值必须回落到类别默认色,
 * 而不是让一条坏规则污染整张表.
 * @param value - 用户在设置里填写的颜色.
 * @returns 是否接受这个值.
 */
export function isCssColor(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed === '') return false
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return true
  return /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|device-cmyk)\(/i.test(trimmed)
}

/**
 * 把用户配色合并到默认配色上, 非法项逐个回落到默认值.
 * @param settings - settings 快照里的值, 可能不完整.
 * @returns 每个类别都有合法颜色的完整配色.
 */
export function resolveColors(settings: Partial<NodeAccentSettings> | undefined): AccentColors {
  const colors: AccentColors = { ...DEFAULT_COLORS }
  const configured = settings?.colors
  if (typeof configured !== 'object' || configured === null) return colors
  for (const category of CATEGORIES) {
    const value = (configured as Record<string, unknown>)[category]
    if (typeof value === 'string' && isCssColor(value)) colors[category] = value
  }
  return colors
}
