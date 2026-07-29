import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createPortadaSlice, type PortadaSliceState } from './portada.slice'

function createTestStore() {
  return create<PortadaSliceState>()((...a) => ({
    ...createPortadaSlice(...a),
  }))
}

describe('PortadaSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with all empty fields', () => {
    expect(store.getState().portada.entidad).toBe('')
    expect(store.getState().portada.folioViv).toBe('')
  })

  it('updatePortada({ entidad: "14" }) only updates entidad', () => {
    store.getState().updatePortada({ entidad: '14' })
    expect(store.getState().portada.entidad).toBe('14')
    expect(store.getState().portada.folioViv).toBe('')
  })

  it('partial update preserves other fields', () => {
    store.getState().updatePortada({ entidad: '14', folioViv: '1234567890' })
    store.getState().updatePortada({ folioHog: '1' })
    expect(store.getState().portada.entidad).toBe('14')
    expect(store.getState().portada.folioViv).toBe('1234567890')
    expect(store.getState().portada.folioHog).toBe('1')
  })

  it('resetPortada resets to initial state', () => {
    store.getState().updatePortada({ entidad: '14', folioViv: '1234567890' })
    store.getState().resetPortada()
    expect(store.getState().portada.entidad).toBe('')
    expect(store.getState().portada.folioViv).toBe('')
  })
})