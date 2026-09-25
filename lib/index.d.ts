import z from "@deepseek-ai/schemastery";
import { Context, Volatile } from "@deepseek-ai/cordis";
//#region src/shared.d.ts
/** 按事件类别着色的可选类别, 工具类别在前, 节点类别在后. */
declare const CATEGORIES: readonly ["search", "agent", "execute", "file", "task", "goal", "ask", "deliver", "skill", "other", "command", "thinking", "context", "system", "compaction", "trigger"];
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
interface Config {
  paintIcon: Volatile<boolean>;
  paintTitle: Volatile<boolean>;
  colors: Volatile<NodeAccentSettings['colors']>;
  toolColors: Volatile<Record<string, string>>;
}
interface ConfigInput {
  paintIcon?: boolean;
  paintTitle?: boolean;
  colors?: NodeAccentSettings['colors'];
  toolColors?: Record<string, string>;
}
/** Loader / settings 共用的着色 schema. */
declare const Config: z<ConfigInput, Config>;
/**
 * 报告一次装配结果; 着色规则由浏览器半区按同一份 volatile Config 生成.
 * @param ctx - Host 插件上下文.
 * @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
 */
declare function apply(ctx: Context, config: Config): void;
//#endregion
export { Config, apply, name };
//# sourceMappingURL=index.d.ts.map