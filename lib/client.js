window.__ModuleLoader__.load({
	id: "dsh-node-accent",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region src/shared.ts
		/**
		* Host 与 Client 共用的插件标识, 配色契约与值校验.
		*
		* 两个半区都从这里取标识, 避免把同一批字符串写两遍; 本文件不依赖任何
		* DSH 运行时包, 因此可以同时被 Node 半区和浏览器 bundle 引用.
		*/
		/** 插件包名, Client loader 注册 id, Loader row 名共用. */
		const PLUGIN_ID = "dsh-node-accent";
		/** 配色规则样式标签的标记属性. */
		const STYLE_ATTR = "data-plugin-css";
		/** 配色规则样式标签的 id. */
		const STYLE_ID = "dsh-node-accent/rules";
		/** 承载当前行配色的 CSS 变量, 由行根节点声明, 图标和标题消费. */
		const ACCENT_VAR = "--naccent";
		/** 按事件类别着色的可选类别. */
		const CATEGORIES = [
			"search",
			"agent",
			"execute",
			"file",
			"task",
			"command",
			"thinking",
			"context",
			"other"
		];
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
		/** 是否给图标上色的字段名. */
		const PAINT_ICON_FIELD = "paintIcon";
		/** 是否给标题文字上色的字段名. */
		const PAINT_TITLE_FIELD = "paintTitle";
		/** 类别配色字段名. */
		const COLORS_FIELD = "colors";
		/** 工具级覆盖字段名. */
		const TOOL_COLORS_FIELD = "toolColors";
		/** 全部字段的初始值. */
		const DEFAULT_SETTINGS = {
			paintIcon: true,
			paintTitle: true,
			colors: DEFAULT_COLORS,
			toolColors: {}
		};
		/**
		* 判断一个配置值是否是可信的 CSS 颜色字面量.
		*
		* 只做白名单式前缀检查: 配置值直接拼进样式表, 非法值必须回落到类别默认色,
		* 而不是让一条坏规则污染整张表.
		* @param value - 用户在设置里填写的颜色.
		* @returns 是否接受这个值.
		*/
		function isCssColor(value) {
			const trimmed = value.trim();
			if (trimmed === "") return false;
			if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return true;
			return /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|device-cmyk)\(/i.test(trimmed);
		}
		/**
		* 把用户配色合并到默认配色上, 非法项逐个回落到默认值.
		* @param settings - settings 快照里的值, 可能不完整.
		* @returns 每个类别都有合法颜色的完整配色.
		*/
		function resolveColors(settings) {
			const colors = { ...DEFAULT_COLORS };
			const configured = settings?.colors;
			if (typeof configured !== "object" || configured === null) return colors;
			for (const category of CATEGORIES) {
				const value = configured[category];
				if (typeof value === "string" && isCssColor(value)) colors[category] = value;
			}
			return colors;
		}
		//#endregion
		//#region src/client/card-css.ts
		/**
		* 节点着色配置卡片的样式.
		*
		* 尺寸与间距对齐官方 fields.module.css, 颜色只用 --dsw-alias-* 语义 token.
		* 输入框的聚焦描边自 0.1.7-rc.2 起走 --dsw-alias-state-business-primary, 不再是
		* --dsw-alias-brand-primary (后者在 rc.2 只用于开关与勾选框的填充色).
		*/
		/** 样式标签的 data-plugin-css 标记. */
		const CARD_STYLE_ID = "dsh-node-accent/card";
		/** 卡片样式表. */
		const CARD_CSS = `
.dna-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
}
.dna-field + .dna-field {
  border-top: 0.5px solid var(--dsw-alias-border-l2);
}
.dna-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dna-label {
  flex: 1;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}
.dna-toolName {
  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
  overflow-wrap: anywhere;
}
.dna-badges {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.dna-reset {
  padding: 0;
  border: none;
  background: none;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
}
.dna-reset:hover:not(:disabled) { color: var(--dsw-alias-label-primary); }
.dna-reset:disabled { cursor: default; }
.dna-hint {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}
.dna-sectionTitle {
  margin: 16px 0 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}
.dna-sectionHint {
  margin: 4px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}
.dna-toggles {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex: none;
}
.dna-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dna-colorInput {
  flex: none;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  cursor: pointer;
}
.dna-colorInput:disabled { cursor: default; }
.dna-colorText,
.dna-toolInput {
  height: 34px;
  padding: 0 12px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
}
.dna-colorText { width: 140px; flex: none; }
.dna-toolInput { flex: 1; min-width: 0; }
.dna-colorText:focus-visible,
.dna-toolInput:focus-visible {
  outline: none;
  border-color: var(--dsw-alias-state-business-primary);
}
.dna-colorText:disabled,
.dna-toolInput:disabled {
  color: var(--dsw-alias-label-tertiary);
  cursor: default;
}
.dna-button {
  flex: none;
  height: 34px;
  padding: 0 12px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
}
.dna-button:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l2);
}
.dna-button:disabled { cursor: default; }
.dna-primary { color: var(--dsw-alias-label-primary); }
.dna-danger { color: var(--dsw-alias-state-error-primary); }
.dna-addRow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
}
.dna-empty {
  margin: 0;
  padding: 12px 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 1.5;
}
.dna-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 0;
  border-top: 0.5px solid var(--dsw-alias-border-l2);
}
.dna-status {
  flex: 1;
  min-width: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}
`;
		//#endregion
		//#region src/client/locales.ts
		/** 本插件字典的命名空间, 与包名一致. */
		const NS = "dsh-node-accent";
		/** English copy. */
		const en = {
			description: "Colour the session row icon and title text by event category, with per-tool overrides.",
			paintTarget: "Paint targets",
			paintTargetHint: "Turning one off restores the native colour for that icon or text.",
			paintIcon: "Icon",
			paintTitle: "Title",
			categoryTitle: "Colour by event category",
			categoryHint: "A tool not listed under per-tool overrides uses the \"Other tools\" colour.",
			categorySearch: "Web search",
			categorySearchHint: "web_search, web_fetch",
			categoryAgent: "Agents",
			categoryAgentHint: "subagent, workflow, send_message and friends",
			categoryExecute: "Command execution",
			categoryExecuteHint: "bash, pwsh, run_code, terminal_* and friends",
			categoryFile: "File operations",
			categoryFileHint: "read, write, edit, grep, glob and friends",
			categoryTask: "Tasks and goals",
			categoryTaskHint: "todo_write, create_goal, job_* and friends",
			categoryCommand: "Slash command nodes",
			categoryCommandHint: "the node a slash command renders as",
			categoryThinking: "Thinking",
			categoryThinkingHint: "the thinking row",
			categoryContext: "Context injection",
			categoryContextHint: "the context injection row",
			categoryOther: "Other tools",
			categoryOtherHint: "every tool not listed above",
			toolTitle: "Per-tool overrides",
			toolHint: "A tool listed here uses this colour instead of its category colour.",
			toolEmpty: "No per-tool override yet.",
			toolNamePlaceholder: "tool name, for example bash",
			toolAdd: "Add",
			toolRemove: "Remove",
			swatchLabel: "colour swatch",
			colorLabel: "colour value",
			reset: "Reset to initial settings",
			resetConfirm: "Click again to confirm",
			overridden: "Overridden",
			resetField: "Reset to default",
			readOnly: "This deployment stores settings read-only.",
			unavailable: "This plugin is not loaded, so it cannot be configured right now.",
			save: "Save",
			saving: "Saving...",
			saveFailed: "The deployment did not accept these values; they were left for you to correct."
		};
		/** Simplified Chinese copy. */
		const zh = {
			description: "按事件类别给会话行的图标与标题文字上色, 并可对单个工具覆盖颜色.",
			paintTarget: "着色目标",
			paintTargetHint: "关掉某一项, 对应的图标或文字恢复原生颜色.",
			paintIcon: "图标",
			paintTitle: "标题",
			categoryTitle: "按事件类别配色",
			categoryHint: "工具名不在下表里的工具, 一律用 \"其他工具\" 的颜色.",
			categorySearch: "联网搜索",
			categorySearchHint: "web_search, web_fetch",
			categoryAgent: "智能体",
			categoryAgentHint: "subagent, workflow, send_message 等",
			categoryExecute: "命令执行",
			categoryExecuteHint: "bash, pwsh, run_code, terminal_* 等",
			categoryFile: "文件操作",
			categoryFileHint: "read, write, edit, grep, glob 等",
			categoryTask: "任务与目标",
			categoryTaskHint: "todo_write, create_goal, job_* 等",
			categoryCommand: "命令节点",
			categoryCommandHint: "斜杠命令渲染出的节点",
			categoryThinking: "思考过程",
			categoryThinkingHint: "思考行",
			categoryContext: "上下文注入",
			categoryContextHint: "上下文注入行",
			categoryOther: "其他工具",
			categoryOtherHint: "未在上面列出的工具",
			toolTitle: "按工具名覆盖",
			toolHint: "在这里单列一个工具, 它就用这里的颜色, 不再跟随类别色.",
			toolEmpty: "还没有工具级覆盖.",
			toolNamePlaceholder: "工具名, 例如 bash",
			toolAdd: "添加",
			toolRemove: "删除",
			swatchLabel: "取色",
			colorLabel: "颜色值",
			reset: "恢复初始设置",
			resetConfirm: "再点一次确认",
			overridden: "已覆盖",
			resetField: "恢复默认",
			readOnly: "本部署的设置为只读.",
			unavailable: "该插件当前未加载, 暂时无法配置.",
			save: "保存",
			saving: "保存中...",
			saveFailed: "本部署没有接受这些值, 已保留供你修改."
		};
		/**
		* 表单框架要的文案, 从本插件字典取.
		* @param t - 本插件字典的读取函数.
		* @returns 共享设置表单渲染的标签.
		*/
		function formLabels(t) {
			return {
				unavailable: t("unavailable"),
				readOnly: t("readOnly"),
				saveFailed: t("saveFailed"),
				save: t("save"),
				saving: t("saving")
			};
		}
		//#endregion
		//#region src/client/card.tsx
		/**
		* 插件页里 dsh-node-accent 卡片的配置页.
		*
		* 骨架用官方 SettingsForm (草稿, 已覆盖标记, 保存语义与其它插件一致), 取色器与工具级
		* 覆盖编辑器自绘并嵌在表单里. 配色规则由 palette.ts 从已保存的配置生成, 所以改动要保存
		* 后才作用到会话行.
		*/
		/** `<input type="color">` 只接受 `#rrggbb`. */
		function swatchValue(value) {
			return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : "#000000";
		}
		/** 类别名到文案键的映射. */
		const CATEGORY_KEYS = {
			search: "categorySearch",
			agent: "categoryAgent",
			execute: "categoryExecute",
			file: "categoryFile",
			task: "categoryTask",
			command: "categoryCommand",
			thinking: "categoryThinking",
			context: "categoryContext",
			other: "categoryOther"
		};
		/** 类别名到说明文案键的映射. */
		const CATEGORY_HINT_KEYS = {
			search: "categorySearchHint",
			agent: "categoryAgentHint",
			execute: "categoryExecuteHint",
			file: "categoryFileHint",
			task: "categoryTaskHint",
			command: "categoryCommandHint",
			thinking: "categoryThinkingHint",
			context: "categoryContextHint",
			other: "categoryOtherHint"
		};
		/**
		* 取色器 + 颜色值文本框.
		*
		* 文本框在输入过程中不提交 (半截的 `#ff00` 是非法颜色), 失焦或回车时才提交;
		* 提交时仍非法的输入直接丢弃, 恢复成当前值.
		*/
		function ColorField(props) {
			const [draft, setDraft] = (0, react.useState)(null);
			const shown = draft ?? props.value;
			const commit = () => {
				const next = draft;
				setDraft(null);
				if (next === null || next === props.value) return;
				if (!isCssColor(next)) return;
				props.onCommit(next.trim());
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "color",
				className: "dna-colorInput",
				value: swatchValue(props.value),
				disabled: props.disabled,
				"aria-label": `${props.label} ${props.swatchLabel}`,
				onChange: (event) => {
					props.onCommit(event.currentTarget.value);
				}
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "text",
				className: "dna-colorText",
				value: shown,
				spellCheck: false,
				disabled: props.disabled,
				"aria-label": `${props.label} ${props.colorLabel}`,
				onFocus: () => {
					setDraft(props.value);
				},
				onChange: (event) => {
					setDraft(event.currentTarget.value);
				},
				onBlur: commit,
				onKeyDown: (event) => {
					if (event.key === "Enter") event.currentTarget.blur();
				}
			})] });
		}
		/**
		* 渲染节点着色配置卡片.
		* @param props - 页面要的视图, 字典, 表单快照与动作.
		* @returns 简介文本或配置表单.
		*/
		function NodeAccentSettingsCard(props) {
			const { t } = props;
			const state = props.useNodeAccentCard((snapshot) => snapshot);
			const [confirmReset, setConfirmReset] = (0, react.useState)(false);
			const [draftTool, setDraftTool] = (0, react.useState)("");
			const [draftColor, setDraftColor] = (0, react.useState)("#64748b");
			if (props.view === "summary") return t("description");
			const disabled = !state.writable;
			const tools = Object.entries(state.toolColors.value);
			const addTool = () => {
				const tool = draftTool.trim();
				if (tool === "" || !isCssColor(draftColor)) return;
				props.setPath([TOOL_COLORS_FIELD, tool], draftColor.trim());
				setDraftTool("");
			};
			const resetAll = () => {
				props.clearPath([PAINT_ICON_FIELD]);
				props.clearPath([PAINT_TITLE_FIELD]);
				for (const category of CATEGORIES) props.clearPath([COLORS_FIELD, category]);
				for (const [tool] of tools) props.clearPath([TOOL_COLORS_FIELD, tool]);
			};
			const badges = (overridden, onReset) => overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dna-badges",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
					tone: "neutral",
					children: t("overridden")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dna-reset",
					disabled,
					onClick: onReset,
					children: t("resetField")
				})]
			}) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.SettingsForm, {
				labels: formLabels(t),
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dna-field",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-label",
									children: t("paintTarget")
								}),
								badges(state.paintIcon.overridden || state.paintTitle.overridden, () => {
									props.clearPath([PAINT_ICON_FIELD]);
									props.clearPath([PAINT_TITLE_FIELD]);
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dna-toggles",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "dna-toggle",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
											checked: state.paintIcon.value,
											label: t("paintIcon"),
											disabled,
											onChange: (next) => {
												props.setPath([PAINT_ICON_FIELD], next);
											}
										}), t("paintIcon")]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "dna-toggle",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
											checked: state.paintTitle.value,
											label: t("paintTitle"),
											disabled,
											onChange: (next) => {
												props.setPath([PAINT_TITLE_FIELD], next);
											}
										}), t("paintTitle")]
									})]
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-hint",
							children: t("paintTargetHint")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dna-sectionTitle",
						children: t("categoryTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dna-sectionHint",
						children: t("categoryHint")
					}),
					CATEGORIES.map((category) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dna-field",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-label",
									children: t(CATEGORY_KEYS[category])
								}),
								badges(state.colors[category].overridden, () => {
									props.clearPath([COLORS_FIELD, category]);
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColorField, {
									label: t(CATEGORY_KEYS[category]),
									swatchLabel: t("swatchLabel"),
									colorLabel: t("colorLabel"),
									value: state.colors[category].value,
									disabled,
									onCommit: (next) => {
										props.setPath([COLORS_FIELD, category], next);
									}
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-hint",
							children: t(CATEGORY_HINT_KEYS[category])
						})]
					}, category)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dna-sectionTitle",
						children: t("toolTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dna-sectionHint",
						children: t("toolHint")
					}),
					tools.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dna-empty",
						children: t("toolEmpty")
					}) : tools.map(([tool, color]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dna-field",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-label dna-toolName",
									title: tool,
									children: tool
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColorField, {
									label: tool,
									swatchLabel: t("swatchLabel"),
									colorLabel: t("colorLabel"),
									value: color,
									disabled,
									onCommit: (next) => {
										props.setPath([TOOL_COLORS_FIELD, tool], next);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dna-button",
									disabled,
									onClick: () => {
										props.clearPath([TOOL_COLORS_FIELD, tool]);
									},
									children: t("toolRemove")
								})
							]
						})
					}, tool)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dna-addRow",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								className: "dna-toolInput",
								placeholder: t("toolNamePlaceholder"),
								value: draftTool,
								spellCheck: false,
								disabled,
								"aria-label": t("toolNamePlaceholder"),
								onChange: (event) => {
									setDraftTool(event.currentTarget.value);
								},
								onKeyDown: (event) => {
									if (event.key === "Enter") addTool();
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "color",
								className: "dna-colorInput",
								value: swatchValue(draftColor),
								disabled,
								"aria-label": t("toolAdd"),
								onChange: (event) => {
									setDraftColor(event.currentTarget.value);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dna-button dna-primary",
								disabled: disabled || draftTool.trim() === "",
								onClick: addTool,
								children: t("toolAdd")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dna-footer",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dna-status",
							children: t("description")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: confirmReset ? "dna-button dna-danger" : "dna-button",
							disabled,
							onClick: () => {
								if (!confirmReset) {
									setConfirmReset(true);
									return;
								}
								setConfirmReset(false);
								resetAll();
							},
							onBlur: () => {
								setConfirmReset(false);
							},
							children: confirmReset ? t("resetConfirm") : t("reset")
						})]
					})
				]
			});
		}
		//#endregion
		//#region src/client/palette.ts
		/**
		* 着色样式表生成: 把配色快照翻译成一条注入 document 的 CSS 文本.
		*
		* 与对标实现 (首版色条 + 底色) 的唯一差别在最后一条消费规则: 这里只改
		* DisclosureRow 行首图标和标题文字的 `color`, 不输出 box-shadow /
		* background-color / padding, 因此行高, 间距, hover 和展开行为都不受影响.
		*/
		/** wire 工具名 → 类别, 未列出的工具一律落到 `other`. */
		const TOOL_CATEGORIES = {
			search: ["web_search", "web_fetch"],
			agent: [
				"subagent",
				"subagent_acp",
				"subagent_fork",
				"send_message",
				"interrupt_agent",
				"list_agents",
				"report",
				"workflow"
			],
			execute: [
				"bash",
				"pwsh",
				"run_code",
				"terminal_open",
				"terminal_close",
				"terminal_list",
				"terminal_read",
				"terminal_send",
				"terminal_signal",
				"str_replace_editor"
			],
			file: [
				"read",
				"write",
				"edit",
				"read_image",
				"glob",
				"grep"
			],
			task: [
				"todo_write",
				"create_goal",
				"get_goal",
				"update_goal",
				"job_kill",
				"job_list",
				"job_output",
				"schedule_create",
				"schedule_delete",
				"schedule_list",
				"exit_plan_mode"
			]
		};
		/**
		* 工具行的 ToolRow 根节点.
		*
		* `data-tool` 在整个会话流里只出现在 ToolRow, SkillRow 和 PresentRow 三处, 没有
		* 外层 wrapper 重复携带, 所以不需要再绑定 `data-variant` 来排除 wrapper.
		*/
		const TOOL_ROW = "[data-chat-flow-kind=\"tool-call\"] [data-tool]";
		/** 命令行节点外层. */
		const COMMAND_ROW = "[data-chat-flow-kind=\"command\"]";
		/** 思考行 (ReasoningRow 根节点). */
		const THINK_ROW = "[data-variant=\"think\"]";
		/** 上下文注入行外层. */
		const CONTEXT_ROW = "[data-chat-flow-kind=\"context\"]";
		/** 声明配色变量并参与着色的行. */
		const ACCENTED_ROWS = [
			TOOL_ROW,
			COMMAND_ROW,
			THINK_ROW,
			CONTEXT_ROW
		];
		/** 把工具名转义成 CSS 属性选择器里的字符串字面量. */
		function attributeLiteral(value) {
			return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
		}
		/**
		* 生成所有 `--naccent` 声明规则.
		* @param colors - 已解析的类别配色.
		* @param toolColors - 工具级覆盖.
		* @returns 每条规则占一行的 CSS 片段.
		*/
		function declarationRules(colors, toolColors) {
			const lines = [`${TOOL_ROW} { ${ACCENT_VAR}: ${colors.other}; }`];
			for (const category of CATEGORIES) {
				if (category === "command" || category === "thinking" || category === "context" || category === "other") continue;
				for (const tool of TOOL_CATEGORIES[category]) {
					const override = toolColors[tool];
					const color = typeof override === "string" && isCssColor(override) ? override : colors[category];
					lines.push(`[data-chat-flow-kind="tool-call"] [data-tool="${attributeLiteral(tool)}"] { ${ACCENT_VAR}: ${color}; }`);
				}
			}
			lines.push(`${COMMAND_ROW} { ${ACCENT_VAR}: ${colors.command}; }`);
			lines.push(`${THINK_ROW} { ${ACCENT_VAR}: ${colors.thinking}; }`);
			lines.push(`${CONTEXT_ROW} { ${ACCENT_VAR}: ${colors.context}; }`);
			return lines;
		}
		/**
		* 生成真正吃配色的规则.
		*
		* 图标走 `svg:not([data-state])`: 工具行在 error / stopped 状态下会把图标换成
		* StateDot, 那是状态色, 必须保持原样 (官方 DisclosureRow 也用同一个判据).
		* 标题是 DisclosureRow 里恒为第 2 个子元素的 `span`.
		* @param paintIcon - 是否染图标.
		* @param paintTitle - 是否染标题.
		* @returns 一条规则, 或空字符串表示两个目标都关掉了.
		*/
		function paintRule(paintIcon, paintTitle) {
			const targets = [];
			if (paintIcon) for (const row of ACCENTED_ROWS) targets.push(`${row} [data-disclosure-row] > :first-child svg:not([data-state])`);
			if (paintTitle) for (const row of ACCENTED_ROWS) targets.push(`${row} [data-disclosure-row] > span:nth-child(2)`);
			if (targets.length === 0) return "";
			return `${targets.join(",\n")} {\n  color: var(${ACCENT_VAR});\n}`;
		}
		/**
		* 为一份 settings 快照生成完整样式表.
		* @param settings - settings 快照里的值, 可能不完整或缺失.
		* @returns 注入 `<style>` 的 CSS 文本.
		*/
		function buildCss(settings) {
			const lines = declarationRules(resolveColors(settings), settings?.toolColors ?? {});
			const paint = paintRule(settings?.paintIcon ?? true, settings?.paintTitle ?? true);
			if (paint !== "") lines.push(paint);
			return lines.join("\n");
		}
		//#endregion
		//#region src/client/settings-form.ts
		/** 路径的稳定键. */
		function pathKey(path) {
			return path.join(".");
		}
		/**
		* 沿路径读一个嵌套值.
		* @param source - 原始对象.
		* @param path - 字段路径.
		* @returns 读到的值, 缺失时为 undefined.
		*/
		function readPath(source, path) {
			let current = source;
			for (const segment of path) {
				if (typeof current !== "object" || current === null) return void 0;
				current = current[segment];
			}
			return current;
		}
		/** 把本插件条目的配置表单桥接成卡片的暂存表单. */
		var NodeAccentSettingsForm = class {
			scope;
			drafts = /* @__PURE__ */ new Map();
			store;
			unsubscribe;
			saving = false;
			failed = false;
			baseline;
			/**
			* @param scope - 本插件 profile 条目的共享配置表单 (ctx.configForms.get).
			*/
			constructor(scope) {
				this.scope = scope;
				this.store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(this.projection());
				this.unsubscribe = scope.subscribe(() => {
					this.publish();
				});
			}
			/**
			* 构造 slot 注册要注入的面.
			* @returns 快照 hook, 路径写入动作与表单动作.
			*/
			inject() {
				return {
					hooks: { nodeAccentCard: this.store },
					setPath: (path, value) => {
						this.stage(path, {
							clear: false,
							value
						});
					},
					clearPath: (path) => {
						this.stage(path, { clear: true });
					},
					...this.actions()
				};
			}
			/** 释放对配置表单的订阅. */
			dispose() {
				this.unsubscribe();
			}
			/** 暂存一条路径, 首次暂存记下当时的修订号作为写入栅栏. */
			stage(path, draft) {
				this.baseline ??= this.scope.getSnapshot().revision;
				this.drafts.set(pathKey(path), draft);
				this.failed = false;
				this.publish();
			}
			/** 把全部草稿写成一次原子写入, 然后按 Host 接受的结果重新播种. */
			async save() {
				const ops = this.plannedOps();
				if (ops === void 0 || ops.length === 0 || this.saving || !this.scope.getSnapshot().writable) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				try {
					const landed = await this.scope.mutate(ops, this.baseline);
					if (landed) {
						this.drafts.clear();
						this.baseline = void 0;
					}
					this.failed = !landed;
				} catch {
					this.failed = true;
				} finally {
					this.saving = false;
					this.publish();
				}
			}
			/**
			* 把草稿翻成路径操作.
			* @returns 操作列表; 有非法草稿时返回 undefined, 保存被拦下.
			*/
			plannedOps() {
				const ops = [];
				for (const [key, draft] of this.drafts) {
					const path = key.split(".");
					if (draft.clear) {
						ops.push({
							op: "unset",
							path
						});
						continue;
					}
					if (typeof draft.value === "string" && !isCssColor(draft.value)) return void 0;
					ops.push({
						op: "set",
						path,
						value: draft.value
					});
				}
				return ops;
			}
			/** 表单框架要的四个动作. */
			actions() {
				return {
					edit: () => {},
					resetField: (field) => {
						this.stage([field], { clear: true });
					},
					save: () => {
						this.save();
					},
					discard: () => {
						if (this.drafts.size === 0 && !this.failed) return;
						this.drafts.clear();
						this.baseline = void 0;
						this.failed = false;
						this.publish();
					}
				};
			}
			/** 读一条路径的草稿生效值. */
			viewOf(path, fallback) {
				const draft = this.drafts.get(pathKey(path));
				const snapshot = this.scope.getSnapshot();
				const overridden = readPath(snapshot.user, path) !== void 0 || draft !== void 0 && !draft.clear;
				if (draft === void 0) {
					const value = readPath(snapshot.value, path);
					return {
						value: value === void 0 ? fallback : value,
						overridden
					};
				}
				if (draft.clear) {
					const base = readPath(snapshot.base, path);
					return {
						value: base === void 0 ? fallback : base,
						overridden: false
					};
				}
				return {
					value: draft.value,
					overridden: true
				};
			}
			/** 组装卡片读到的整块状态. */
			projection() {
				const snapshot = this.scope.getSnapshot();
				const colors = Object.fromEntries(CATEGORIES.map((category) => [category, this.viewOf([COLORS_FIELD, category], DEFAULT_SETTINGS.colors[category])]));
				const tools = new Set(Object.keys(this.viewOf([TOOL_COLORS_FIELD], {}).value));
				for (const key of this.drafts.keys()) if (key.startsWith(`toolColors.`)) tools.add(key.slice(11));
				const toolColors = {};
				for (const tool of tools) {
					const view = this.viewOf([TOOL_COLORS_FIELD, tool], "#64748b");
					if (!view.overridden && this.drafts.get(pathKey(["toolColors", tool]))?.clear === true) continue;
					toolColors[tool] = view.value;
				}
				const invalid = this.plannedOps() === void 0;
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: this.drafts.size > 0,
					invalid,
					saving: this.saving,
					failed: this.failed,
					paintIcon: this.viewOf([PAINT_ICON_FIELD], DEFAULT_SETTINGS.paintIcon),
					paintTitle: this.viewOf([PAINT_TITLE_FIELD], DEFAULT_SETTINGS.paintTitle),
					colors,
					toolColors: {
						value: toolColors,
						overridden: Object.keys(toolColors).length > 0
					}
				};
			}
			/** 通知订阅者. */
			publish() {
				this.store.set(this.projection());
			}
		};
		//#endregion
		//#region src/client/style.ts
		/** 样式标签的唯一写入点: 同一个 id 只对应一个 `<style>`, 重复调用是覆盖. */
		/**
		* 插入或更新一个插件样式标签.
		* @param id - `data-plugin-css` 上的标记值, 也是本插件内唯一的样式身份.
		* @param css - 完整样式表文本.
		*/
		function upsertStyleTag(id, css) {
			if (typeof document === "undefined") return;
			let tag = document.querySelector(`style[${STYLE_ATTR}="${id}"]`);
			if (tag === null) {
				tag = document.createElement("style");
				tag.setAttribute(STYLE_ATTR, id);
				document.head.appendChild(tag);
			}
			tag.textContent = css;
		}
		/**
		* 只在标签缺失时插入, 用于内容固定的静态样式.
		* @param id - `data-plugin-css` 上的标记值.
		* @param css - 完整样式表文本.
		*/
		function ensureStyleTag(id, css) {
			if (typeof document === "undefined") return;
			if (document.querySelector(`style[data-plugin-css="${id}"]`) !== null) return;
			upsertStyleTag(id, css);
		}
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"slots",
			"locale",
			"configForms"
		];
		/**
		* 用当前快照重写配色样式表.
		* @param ctx - Web Client 插件上下文, 仅用于日志.
		* @param scope - 已绑定的配置表单.
		*/
		function repaint(ctx, scope) {
			const settings = scope.getSnapshot().value;
			upsertStyleTag(STYLE_ID, buildCss(settings));
			ctx.logger.debug("dsh-node-accent: repainted, tool overrides=%d, icon=%s, title=%s", Object.keys(settings?.toolColors ?? {}).length, String(settings?.paintIcon ?? true), String(settings?.paintTitle ?? true));
		}
		/**
		* 注入配置卡样式, 订阅配色快照, 并挂上插件页的配置卡片.
		* @param ctx - Web Client 插件上下文.
		*/
		function apply(ctx) {
			ctx.logger.info("dsh-node-accent: client applying");
			ensureStyleTag(CARD_STYLE_ID, CARD_CSS);
			const scope = ctx.configForms.get(PLUGIN_ID);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-node-accent: dictionaries");
			ctx.effect(() => {
				repaint(ctx, scope);
				return scope.subscribe(() => {
					repaint(ctx, scope);
				});
			}, "dsh-node-accent: repaint on settings change");
			const card = new NodeAccentSettingsForm(scope);
			ctx.effect(() => () => {
				card.dispose();
			}, "dsh-node-accent: settings form");
			ctx.effect(() => ctx.configForms.whileServed([PLUGIN_ID], () => ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: PLUGIN_ID,
				locale: NS,
				inject: () => card.inject()
			}, NodeAccentSettingsCard))), "dsh-node-accent: plugins page card");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map