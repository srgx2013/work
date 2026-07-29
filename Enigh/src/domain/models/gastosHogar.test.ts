import { describe, it, expect } from 'vitest'
import type { GastosHogarData } from './gastosHogar'

describe('GastosHogarData', () => {
  it('can be constructed with all 8 sections empty', () => {
    const data: GastosHogarData = {
      folioViv: '1234567890',
      folioHog: '1',
    }
    expect(data.folioViv).toBe('1234567890')
    expect(data.alimentosCarnes).toBeUndefined()
    expect(data.enseresBlancos).toBeUndefined()
  })

  it('holds values across all 8 sections', () => {
    const data: GastosHogarData = {
      folioViv: '1234567890',
      folioHog: '1',
      // Section I
      alimentosCarnes: 500,
      alimentosCereales: 300,
      // Section II
      transportePublico: 200,
      // Section III
      viviendaRenta: 5000,
      // Section IV
      educacionUtiles: 100,
      // Section V
      saludMedicamentos: 150,
      // Section VI
      vestidoRopa: 800,
      // Section VII
      cuidadosHigiene: 250,
      // Section VIII
      enseresDetergentes: 100,
    }
    expect(data.alimentosCarnes).toBe(500)
    expect(data.viviendaRenta).toBe(5000)
    expect(data.enseresDetergentes).toBe(100)
  })
})