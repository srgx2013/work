import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createGastosHogarSlice, type GastosHogarSliceState } from './gastos-hogar.slice'

function createTestStore() {
  return create<GastosHogarSliceState>()((...a) => ({
    ...createGastosHogarSlice(...a),
  }))
}

describe('GastosHogarSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with empty folio fields and undefined amounts', () => {
    expect(store.getState().gastosHogar.folioViv).toBe('')
    expect(store.getState().gastosHogar.folioHog).toBe('')
    expect(store.getState().gastosHogar.alimentosCarnes).toBeUndefined()
  })

  it('updateGastosHogar updates a single field', () => {
    store.getState().updateGastosHogar({ alimentosCarnes: 1500 })
    expect(store.getState().gastosHogar.alimentosCarnes).toBe(1500)
  })

  it('preserves other fields on partial update', () => {
    store.getState().updateGastosHogar({ alimentosCarnes: 1500 })
    store.getState().updateGastosHogar({ transportePublico: 800 })
    expect(store.getState().gastosHogar.alimentosCarnes).toBe(1500)
    expect(store.getState().gastosHogar.transportePublico).toBe(800)
  })

  it('resetGastosHogar resets to initial state', () => {
    store.getState().updateGastosHogar({ alimentosCarnes: 1500, viviendaRenta: 5000 })
    store.getState().resetGastosHogar()
    expect(store.getState().gastosHogar.alimentosCarnes).toBeUndefined()
    expect(store.getState().gastosHogar.viviendaRenta).toBeUndefined()
  })
})