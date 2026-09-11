/**
 * 设置卡的静态样式.
 *
 * 卡片外观沿用官方 Plugins 面板的卡片语言 (卡片壳, 名称压描述, chevron
 * disclosure), 只使用 DSH 主题 token. 这里手写而不是复用官方卡片组件: 特性
 * 插件跨包做值导入会触发 Client bundle 纯度门禁.
 */

/** 设置卡样式的标签 id. */
export const CARD_STYLE_ID = 'dsh-node-accent/card'

/** 设置卡样式表. */
export const CARD_CSS = `
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
`.trim()
