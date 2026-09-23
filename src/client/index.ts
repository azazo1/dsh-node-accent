/**
 * dsh-node-accent 浏览器半区.
 *
 * 绑定 `node-accent` settings 命名空间, 把每次快照变化翻译成一张
 * `<style data-plugin-css="dsh-node-accent/rules">` 的内容, 并在官方 Plugins
 * 面板里挂上配置卡. 不改 DSH 源码, 不改 React 树.
 */
import { createElement } from 'react'
import {
  CARD_PRIORITY, PLUGIN_NAME, STYLE_ID,
  type NodeAccentSettings,
} from '../shared.ts'
import { CARD_CSS, CARD_STYLE_ID } from './card-css.ts'
import { NodeAccentCard } from './card.tsx'
import type { ClientContext } from './context.ts'
import { buildCss } from './palette.ts'
import type { SettingsScope } from './scope.ts'
import { ensureStyleTag, upsertStyleTag } from './style.ts'

export const inject = ['slots', 'configForms']

/**
 * 用当前快照重写配色样式表.
 * @param ctx - Web Client 插件上下文, 仅用于日志.
 * @param scope - 已绑定的 settings scope.
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
 * 注入配置卡样式, 订阅配色快照, 并挂上 Plugins 面板里的配置卡.
 * @param ctx - Web Client 插件上下文.
 */
export function apply(ctx: ClientContext): void {
  ctx.logger.info('dsh-node-accent: client applying')
  ensureStyleTag(CARD_STYLE_ID, CARD_CSS)

  const scope = ctx.configForms.get<NodeAccentSettings>(PLUGIN_NAME)

  ctx.effect(() => {
    repaint(ctx, scope)
    return scope.subscribe(() => {
      repaint(ctx, scope)
    })
  }, 'dsh-node-accent: repaint on settings change')

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register(
    { name: 'settings.plugin.item', key: PLUGIN_NAME, priority: CARD_PRIORITY },
    () => createElement(NodeAccentCard, { scope }),
  ))
}
