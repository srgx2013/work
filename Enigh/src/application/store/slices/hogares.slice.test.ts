import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createHogaresSlice, type HogaresSliceState } from './hogares.slice'

function createTestStore() {
  return create<HogaresSliceState>()((...a) => ({
    ...createHogaresSlice(...a),
  }))
}

describe('HogaresSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  describe('updateHogares', () => {
    it('updates partial vivienda data', () => {
      store.getState().updateHogares({ claseVivienda: '1' })
      expect(store.getState().hogares.claseVivienda).toBe('1')
    })

    it('preserves other fields on partial update', () => {
      store.getState().updateHogares({ claseVivienda: '1' })
      store.getState().updateHogares({ materialParedes: '2' })
      expect(store.getState().hogares.claseVivienda).toBe('1')
      expect(store.getState().hogares.materialParedes).toBe('2')
    })
  })

  describe('addIntegrante', () => {
    it('first call creates numPer="01"', () => {
      store.getState().addIntegrante()
      const integrantes = store.getState().hogares.integrantes
      expect(integrantes).toHaveLength(1)
      expect(integrantes[0].numPer).toBe('01')
    })

    it('second call creates numPer="02"', () => {
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      const integrantes = store.getState().hogares.integrantes
      expect(integrantes[1].numPer).toBe('02')
    })

    it('third call creates numPer="03"', () => {
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      expect(store.getState().hogares.integrantes[2].numPer).toBe('03')
    })

    it('new integrante has empty name and default fields', () => {
      store.getState().addIntegrante()
      const integrante = store.getState().hogares.integrantes[0]
      expect(integrante.nombre).toBe('')
      expect(integrante.parentesco).toBe('')
      expect(integrante.edad).toBe(0)
    })
  })

  describe('removeIntegrante', () => {
    it('removes integrante "02" and re-numbers remaining: 01,03 → 01,02', () => {
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      // integrantes: 01, 02, 03
      store.getState().removeIntegrante('02')
      const integrantes = store.getState().hogares.integrantes
      expect(integrantes).toHaveLength(2)
      expect(integrantes[0].numPer).toBe('01')
      expect(integrantes[1].numPer).toBe('02') // re-numbered from 03
    })

    it('does NOT remove "01" (jefe cannot be removed) when only one integrante', () => {
      store.getState().addIntegrante()
      store.getState().removeIntegrante('01')
      expect(store.getState().hogares.integrantes).toHaveLength(1)
    })

    it('can remove "01" when more than one integrante (jefe reassigns)', () => {
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      store.getState().removeIntegrante('01')
      const integrantes = store.getState().hogares.integrantes
      expect(integrantes).toHaveLength(1)
      expect(integrantes[0].numPer).toBe('01') // re-numbered from 02
    })

    it('also removes corresponding ingresoIntegrante', () => {
      store.getState().addIntegrante()
      store.getState().addIntegrante()
      store.getState().updateIngresoIntegrante('01', { trabajoSemanaPasada: '1' })
      store.getState().updateIngresoIntegrante('02', { trabajoSemanaPasada: '2' })
      store.getState().removeIntegrante('02')
      const ingresos = store.getState().hogares.ingresosIntegrantes
      expect(ingresos).toHaveLength(1)
    })
  })

  describe('updateIntegrante', () => {
    it('updateIntegrante("01", { nombre: "Juan" }) only updates nombre', () => {
      store.getState().addIntegrante()
      store.getState().updateIntegrante('01', { nombre: 'Juan' })
      const integrante = store.getState().hogares.integrantes[0]
      expect(integrante.nombre).toBe('Juan')
      expect(integrante.parentesco).toBe('')
    })
  })

  describe('updateIngresoIntegrante', () => {
    it('updates ingreso for the correct integrante', () => {
      store.getState().addIntegrante()
      store.getState().updateIngresoIntegrante('01', {
        trabajoSemanaPasada: '1',
        ocupacionPrincipal: 'Obrero',
      })
      const ingreso = store.getState().hogares.ingresosIntegrantes[0]
      expect(ingreso.trabajoSemanaPasada).toBe('1')
      expect(ingreso.ocupacionPrincipal).toBe('Obrero')
    })

    it('creates ingreso entry if it does not exist', () => {
      store.getState().addIntegrante()
      store.getState().updateIngresoIntegrante('01', { trabajoSemanaPasada: '1' })
      expect(store.getState().hogares.ingresosIntegrantes).toHaveLength(1)
    })
  })

  describe('resetHogares', () => {
    it('resets to initial state', () => {
      store.getState().addIntegrante()
      store.getState().updateHogares({ claseVivienda: '1' })
      store.getState().resetHogares()
      expect(store.getState().hogares.integrantes).toEqual([])
      expect(store.getState().hogares.claseVivienda).toBe('')
    })
  })
})