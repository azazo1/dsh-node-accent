/**
 * 节点着色配置卡片的样式.
 *
 * 尺寸与间距对齐官方 fields.module.css, 颜色只用 --dsw-alias-* 语义 token.
 * 输入框的聚焦描边自 0.1.7-rc.2 起走 --dsw-alias-state-business-primary, 不再是
 * --dsw-alias-brand-primary (后者在 rc.2 只用于开关与勾选框的填充色).
 */

/** 样式标签的 data-plugin-css 标记. */
export const CARD_STYLE_ID = 'dsh-node-accent/card'

/** 卡片样式表. */
export const CARD_CSS = `
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
`
