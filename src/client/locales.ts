/** 节点着色配置卡片的文案. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** 本插件字典的命名空间, 与包名一致. */
export const NS = 'dsh-node-accent'

/** 本插件用到的文案键. */
export type NodeAccentKey =
  | 'description'
  | 'paintTarget' | 'paintTargetHint' | 'paintIcon' | 'paintTitle'
  | 'categoryTitle' | 'categoryHint'
  | 'categorySearch' | 'categorySearchHint'
  | 'categoryAgent' | 'categoryAgentHint'
  | 'categoryExecute' | 'categoryExecuteHint'
  | 'categoryFile' | 'categoryFileHint'
  | 'categoryTask' | 'categoryTaskHint'
  | 'categoryCommand' | 'categoryCommandHint'
  | 'categoryThinking' | 'categoryThinkingHint'
  | 'categoryContext' | 'categoryContextHint'
  | 'categoryOther' | 'categoryOtherHint'
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
  categoryTitle: 'Colour by event category',
  categoryHint: 'A tool not listed under per-tool overrides uses the "Other tools" colour.',
  categorySearch: 'Web search',
  categorySearchHint: 'web_search, web_fetch',
  categoryAgent: 'Agents',
  categoryAgentHint: 'subagent, workflow, send_message and friends',
  categoryExecute: 'Command execution',
  categoryExecuteHint: 'bash, pwsh, run_code, terminal_* and friends',
  categoryFile: 'File operations',
  categoryFileHint: 'read, write, edit, grep, glob and friends',
  categoryTask: 'Tasks and goals',
  categoryTaskHint: 'todo_write, create_goal, job_* and friends',
  categoryCommand: 'Slash command nodes',
  categoryCommandHint: 'the node a slash command renders as',
  categoryThinking: 'Thinking',
  categoryThinkingHint: 'the thinking row',
  categoryContext: 'Context injection',
  categoryContextHint: 'the context injection row',
  categoryOther: 'Other tools',
  categoryOtherHint: 'every tool not listed above',
  toolTitle: 'Per-tool overrides',
  toolHint: 'A tool listed here uses this colour instead of its category colour.',
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
  categoryTitle: '按事件类别配色',
  categoryHint: '工具名不在下表里的工具, 一律用 "其他工具" 的颜色.',
  categorySearch: '联网搜索',
  categorySearchHint: 'web_search, web_fetch',
  categoryAgent: '智能体',
  categoryAgentHint: 'subagent, workflow, send_message 等',
  categoryExecute: '命令执行',
  categoryExecuteHint: 'bash, pwsh, run_code, terminal_* 等',
  categoryFile: '文件操作',
  categoryFileHint: 'read, write, edit, grep, glob 等',
  categoryTask: '任务与目标',
  categoryTaskHint: 'todo_write, create_goal, job_* 等',
  categoryCommand: '命令节点',
  categoryCommandHint: '斜杠命令渲染出的节点',
  categoryThinking: '思考过程',
  categoryThinkingHint: '思考行',
  categoryContext: '上下文注入',
  categoryContextHint: '上下文注入行',
  categoryOther: '其他工具',
  categoryOtherHint: '未在上面列出的工具',
  toolTitle: '按工具名覆盖',
  toolHint: '在这里单列一个工具, 它就用这里的颜色, 不再跟随类别色.',
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
