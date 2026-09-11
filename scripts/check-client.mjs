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
const exports = handoff.factory((spec) => {
  if (spec === 'react' || spec === 'react/jsx-runtime') return require(spec)
  throw new Error(`unexpected require: ${spec}`)
})

if (typeof exports.apply !== 'function') {
  throw new Error('factory did not export apply')
}
for (const name of ['slots', 'settingsScope']) {
  if (!Array.isArray(exports.inject) || !exports.inject.includes(name)) {
    throw new Error(`unexpected inject: ${JSON.stringify(exports.inject)}`)
  }
}

// 真的跑一遍 apply: 卡片能出现在设置页, 靠的是"注册到 settings.plugin.item 的
// key"与"Host 注册的 settings namespace"相等, 这里两边都断言.
const bindings = []
const registrations = []
const injections = []
const effects = []
const ctx = {
  logger: { info() {}, warn() {}, debug() {} },
  settingsScope: {
    bind(spec) {
      bindings.push(spec)
      return {
        getSnapshot: () => ({ value: undefined }),
        subscribe: () => () => {},
        set: async () => {},
      }
    },
  },
  slots: {
    inject(name, factory) {
      injections.push(name)
      factory()
    },
    register(options, component) {
      registrations.push({ options, component })
      return options
    },
  },
  effect(callback) {
    effects.push(callback)
  },
}

exports.apply(ctx)
for (const effect of effects) effect()

if (!injections.includes('settings.plugin.item')) {
  throw new Error(`apply did not inject the plugin card slot: ${JSON.stringify(injections)}`)
}
const card = registrations.find(entry => entry.options.name === 'settings.plugin.item')
if (card === undefined) {
  throw new Error('apply did not register a settings.plugin.item card')
}
// 官方那几张卡都是默认 priority 0, keyed slot 只按 priority 升序排. 没有显式
// 优先级就会退回"谁先注册谁在前", 卡片可能顶到配置页最上面.
if (!(card.options.priority > 0)) {
  throw new Error(`card priority ${card.options.priority} does not push it below the official cards`)
}

// 卡片能否出现在设置页, 取决于它的 key 与 Host 半区注册的 settings namespace
// 相等 (官方 tab 只派发两者的交集). 两边都取真实构建产物, 做交叉断言.
const host = await import(join(root, 'lib/index.js'))
let hostNamespace
host.apply({
  logger: { info() {}, debug() {} },
  inject(services, callback) {
    if (!services.includes('settings')) throw new Error(`host wants unknown services: ${services}`)
    callback({
      logger: { info() {}, debug() {} },
      settings: {
        installSection(owner, ns) {
          hostNamespace = ns
        },
      },
    })
  },
})

if (hostNamespace === undefined) {
  throw new Error('host half did not install a settings section')
}
if (card.options.key !== hostNamespace) {
  throw new Error(`card key ${card.options.key} !== host namespace ${hostNamespace}`)
}
const bound = bindings.find(spec => spec.namespace === hostNamespace)
if (bound === undefined) {
  throw new Error(`apply did not bind the ${hostNamespace} settings scope`)
}
if (typeof bound.decode !== 'function') {
  throw new Error('bound scope has no decoder')
}

console.log(`dsh-node-accent: client loader registration ok (card key "${card.options.key}")`)
