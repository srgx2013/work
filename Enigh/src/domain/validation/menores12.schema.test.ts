import { describe, it, expect } from 'vitest'
import { menor12Schema } from './schemas'

const validMenor = {
  folioViv: '1234567890',
  folioHog: '1',
  numPer: '04',
  nombre: 'Ana García',
  edad: 8,
  sexo: '2',
  tieneDerechohabiencia: '1',
  institucionSalud: '1',
  problemaSalud2Semanas: '2',
  vacunacionCompleta: '1' as const,
  asisteEscuela: '1',
  gradoEscolar: '3° de primaria',
  tipoEscuela: '1',
  recibeBeca: '2',
  quienCuida: '1',
}

describe('menor12Schema — valid data', () => {
  it('passes with all valid fields', () => {
    const result = menor12Schema.safeParse(validMenor)
    expect(result.success).toBe(true)
  })
})

describe('M12-004 edad must be < 12', () => {
  it('rejects edad = 12', () => {
    const result = menor12Schema.safeParse({ ...validMenor, edad: 12 })
    expect(result.success).toBe(false)
  })

  it('accepts edad = 11', () => {
    const result = menor12Schema.safeParse({ ...validMenor, edad: 11 })
    expect(result.success).toBe(true)
  })
})

describe('M12-005 institucionSalud required when tieneDerechohabiencia = 1', () => {
  it('rejects empty institucionSalud when tieneDerechohabiencia = 1', () => {
    const result = menor12Schema.safeParse({
      ...validMenor,
      tieneDerechohabiencia: '1',
      institucionSalud: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts no institucionSalud when tieneDerechohabiencia = 2', () => {
    const result = menor12Schema.safeParse({
      ...validMenor,
      tieneDerechohabiencia: '2',
      institucionSalud: undefined,
    })
    expect(result.success).toBe(true)
  })
})

describe('M12-006/007 gradoEscolar and tipoEscuela required when asisteEscuela = 1', () => {
  it('rejects empty gradoEscolar when asisteEscuela = 1', () => {
    const result = menor12Schema.safeParse({
      ...validMenor,
      asisteEscuela: '1',
      gradoEscolar: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts no gradoEscolar when asisteEscuela = 2', () => {
    const result = menor12Schema.safeParse({
      ...validMenor,
      asisteEscuela: '2',
      gradoEscolar: undefined,
      tipoEscuela: undefined,
    })
    expect(result.success).toBe(true)
  })
})

describe('vacunacionCompleta accepts 1, 2, and 9', () => {
  it('accepts 9 (No sabe)', () => {
    const result = menor12Schema.safeParse({
      ...validMenor,
      vacunacionCompleta: '9',
    })
    expect(result.success).toBe(true)
  })
})