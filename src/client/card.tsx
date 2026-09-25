/**
 * 插件页里 dsh-node-accent 卡片的配置页.
 *
 * 骨架用官方 SettingsForm (草稿, 已覆盖标记, 保存语义与其它插件一致), 取色器与工具级
 * 覆盖编辑器自绘并嵌在表单里. 配色规则由 palette.ts 从已保存的配置生成, 所以改动要保存
 * 后才作用到会话行.
 */
import { useState, type ChangeEvent } from 'react'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import { SettingsForm, Switch, Tag } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import {
  CATEGORIES, COLORS_FIELD, PAINT_ICON_FIELD, PAINT_TITLE_FIELD, ROW_CATEGORIES, TOOL_CATEGORIES,
  TOOL_COLORS_FIELD, isCssColor,
  type AccentCategory,
} from '../shared.ts'
import { formLabels, type NodeAccentKey } from './locales.ts'
import type { NodeAccentCardFace } from './settings-form.ts'

/** 组件拿到的 props. */
export type NodeAccentCardProps =
  PropsRuntime<'plugins.bundle.config'>
  & PropsLocale<'dsh-node-accent'>
  & InjectFace<NodeAccentCardFace>

/** `<input type="color">` 只接受 `#rrggbb`. */
function swatchValue(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : '#000000'
}

/** 类别名到文案键的映射. */
const CATEGORY_KEYS: Record<AccentCategory, NodeAccentKey> = {
  search: 'categorySearch',
  agent: 'categoryAgent',
  execute: 'categoryExecute',
  file: 'categoryFile',
  task: 'categoryTask',
  goal: 'categoryGoal',
  ask: 'categoryAsk',
  deliver: 'categoryDeliver',
  skill: 'categorySkill',
  other: 'categoryOther',
  command: 'categoryCommand',
  thinking: 'categoryThinking',
  context: 'categoryContext',
  system: 'categorySystem',
  compaction: 'categoryCompaction',
  trigger: 'categoryTrigger',
}

/** 类别名到说明文案键的映射. */
const CATEGORY_HINT_KEYS: Record<AccentCategory, NodeAccentKey> = {
  search: 'categorySearchHint',
  agent: 'categoryAgentHint',
  execute: 'categoryExecuteHint',
  file: 'categoryFileHint',
  task: 'categoryTaskHint',
  goal: 'categoryGoalHint',
  ask: 'categoryAskHint',
  deliver: 'categoryDeliverHint',
  skill: 'categorySkillHint',
  other: 'categoryOtherHint',
  command: 'categoryCommandHint',
  thinking: 'categoryThinkingHint',
  context: 'categoryContextHint',
  system: 'categorySystemHint',
  compaction: 'categoryCompactionHint',
  trigger: 'categoryTriggerHint',
}

/**
 * 取色器 + 颜色值文本框.
 *
 * 文本框在输入过程中不提交 (半截的 `#ff00` 是非法颜色), 失焦或回车时才提交;
 * 提交时仍非法的输入直接丢弃, 恢复成当前值.
 */
