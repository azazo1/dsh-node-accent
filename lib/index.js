import z from "@deepseek-ai/schemastery";
/** Host Cordis 插件名. */
const PLUGIN_NAME = "dsh-node-accent";
/** 按工具名着色的类别, 不含兜底. */
const TOOL_FAMILIES = [
	"search",
	"agent",
	"execute",
	"file",
	"task",
	"goal",
	"ask",
	"deliver",
	"skill"
];
/** 兜底类别: 未列入类别表的工具都用它. */
const OTHER_CATEGORY = "other";
/** 按工具名着色的类别, 含兜底. */
const TOOL_CATEGORIES = [...TOOL_FAMILIES, OTHER_CATEGORY];
/** 按会话节点着色的类别. */
const ROW_CATEGORIES = [
	"command",
	"thinking",
	"context",
	"system",
	"compaction",
	"trigger"
];
[...TOOL_CATEGORIES, ...ROW_CATEGORIES];
/** 初始配色: 中等明度, 深浅主题下都保持可读. */
const DEFAULT_COLORS = {
	search: "#3b82f6",
	agent: "#a855f7",
	execute: "#f59e0b",
	file: "#22c55e",
	task: "#ec4899",
	goal: "#14b8a6",
	ask: "#06b6d4",
	deliver: "#84cc16",
	skill: "#d946ef",
	other: "#64748b",
	command: "#f97316",
	thinking: "#c4b5fd",
	context: "#8a9bb5",
	system: "#38bdf8",
	compaction: "#94a3b8",
	trigger: "#fb7185"
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
		goal: z.string().default(DEFAULT_COLORS.goal),
		ask: z.string().default(DEFAULT_COLORS.ask),
		deliver: z.string().default(DEFAULT_COLORS.deliver),
		skill: z.string().default(DEFAULT_COLORS.skill),
		other: z.string().default(DEFAULT_COLORS.other),
		command: z.string().default(DEFAULT_COLORS.command),
		thinking: z.string().default(DEFAULT_COLORS.thinking),
		context: z.string().default(DEFAULT_COLORS.context),
		system: z.string().default(DEFAULT_COLORS.system),
		compaction: z.string().default(DEFAULT_COLORS.compaction),
		trigger: z.string().default(DEFAULT_COLORS.trigger)
	}).default(DEFAULT_COLORS).volatile(),
	toolColors: z.dict(z.string()).default({}).volatile()
});
/**
* 报告一次装配结果; 着色规则由浏览器半区按同一份 volatile Config 生成.
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