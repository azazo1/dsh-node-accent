import z from "@deepseek-ai/schemastery";
/** Host Cordis 插件名. */
const PLUGIN_NAME = "dsh-node-accent";
/** 初始配色: 中等明度, 深浅主题下都保持可读. */
const DEFAULT_COLORS = {
	search: "#3b82f6",
	agent: "#a855f7",
	execute: "#f59e0b",
	file: "#22c55e",
	task: "#ec4899",
	command: "#f97316",
	thinking: "#c4b5fd",
	context: "#8a9bb5",
	other: "#64748b"
};
/** 全部字段的初始值. */
const DEFAULT_SETTINGS = {
	paintIcon: true,
	paintTitle: true,
	colors: DEFAULT_COLORS,
	toolColors: {}
};
//#endregion
//#region src/index.ts
const name = PLUGIN_NAME;
/** Loader / settings 共用的着色 schema. */
const Config = z.object({
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
		other: z.string().default(DEFAULT_COLORS.other)
	}).default(DEFAULT_COLORS).volatile(),
	toolColors: z.dict(z.string()).default({}).volatile()
});
/**
* 在 settings 服务可用时挂上命名空间, 并把 cordis.yml 行配置作为 composition 底.
* @param ctx - Host 插件上下文.
* @param config - Loader 校验后的行配置, 缺省时使用 schema 默认值.
*/
function apply(ctx, config) {
	const resolved = {
		paintIcon: config.paintIcon.get(),
		paintTitle: config.paintTitle.get(),
		colors: config.colors.get(),
		toolColors: config.toolColors.get()
	};
	ctx.logger.info("dsh-node-accent: host loaded, paint icon=%s title=%s tools=%d", String(resolved.paintIcon), String(resolved.paintTitle), Object.keys(resolved.toolColors).length);
}
//#endregion
export { Config, apply, name };

//# sourceMappingURL=index.js.map