function ColorField(props: {
  value: string
  label: string
  swatchLabel: string
  colorLabel: string
  disabled: boolean
  onCommit: (next: string) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? props.value

  const commit = (): void => {
    const next = draft
    setDraft(null)
    if (next === null || next === props.value) return
    if (!isCssColor(next)) return
    props.onCommit(next.trim())
  }

  return (
    <>
      <input
        type="color"
        className="dna-colorInput"
        value={swatchValue(props.value)}
        disabled={props.disabled}
        aria-label={`${props.label} ${props.swatchLabel}`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          props.onCommit(event.currentTarget.value)
        }}
      />
      <input
        type="text"
        className="dna-colorText"
        value={shown}
        spellCheck={false}
        disabled={props.disabled}
        aria-label={`${props.label} ${props.colorLabel}`}
        onFocus={() => { setDraft(props.value) }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => { setDraft(event.currentTarget.value) }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
      />
    </>
  )
}

/**
 * 渲染节点着色配置卡片.
 * @param props - 页面要的视图, 字典, 表单快照与动作.
 * @returns 简介文本或配置表单.
 */
export function NodeAccentSettingsCard(props: NodeAccentCardProps) {
  const { t } = props
  const state = props.useNodeAccentCard(snapshot => snapshot)
  const [confirmReset, setConfirmReset] = useState(false)
  const [draftTool, setDraftTool] = useState('')
  const [draftColor, setDraftColor] = useState('#64748b')
  if (props.view === 'summary') return t('description')

  const disabled = !state.writable
  const tools = Object.entries(state.toolColors.value)

  const addTool = (): void => {
    const tool = draftTool.trim()
    if (tool === '' || !isCssColor(draftColor)) return
    props.setPath([TOOL_COLORS_FIELD, tool], draftColor.trim())
    setDraftTool('')
  }

  const resetAll = (): void => {
    props.clearPath([PAINT_ICON_FIELD])
    props.clearPath([PAINT_TITLE_FIELD])
    for (const category of CATEGORIES) props.clearPath([COLORS_FIELD, category])
    for (const [tool] of tools) props.clearPath([TOOL_COLORS_FIELD, tool])
  }

  const badges = (overridden: boolean, onReset: () => void) => overridden
    ? (
      <span className="dna-badges">
        <Tag tone="neutral">{t('overridden')}</Tag>
        <button type="button" className="dna-reset" disabled={disabled} onClick={onReset}>
          {t('resetField')}
        </button>
      </span>
    )
    : null

  const categoryField = (category: AccentCategory) => (
    <div className="dna-field" key={category}>
      <div className="dna-head">
        <span className="dna-label">{t(CATEGORY_KEYS[category])}</span>
        {badges(state.colors[category].overridden, () => { props.clearPath([COLORS_FIELD, category]) })}
        <ColorField
          label={t(CATEGORY_KEYS[category])}
          swatchLabel={t('swatchLabel')}
          colorLabel={t('colorLabel')}
          value={state.colors[category].value}
          disabled={disabled}
          onCommit={(next) => { props.setPath([COLORS_FIELD, category], next) }}
        />
      </div>
      <p className="dna-hint">{t(CATEGORY_HINT_KEYS[category])}</p>
    </div>
  )

  return (
    <SettingsForm labels={formLabels(t)} state={state} onSave={props.save} onDiscard={props.discard}>
      <div className="dna-field">
        <div className="dna-head">
          <span className="dna-label">{t('paintTarget')}</span>
          {badges(state.paintIcon.overridden || state.paintTitle.overridden, () => {
            props.clearPath([PAINT_ICON_FIELD])
            props.clearPath([PAINT_TITLE_FIELD])
          })}
          <span className="dna-toggles">
            <span className="dna-toggle">
              <Switch
                checked={state.paintIcon.value}
                label={t('paintIcon')}
                disabled={disabled}
                onChange={(next) => { props.setPath([PAINT_ICON_FIELD], next) }}
              />
              {t('paintIcon')}
            </span>
            <span className="dna-toggle">
              <Switch
                checked={state.paintTitle.value}
                label={t('paintTitle')}
                disabled={disabled}
                onChange={(next) => { props.setPath([PAINT_TITLE_FIELD], next) }}
              />
              {t('paintTitle')}
            </span>
          </span>
        </div>
        <p className="dna-hint">{t('paintTargetHint')}</p>
      </div>

      <p className="dna-sectionTitle">{t('toolCategoryTitle')}</p>
      <p className="dna-sectionHint">{t('toolCategoryHint')}</p>
      {TOOL_CATEGORIES.map(categoryField)}

      <p className="dna-sectionTitle">{t('rowCategoryTitle')}</p>
      <p className="dna-sectionHint">{t('rowCategoryHint')}</p>
      {ROW_CATEGORIES.map(categoryField)}

      <p className="dna-sectionTitle">{t('toolTitle')}</p>
      <p className="dna-sectionHint">{t('toolHint')}</p>
      {tools.length === 0
        ? <p className="dna-empty">{t('toolEmpty')}</p>
        : tools.map(([tool, color]) => (
          <div className="dna-field" key={tool}>
            <div className="dna-head">
              <span className="dna-label dna-toolName" title={tool}>{tool}</span>
              <ColorField
                label={tool}
                swatchLabel={t('swatchLabel')}
                colorLabel={t('colorLabel')}
                value={color}
                disabled={disabled}
                onCommit={(next) => { props.setPath([TOOL_COLORS_FIELD, tool], next) }}
              />
              <button
                type="button"
                className="dna-button"
                disabled={disabled}
                onClick={() => { props.clearPath([TOOL_COLORS_FIELD, tool]) }}
              >
                {t('toolRemove')}
              </button>
            </div>
          </div>
        ))}

      <div className="dna-addRow">
        <input
          type="text"
          className="dna-toolInput"
          placeholder={t('toolNamePlaceholder')}
          value={draftTool}
          spellCheck={false}
          disabled={disabled}
          aria-label={t('toolNamePlaceholder')}
          onChange={(event: ChangeEvent<HTMLInputElement>) => { setDraftTool(event.currentTarget.value) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTool()
          }}
        />
        <input
          type="color"
          className="dna-colorInput"
          value={swatchValue(draftColor)}
          disabled={disabled}
          aria-label={t('toolAdd')}
          onChange={(event: ChangeEvent<HTMLInputElement>) => { setDraftColor(event.currentTarget.value) }}
        />
        <button
          type="button"
          className="dna-button dna-primary"
          disabled={disabled || draftTool.trim() === ''}
          onClick={addTool}
        >
          {t('toolAdd')}
        </button>
      </div>

      <div className="dna-footer">
        <span className="dna-status">{t('description')}</span>
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
            resetAll()
          }}
          onBlur={() => { setConfirmReset(false) }}
        >
          {confirmReset ? t('resetConfirm') : t('reset')}
        </button>
      </div>
    </SettingsForm>
  )
}
