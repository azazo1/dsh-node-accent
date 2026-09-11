import z from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";
//#region src/shared.d.ts
/** 按事件类别着色的可选类别. */
declare const CATEGORIES: readonly ["search", "agent", "execute", "file", "task", "command", "thinking", "context", "other"];
/** 一个可着色的事件类别. */
type AccentCategory = (typeof CATEGORIES)[number];
/** 每个类别一个 CSS 颜色值. */
type AccentColors = Record<AccentCategory, string>;
/** 用户可调的着色设置. */
interface NodeAccentSettings {
  /** 是否给行首图标上色. */
  paintIcon: boolean;
  /** 是否给行标题文字上色. */
  paintTitle: boolean;
  /** 每个事件类别的颜色. */
  colors: AccentColors;
  /** 按 wire 工具名逐个覆盖的颜色, 优先级高于类别色. */
  toolColors: Record<string, string>;
}
//#endregion
//#region src/index.d.ts
declare const name = "dsh-node-accent";
type Config = NodeAccentSettings;
/** Loader / settings 共用的着色 schema. */
declare const Config: z<NodeAccentSettings>;
/**
 * 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
declare function apply(ctx: Context, config?: NodeAccentSettings): void;
//#endregion
export { Config, apply, name };
//# sourceMappingURL=index.d.ts.map