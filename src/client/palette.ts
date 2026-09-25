/**
 * 着色样式表生成: 把配色快照翻译成一条注入 document 的 CSS 文本.
 *
 * 与对标实现 (首版色条 + 底色) 的唯一差别在最后那批消费规则: 这里只改行首图标和
 * 标题文字的 `color`, 不输出 box-shadow / background-color / padding, 因此行高,
 * 间距, hover 和展开行为都不受影响.
 */
import {
  ACCENT_VAR, isCssColor, resolveColors,
  type AccentCategory, type AccentColors, type NodeAccentSettings, type RowCategory, type ToolFamily,
} from '../shared.ts'

/**
 * 工具类别到 wire 工具名的映射, 未列出的工具一律落到 `other`.
 *
 * 只收 dsh 自带预设 (standard / minimal / ptc / web app bundle) 实际下发的工具,
 * 或 dsh 自带工具包以固定名注册的工具. 第三方插件带来的工具不进这张表, 需要单独
 * 上色时走 `toolColors` 的工具级覆盖.
 */
export const TOOL_CATEGORY_TOOLS: Record<ToolFamily, readonly string[]> = {
  search: ['web_search', 'web_fetch'],
  agent: [
    'subagent',
    'subagent_fork',
    'subagent_codex',
    'subagent_claude_code',
    'subagent_acp',
    'list_subagent_models',
    'send_message',
    'interrupt_agent',
    'list_agents',
    'workflow',
    'ralph',
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
    'job_output',
    'job_list',
    'job_kill',
    'schedule_create',
    'schedule_update',
    'schedule_list',
    'schedule_delete',
  ],
  goal: ['create_goal', 'get_goal', 'update_goal', 'exit_plan_mode'],
  ask: ['ask_user_question'],
  deliver: ['present'],
  skill: ['skill'],
}

/** 工具行的 ToolRow / PresentRow 根节点. */
const TOOL_ROW = '[data-chat-flow-kind="tool-call"] [data-tool]'

/** 命令行节点外层. */
const COMMAND_ROW = '[data-chat-flow-kind="command"]'

/** 思考行 (ReasoningRow 根节点). */
const THINK_ROW = '[data-variant="think"]'

/** 上下文注入行外层. */
const CONTEXT_ROW = '[data-chat-flow-kind="context"]'

/** 系统提示卡外层. */
const SYSTEM_PROMPT_ROW = '[data-chat-flow-kind="system-prompt"]'

/** 模型历史压缩标记行外层. */
const COMPACTION_ROW = '[data-chat-flow-kind="compaction"]'

/** 斜杠命令触发的压缩行外层. */
const MANUAL_COMPACTION_ROW = '[data-chat-flow-kind="manual-compaction"]'

/** 非人工触发的回合通知行外层. */
const TRIGGER_ROW = '[data-chat-flow-kind="turn-trigger"]'

/** DisclosureRow 行内的图标位: 工具行换上的 StateDot 带 data-state, 必须排除. */
const DISCLOSURE_ICON = '[data-disclosure-row] > :first-child svg:not([data-state])'

/** DisclosureRow 行内的标题: 恒为第 2 个子元素 (TextShimmer 渲染成 span). */
const DISCLOSURE_TITLE = '[data-disclosure-row] > span:nth-child(2)'

/** CompactionItem 的图标 (只有内容图标带 data-compaction-icon, 折叠箭头不带). */
const COMPACTION_ICON = '[data-compaction-icon] svg'

/** CompactionItem 的标题. */
const COMPACTION_TITLE = 'button > span:nth-child(2)'

/** TurnTriggerNodeView 的图标. */
const TRIGGER_ICON = '[data-turn-trigger] > button > span:nth-child(1) svg'

/** TurnTriggerNodeView 的标题. */
const TRIGGER_TITLE = '[data-turn-trigger] > button > span:nth-child(2)'

/**
 * SkillRow 的图标: 行首 span 里第一个 svg 是技能图标, 折叠箭头是它的兄弟节点.
 * `:first-child` 同时覆盖 preparing 阶段那个不带 iconIdle 包裹的裸图标.
 */
const SKILL_ICON = '> div > span:nth-child(1) svg:first-child'

/**
 * SkillRow 的标题: 状态文本 (visuallyHidden) 存在时标题在第 3 位, 不存在时在第 2 位.
 * 两个位置都写, 另一个位置命中的只会是不可见文本或 2px 分隔点, 改 color 没有副作用.
 */
const SKILL_TITLES: readonly string[] = ['> div > span:nth-child(2)', '> div > span:nth-child(3)']

/** 一个节点类别的着色目标: 行根节点加上行内的图标与标题选择器. */
interface RowPaint {
  /** 该行使用的类别色. */
  category: RowCategory
  /** 声明配色变量的行选择器. */
  row: string
  /** 行内图标选择器. */
  icons: readonly string[]
  /** 行内标题选择器. */
  titles: readonly string[]
}

