import { describe, it, expect } from 'vitest'
import type { ReporteData, FolioStatus } from './reporte'

describe('ReporteData', () => {
  it('holds folio status, totals, and timer data', () => {
    const reporte: ReporteData = {
      folioStatus: 'INCOMPLETO',
      folioViv: '1234567890',
      folioHog: '1',
      entidad: '14',
      entidadNombre: 'Jalisco',
      entrevistador: 'Ana',
      fechaInicio: '15/07/2024',
      fechaTermino: '',
      totalIntegrantes: 4,
      ingresoLaboralTotal: 15000,
      otrosIngresosTotal: 2500,
      ingresoTotal: 17500,
      gastosTrimestralTotal: 30000,
      gastosDiariosTotal: 2100,
      gastosDiariosEstimado: 2000,
      tiempoTotal: 3600,
      tiemposPorStep: { 1: 120, 2: 300 },
      warnings: [],
    }
    expect(reporte.folioStatus).toBe('INCOMPLETO')
    expect(reporte.totalIntegrantes).toBe(4)
    expect(reporte.ingresoTotal).toBe(17500)
    expect(reporte.tiemposPorStep[1]).toBe(120)
  })
})

describe('FolioStatus', () => {
  it('can be CONCLUIDO or INCOMPLETO', () => {
    const statuses: FolioStatus[] = ['CONCLUIDO', 'INCOMPLETO']
    expect(statuses).toHaveLength(2)
  })
})