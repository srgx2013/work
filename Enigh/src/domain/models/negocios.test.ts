import { describe, it, expect } from 'vitest'
import type { Negocio, NegociosData } from './negocios'

describe('Negocio', () => {
  it('holds all negocio fields including id', () => {
    const negocio: Negocio = {
      id: 'abc-123',
      numPerOperador: '01',
      tipoNegocio: 'Abarrotes',
      esActividadPrincipal: '1',
      tieneLocal: '1',
      llevaContabilidad: '2',
      dadoAltaHacienda: '1',
      ingresoMensual: 15000,
      gastosMensuales: 8000,
    }
    expect(negocio.id).toBe('abc-123')
    expect(negocio.tipoNegocio).toBe('Abarrotes')
    expect(negocio.ingresoMensual).toBe(15000)
  })
})

describe('NegociosData', () => {
  it('holds tieneNegocio flag and negocios array', () => {
    const data: NegociosData = {
      folioViv: '1234567890',
      folioHog: '1',
      tieneNegocio: '1',
      negocios: [],
    }
    expect(data.tieneNegocio).toBe('1')
    expect(data.negocios).toEqual([])
  })
})