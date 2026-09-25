import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  CATEGORIES, DEFAULT_COLORS, DEFAULT_SETTINGS, ROW_CATEGORIES, TOOL_CATEGORIES,
  isCssColor, resolveColors,
} from '../src/shared.ts'

describe('category contract', () => {
  it('partitions the categories into tool and node groups without repeats', () => {
    assert.deepEqual([...TOOL_CATEGORIES, ...ROW_CATEGORIES], [...CATEGORIES])
    assert.equal(new Set(CATEGORIES).size, CATEGORIES.length)
  })

  it('gives every category its own default color', () => {
    assert.deepEqual(Object.keys(DEFAULT_COLORS).sort(), [...CATEGORIES].sort())
    assert.equal(new Set(Object.values(DEFAULT_COLORS)).size, CATEGORIES.length)
  })
})

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
