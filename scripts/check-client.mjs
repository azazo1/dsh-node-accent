import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pluginId = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name
const code = readFileSync(join(root, 'lib/client.js'), 'utf8')

if (/^\s*import\s/m.test(code)) {
  throw new Error('client bundle still has a top-level ESM import')
}
if (/\bexport\s/.test(code)) {
  throw new Error('client bundle still has an ESM export')
}

if (!code.includes('__ModuleLoader__.load') || !code.includes(`id: "${pluginId}"`)) {
  throw new Error(`client bundle is missing __ModuleLoader__.load id ${pluginId}`)
}

let handoff
const sandbox = {
  window: {
    __ModuleLoader__: {
      load(next) {
        handoff = next
      },
    },
  },
}
sandbox.window.window = sandbox.window
vm.runInNewContext(code, sandbox, { filename: 'client.js' })

if (handoff === undefined) {
  throw new Error('client bundle did not register via __ModuleLoader__.load')
}
if (handoff.id !== pluginId) {
  throw new Error(`registered id ${handoff.id} !== ${pluginId}`)
}

const require = createRequire(import.meta.url)
// 平台模块表里的依赖: 运行时由 loader 的 require 提供. react 用本机安装的同一份顶替,
// store 与界面控件这里只要形状存在即可 — 本脚本校验的是 loader 注册, 真实挂载在运行中的
// web 实例里验证.
const componentStub = () => null
const platformModules = new Map([
  ['react', () => require('react')],
  ['react/jsx-runtime', () => require('react/jsx-runtime')],
  ['@deepseek-ai/dsh-client-store', () => ({
    createSnapshotStore: (initial) => {
      let value = initial
      return { get: () => value, set: (next) => { value = next }, subscribe: () => () => {} }
    },
  })],
  ['@deepseek-ai/dsh-client-ui-primitives', () => ({
    SettingsForm: componentStub,
    Switch: componentStub,
    Tag: componentStub,
  })],
])
const exports = handoff.factory((spec) => {
  const load = platformModules.get(spec)
  if (load === undefined) throw new Error(`unexpected require: ${spec}`)
  return load()
})

if (typeof exports.apply !== 'function') {
  throw new Error('factory did not export apply')
}
for (const name of ['slots', 'locale', 'configForms']) {
  if (!Array.isArray(exports.inject) || !exports.inject.includes(name)) {
    throw new Error(`unexpected inject: ${JSON.stringify(exports.inject)}`)
  }
}

// 真的跑一遍 apply: 卡片能出现在插件页, 靠的是"注册到 plugins.bundle.config 的 key"
// 与"Host 条目 id"相等, 这里两边都断言.
const bindings = []
const registrations = []
const injections = []
const effects = []
const ctx = {
  logger: { info() {}, warn() {}, debug() {} },
  configForms: {
    get(entryId) {
      bindings.push({ namespace: entryId })
      return {
        getSnapshot: () => ({ status: 'ready', value: undefined, base: undefined, user: undefined, revision: 0, writable: true }),
        subscribe: () => () => {},
        mutate: async () => true,
      }
    },
    whileServed(_entryIds, register) {
      register(new Set([pluginId]))
      return () => {}
    },
  },
  locale: {
    register() { return () => {} },
  },
  slots: {
    inject(name, factory) {
      injections.push(name)
      factory()
      return () => {}
    },
    register(options) {
      registrations.push({ options })
      return () => {}
    },
  },
  effect(callback) {
    effects.push(callback)
  },
}

exports.apply(ctx)
for (const effect of effects) effect()

if (!injections.includes('plugins.bundle.config')) {
  throw new Error(`apply did not inject the plugin card slot: ${JSON.stringify(injections)}`)
}
const card = registrations.find(entry => entry.options.name === 'plugins.bundle.config')
if (card === undefined) {
  throw new Error('apply did not register a plugins.bundle.config card')
}

// 卡片能否出现在插件页, 取决于它的 key 与 Host 条目 id 相等. 两边都取真实构建产物,
// 做交叉断言.
const host = await import(join(root, 'lib/index.js'))
if (typeof host.Config !== 'function' && typeof host.Config !== 'object') {
  throw new Error('host half did not export its Config schema')
}
if (card.options.key !== pluginId) {
  throw new Error(`card key ${card.options.key} !== host entry id ${pluginId}`)
}
const bound = bindings.find(spec => spec.namespace === pluginId)
if (bound === undefined) {
  throw new Error(`apply did not bind the ${pluginId} settings scope`)
}

console.log(`dsh-node-accent: client loader registration ok (card key "${card.options.key}")`)
