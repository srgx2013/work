import { describe, it, expect } from 'vitest'
import { hogaresSchema } from './schemas'

const validIntegrante = {
  numPer: '01',
  nombre: 'Juan García',
  parentesco: '1',
  sexo: '1',
  edad: 47,
  fechaNacimiento: '15/03/1977',
  estadoCivil: '2',
  sabeLeerEscribir: '1',
  nivelEscolaridad: '09',
  asisteEscuela: '2',
}

const validHogares = {
  folioViv: '1234567890',
  folioHog: '1',
  claseVivienda: '1',
  materialParedes: '8',
  materialTecho: '10',
  materialPiso: '3',
  tieneCuartoCocina: '1',
  numeroDormitorios: 2,
  numeroCuartos: 4,
  aguaTipo: '1',
  drenaje: '1',
  tieneElectricidad: '1',
  numeroFocos: 10,
  focosAhorradores: 5,
  combustibleCocina: '3',
  eliminaBasura: '1',
  bienes: ['1', '4'],
  integrantes: [validIntegrante],
  ingresosIntegrantes: [],
  alimentosPocaVariedad: '2',
  alimentosDejoComida: '2',
  alimentosComioMenos: '2',
  alimentosSinComida: '2',
  alimentosSintioHambre: '2',
  alimentosUnaVez: '2',
  climaSequia: '2',
  climaInundacion: '2',
  climaHelada: '2',
  climaIncendio: '2',
  climaHuracan: '2',
}

describe('hogaresSchema — valid data', () => {
  it('passes with all valid fields', () => {
    const result = hogaresSchema.safeParse(validHogares)
    expect(result.success).toBe(true)
  })
})

describe('HV-001 numeroCuartos >= numeroDormitorios', () => {
  it('rejects when numeroCuartos < numeroDormitorios', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      numeroDormitorios: 5,
      numeroCuartos: 2,
    })
    expect(result.success).toBe(false)
  })
})

describe('HV-003 focosAhorradores <= numeroFocos', () => {
  it('rejects when focosAhorradores > numeroFocos', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      numeroFocos: 5,
      focosAhorradores: 10,
    })
    expect(result.success).toBe(false)
  })

  it('accepts when focosAhorradores = numeroFocos', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      numeroFocos: 10,
      focosAhorradores: 10,
    })
    expect(result.success).toBe(true)
  })
})

describe('HV-005 first integrante must be Jefe', () => {
  it('rejects when first integrante parentesco != 1', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      integrantes: [{ ...validIntegrante, parentesco: '3' }],
    })
    expect(result.success).toBe(false)
  })
})

describe('HV-004 numPer uniqueness', () => {
  it('rejects duplicate numPer', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      integrantes: [
        validIntegrante,
        { ...validIntegrante, nombre: 'María' },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('accepts unique numPers', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      integrantes: [
        validIntegrante,
        { ...validIntegrante, numPer: '02', nombre: 'María', parentesco: '2' },
      ],
    })
    expect(result.success).toBe(true)
  })
})

describe('HV-011 at least one integrante', () => {
  it('rejects empty integrantes array', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      integrantes: [],
    })
    expect(result.success).toBe(false)
  })
})

describe('HV-008 edad range', () => {
  it('rejects edad > 120', () => {
    const result = hogaresSchema.safeParse({
      ...validHogares,
      integrantes: [{ ...validIntegrante, edad: 150 }],
    })
    expect(result.success).toBe(false)
  })
})