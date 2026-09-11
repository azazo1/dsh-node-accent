import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  CATEGORIES, DEFAULT_COLORS, DEFAULT_SETTINGS, decodeNodeAccentSettings, isCssColor,
  resolveColors,
} from '../src/shared.ts'

describe('isCssColor', () => {
  it('accepts hex and color functions', () => {
    for (const value of ['#fff', '#f59e0b', '#f59e0bcc', 'rgb(1, 2, 3)', 'oklch(0.7 0.1 200)']) {
      assert.equal(isCssColor(value), true, value)
    }
  })

  it('rejects blanks, keywords, and rule-breaking payloads', () => {
    for (const value of ['', '   ', 'red', 'var(--x)', '#ff0000; } html {']) {
      assert.equal(isCssColor(value), false, value)
    }
  })
})

describe('resolveColors', () => {
  it('returns the defaults when nothing is configured', () => {
    assert.deepEqual(resolveColors(undefined), DEFAULT_COLORS)
  })

  it('keeps valid entries and replaces invalid ones', () => {
    const colors = resolveColors({ colors: { bash: '#000', execute: 'nope' } } as never)
    assert.equal(colors.execute, DEFAULT_COLORS.execute)
    assert.equal(colors.file, DEFAULT_COLORS.file)
  })

  it('never invents a category the plugin does not paint', () => {
    const colors = resolveColors({ colors: { steering: '#14b8a6' } } as never)
    assert.deepEqual(Object.keys(colors).sort(), [...CATEGORIES].sort())
  })
})

describe('decodeNodeAccentSettings', () => {
  it('returns undefined for a non-object section', () => {
    assert.equal(decodeNodeAccentSettings(null), undefined)
    assert.equal(decodeNodeAccentSettings('x'), undefined)
  })

  it('fills every field for an empty section', () => {
    assert.deepEqual(decodeNodeAccentSettings({}), DEFAULT_SETTINGS)
  })

  it('reads the switches and drops unusable tool overrides', () => {
    const decoded = decodeNodeAccentSettings({
      paintIcon: false,
      paintTitle: true,
      colors: { execute: '#123456' },
      toolColors: { bash: '#ff0000', broken: 'red' },
    })
    assert.equal(decoded?.paintIcon, false)
    assert.equal(decoded?.paintTitle, true)
    assert.equal(decoded?.colors.execute, '#123456')
    assert.equal(decoded?.colors.file, DEFAULT_COLORS.file)
    assert.deepEqual(decoded?.toolColors, { bash: '#ff0000' })
  })
})