/**
 * 全部按节点着色的行. 同一个类别可以有多套行结构: 手动压缩在有检查点时用
 * CompactionItem, 否则用走 DisclosureRow 的 GenericCommandCard.
 */
export const ROW_PAINTS: readonly RowPaint[] = [
  { category: 'command', row: COMMAND_ROW, icons: [DISCLOSURE_ICON], titles: [DISCLOSURE_TITLE] },
  { category: 'thinking', row: THINK_ROW, icons: [DISCLOSURE_ICON], titles: [DISCLOSURE_TITLE] },
  { category: 'context', row: CONTEXT_ROW, icons: [DISCLOSURE_ICON], titles: [DISCLOSURE_TITLE] },
  { category: 'system', row: SYSTEM_PROMPT_ROW, icons: [DISCLOSURE_ICON], titles: [DISCLOSURE_TITLE] },
  { category: 'compaction', row: COMPACTION_ROW, icons: [COMPACTION_ICON], titles: [COMPACTION_TITLE] },
  {
    category: 'compaction',
    row: MANUAL_COMPACTION_ROW,
    icons: [COMPACTION_ICON, DISCLOSURE_ICON],
    titles: [COMPACTION_TITLE, DISCLOSURE_TITLE],
  },
  { category: 'trigger', row: TRIGGER_ROW, icons: [TRIGGER_ICON], titles: [TRIGGER_TITLE] },
]

/** 不走 DisclosureRow 的工具行, 需要自己的行内选择器. */
export const SPECIAL_TOOL_ROWS: Record<string, { icons: readonly string[], titles: readonly string[] }> = {
  skill: { icons: [SKILL_ICON], titles: SKILL_TITLES },
}

/** 把工具名转义成 CSS 属性选择器里的字符串字面量. */
function attributeLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** 一个工具行的根节点选择器. */
function toolRowSelector(tool: string): string {
  return `[data-chat-flow-kind="tool-call"] [data-tool="${attributeLiteral(tool)}"]`
}

/** 取一个工具最终生效的颜色: 工具级覆盖优先, 其次类别色. */
function toolColor(
  tool: string,
  category: AccentCategory,
  colors: AccentColors,
  toolColors: Record<string, string>,
): string {
  const override = toolColors[tool]
  return typeof override === 'string' && isCssColor(override) ? override.trim() : colors[category]
}

/**
 * 生成所有 `--naccent` 声明规则.
 *
 * 兜底规则先写, 之后每个已知工具一条精确规则; 未列入类别表但配了覆盖色的工具也补
 * 一条, 否则插件工具的颜色设置会被静默丢弃.
 * @param colors - 已解析的类别配色.
 * @param toolColors - 工具级覆盖.
 * @returns 每条规则占一行的 CSS 片段.
 */
function declarationRules(
  colors: AccentColors,
  toolColors: Record<string, string>,
): string[] {
  const lines = [`${TOOL_ROW} { ${ACCENT_VAR}: ${colors.other}; }`]
  const known = new Set<string>()
  for (const [category, tools] of Object.entries(TOOL_CATEGORY_TOOLS) as [ToolFamily, readonly string[]][]) {
    for (const tool of tools) {
      known.add(tool)
      lines.push(`${toolRowSelector(tool)} { ${ACCENT_VAR}: ${toolColor(tool, category, colors, toolColors)}; }`)
    }
  }
  for (const [tool, override] of Object.entries(toolColors)) {
    if (known.has(tool) || !isCssColor(override)) continue
    lines.push(`${toolRowSelector(tool)} { ${ACCENT_VAR}: ${override.trim()}; }`)
  }
  const rows = new Map<string, RowCategory>()
  for (const paint of ROW_PAINTS) rows.set(paint.row, paint.category)
  for (const [row, category] of rows) {
    lines.push(`${row} { ${ACCENT_VAR}: ${colors[category]}; }`)
  }
  return lines
}

/**
 * 生成真正吃配色的规则.
 *
 * 只改图标和标题文字的 `color`, 因此行高, 间距, hover 和展开行为保持官方表现.
 * @param paintIcon - 是否染图标.
 * @param paintTitle - 是否染标题.
 * @returns 一条规则, 或空字符串表示两个目标都关掉了.
 */
function paintRule(paintIcon: boolean, paintTitle: boolean): string {
  const targets: string[] = []
  const push = (row: string, locals: readonly string[]): void => {
    for (const local of locals) targets.push(`${row} ${local}`)
  }
  if (paintIcon) {
    push(TOOL_ROW, [DISCLOSURE_ICON])
    for (const [tool, shape] of Object.entries(SPECIAL_TOOL_ROWS)) push(toolRowSelector(tool), shape.icons)
  }
  if (paintTitle) {
    push(TOOL_ROW, [DISCLOSURE_TITLE])
    for (const [tool, shape] of Object.entries(SPECIAL_TOOL_ROWS)) push(toolRowSelector(tool), shape.titles)
  }
  for (const paint of ROW_PAINTS) {
    if (paintIcon) push(paint.row, paint.icons)
    if (paintTitle) push(paint.row, paint.titles)
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
