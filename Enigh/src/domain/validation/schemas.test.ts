import { describe, it, expect } from 'vitest'
import {
  folioVivSchema,
  folioHogSchema,
  yesNoSchema,
  yesNoUnkSchema,
  moneySchema,
  dateSchema,
  codigoEntidadSchema,
  decenaSchema,
  resultadoEntrevistaSchema,
} from './schemas'

describe('folioVivSchema', () => {
  it('accepts exactly 10 numeric digits', () => {
    expect(folioVivSchema.safeParse('1234567890').success).toBe(true)
  })

  it('rejects fewer than 10 digits', () => {
    expect(folioVivSchema.safeParse('123456789').success).toBe(false)
  })

  it('rejects non-numeric characters', () => {
    expect(folioVivSchema.safeParse('12345678AB').success).toBe(false)
  })
})

describe('folioHogSchema', () => {
  it('accepts digits 1-5', () => {
    expect(folioHogSchema.safeParse('1').success).toBe(true)
    expect(folioHogSchema.safeParse('5').success).toBe(true)
  })

  it('rejects 0', () => {
    expect(folioHogSchema.safeParse('0').success).toBe(false)
  })

  it('rejects 6', () => {
    expect(folioHogSchema.safeParse('6').success).toBe(false)
  })

  it('rejects multi-digit', () => {
    expect(folioHogSchema.safeParse('12').success).toBe(false)
  })
})

describe('yesNoSchema', () => {
  it('accepts 1 and 2', () => {
    expect(yesNoSchema.safeParse('1').success).toBe(true)
    expect(yesNoSchema.safeParse('2').success).toBe(true)
  })

  it('rejects 9', () => {
    expect(yesNoSchema.safeParse('9').success).toBe(false)
  })
})

describe('yesNoUnkSchema', () => {
  it('accepts 1, 2, and 9', () => {
    expect(yesNoUnkSchema.safeParse('1').success).toBe(true)
    expect(yesNoUnkSchema.safeParse('2').success).toBe(true)
    expect(yesNoUnkSchema.safeParse('9').success).toBe(true)
  })

  it('rejects 3', () => {
    expect(yesNoUnkSchema.safeParse('3').success).toBe(false)
  })
})

describe('moneySchema', () => {
  it('accepts a plain integer string', () => {
    expect(moneySchema.safeParse('18500').success).toBe(true)
  })

  it('accepts a decimal string', () => {
    expect(moneySchema.safeParse('18500.50').success).toBe(true)
  })

  it('rejects a $ sign', () => {
    expect(moneySchema.safeParse('$18500').success).toBe(false)
  })

  it('rejects commas', () => {
    expect(moneySchema.safeParse('18,500').success).toBe(false)
  })

  it('rejects negative numbers', () => {
    expect(moneySchema.safeParse('-100').success).toBe(false)
  })
})

describe('dateSchema', () => {
  it('accepts DD/MM/AAAA format', () => {
    expect(dateSchema.safeParse('15/07/2024').success).toBe(true)
  })

  it('rejects MM/DD/AAAA format', () => {
    expect(dateSchema.safeParse('07/15/2024').success).toBe(false)
  })

  it('rejects incomplete dates', () => {
    expect(dateSchema.safeParse('15/07/24').success).toBe(false)
  })
})

describe('codigoEntidadSchema', () => {
  it('accepts 01-32', () => {
    expect(codigoEntidadSchema.safeParse('01').success).toBe(true)
    expect(codigoEntidadSchema.safeParse('32').success).toBe(true)
  })

  it('rejects 00', () => {
    expect(codigoEntidadSchema.safeParse('00').success).toBe(false)
  })

  it('rejects 33', () => {
    expect(codigoEntidadSchema.safeParse('33').success).toBe(false)
  })
})

describe('decenaSchema', () => {
  it('accepts 0-9', () => {
    expect(decenaSchema.safeParse('0').success).toBe(true)
    expect(decenaSchema.safeParse('9').success).toBe(true)
  })

  it('rejects A', () => {
    expect(decenaSchema.safeParse('A').success).toBe(false)
  })
})

describe('resultadoEntrevistaSchema', () => {
  it('accepts A1-A7', () => {
    expect(resultadoEntrevistaSchema.safeParse('A1').success).toBe(true)
    expect(resultadoEntrevistaSchema.safeParse('A7').success).toBe(true)
  })

  it('rejects A8', () => {
    expect(resultadoEntrevistaSchema.safeParse('A8').success).toBe(false)
  })
})