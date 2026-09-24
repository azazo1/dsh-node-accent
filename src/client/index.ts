/**
 * dsh-node-accent 浏览器半区.
 *
 * 绑定本插件 profile 条目的配置表单, 把每次已保存的配置翻译成一张
 * `<style data-plugin-css="dsh-node-accent/rules">` 的内容, 并在插件页的卡片上挂配置界面.
 * 不改 DSH 源码, 不改 React 树.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { PLUGIN_ID, STYLE_ID, type NodeAccentSettings } from '../shared.ts'
import { CARD_CSS, CARD_STYLE_ID } from './card-css.ts'
import { NodeAccentSettingsCard } from './card.tsx'
import { NS, en, zh } from './locales.ts'
import { buildCss } from './palette.ts'
import type { SettingsScope } from './scope.ts'
import { NodeAccentSettingsForm } from './settings-form.ts'
import { ensureStyleTag, upsertStyleTag } from './style.ts'

export const inject = ['slots', 'locale', 'configForms']

/**
 * 用当前快照重写配色样式表.
 * @param ctx - Web Client 插件上下文, 仅用于日志.
 * @param scope - 已绑定的配置表单.
 */
function repaint(ctx: ClientContext, scope: SettingsScope<NodeAccentSettings>): void {
  const settings = scope.getSnapshot().value
  upsertStyleTag(STYLE_ID, buildCss(settings))
  ctx.logger.debug(
    'dsh-node-accent: repainted, tool overrides=%d, icon=%s, title=%s',
    Object.keys(settings?.toolColors ?? {}).length,
    String(settings?.paintIcon ?? true),
    String(settings?.paintTitle ?? true),
  )
}

/**
 * 注入配置卡样式, 订阅配色快照, 并挂上插件页的配置卡片.
 * @param ctx - Web Client 插件上下文.
 */
export function apply(ctx: ClientContext): void {
  ctx.logger.info('dsh-node-accent: client applying')
  ensureStyleTag(CARD_STYLE_ID, CARD_CSS)

  const scope = ctx.configForms.get<NodeAccentSettings>(PLUGIN_ID)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-node-accent: dictionaries')

  ctx.effect(() => {
    repaint(ctx, scope)
    return scope.subscribe(() => {
      repaint(ctx, scope)
    })
  }, 'dsh-node-accent: repaint on settings change')

  const card = new NodeAccentSettingsForm(scope)
  ctx.effect(() => () => { card.dispose() }, 'dsh-node-accent: settings form')
  ctx.effect(() => ctx.configForms.whileServed([PLUGIN_ID], () => ctx.slots.inject(
    'plugins.bundle.config',
    () => ctx.slots.register({
      name: 'plugins.bundle.config',
      key: PLUGIN_ID,
      locale: NS,
      inject: () => card.inject(),
    }, NodeAccentSettingsCard),
  )), 'dsh-node-accent: plugins page card')
}
