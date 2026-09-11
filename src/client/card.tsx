/**
 * `settings.plugin.item[node-accent]` 插件配置卡.
 *
 * 写入是即时的: 改一个颜色或翻一个开关立刻重绘会话行, 配色本身就是预览,
 * 因此没有保存按钮. 底部只放一个两段确认的 "恢复初始设置".
 */
import { useState, useSyncExternalStore, type ChangeEvent } from 'react'
import {
  CATEGORIES, COLORS_FIELD, DEFAULT_SETTINGS, PAINT_ICON_FIELD, PAINT_TITLE_FIELD,
  TOOL_COLORS_FIELD, isCssColor,
  type AccentCategory, type NodeAccentSettings,
} from '../shared.ts'
import type { SettingsScope } from './scope.ts'

/** 类别在卡片上显示的名字. */
const CATEGORY_LABELS: Record<AccentCategory, string> = {
  search: '联网搜索',
  agent: '智能体',
  execute: '命令执行',
  file: '文件操作',
  task: '任务与目标',
  command: '命令节点',
  thinking: '思考过程',
  context: '上下文注入',
  other: '其他工具',
}

/** 每个类别覆盖哪些行. */
const CATEGORY_HINTS: Record<AccentCategory, string> = {
  search: 'web_search, web_fetch',
  agent: 'subagent, workflow, send_message 等',
  execute: 'bash, pwsh, run_code, terminal_* 等',
  file: 'read, write, edit, grep, glob 等',
  task: 'todo_write, create_goal, job_* 等',
  command: '斜杠命令节点',
  thinking: '思考行',
  context: '上下文注入行',
  other: '未在上面列出的工具',
}

/** `<input type="color">` 只接受 `#rrggbb`. */
function swatchValue(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : '#000000'
}

interface ColorFieldProps {
  /** 当前颜色值. */
  value: string
  /** 取色器与文本输入的无障碍名称前缀. */
  label: string
  /** 只读状态. */
  disabled: boolean
  /** 提交一个合法颜色. */
  onCommit: (next: string) => void
}

/**
 * 取色器 + 颜色值文本框.
 *
 * 文本框在输入过程中不写回 Host (半截的 `#ff00` 是非法颜色), 失焦或回车时
 * 才提交; 提交时仍非法的输入直接丢弃, 恢复成当前值.
 */
