/**
 * dsh-node-accent Host 半区.
 *
 * 只注册可持久化的 settings 命名空间, 让 Web Settings 能保存配色. 真正的
 * 着色规则由浏览器半区按同一命名空间的快照生成, 这里不做任何 DOM 相关的事.
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-settings'
import {
  DEFAULT_COLORS, DEFAULT_SETTINGS, PLUGIN_NAME, SETTINGS_NAMESPACE,
  type NodeAccentSettings,
} from './shared.ts'

export const name = PLUGIN_NAME

export type Config = NodeAccentSettings

/** Loader / settings 共用的着色 schema. */
export const Config: z<NodeAccentSettings> = z.object({
  paintIcon: z.boolean().default(DEFAULT_SETTINGS.paintIcon),
  paintTitle: z.boolean().default(DEFAULT_SETTINGS.paintTitle),
  colors: z.object({
    search: z.string().default(DEFAULT_COLORS.search),
    agent: z.string().default(DEFAULT_COLORS.agent),
    execute: z.string().default(DEFAULT_COLORS.execute),
    file: z.string().default(DEFAULT_COLORS.file),
    task: z.string().default(DEFAULT_COLORS.task),
    command: z.string().default(DEFAULT_COLORS.command),
    thinking: z.string().default(DEFAULT_COLORS.thinking),
    context: z.string().default(DEFAULT_COLORS.context),
    other: z.string().default(DEFAULT_COLORS.other),
  }).default(DEFAULT_COLORS),
  toolColors: z.dict(z.string()).default({}),
})

/**
 * 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
export function apply(ctx: Context, config?: NodeAccentSettings): void {
  const resolved = Config(config)
  ctx.logger.info(
    'dsh-node-accent: host loaded, paint icon=%s title=%s tools=%d',
    String(resolved.paintIcon),
    String(resolved.paintTitle),
    Object.keys(resolved.toolColors).length,
  )

  ctx.inject(['settings'], (settingsCtx) => {
    let source = (): NodeAccentSettings => resolved
    settingsCtx.settings.installSection(
      ctx,
      SETTINGS_NAMESPACE,
      Config,
      resolved,
      {
        setSource: (current) => {
          source = current
        },
        onChange: () => {
          const next = source()
          settingsCtx.logger.debug(
            'dsh-node-accent: settings updated, paint icon=%s title=%s tools=%d',
            String(next.paintIcon),
            String(next.paintTitle),
            Object.keys(next.toolColors).length,
          )
        },
      },
    )
  })
}
