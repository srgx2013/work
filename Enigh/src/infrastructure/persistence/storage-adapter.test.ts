// Tests for the localStorage availability adapter.

import { describe, it, expect, afterEach, vi } from 'vitest'
import { isLocalStorageAvailable } from './storage-adapter'

describe('isLocalStorageAvailable', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when localStorage works', () => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size
      },
    })
    expect(isLocalStorageAvailable()).toBe(true)
  })

  it('returns false when localStorage.setItem throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceeded')
      },
      removeItem: () => {
        throw new Error('denied')
      },
      clear: () => {
        /* noop */
      },
      key: () => null,
      length: 0,
    })
    expect(isLocalStorageAvailable()).toBe(false)
  })

  it('returns false when localStorage is undefined', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(isLocalStorageAvailable()).toBe(false)
  })
})