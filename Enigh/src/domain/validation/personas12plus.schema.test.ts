import { describe, it, expect } from 'vitest'
import { persona12PlusSchema } from './schemas'

const validPersona = {
  folioViv: '1234567890',
  folioHog: '1',
  numPer: '01',
  nombre: 'Juan García',
  edad: 47,
  sexo: '1',
  parentesco: '1',
  nivelAprobado: '09',
  asisteEscuela: '2',
  sabeLeerEscribir: '1',
  tieneDerechohabiencia: '1',
  institucionSalud: '1',
  problemaSalud2Semanas: '2',
  fuma: '2',
  consumeAlcohol: '2',
  trabajoSemanaPasada: '1',
  ocupacionPrincipal: 'Maestro',
  tipoTrabajo: '1',
  horasTrabajadas: 40,
  ingresoMensualNeto: 15000,
  recibeAguinaldo: '1',
  recibeVacaciones: '1',
  contratoEscrito: '1',
  prestacionesLey: '1',
  tieneOtroTrabajo: '2',
  recibeJubilacion: '2',
  recibeRemesas: '2',
  recibeProgGobierno: '2',
  recibeAyudaOtros: '2',
  recibeBeca: '2',
  recibeCreditoEducativo: '2',
  viveConyugeEnHogar: '2',
}

describe('persona12PlusSchema — valid data', () => {
  it('passes with all valid fields', () => {
    const result = persona12PlusSchema.safeParse(validPersona)
    expect(result.success).toBe(true)
  })
})

describe('P12-004 edad must be >= 12', () => {
  it('rejects edad = 11', () => {
    const result = persona12PlusSchema.safeParse({ ...validPersona, edad: 11 })
    expect(result.success).toBe(false)
  })
})

describe('P12-008 ocupacionPrincipal required when trabajoSemanaPasada = 1', () => {
  it('rejects empty ocupacionPrincipal', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      ocupacionPrincipal: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('P12-011 ingresoMensualNeto required when trabajoSemanaPasada = 1', () => {
  it('rejects undefined ingresoMensualNeto', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      ingresoMensualNeto: undefined,
    })
    expect(result.success).toBe(false)
  })
})

describe('P12-015 motivoNoTrabaja required when trabajoSemanaPasada = 2 and edad >= 14', () => {
  it('rejects empty motivoNoTrabaja when not working and age >= 14', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      edad: 25,
      trabajoSemanaPasada: '2',
      ocupacionPrincipal: undefined,
      horasTrabajadas: undefined,
      ingresoMensualNeto: undefined,
      motivoNoTrabaja: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts no motivoNoTrabaja when age < 14', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      edad: 12,
      trabajoSemanaPasada: '2',
      ocupacionPrincipal: undefined,
      horasTrabajadas: undefined,
      ingresoMensualNeto: undefined,
      motivoNoTrabaja: undefined,
    })
    expect(result.success).toBe(true)
  })
})

describe('P12-006 institucionSalud required when tieneDerechohabiencia = 1', () => {
  it('rejects empty institucionSalud', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      institucionSalud: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('P12-012 progGobiernoNombre required when recibeProgGobierno = 1', () => {
  it('rejects empty progGobiernoNombre', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      recibeProgGobierno: '1',
      progGobiernoNombre: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('P12-014 ayudaMonto required when recibeAyudaOtros = 1', () => {
  it('rejects undefined ayudaMonto', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      recibeAyudaOtros: '1',
      ayudaMonto: undefined,
    })
    expect(result.success).toBe(false)
  })

  it('accepts with ayudaMonto provided', () => {
    const result = persona12PlusSchema.safeParse({
      ...validPersona,
      recibeAyudaOtros: '1',
      ayudaMonto: 500,
      ayudaPeriodicidad: '1',
    })
    expect(result.success).toBe(true)
  })
})