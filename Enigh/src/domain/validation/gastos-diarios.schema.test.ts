import { describe, it, expect } from 'vitest'
import { gastosDiariosSchema, diaGastosSchema, gastoDiarioSchema } from './schemas'

const validGasto = { id: 'g1', concepto: 'Tortillas', monto: 25 }
const validDia = {
  diaNumero: 1 as const,
  nombreDia: 'Lunes',
  fecha: '01/07/2024',
  gastos: [validGasto],
}
const validGastosDiarios = {
  folioViv: '1234567890',
  folioHog: '1',
  informanteNumPer: '01',
  dias: [validDia],
  estimacionMensual: { tortilleria: 500 },
}

describe('gastosDiariosSchema — valid data', () => {
  it('passes with one day and one gasto', () => {
    const result = gastosDiariosSchema.safeParse(validGastosDiarios)
    expect(result.success).toBe(true)
  })
})

describe('GD-003 informanteNumPer format', () => {
  it('rejects single-digit informanteNumPer', () => {
    const result = gastosDiariosSchema.safeParse({
      ...validGastosDiarios,
      informanteNumPer: '1',
    })
    expect(result.success).toBe(false)
  })
})

describe('GD-007 concepto non-empty', () => {
  it('rejects empty concepto', () => {
    const result = gastoDiarioSchema.safeParse({
      id: 'g1',
      concepto: '',
      monto: 25,
    })
    expect(result.success).toBe(false)
  })

  it('accepts non-empty concepto', () => {
    const result = gastoDiarioSchema.safeParse({
      id: 'g1',
      concepto: 'Pan',
      monto: 30,
    })
    expect(result.success).toBe(true)
  })
})

describe('GD-008 at least one gasto per day', () => {
  it('rejects empty gastos array for a day', () => {
    const result = diaGastosSchema.safeParse({
      ...validDia,
      gastos: [],
    })
    expect(result.success).toBe(false)
  })
})

describe('all 7 days represented', () => {
  it('passes with all 7 days', () => {
    const dias = Array.from({ length: 7 }, (_, i) => ({
      diaNumero: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      nombreDia: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i],
      fecha: `0${i + 1}/07/2024`,
      gastos: [{ id: `g${i}`, concepto: 'Comida', monto: 50 }],
    }))
    const result = gastosDiariosSchema.safeParse({
      ...validGastosDiarios,
      dias,
    })
    expect(result.success).toBe(true)
  })
})