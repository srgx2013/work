import { describe, it, expect } from 'vitest'
import { portadaSchema } from './schemas'

const validPortada = {
  folioViv: '1234567890',
  folioHog: '1',
  entidad: '14',
  decena: '5',
  nombreEntrevistador: 'Ana López',
  nombreSupervisor: 'Carlos Ruiz',
  resultadoEntrevista: 'A1' as const,
  fechaInicio: '15/07/2024',
  fechaTermino: '15/07/2024',
  observaciones: '',
}

describe('portadaSchema — valid data', () => {
  it('passes with all valid fields', () => {
    const result = portadaSchema.safeParse(validPortada)
    expect(result.success).toBe(true)
  })
})

describe('P-001 folioViv validation', () => {
  it('rejects non-10-digit folioViv', () => {
    const result = portadaSchema.safeParse({ ...validPortada, folioViv: '123456789' })
    expect(result.success).toBe(false)
  })
})

describe('P-005 folioHog validation', () => {
  it('rejects folioHog = 0', () => {
    const result = portadaSchema.safeParse({ ...validPortada, folioHog: '0' })
    expect(result.success).toBe(false)
  })

  it('rejects folioHog = 6', () => {
    const result = portadaSchema.safeParse({ ...validPortada, folioHog: '6' })
    expect(result.success).toBe(false)
  })
})

describe('P-007 entidad validation', () => {
  it('rejects entidad = 00', () => {
    const result = portadaSchema.safeParse({ ...validPortada, entidad: '00' })
    expect(result.success).toBe(false)
  })

  it('rejects entidad = 33', () => {
    const result = portadaSchema.safeParse({ ...validPortada, entidad: '33' })
    expect(result.success).toBe(false)
  })
})

describe('P-008 nombreEntrevistador validation', () => {
  it('rejects empty entrevistador', () => {
    const result = portadaSchema.safeParse({ ...validPortada, nombreEntrevistador: '' })
    expect(result.success).toBe(false)
  })
})

describe('P-010 resultadoEntrevista validation', () => {
  it('rejects invalid resultado', () => {
    const result = portadaSchema.safeParse({ ...validPortada, resultadoEntrevista: 'A8' })
    expect(result.success).toBe(false)
  })
})

describe('P-012 fechaTermino >= fechaInicio', () => {
  it('rejects fechaTermino before fechaInicio', () => {
    const result = portadaSchema.safeParse({
      ...validPortada,
      fechaInicio: '15/07/2024',
      fechaTermino: '14/07/2024',
    })
    expect(result.success).toBe(false)
  })

  it('accepts fechaTermino equal to fechaInicio', () => {
    const result = portadaSchema.safeParse({
      ...validPortada,
      fechaTermino: '15/07/2024',
    })
    expect(result.success).toBe(true)
  })
})

describe('P-013 resultado A1 requires fechaTermino', () => {
  it('rejects A1 with empty fechaTermino', () => {
    const result = portadaSchema.safeParse({
      ...validPortada,
      resultadoEntrevista: 'A1',
      fechaTermino: '',
    })
    expect(result.success).toBe(false)
  })
})