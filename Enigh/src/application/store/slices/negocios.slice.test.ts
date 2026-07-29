import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createNegociosSlice, type NegociosSliceState } from './negocios.slice'

function createTestStore() {
  return create<NegociosSliceState>()((...a) => ({
    ...createNegociosSlice(...a),
  }))
}

describe('NegociosSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with tieneNegocio="2" and empty negocios', () => {
    expect(store.getState().negocios.tieneNegocio).toBe('2')
    expect(store.getState().negocios.negocios).toEqual([])
  })

  describe('updateNegociosData', () => {
    it('updates tieneNegocio to "1"', () => {
      store.getState().updateNegociosData({ tieneNegocio: '1' })
      expect(store.getState().negocios.tieneNegocio).toBe('1')
    })

    it('partial update preserves other fields', () => {
      store.getState().updateNegociosData({ folioViv: '1234567890' })
      store.getState().updateNegociosData({ tieneNegocio: '1' })
      expect(store.getState().negocios.folioViv).toBe('1234567890')
      expect(store.getState().negocios.tieneNegocio).toBe('1')
    })
  })

  describe('addNegocio', () => {
    it('creates a new negocio with unique id', () => {
      store.getState().addNegocio()
      const negocios = store.getState().negocios.negocios
      expect(negocios).toHaveLength(1)
      expect(negocios[0].id).toBeTruthy()
    })

    it('creates two negocios with different ids', () => {
      store.getState().addNegocio()
      store.getState().addNegocio()
      const ids = store.getState().negocios.negocios.map((n) => n.id)
      expect(ids[0]).not.toBe(ids[1])
    })

    it('new negocio has empty default fields', () => {
      store.getState().addNegocio()
      const neg = store.getState().negocios.negocios[0]
      expect(neg.tipoNegocio).toBe('')
      expect(neg.ingresoMensual).toBe(0)
    })
  })

  describe('removeNegocio', () => {
    it('removes by id, not by index', () => {
      store.getState().addNegocio()
      store.getState().addNegocio()
      const firstId = store.getState().negocios.negocios[0].id
      store.getState().removeNegocio(firstId)
      expect(store.getState().negocios.negocios).toHaveLength(1)
      expect(store.getState().negocios.negocios[0].id).not.toBe(firstId)
    })
  })

  describe('updateNegocio', () => {
    it('updateNegocio(id, { ingresoMensual: 5000 }) only updates that field', () => {
      store.getState().addNegocio()
      const id = store.getState().negocios.negocios[0].id
      store.getState().updateNegocio(id, { ingresoMensual: 5000 })
      expect(store.getState().negocios.negocios[0].ingresoMensual).toBe(5000)
      expect(store.getState().negocios.negocios[0].gastosMensuales).toBe(0)
    })
  })

  describe('resetNegocios', () => {
    it('resets to initial state', () => {
      store.getState().addNegocio()
      store.getState().updateNegociosData({ tieneNegocio: '1' })
      store.getState().resetNegocios()
      expect(store.getState().negocios.tieneNegocio).toBe('2')
      expect(store.getState().negocios.negocios).toEqual([])
    })
  })
})