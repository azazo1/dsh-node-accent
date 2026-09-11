/**
 * 着色样式表生成: 把配色快照翻译成一条注入 document 的 CSS 文本.
 *
 * 与对标实现 (首版色条 + 底色) 的唯一差别在最后一条消费规则: 这里只改
 * DisclosureRow 行首图标和标题文字的 `color`, 不输出 box-shadow /
 * background-color / padding, 因此行高, 间距, hover 和展开行为都不受影响.
 */
import {
  ACCENT_VAR, CATEGORIES, isCssColor, resolveColors,
  type AccentCategory, type AccentColors, type NodeAccentSettings,
} from '../shared.ts'

/** 需要按类别着色的类别 (其余类别不对应独立的行). */
type ToolAccentCategory = Exclude<AccentCategory, 'command' | 'thinking' | 'context' | 'other'>

/** wire 工具名 → 类别, 未列出的工具一律落到 `other`. */
export const TOOL_CATEGORIES: Record<ToolAccentCategory, readonly string[]> = {
  search: ['web_search', 'web_fetch'],
  agent: [
    'subagent',
    'subagent_acp',
    'subagent_fork',
    'send_message',
    'interrupt_agent',
    'list_agents',
    'report',
    'workflow',
  ],
  execute: [
    'bash',
    'pwsh',
    'run_code',
    'terminal_open',
    'terminal_close',
    'terminal_list',
    'terminal_read',
    'terminal_send',
    'terminal_signal',
    'str_replace_editor',
  ],
  file: ['read', 'write', 'edit', 'read_image', 'glob', 'grep'],
  task: [
    'todo_write',
    'create_goal',
    'get_goal',
    'update_goal',
    'job_kill',
    'job_list',
    'job_output',
    'schedule_create',
    'schedule_delete',
    'schedule_list',
    'exit_plan_mode',
  ],
}

/**
 * 工具行的 ToolRow 根节点.
 *
 * `data-tool` 在整个会话流里只出现在 ToolRow, SkillRow 和 PresentRow 三处, 没有
 * 外层 wrapper 重复携带, 所以不需要再绑定 `data-variant` 来排除 wrapper.
 */
const TOOL_ROW = '[data-chat-flow-kind="tool-call"] [data-tool]'

/** 命令行节点外层. */
const COMMAND_ROW = '[data-chat-flow-kind="command"]'

/** 思考行 (ReasoningRow 根节点). */
const THINK_ROW = '[data-variant="think"]'

/** 上下文注入行外层. */
const CONTEXT_ROW = '[data-chat-flow-kind="context"]'

/** 声明配色变量并参与着色的行. */
export const ACCENTED_ROWS: readonly string[] = [TOOL_ROW, COMMAND_ROW, THINK_ROW, CONTEXT_ROW]

/** 把工具名转义成 CSS 属性选择器里的字符串字面量. */
function attributeLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * 生成所有 `--naccent` 声明规则.
 * @param colors - 已解析的类别配色.
 * @param toolColors - 工具级覆盖.
 * @returns 每条规则占一行的 CSS 片段.
 */
function declarationRules(
  colors: AccentColors,
  toolColors: Record<string, string>,
): string[] {
  const lines = [`${TOOL_ROW} { ${ACCENT_VAR}: ${colors.other}; }`]
  for (const category of CATEGORIES) {
    if (category === 'command' || category === 'thinking' || category === 'context' || category === 'other') continue
    for (const tool of TOOL_CATEGORIES[category]) {
      const override = toolColors[tool]
      const color = typeof override === 'string' && isCssColor(override) ? override : colors[category]
      lines.push(
        `[data-chat-flow-kind="tool-call"] [data-tool="${attributeLiteral(tool)}"] { ${ACCENT_VAR}: ${color}; }`,
      )
    }
  }
  lines.push(`${COMMAND_ROW} { ${ACCENT_VAR}: ${colors.command}; }`)
  lines.push(`${THINK_ROW} { ${ACCENT_VAR}: ${colors.thinking}; }`)
  lines.push(`${CONTEXT_ROW} { ${ACCENT_VAR}: ${colors.context}; }`)
  return lines
}

/**
 * 生成真正吃配色的规则.
 *
 * 图标走 `svg:not([data-state])`: 工具行在 error / stopped 状态下会把图标换成
 * StateDot, 那是状态色, 必须保持原样 (官方 DisclosureRow 也用同一个判据).
 * 标题是 DisclosureRow 里恒为第 2 个子元素的 `span`.
 * @param paintIcon - 是否染图标.
 * @param paintTitle - 是否染标题.
 * @returns 一条规则, 或空字符串表示两个目标都关掉了.
 */
function paintRule(paintIcon: boolean, paintTitle: boolean): string {
  const targets: string[] = []
  if (paintIcon) {
    for (const row of ACCENTED_ROWS) {
      targets.push(`${row} [data-disclosure-row] > :first-child svg:not([data-state])`)
    }
  }
  if (paintTitle) {
    for (const row of ACCENTED_ROWS) {
      targets.push(`${row} [data-disclosure-row] > span:nth-child(2)`)
    }
  }
  if (targets.length === 0) return ''
  return `${targets.join(',\n')} {\n  color: var(${ACCENT_VAR});\n}`
}

/**
 * 为一份 settings 快照生成完整样式表.
 * @param settings - settings 快照里的值, 可能不完整或缺失.
 * @returns 注入 `<style>` 的 CSS 文本.
 */
export function buildCss(settings: NodeAccentSettings | undefined): string {
  const colors = resolveColors(settings)
  const lines = declarationRules(colors, settings?.toolColors ?? {})
  const paint = paintRule(settings?.paintIcon ?? true, settings?.paintTitle ?? true)
  if (paint !== '') lines.push(paint)
  return lines.join('\n')
}