function ColorField({ value, label, disabled, onCommit }: ColorFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? value

  const commit = (): void => {
    const next = draft
    setDraft(null)
    if (next === null || next === value) return
    if (!isCssColor(next)) return
    onCommit(next.trim())
  }

  return (
    <>
      <input
        type="color"
        className="dna-colorInput"
        value={swatchValue(value)}
        disabled={disabled}
        aria-label={`${label} 取色`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onCommit(event.currentTarget.value)
        }}
      />
      <input
        type="text"
        className="dna-colorText"
        value={shown}
        spellCheck={false}
        disabled={disabled}
        aria-label={`${label} 颜色值`}
        onFocus={() => {
          setDraft(value)
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setDraft(event.currentTarget.value)
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
      />
    </>
  )
}

interface SwitchProps {
  /** 开关的无障碍名称. */
  label: string
  /** 当前状态. */
  on: boolean
  /** 只读状态. */
  disabled: boolean
  /** 翻转开关. */
  onToggle: (next: boolean) => void
}

/** 一个开关按钮. */
function Switch({ label, on, disabled, onToggle }: SwitchProps) {
  return (
    <span className="dna-toggle">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        className={on ? 'dna-switch dna-switchOn' : 'dna-switch'}
        onClick={() => {
          onToggle(!on)
        }}
      >
        <span className="dna-knob" />
      </button>
      {label}
    </span>
  )
}

export interface NodeAccentCardProps {
  /** 已绑定的 settings scope. */
  scope: SettingsScope<NodeAccentSettings>
}

/**
 * 渲染节点着色配置卡.
 * @param props.scope - Host 命名空间的浏览器镜像.
 */
export function NodeAccentCard({ scope }: NodeAccentCardProps) {
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [draftTool, setDraftTool] = useState('')
  const [draftToolColor, setDraftToolColor] = useState('#64748b')

  const snapshot = useSyncExternalStore(
    (onChange) => scope.subscribe(onChange),
    () => scope.getSnapshot(),
  )
  const settings = snapshot.value ?? DEFAULT_SETTINGS
  const disabled = snapshot.writable === false
  const toolEntries = Object.entries(settings.toolColors)

  const setCategory = (category: AccentCategory, color: string): void => {
    void scope.set(COLORS_FIELD, { ...settings.colors, [category]: color })
  }

  const setTool = (tool: string, color: string): void => {
    void scope.set(TOOL_COLORS_FIELD, { ...settings.toolColors, [tool]: color })
  }

  const removeTool = (tool: string): void => {
    const next = { ...settings.toolColors }
    delete next[tool]
    void scope.set(TOOL_COLORS_FIELD, next)
  }

  const reset = (): void => {
    void scope.set(PAINT_ICON_FIELD, DEFAULT_SETTINGS.paintIcon)
    void scope.set(PAINT_TITLE_FIELD, DEFAULT_SETTINGS.paintTitle)
    void scope.set(COLORS_FIELD, { ...DEFAULT_SETTINGS.colors })
    void scope.set(TOOL_COLORS_FIELD, {})
  }

  const addTool = (): void => {
    const tool = draftTool.trim()
    if (tool === '' || !isCssColor(draftToolColor)) return
    setTool(tool, draftToolColor.trim())
    setDraftTool('')
  }

  return (
    <li className={open ? 'dna-card dna-open' : 'dna-card'}>
      <button
        type="button"
        className="dna-header"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <span className="dna-headText">
          <span className="dna-name">节点着色</span>
          <span className="dna-desc">
            只给会话行的图标和标题文字上色, 不加左侧色条和底色.
          </span>
        </span>
        <svg
          className={open ? 'dna-chevron dna-chevronOpen' : 'dna-chevron'}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6.5 8 10.5 12 6.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="dna-body">
          <div className="dna-row dna-rowFirst">
            <div className="dna-rowLabel">
              着色目标
              <span className="dna-rowHint">关掉某一项, 对应的图标或文字恢复原生颜色</span>
            </div>
            <div className="dna-toggles">
              <Switch
                label="图标"
                on={settings.paintIcon}
                disabled={disabled}
                onToggle={(next) => {
                  void scope.set(PAINT_ICON_FIELD, next)
                }}
              />
              <Switch
                label="标题"
                on={settings.paintTitle}
                disabled={disabled}
                onToggle={(next) => {
                  void scope.set(PAINT_TITLE_FIELD, next)
                }}
              />
            </div>
          </div>

          <p className="dna-sectionTitle">按事件类别配色</p>
          <p className="dna-sectionHint">
            工具名不在下表里的工具, 一律用 "其他工具" 的颜色.
          </p>
          {CATEGORIES.map((category) => (
            <div className="dna-row" key={category}>
              <div className="dna-rowLabel">
                {CATEGORY_LABELS[category]}
                <span className="dna-rowHint">{CATEGORY_HINTS[category]}</span>
              </div>
              <ColorField
                label={CATEGORY_LABELS[category]}
                value={settings.colors[category]}
                disabled={disabled}
                onCommit={(next) => {
                  setCategory(category, next)
                }}
              />
            </div>
          ))}

          <p className="dna-sectionTitle">按工具名覆盖</p>
          <p className="dna-sectionHint">
            在这里单列一个工具, 它就用这里的颜色, 不再跟随类别色.
          </p>
          {toolEntries.length === 0 ? (
            <p className="dna-empty">还没有工具级覆盖.</p>
          ) : (
            toolEntries.map(([tool, color]) => (
              <div className="dna-row" key={tool}>
                <span className="dna-toolName" title={tool}>{tool}</span>
                <ColorField
                  label={tool}
                  value={color}
                  disabled={disabled}
                  onCommit={(next) => {
                    setTool(tool, next)
                  }}
                />
                <button
                  type="button"
                  className="dna-button"
                  disabled={disabled}
                  onClick={() => {
                    removeTool(tool)
                  }}
                >
                  删除
                </button>
              </div>
            ))
          )}

          <div className="dna-addRow">
            <input
              type="text"
              className="dna-toolInput"
              placeholder="工具名, 例如 bash"
              value={draftTool}
              spellCheck={false}
              disabled={disabled}
              aria-label="新增覆盖的工具名"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setDraftTool(event.currentTarget.value)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addTool()
              }}
            />
            <input
              type="color"
              className="dna-colorInput"
              value={swatchValue(draftToolColor)}
              disabled={disabled}
              aria-label="新增覆盖的颜色"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setDraftToolColor(event.currentTarget.value)
              }}
            />
            <button
              type="button"
              className="dna-button dna-primary"
              disabled={disabled || draftTool.trim() === ''}
              onClick={addTool}
            >
              添加
            </button>
          </div>

          <div className="dna-footer">
            <span className="dna-status">
              改动即时生效. 与 dsh-node-appearance 不能同时启用.
            </span>
            <button
              type="button"
              className={confirmReset ? 'dna-button dna-danger' : 'dna-button'}
              disabled={disabled}
              onClick={() => {
                if (!confirmReset) {
                  setConfirmReset(true)
                  return
                }
                setConfirmReset(false)
                reset()
              }}
              onBlur={() => {
                setConfirmReset(false)
              }}
            >
              {confirmReset ? '再点一次确认' : '恢复初始设置'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
