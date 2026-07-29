import { describe, it, expect } from 'vitest'
import {
  ENTIDAD_CODES,
  RESULTADO_ENTREVISTA_CODES,
  YES_NO_VALUES,
  YES_NO_UNK_VALUES,
  isValidEntidadCode,
  isValidResultadoEntrevista,
  isValidYesNo,
  isValidYesNoUnk,
} from './shared'
import type { SharedFolioFields } from './shared'

describe('SharedFolioFields', () => {
  it('holds folioViv and folioHog as strings', () => {
    const fields: SharedFolioFields = { folioViv: '1234567890', folioHog: '1' }
    expect(fields.folioViv).toBe('1234567890')
    expect(fields.folioHog).toBe('1')
  })
})

describe('ENTIDAD_CODES', () => {
  it('contains exactly 32 entity codes from 01 to 32', () => {
    expect(ENTIDAD_CODES).toHaveLength(32)
    expect(ENTIDAD_CODES[0]).toBe('01')
    expect(ENTIDAD_CODES[13]).toBe('14')
    expect(ENTIDAD_CODES[31]).toBe('32')
  })
})

describe('RESULTADO_ENTREVISTA_CODES', () => {
  it('contains all 7 codes A1 through A7', () => {
    expect(RESULTADO_ENTREVISTA_CODES).toHaveLength(7)
    expect(RESULTADO_ENTREVISTA_CODES[0]).toBe('A1')
    expect(RESULTADO_ENTREVISTA_CODES[6]).toBe('A7')
  })
})

describe('YES_NO_VALUES / YES_NO_UNK_VALUES', () => {
  it('YesNo has exactly 1 and 2', () => {
    expect(YES_NO_VALUES).toEqual(['1', '2'])
  })

  it('YesNoUnk has exactly 1, 2, and 9', () => {
    expect(YES_NO_UNK_VALUES).toEqual(['1', '2', '9'])
  })
})

describe('isValidEntidadCode', () => {
  it('validates a known code', () => {
    expect(isValidEntidadCode('14')).toBe(true)
  })

  it('rejects an out-of-range code', () => {
    expect(isValidEntidadCode('33')).toBe(false)
  })

  it('rejects a malformed code', () => {
    expect(isValidEntidadCode('1')).toBe(false)
    expect(isValidEntidadCode('ABC')).toBe(false)
  })
})

describe('isValidResultadoEntrevista', () => {
  it('validates A1', () => {
    expect(isValidResultadoEntrevista('A1')).toBe(true)
  })

  it('rejects A8', () => {
    expect(isValidResultadoEntrevista('A8')).toBe(false)
  })
})

describe('isValidYesNo', () => {
  it('validates 1 and 2', () => {
    expect(isValidYesNo('1')).toBe(true)
    expect(isValidYesNo('2')).toBe(true)
  })

  it('rejects 9', () => {
    expect(isValidYesNo('9')).toBe(false)
  })
})

describe('isValidYesNoUnk', () => {
  it('validates 1, 2, and 9', () => {
    expect(isValidYesNoUnk('1')).toBe(true)
    expect(isValidYesNoUnk('2')).toBe(true)
    expect(isValidYesNoUnk('9')).toBe(true)
  })

  it('rejects 3', () => {
    expect(isValidYesNoUnk('3')).toBe(false)
  })
})