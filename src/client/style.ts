/** 样式标签的唯一写入点: 同一个 id 只对应一个 `<style>`, 重复调用是覆盖. */
import { STYLE_ATTR } from '../shared.ts'

/**
 * 插入或更新一个插件样式标签.
 * @param id - `data-plugin-css` 上的标记值, 也是本插件内唯一的样式身份.
 * @param css - 完整样式表文本.
 */
export function upsertStyleTag(id: string, css: string): void {
  if (typeof document === 'undefined') return
  let tag = document.querySelector<HTMLStyleElement>(`style[${STYLE_ATTR}="${id}"]`)
  if (tag === null) {
    tag = document.createElement('style')
    tag.setAttribute(STYLE_ATTR, id)
    document.head.appendChild(tag)
  }
  tag.textContent = css
}

/**
 * 只在标签缺失时插入, 用于内容固定的静态样式.
 * @param id - `data-plugin-css` 上的标记值.
 * @param css - 完整样式表文本.
 */
export function ensureStyleTag(id: string, css: string): void {
  if (typeof document === 'undefined') return
  if (document.querySelector(`style[${STYLE_ATTR}="${id}"]`) !== null) return
  upsertStyleTag(id, css)
}
