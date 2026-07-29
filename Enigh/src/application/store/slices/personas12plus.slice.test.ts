import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createPersonas12PlusSlice, type Personas12PlusSliceState } from './personas12plus.slice'

function createTestStore() {
  return create<Personas12PlusSliceState>()((...a) => ({
    ...createPersonas12PlusSlice(...a),
  }))
}

describe('Personas12PlusSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with empty personas array', () => {
    expect(store.getState().personas12plus.personas).toEqual([])
  })

  it('setPersonas replaces the entire personas array', () => {
    store.getState().setPersonas([
      { folioViv: '1234567890', folioHog: '1', numPer: '01', nombre: 'Juan', edad: 47, sexo: '1',
        parentesco: '1', nivelAprobado: '09', asisteEscuela: '2', sabeLeerEscribir: '1',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', fuma: '2', consumeAlcohol: '2',
        trabajoSemanaPasada: '1', recibeJubilacion: '2', recibeRemesas: '2', recibeProgGobierno: '2',
        recibeAyudaOtros: '2' } as never,
    ])
    expect(store.getState().personas12plus.personas).toHaveLength(1)
  })

  it('updatePersona12("01", { nivelAprobado: "09" }) updates the correct persona', () => {
    store.getState().setPersonas([
      { folioViv: '1234567890', folioHog: '1', numPer: '01', nombre: 'Juan', edad: 47, sexo: '1',
        parentesco: '1', nivelAprobado: '', asisteEscuela: '2', sabeLeerEscribir: '1',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', fuma: '2', consumeAlcohol: '2',
        trabajoSemanaPasada: '1', recibeJubilacion: '2', recibeRemesas: '2', recibeProgGobierno: '2',
        recibeAyudaOtros: '2' } as never,
    ])
    store.getState().updatePersona12('01', { nivelAprobado: '09' })
    expect(store.getState().personas12plus.personas[0].nivelAprobado).toBe('09')
  })

  it('resetPersonas12Plus resets to initial state', () => {
    store.getState().setPersonas([
      { folioViv: '', folioHog: '', numPer: '01', nombre: '', edad: 0, sexo: '',
        parentesco: '', nivelAprobado: '', asisteEscuela: '2', sabeLeerEscribir: '1',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', fuma: '2', consumeAlcohol: '2',
        trabajoSemanaPasada: '2', recibeJubilacion: '2', recibeRemesas: '2', recibeProgGobierno: '2',
        recibeAyudaOtros: '2' } as never,
    ])
    store.getState().resetPersonas12Plus()
    expect(store.getState().personas12plus.personas).toEqual([])
  })
})