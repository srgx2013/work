import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createGastosDiariosSlice, type GastosDiariosSliceState } from './gastos-diarios.slice'

function createTestStore() {
  return create<GastosDiariosSliceState>()((...a) => ({
    ...createGastosDiariosSlice(...a),
  }))
}

describe('GastosDiariosSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with 7 empty days', () => {
    expect(store.getState().gastosDiarios.dias).toHaveLength(7)
    store.getState().gastosDiarios.dias.forEach((dia) => {
      expect(dia.gastos).toEqual([])
      expect(dia.fecha).toBe('')
    })
  })

  describe('setInformante', () => {
    it('sets informanteNumPer', () => {
      store.getState().setInformante('01')
      expect(store.getState().gastosDiarios.informanteNumPer).toBe('01')
    })
  })

  describe('addGastoDia', () => {
    it('addGastoDia(0) adds a new gasto to day 1 gastos array', () => {
      store.getState().addGastoDia(0)
      expect(store.getState().gastosDiarios.dias[0].gastos).toHaveLength(1)
    })

    it('new gasto has id, empty concepto, and 0 monto', () => {
      store.getState().addGastoDia(0)
      const gasto = store.getState().gastosDiarios.dias[0].gastos[0]
      expect(gasto.id).toBeTruthy()
      expect(gasto.monto).toBe(0)
    })

    it('adds multiple gastos to the same day', () => {
      store.getState().addGastoDia(0)
      store.getState().addGastoDia(0)
      store.getState().addGastoDia(0)
      expect(store.getState().gastosDiarios.dias[0].gastos).toHaveLength(3)
    })
  })

  describe('removeGastoDia', () => {
    it('removes the specific gasto by id', () => {
      store.getState().addGastoDia(0)
      store.getState().addGastoDia(0)
      const id = store.getState().gastosDiarios.dias[0].gastos[0].id
      store.getState().removeGastoDia(0, id)
      const gastos = store.getState().gastosDiarios.dias[0].gastos
      expect(gastos).toHaveLength(1)
      expect(gastos[0].id).not.toBe(id)
    })
  })

  describe('updateGastoDia', () => {
    it('updateGastoDia(0, id, { monto: 150 }) updates only monto', () => {
      store.getState().addGastoDia(0)
      const id = store.getState().gastosDiarios.dias[0].gastos[0].id
      store.getState().updateGastoDia(0, id, { monto: 150 })
      const gasto = store.getState().gastosDiarios.dias[0].gastos[0]
      expect(gasto.monto).toBe(150)
    })

    it('updateGastoDia(0, id, { concepto: "Pan" }) updates only concepto', () => {
      store.getState().addGastoDia(0)
      const id = store.getState().gastosDiarios.dias[0].gastos[0].id
      store.getState().updateGastoDia(0, id, { concepto: 'Pan' })
      expect(store.getState().gastosDiarios.dias[0].gastos[0].concepto).toBe('Pan')
    })
  })

  describe('updateEstimacion', () => {
    it('updates estimacion field', () => {
      store.getState().updateEstimacion({ tortilleria: 200 })
      expect(store.getState().gastosDiarios.estimacionMensual.tortilleria).toBe(200)
    })

    it('preserves other estimacion fields', () => {
      store.getState().updateEstimacion({ tortilleria: 200 })
      store.getState().updateEstimacion({ carniceria: 500 })
      expect(store.getState().gastosDiarios.estimacionMensual.tortilleria).toBe(200)
      expect(store.getState().gastosDiarios.estimacionMensual.carniceria).toBe(500)
    })
  })

  describe('resetGastosDiarios', () => {
    it('resets to initial state', () => {
      store.getState().setInformante('01')
      store.getState().addGastoDia(0)
      store.getState().resetGastosDiarios()
      expect(store.getState().gastosDiarios.informanteNumPer).toBe('')
      expect(store.getState().gastosDiarios.dias[0].gastos).toEqual([])
    })
  })
})