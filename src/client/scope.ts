/** 本插件用到的 configForms 最小契约, 避免把 settings UI 包打进 Client bundle. */

/** 字段路径: 顶层字段名, 或对象字段下的一段路径. */
export type FieldPath = readonly string[]

/** 一次写入操作. */
export interface PathOp {
  /** 写入或清空. */
  op: 'set' | 'unset'
  /** 目标字段路径. */
  path: FieldPath
  /** `set` 时的值. */
  value?: unknown
}

/** 条目表单快照里本插件读到的部分. */
export interface SettingsScopeSnapshot<T> {
  /** `ready` 表示 Host 正在服务该条目. */
  status: 'loading' | 'ready' | 'unavailable'
  /** Host 解析后的有效值 (组合层 + user 层 + schema 默认). */
  value: T | undefined
  /** 组合层: 清掉某字段后回落到这里. */
  base: unknown
  /** user 层: 字段在这里出现才表示被覆盖. */
  user: unknown
  /** 该快照读到的修订号, 保存时作为写入栅栏. */
  revision: number | undefined
  /** Host 文档是否接受写入. */
  writable: boolean
}

/** 本插件 profile 条目的共享配置表单. */
export interface SettingsScope<T> {
  getSnapshot(): SettingsScopeSnapshot<T>
  subscribe(listener: () => void): () => void
  mutate(ops: readonly PathOp[], expectedRevision?: number): Promise<boolean>
}
