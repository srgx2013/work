import { describe, it, expect } from 'vitest'
import type { PortadaData, CompleteFolioData } from './portada'

describe('PortadaData', () => {
  it('holds all portada fields', () => {
    const data: PortadaData = {
      folioViv: '1234567890',
      folioHog: '1',
      entidad: '14',
      decena: '5',
      nombreEntrevistador: 'Ana',
      nombreSupervisor: 'Carlos',
      resultadoEntrevista: 'A1',
      fechaInicio: '15/07/2024',
      fechaTermino: '15/07/2024',
      observaciones: 'Sin observaciones',
    }
    expect(data.entidad).toBe('14')
    expect(data.resultadoEntrevista).toBe('A1')
    expect(data.observaciones).toBe('Sin observaciones')
  })
})

describe('CompleteFolioData', () => {
  it('includes all questionnaire data', () => {
    const folio: CompleteFolioData = {
      portada: {} as PortadaData,
      hogares: null,
      menores12: null,
      personas12plus: null,
      negocios: null,
      gastosHogar: null,
      gastosDiarios: null,
      timer: null,
    }
    expect(folio).toHaveProperty('portada')
    expect(folio).toHaveProperty('timer')
  })
})