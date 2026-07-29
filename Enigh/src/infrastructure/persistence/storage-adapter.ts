// storage-adapter — detects whether localStorage can be used at runtime.
// Some browsers (private mode, disabled cookies, file:// origin) throw on
// persistence operations. We probe once with a throwaway key so the wizard
// can show a warning banner instead of crashing while typing.

const PROBE_KEY = '__iktan_storage_test__'

/**
 * Returns `true` when localStorage is exposed and accepts setItem/removeItem
 * round-trips. Returns `false` on any exception, when `localStorage` is not
 * defined, or when `window` is not available (SSR / test environments).
 */
export function isLocalStorageAvailable(): boolean {
  try {
    // Avoid touching `localStorage` when it is not defined (SSR, legacy envs).
    const storage = (typeof window !== 'undefined'
      ? window.localStorage
      : typeof localStorage !== 'undefined'
        ? localStorage
        : undefined) as Storage | undefined

    if (!storage) return false

    storage.setItem(PROBE_KEY, 'probe')
    storage.removeItem(PROBE_KEY)
    return true
  } catch {
    return false
  }
}