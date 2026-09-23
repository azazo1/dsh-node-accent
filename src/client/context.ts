import type { SettingsScope } from './scope.ts'

/** Client 插件实际用到的 Cordis 面. */
export interface ClientContext {
  logger: {
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    debug: (...args: unknown[]) => void
  }
  configForms: { get<T>(namespace: string): SettingsScope<T> }
  slots: {
    inject: (name: string, factory: () => unknown) => void
    register: (options: Record<string, unknown>, component: unknown) => unknown
  }
  effect: (callback: () => (() => void) | void, name?: string) => void
}
