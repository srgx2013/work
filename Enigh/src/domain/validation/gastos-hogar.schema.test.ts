import { describe, it, expect } from 'vitest'
import { gastosHogarSchema } from './schemas'

const validBase = {
  folioViv: '1234567890',
  folioHog: '1',
}

describe('gastosHogarSchema — empty data is valid', () => {
  it('passes with only folioViv and folioHog', () => {
    const result = gastosHogarSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })
})

describe('gastosHogarSchema — with values', () => {
  it('passes with values in all 8 sections', () => {
    const result = gastosHogarSchema.safeParse({
      ...validBase,
      alimentosCarnes: '500',
      transportePublico: '200',
      viviendaRenta: '5000',
      educacionUtiles: '100',
      saludMedicamentos: '150',
      vestidoRopa: '800',
      cuidadosHigiene: '250',
      enseresDetergentes: '100',
    })
    expect(result.success).toBe(true)
  })
})

describe('GH-003 rejects $ sign', () => {
  it('rejects amount with $', () => {
    const result = gastosHogarSchema.safeParse({
      ...validBase,
      alimentosCarnes: '$500',
    })
    expect(result.success).toBe(false)
  })
})

describe('GH-003 rejects commas', () => {
  it('rejects amount with thousand separator', () => {
    const result = gastosHogarSchema.safeParse({
      ...validBase,
      alimentosCarnes: '1,500',
    })
    expect(result.success).toBe(false)
  })
})

describe('GH-004 rejects negative amounts', () => {
  it('rejects negative amount', () => {
    const result = gastosHogarSchema.safeParse({
      ...validBase,
      alimentosCarnes: '-100',
    })
    expect(result.success).toBe(false)
  })
})