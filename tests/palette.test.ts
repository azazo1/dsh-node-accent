import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ACCENTED_ROWS, buildCss,
} from '../src/client/palette.ts'
import { ACCENT_VAR, DEFAULT_COLORS, DEFAULT_SETTINGS } from '../src/shared.ts'

/** CSS 里 `--naccent` 出现的次数, 用来确认每条声明规则都写出了变量. */
function accentCount(css: string): number {
  return css.split(ACCENT_VAR).length - 1
}

describe('buildCss', () => {
  it('gives every tool its category color and unlisted tools the fallback', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    assert.ok(css.includes(`[data-tool] { ${ACCENT_VAR}: ${DEFAULT_COLORS.other}; }`))
    assert.ok(css.includes(`[data-tool="bash"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.execute}; }`))
    assert.ok(css.includes(`[data-tool="read"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.file}; }`))
    assert.ok(css.includes(`[data-tool="web_search"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.search}; }`))
  })

  it('lets a per-tool override win over the category color', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, toolColors: { bash: '#ff0000' } })
    assert.ok(css.includes(`[data-tool="bash"] { ${ACCENT_VAR}: #ff0000; }`))
    assert.ok(css.includes(`[data-tool="pwsh"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.execute}; }`))
  })

  it('ignores an override that is not a CSS color', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, toolColors: { bash: 'red; } html {' } })
    assert.ok(css.includes(`[data-tool="bash"] { ${ACCENT_VAR}: ${DEFAULT_COLORS.execute}; }`))
    assert.ok(!css.includes('html {'))
  })

  it('prefixes every accented row with its own paint selector', () => {
    const css = buildCss(DEFAULT_SETTINGS)
    for (const row of ACCENTED_ROWS) {
      assert.ok(
        css.includes(`${row} [data-disclosure-row] > span:nth-child(2)`),
        `missing title rule for ${row}`,
      )
      assert.ok(
        css.includes(`${row} [data-disclosure-row] > :first-child svg:not([data-state])`),
        `missing icon rule for ${row}`,
      )
    }
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

  it('keeps the declaration rules when both paint targets are off', () => {
    const css = buildCss({ ...DEFAULT_SETTINGS, paintIcon: false, paintTitle: false })
    assert.ok(accentCount(css) >= ACCENTED_ROWS.length)
    assert.ok(!css.includes('color: var('))
  })

  it('falls back to defaults for a missing snapshot', () => {
    assert.equal(buildCss(undefined), buildCss(DEFAULT_SETTINGS))
  })
})
