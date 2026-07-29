import { describe, it, expect } from 'vitest'
import type { GastoDiario, DiaGastos, EstimacionMensual, GastosDiariosData } from './gastosDiarios'

describe('GastoDiario', () => {
  it('holds id, concepto, and monto', () => {
    const gasto: GastoDiario = { id: 'g1', concepto: 'Tortillas', monto: 25 }
    expect(gasto.id).toBe('g1')
    expect(gasto.concepto).toBe('Tortillas')
    expect(gasto.monto).toBe(25)
  })
})

describe('DiaGastos', () => {
  it('has a day number, name, fecha, and gasto array', () => {
    const dia: DiaGastos = {
      diaNumero: 1,
      nombreDia: 'Lunes',
      fecha: '01/07/2024',
      gastos: [{ id: 'g1', concepto: 'Pan', monto: 30 }],
    }
    expect(dia.diaNumero).toBe(1)
    expect(dia.nombreDia).toBe('Lunes')
    expect(dia.gastos).toHaveLength(1)
  })
})

describe('EstimacionMensual', () => {
  it('holds all 6 estimation fields as optional', () => {
    const est: EstimacionMensual = { tortilleria: 500, carniceria: 800 }
    expect(est.tortilleria).toBe(500)
    expect(est.transporte).toBeUndefined()
  })
})

describe('GastosDiariosData', () => {
  it('holds informanteNumPer, dias, and estimacionMensual', () => {
    const data: GastosDiariosData = {
      folioViv: '1234567890',
      folioHog: '1',
      informanteNumPer: '01',
      dias: [],
      estimacionMensual: {},
    }
    expect(data.informanteNumPer).toBe('01')
    expect(data.dias).toEqual([])
  })
})