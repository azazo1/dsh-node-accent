import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ROW_PAINTS, buildCss,
} from '../src/client/palette.ts'
import { ACCENT_VAR, DEFAULT_COLORS, DEFAULT_SETTINGS } from '../src/shared.ts'

/** CSS 里 `--naccent` 出现的次数, 用来确认每条声明规则都写出了变量. */
function accentCount(css: string): number {
  return css.split(ACCENT_VAR).length - 1
}

/** 一个工具行的声明规则文本. */
function toolRule(tool: string, color: string): string {
  return `[data-tool="${tool}"] { ${ACCENT_VAR}: ${color}; }`
}

describe('buildCss', () => {
  it('gives every tool its category color and unlisted tools the fallback', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes(`[data-tool] { ${ACCENT_VAR}: ${DEFAULT_COLORS.other}; }`))
    assert.ok(css.includes(toolRule('bash', DEFAULT_COLORS.execute)))
    assert.ok(css.includes(toolRule('read', DEFAULT_COLORS.file)))
    assert.ok(css.includes(toolRule('web_search', DEFAULT_COLORS.search)))
  })

  it('keeps every dsh built-in family in its own category', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes(toolRule('ask_user_question', DEFAULT_COLORS.ask)))
    assert.ok(css.includes(toolRule('present', DEFAULT_COLORS.deliver)))
    assert.ok(css.includes(toolRule('skill', DEFAULT_COLORS.skill)))
    assert.ok(css.includes(toolRule('create_goal', DEFAULT_COLORS.goal)))
    assert.ok(css.includes(toolRule('update_goal', DEFAULT_COLORS.goal)))
    assert.ok(css.includes(toolRule('schedule_update', DEFAULT_COLORS.task)))
    assert.ok(!css.includes('data-tool="report"'))
  })

  it('lets a per-tool override win over the category color', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, toolColors: { bash: '#ff0000' } })
    assert.ok(css.includes(toolRule('bash', '#ff0000')))
    assert.ok(css.includes(toolRule('pwsh', DEFAULT_COLORS.execute)))
  })

  it('lets a per-tool override reach a tool outside every category', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, toolColors: { chrome_open: '#ff0000' } })
    assert.ok(css.includes(toolRule('chrome_open', '#ff0000')))
  })

  it('ignores an override that is not a CSS color', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, toolColors: { bash: 'red; } html {' } })
    assert.ok(css.includes(toolRule('bash', DEFAULT_COLORS.execute)))
    assert.ok(!css.includes('html {'))

    const injected = buildCss({ ...DEFAULT_SETTINGS, toolColors: { chrome_open: 'red; } html {' } })
    assert.ok(!injected.includes('data-tool="chrome_open"'))
    assert.ok(!injected.includes('html {'))
  })

  it('prefixes every accented row with its own paint selector', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    for (const paint of ROW_PAINTS) {
      for (const title of paint.titles) {
        assert.ok(css.includes(`${paint.row} ${title}`), `missing title rule for ${paint.row}`)
      }
      for (const icon of paint.icons) {
        assert.ok(css.includes(`${paint.row} ${icon}`), `missing icon rule for ${paint.row}`)
      }
    }
  })

  it('paints the context-type rows that carry no tool name', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes(`[data-chat-flow-kind="system-prompt"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.system}; }`))
    assert.ok(css.includes(`[data-chat-flow-kind="compaction"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.compaction}; }`))
    assert.ok(css.includes(`[data-chat-flow-kind="manual-compaction"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.compaction}; }`))
    assert.ok(css.includes(`[data-chat-flow-kind="turn-trigger"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.trigger}; }`))
    assert.ok(css.includes('[data-compaction-icon] svg'))
    assert.ok(css.includes('[data-turn-trigger] > button > span:nth-child(1) svg'))
  })

  it('paints the skill row through its own structure', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes('[data-tool="skill"] > div > span:nth-child(1) svg:first-child'))
    assert.ok(css.includes('[data-tool="skill"] > div > span:nth-child(2)'))
    assert.ok(css.includes('[data-tool="skill"] > div > span:nth-child(3)'))
  })

  it('leaves the state dot out of the icon rule', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes('svg:not([data-state])'))
    assert.ok(!css.includes('> :first-child svg {'))
  })

  it('drops a paint target when its switch is off', () => {
    const noTitle = buildCss({ ...DEFAULT_SETTINGS, paintTitle: false })
    assert.ok(!noTitle.includes('span:nth-child(2)'))
    assert.ok(noTitle.includes('svg:not([data-state])'))

    const noIcon = buildCss({ ...DEFAULT_SETTINGS, paintIcon: false })
    assert.ok(!noIcon.includes('svg:not([data-state])'))
    assert.ok(noIcon.includes('span:nth-child(2)'))
  })

  it('emits nothing but color declarations', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(!css.includes('box-shadow'))
    assert.ok(!css.includes('background'))
    assert.ok(!css.includes('padding'))
  })

  it('keeps the declaration rules when both paint targets are off', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, paintIcon: false, paintTitle: false })
    assert.ok(accentCount(css) >= ROW_PAINTS.length)
    assert.ok(!css.includes('color: var('))
  })

  it('falls back to defaults for a missing snapshot', () => {
    assert.equal(buildCss(undefined), buildCss(DEFAULT_SETTINGS))
  })
})
