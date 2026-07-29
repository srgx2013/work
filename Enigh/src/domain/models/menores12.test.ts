import { describe, it, expect } from 'vitest'
import type { Menor12Data, Menores12Section } from './menores12'

describe('Menor12Data', () => {
  it('holds all menor fields including pre-filled read-only fields', () => {
    const menor: Menor12Data = {
      folioViv: '1234567890',
      folioHog: '1',
      numPer: '04',
      nombre: 'Ana',
      edad: 8,
      sexo: '2',
      tieneDerechohabiencia: '1',
      institucionSalud: '1',
      problemaSalud2Semanas: '2',
      vacunacionCompleta: '1',
      asisteEscuela: '1',
      gradoEscolar: '3° de primaria',
      tipoEscuela: '1',
      recibeBeca: '2',
      quienCuida: '1',
    }
    expect(menor.edad).toBe(8)
    expect(menor.tieneDerechohabiencia).toBe('1')
    expect(menor.vacunacionCompleta).toBe('1')
  })
})

describe('Menores12Section', () => {
  it('holds an array of menores', () => {
    const section: Menores12Section = { menores: [] }
    expect(section.menores).toEqual([])
  })
})