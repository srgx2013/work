import { describe, it, expect } from 'vitest'
import { negociosSchema } from './schemas'

const validNegocio = {
  id: 'neg-1',
  numPerOperador: '01',
  tipoNegocio: 'Abarrotes',
  esActividadPrincipal: '1' as const,
  tieneLocal: '1' as const,
  llevaContabilidad: '2' as const,
  dadoAltaHacienda: '1' as const,
  ingresoMensual: 15000,
  gastosMensuales: 8000,
}

const validBase = {
  folioViv: '1234567890',
  folioHog: '1',
  tieneNegocio: '1' as const,
  negocios: [validNegocio],
}

describe('negociosSchema — valid data', () => {
  it('passes with tieneNegocio=1 and one negocio', () => {
    const result = negociosSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })
})

describe('NEG-006 at least one negocio when tieneNegocio = 1', () => {
  it('rejects empty negocios when tieneNegocio = 1', () => {
    const result = negociosSchema.safeParse({
      ...validBase,
      tieneNegocio: '1',
      negocios: [],
    })
    expect(result.success).toBe(false)
  })
})

describe('NEG-007 tipoNegocio not empty', () => {
  it('rejects empty tipoNegocio', () => {
    const result = negociosSchema.safeParse({
      ...validBase,
      negocios: [{ ...validNegocio, tipoNegocio: '' }],
    })
    expect(result.success).toBe(false)
  })
})

describe('tieneNegocio = 2 with empty negocios', () => {
  it('accepts empty negocios when tieneNegocio = 2', () => {
    const result = negociosSchema.safeParse({
      ...validBase,
      tieneNegocio: '2',
      negocios: [],
    })
    expect(result.success).toBe(true)
  })
})