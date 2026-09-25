/** 节点着色配置卡片的文案. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** 本插件字典的命名空间, 与包名一致. */
export const NS = 'dsh-node-accent'

/** 本插件用到的文案键. */
export type NodeAccentKey =
  | 'description'
  | 'paintTarget' | 'paintTargetHint' | 'paintIcon' | 'paintTitle'
  | 'toolCategoryTitle' | 'toolCategoryHint' | 'rowCategoryTitle' | 'rowCategoryHint'
  | 'categorySearch' | 'categorySearchHint'
  | 'categoryAgent' | 'categoryAgentHint'
  | 'categoryExecute' | 'categoryExecuteHint'
  | 'categoryFile' | 'categoryFileHint'
  | 'categoryTask' | 'categoryTaskHint'
  | 'categoryGoal' | 'categoryGoalHint'
  | 'categoryAsk' | 'categoryAskHint'
  | 'categoryDeliver' | 'categoryDeliverHint'
  | 'categorySkill' | 'categorySkillHint'
  | 'categoryOther' | 'categoryOtherHint'
  | 'categoryCommand' | 'categoryCommandHint'
  | 'categoryThinking' | 'categoryThinkingHint'
  | 'categoryContext' | 'categoryContextHint'
  | 'categorySystem' | 'categorySystemHint'
  | 'categoryCompaction' | 'categoryCompactionHint'
  | 'categoryTrigger' | 'categoryTriggerHint'
  | 'toolTitle' | 'toolHint' | 'toolEmpty' | 'toolNamePlaceholder' | 'toolAdd' | 'toolRemove'
  | 'swatchLabel' | 'colorLabel'
  | 'reset' | 'resetConfirm' | 'overridden' | 'resetField'
  | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** 本插件配置卡片的文案. */
    'dsh-node-accent': NodeAccentKey
  }
}

/** English copy. */
export const en: Record<NodeAccentKey, string> = {
  description: 'Colour the session row icon and title text by event category, with per-tool overrides.',
  paintTarget: 'Paint targets',
  paintTargetHint: 'Turning one off restores the native colour for that icon or text.',
  paintIcon: 'Icon',
  paintTitle: 'Title',
  toolCategoryTitle: 'Colour by tool category',
  toolCategoryHint: 'A tool not listed above uses the "Other tools" colour. Any tool name works in the per-tool overrides below, plugin tools included.',
  rowCategoryTitle: 'Colour by node',
  rowCategoryHint: 'The slash command, thinking, context injection, system prompt, compaction, and turn trigger rows.',
  categorySearch: 'Web search',
  categorySearchHint: 'web_search, web_fetch',
  categoryAgent: 'Agents',
  categoryAgentHint: 'subagent, subagent_fork, send_message, list_agents and friends',
  categoryExecute: 'Command execution',
  categoryExecuteHint: 'bash, pwsh, run_code, terminal_* and friends',
  categoryFile: 'File operations',
  categoryFileHint: 'read, write, edit, grep, glob and friends',
  categoryTask: 'Tasks and jobs',
  categoryTaskHint: 'todo_write, job_*, schedule_* and friends',
  categoryGoal: 'Goals and planning',
  categoryGoalHint: 'create_goal, get_goal, update_goal, exit_plan_mode',
  categoryAsk: 'Questions',
  categoryAskHint: 'ask_user_question',
  categoryDeliver: 'Deliverables',
  categoryDeliverHint: 'present',
  categorySkill: 'Skills',
  categorySkillHint: 'skill',
  categoryOther: 'Other tools',
  categoryOtherHint: 'every tool not listed above',
  categoryCommand: 'Slash command nodes',
  categoryCommandHint: 'the node a slash command renders as',
  categoryThinking: 'Thinking',
  categoryThinkingHint: 'the thinking row',
  categoryContext: 'Context injection',
  categoryContextHint: 'the context injection row',
  categorySystem: 'System prompt rows',
  categorySystemHint: 'the system prompt card',
  categoryCompaction: 'Compaction rows',
  categoryCompactionHint: 'the model history compaction marker, including /compact',
  categoryTrigger: 'Turn trigger rows',
  categoryTriggerHint: 'the notice for a turn started by a schedule, subagent, plugin, or other non-human source',
  toolTitle: 'Per-tool overrides',
  toolHint: 'A tool listed here uses this colour instead of its category colour. Any tool name is accepted, plugin tools included.',
  toolEmpty: 'No per-tool override yet.',
  toolNamePlaceholder: 'tool name, for example bash',
  toolAdd: 'Add',
  toolRemove: 'Remove',
  swatchLabel: 'colour swatch',
  colorLabel: 'colour value',
  reset: 'Reset to initial settings',
  resetConfirm: 'Click again to confirm',
  overridden: 'Overridden',
  resetField: 'Reset to default',
  readOnly: 'This deployment stores settings read-only.',
  unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
  save: 'Save',
  saving: 'Saving...',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
}

