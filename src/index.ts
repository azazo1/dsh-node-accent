/**
 * dsh-node-accent Host 半区.
 *
 * 只注册可持久化的 settings 命名空间, 让 Web Settings 能保存配色. 真正的
 * 着色规则由浏览器半区按同一命名空间的快照生成, 这里不做任何 DOM 相关的事.
 */
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import {
  DEFAULT_COLORS, DEFAULT_SETTINGS, PLUGIN_NAME,
  type NodeAccentSettings,
} from './shared.ts'

export const name = PLUGIN_NAME

export interface Config {
  paintIcon: Volatile<boolean>
  paintTitle: Volatile<boolean>
  colors: Volatile<NodeAccentSettings['colors']>
  toolColors: Volatile<Record<string, string>>
}

interface ConfigInput {
  paintIcon?: boolean
  paintTitle?: boolean
  colors?: NodeAccentSettings['colors']
  toolColors?: Record<string, string>
}

/** Loader / settings 共用的着色 schema. */
export const Config: z<ConfigInput, Config> = z.object({
  paintIcon: z.boolean().default(DEFAULT_SETTINGS.paintIcon).volatile(),
  paintTitle: z.boolean().default(DEFAULT_SETTINGS.paintTitle).volatile(),
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
  }).default(DEFAULT_COLORS).volatile(),
  toolColors: z.dict(z.string()).default({}).volatile(),
})

/**
 * 报告一次装配结果; 着色规则由浏览器半区按同一份 volatile Config 生成.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
export function apply(ctx: Context, config: Config): void {
  const resolved: NodeAccentSettings = {
    paintIcon: config.paintIcon.get(),
    paintTitle: config.paintTitle.get(),
    colors: config.colors.get(),
    toolColors: config.toolColors.get(),
  }
  ctx.logger.info(
    'dsh-node-accent: host loaded, paint icon=%s title=%s tools=%d',
    String(resolved.paintIcon),
    String(resolved.paintTitle),
    Object.keys(resolved.toolColors).length,
  )
}
