/** 浏览器 settings scope 的最小契约, 避免把 settings UI 包打进 Client bundle. */

export interface SettingsScopeSnapshot<T> {
  /** 最近一次被接受的 section, 首次接受前为 `undefined`. */
  value: T | undefined
  /** Host 文档是否接受写入. */
  writable?: boolean
}

export interface SettingsScope<T> {
  getSnapshot(): SettingsScopeSnapshot<T>
  subscribe(listener: () => void): () => void
  set(field: string, value: unknown): Promise<void>
}

export interface SettingsScopeService {
  bind<T>(spec: {
    namespace: string
    decode?: (section: unknown) => T | undefined
  }): SettingsScope<T>
}