/** Simplified Chinese copy. */
export const zh: Record<NodeAccentKey, string> = {
  description: '按事件类别给会话行的图标与标题文字上色, 并可对单个工具覆盖颜色.',
  paintTarget: '着色目标',
  paintTargetHint: '关掉某一项, 对应的图标或文字恢复原生颜色.',
  paintIcon: '图标',
  paintTitle: '标题',
  toolCategoryTitle: '按工具类别配色',
  toolCategoryHint: '工具名不在表里的工具用 "其他工具" 的颜色. 任何工具名都能在下面按工具名单列颜色, 包括插件带来的工具.',
  rowCategoryTitle: '按节点配色',
  rowCategoryHint: '斜杠命令, 思考, 上下文注入, 系统提示, 上下文压缩, 触发通知这些行.',
  categorySearch: '联网搜索',
  categorySearchHint: 'web_search, web_fetch',
  categoryAgent: '智能体',
  categoryAgentHint: 'subagent, subagent_fork, send_message, list_agents 等',
  categoryExecute: '命令执行',
  categoryExecuteHint: 'bash, pwsh, run_code, terminal_* 等',
  categoryFile: '文件操作',
  categoryFileHint: 'read, write, edit, grep, glob 等',
  categoryTask: '任务与作业',
  categoryTaskHint: 'todo_write, job_*, schedule_* 等',
  categoryGoal: '目标与计划',
  categoryGoalHint: 'create_goal, get_goal, update_goal, exit_plan_mode',
  categoryAsk: '提问',
  categoryAskHint: 'ask_user_question',
  categoryDeliver: '交付与展示',
  categoryDeliverHint: 'present',
  categorySkill: '技能',
  categorySkillHint: 'skill',
  categoryOther: '其他工具',
  categoryOtherHint: '未在上面列出的工具',
  categoryCommand: '命令节点',
  categoryCommandHint: '斜杠命令渲染出的节点',
  categoryThinking: '思考过程',
  categoryThinkingHint: '思考行',
  categoryContext: '上下文注入',
  categoryContextHint: '上下文注入行',
  categorySystem: '系统提示行',
  categorySystemHint: '系统提示卡',
  categoryCompaction: '上下文压缩行',
  categoryCompactionHint: '模型历史压缩标记, 含 /compact 触发的压缩',
  categoryTrigger: '触发通知行',
  categoryTriggerHint: '由定时, 子智能体, 插件等非人工来源开启的回合通知',
  toolTitle: '按工具名覆盖',
  toolHint: '在这里单列一个工具, 它就用这里的颜色, 不再跟随类别色. 任何工具名都接受, 包括插件带来的工具.',
  toolEmpty: '还没有工具级覆盖.',
  toolNamePlaceholder: '工具名, 例如 bash',
  toolAdd: '添加',
  toolRemove: '删除',
  swatchLabel: '取色',
  colorLabel: '颜色值',
  reset: '恢复初始设置',
  resetConfirm: '再点一次确认',
  overridden: '已覆盖',
  resetField: '恢复默认',
  readOnly: '本部署的设置为只读.',
  unavailable: '该插件当前未加载, 暂时无法配置.',
  save: '保存',
  saving: '保存中...',
  saveFailed: '本部署没有接受这些值, 已保留供你修改.',
}

/**
 * 表单框架要的文案, 从本插件字典取.
 * @param t - 本插件字典的读取函数.
 * @returns 共享设置表单渲染的标签.
 */
export function formLabels(t: (key: NodeAccentKey) => string): SettingsFormLabels {
  return {
    unavailable: t('unavailable'),
    readOnly: t('readOnly'),
    saveFailed: t('saveFailed'),
    save: t('save'),
    saving: t('saving'),
  }
}
