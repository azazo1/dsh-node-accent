window.__ModuleLoader__.load({
	id: "dsh-node-accent",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		/** Host Cordis 插件名. */
		const PLUGIN_NAME = "dsh-node-accent";
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
		* 设置卡的静态样式.
		*
		* 卡片外观沿用官方 Plugins 面板的卡片语言 (卡片壳, 名称压描述, chevron
		* disclosure), 只使用 DSH 主题 token. 这里手写而不是复用官方卡片组件: 特性
		* 插件跨包做值导入会触发 Client bundle 纯度门禁.
		*/
		/** 设置卡样式的标签 id. */
		const CARD_STYLE_ID = "dsh-node-accent/card";
		/** 设置卡样式表. */
		const CARD_CSS = `
.dna-card {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  border-radius: 12px;
  list-style: none;
  transition: border-color .16s, background .16s;
}

.dna-card:hover {
  border-color: var(--dsw-alias-label-dimmed);
}

.dna-open {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-label-dimmed);
}

.dna-header {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.dna-header:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}

.dna-headText {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.dna-name {
  color: var(--dsw-alias-label-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.dna-desc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 1.5;
}

.dna-chevron {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform .16s;
}

.dna-chevronOpen {
  transform: rotate(180deg);
}

.dna-body {
  margin: 0 16px;
  padding-bottom: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.dna-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px 0 4px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.dna-rowFirst,
.dna-row:first-child {
  margin-top: 4px;
  border-top: none;
}

.dna-rowLabel {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.dna-rowHint {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
}

.dna-colorInput {
  flex: none;
  width: 34px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  cursor: pointer;
}

.dna-colorText {
  flex: none;
  width: 112px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
}

.dna-colorText:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  outline: none;
}

.dna-sectionTitle {
  margin: 14px 0 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.dna-sectionHint {
  margin: 4px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}

.dna-toolName {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 13px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dna-empty {
  margin: 8px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}

.dna-addRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 12px;
}

.dna-toolInput {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
}

.dna-toolInput:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  outline: none;
}

.dna-toolInput::placeholder {
  color: var(--dsw-alias-label-tertiary);
}

.dna-button {
  appearance: none;
  flex: none;
  padding: 5px 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
}

.dna-button:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-dimmed);
}

.dna-button:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}

.dna-button:disabled {
  opacity: .4;
  cursor: default;
}

.dna-primary {
  border-color: transparent;
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-layer-3);
}

.dna-primary:hover:not(:disabled) {
  border-color: transparent;
  color: var(--dsw-alias-bg-layer-3);
}

.dna-danger {
  border-color: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-state-error-primary);
}

.dna-toggles {
  display: flex;
  flex: none;
  align-items: center;
  gap: 12px;
}

.dna-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.dna-switch {
  flex: none;
  width: 40px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 11px;
  background: var(--dsw-alias-border-l4, rgba(0, 0, 0, .16));
  cursor: pointer;
  transition: background .15s;
}

.dna-switchOn {
  background: var(--dsw-alias-state-business-primary, #4fc3f7);
}

.dna-switch:disabled {
  opacity: .45;
  cursor: default;
}

.dna-switch:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dna-knob {
  display: block;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  border-radius: 8px;
  background: #fff;
  pointer-events: none;
  transition: margin-left .15s;
}

.dna-switchOn .dna-knob {
  margin-left: 22px;
}

.dna-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 16px 0 4px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.dna-status {
  margin-right: auto;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .dna-row {
    flex-wrap: wrap;
  }

  .dna-toggles {
    width: 100%;
    justify-content: flex-start;
  }

  .dna-colorText {
    flex: 1;
    width: auto;
  }
}
`.trim();
		//#endregion
		//#region src/client/card.tsx
		/**
		* `settings.plugin.item[node-accent]` 插件配置卡.
		*
		* 写入是即时的: 改一个颜色或翻一个开关立刻重绘会话行, 配色本身就是预览,
		* 因此没有保存按钮. 底部只放一个两段确认的 "恢复初始设置".
		*/
		/** 类别在卡片上显示的名字. */
		const CATEGORY_LABELS = {
			search: "联网搜索",
			agent: "智能体",
			execute: "命令执行",
			file: "文件操作",
			task: "任务与目标",
			command: "命令节点",
			thinking: "思考过程",
			context: "上下文注入",
			other: "其他工具"
		};
		/** 每个类别覆盖哪些行. */
		const CATEGORY_HINTS = {
			search: "web_search, web_fetch",
			agent: "subagent, workflow, send_message 等",
			execute: "bash, pwsh, run_code, terminal_* 等",
			file: "read, write, edit, grep, glob 等",
			task: "todo_write, create_goal, job_* 等",
			command: "斜杠命令节点",
			thinking: "思考行",
			context: "上下文注入行",
			other: "未在上面列出的工具"
		};
		/** `<input type="color">` 只接受 `#rrggbb`. */
		function swatchValue(value) {
			return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : "#000000";
		}
		/**
		* 取色器 + 颜色值文本框.
		*
		* 文本框在输入过程中不写回 Host (半截的 `#ff00` 是非法颜色), 失焦或回车时
		* 才提交; 提交时仍非法的输入直接丢弃, 恢复成当前值.
		*/
		function ColorField({ value, label, disabled, onCommit }) {
			const [draft, setDraft] = (0, react.useState)(null);
			const shown = draft ?? value;
			const commit = () => {
				const next = draft;
				setDraft(null);
				if (next === null || next === value) return;
				if (!isCssColor(next)) return;
				onCommit(next.trim());
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "color",
				className: "dna-colorInput",
				value: swatchValue(value),
				disabled,
				"aria-label": `${label} 取色`,
				onChange: (event) => {
					onCommit(event.currentTarget.value);
				}
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "text",
				className: "dna-colorText",
				value: shown,
				spellCheck: false,
				disabled,
				"aria-label": `${label} 颜色值`,
				onFocus: () => {
					setDraft(value);
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
		/** 一个开关按钮. */
		function Switch({ label, on, disabled, onToggle }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dna-toggle",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": on,
					"aria-label": label,
					disabled,
					className: on ? "dna-switch dna-switchOn" : "dna-switch",
					onClick: () => {
						onToggle(!on);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dna-knob" })
				}), label]
			});
		}
		/**
		* 渲染节点着色配置卡.
		* @param props.scope - Host 命名空间的浏览器镜像.
		*/
		function NodeAccentCard({ scope }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [confirmReset, setConfirmReset] = (0, react.useState)(false);
			const [draftTool, setDraftTool] = (0, react.useState)("");
			const [draftToolColor, setDraftToolColor] = (0, react.useState)("#64748b");
			const snapshot = (0, react.useSyncExternalStore)((onChange) => scope.subscribe(onChange), () => scope.getSnapshot());
			const settings = snapshot.value ?? DEFAULT_SETTINGS;
			const disabled = snapshot.writable === false;
			const toolEntries = Object.entries(settings.toolColors);
			const setCategory = (category, color) => {
				scope.set(COLORS_FIELD, {
					...settings.colors,
					[category]: color
				});
			};
			const setTool = (tool, color) => {
				scope.set(TOOL_COLORS_FIELD, {
					...settings.toolColors,
					[tool]: color
				});
			};
			const removeTool = (tool) => {
				const next = { ...settings.toolColors };
				delete next[tool];
				scope.set(TOOL_COLORS_FIELD, next);
			};
			const reset = () => {
				scope.set(PAINT_ICON_FIELD, DEFAULT_SETTINGS.paintIcon);
				scope.set(PAINT_TITLE_FIELD, DEFAULT_SETTINGS.paintTitle);
				scope.set(COLORS_FIELD, { ...DEFAULT_SETTINGS.colors });
				scope.set(TOOL_COLORS_FIELD, {});
			};
			const addTool = () => {
				const tool = draftTool.trim();
				if (tool === "" || !isCssColor(draftToolColor)) return;
				setTool(tool, draftToolColor.trim());
				setDraftTool("");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: open ? "dna-card dna-open" : "dna-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dna-header",
					"aria-expanded": open,
					onClick: () => {
						setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dna-headText",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dna-name",
							children: "节点着色"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dna-desc",
							children: "只给会话行的图标和标题文字上色, 不加左侧色条和底色."
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						className: open ? "dna-chevron dna-chevronOpen" : "dna-chevron",
						width: "16",
						height: "16",
						viewBox: "0 0 16 16",
						fill: "none",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M4 6.5 8 10.5 12 6.5",
							stroke: "currentColor",
							strokeWidth: "1.4",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dna-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-row dna-rowFirst",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dna-rowLabel",
								children: ["着色目标", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-rowHint",
									children: "关掉某一项, 对应的图标或文字恢复原生颜色"
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dna-toggles",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
									label: "图标",
									on: settings.paintIcon,
									disabled,
									onToggle: (next) => {
										scope.set("paintIcon", next);
									}
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
									label: "标题",
									on: settings.paintTitle,
									disabled,
									onToggle: (next) => {
										scope.set("paintTitle", next);
									}
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-sectionTitle",
							children: "按事件类别配色"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-sectionHint",
							children: "工具名不在下表里的工具, 一律用 \"其他工具\" 的颜色."
						}),
						CATEGORIES.map((category) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-row",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dna-rowLabel",
								children: [CATEGORY_LABELS[category], /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-rowHint",
									children: CATEGORY_HINTS[category]
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColorField, {
								label: CATEGORY_LABELS[category],
								value: settings.colors[category],
								disabled,
								onCommit: (next) => {
									setCategory(category, next);
								}
							})]
						}, category)),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-sectionTitle",
							children: "按工具名覆盖"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-sectionHint",
							children: "在这里单列一个工具, 它就用这里的颜色, 不再跟随类别色."
						}),
						toolEntries.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dna-empty",
							children: "还没有工具级覆盖."
						}) : toolEntries.map(([tool, color]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-row",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dna-toolName",
									title: tool,
									children: tool
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColorField, {
									label: tool,
									value: color,
									disabled,
									onCommit: (next) => {
										setTool(tool, next);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dna-button",
									disabled,
									onClick: () => {
										removeTool(tool);
									},
									children: "删除"
								})
							]
						}, tool)),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-addRow",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "text",
									className: "dna-toolInput",
									placeholder: "工具名, 例如 bash",
									value: draftTool,
									spellCheck: false,
									disabled,
									"aria-label": "新增覆盖的工具名",
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
									value: swatchValue(draftToolColor),
									disabled,
									"aria-label": "新增覆盖的颜色",
									onChange: (event) => {
										setDraftToolColor(event.currentTarget.value);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dna-button dna-primary",
									disabled: disabled || draftTool.trim() === "",
									onClick: addTool,
									children: "添加"
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dna-footer",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dna-status",
								children: "改动即时生效. 与 dsh-node-appearance 类插件不能同时启用."
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
									reset();
								},
								onBlur: () => {
									setConfirmReset(false);
								},
								children: confirmReset ? "再点一次确认" : "恢复初始设置"
							})]
						})
					]
				})]
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
		/**
		* dsh-node-accent 浏览器半区.
		*
		* 绑定 `node-accent` settings 命名空间, 把每次快照变化翻译成一张
		* `<style data-plugin-css="dsh-node-accent/rules">` 的内容, 并在官方 Plugins
		* 面板里挂上配置卡. 不改 DSH 源码, 不改 React 树.
		*/
		const inject = ["slots", "configForms"];
		/**
		* 用当前快照重写配色样式表.
		* @param ctx - Web Client 插件上下文, 仅用于日志.
		* @param scope - 已绑定的 settings scope.
		*/
		function repaint(ctx, scope) {
			const settings = scope.getSnapshot().value;
			upsertStyleTag(STYLE_ID, buildCss(settings));
			ctx.logger.debug("dsh-node-accent: repainted, tool overrides=%d, icon=%s, title=%s", Object.keys(settings?.toolColors ?? {}).length, String(settings?.paintIcon ?? true), String(settings?.paintTitle ?? true));
		}
		/**
		* 注入配置卡样式, 订阅配色快照, 并挂上 Plugins 面板里的配置卡.
		* @param ctx - Web Client 插件上下文.
		*/
		function apply(ctx) {
			ctx.logger.info("dsh-node-accent: client applying");
			ensureStyleTag(CARD_STYLE_ID, CARD_CSS);
			const scope = ctx.configForms.get(PLUGIN_NAME);
			ctx.effect(() => {
				repaint(ctx, scope);
				return scope.subscribe(() => {
					repaint(ctx, scope);
				});
			}, "dsh-node-accent: repaint on settings change");
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: PLUGIN_NAME,
				priority: 100
			}, () => (0, react.createElement)(NodeAccentCard, { scope })));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map