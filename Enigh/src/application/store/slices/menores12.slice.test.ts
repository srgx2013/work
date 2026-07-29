import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createMenores12Slice, type Menores12SliceState } from './menores12.slice'

function createTestStore() {
  return create<Menores12SliceState>()((...a) => ({
    ...createMenores12Slice(...a),
  }))
}

describe('Menores12Slice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with empty menores array', () => {
    expect(store.getState().menores12.menores).toEqual([])
  })

  it('setMenores replaces the entire menores array', () => {
    store.getState().setMenores([
      { folioViv: '1234567890', folioHog: '1', numPer: '04', nombre: 'Ana', edad: 8, sexo: '2',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', vacunacionCompleta: '1',
        asisteEscuela: '1', recibeBeca: '2', quienCuida: '1' } as never,
    ])
    expect(store.getState().menores12.menores).toHaveLength(1)
  })

  it('updateMenor12("04", { tieneDerechohabiencia: "1" }) updates the correct menor', () => {
    store.getState().setMenores([
      { folioViv: '1234567890', folioHog: '1', numPer: '04', nombre: 'Ana', edad: 8, sexo: '2',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', vacunacionCompleta: '1',
        asisteEscuela: '1', recibeBeca: '2', quienCuida: '1' } as never,
    ])
    store.getState().updateMenor12('04', { tieneDerechohabiencia: '1' })
    expect(store.getState().menores12.menores[0].tieneDerechohabiencia).toBe('1')
  })

  it('updateMenor12 does nothing if numPer not found', () => {
    store.getState().setMenores([
      { folioViv: '1234567890', folioHog: '1', numPer: '04', nombre: 'Ana', edad: 8, sexo: '2',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', vacunacionCompleta: '1',
        asisteEscuela: '1', recibeBeca: '2', quienCuida: '1' } as never,
    ])
    store.getState().updateMenor12('99', { tieneDerechohabiencia: '1' })
    expect(store.getState().menores12.menores[0].tieneDerechohabiencia).toBe('2')
  })

  it('resetMenores12 resets to initial state', () => {
    store.getState().setMenores([
      { folioViv: '1234567890', folioHog: '1', numPer: '04', nombre: 'Ana', edad: 8, sexo: '2',
        tieneDerechohabiencia: '2', problemaSalud2Semanas: '2', vacunacionCompleta: '1',
        asisteEscuela: '1', recibeBeca: '2', quienCuida: '1' } as never,
    ])
    store.getState().resetMenores12()
    expect(store.getState().menores12.menores).toEqual([])
  })
})