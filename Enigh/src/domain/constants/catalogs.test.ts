import { describe, it, expect } from 'vitest'
import {
  CATALOGS,
  entidades,
  parentescos,
  clasesVivienda,
  materialesParedes,
  materialesTechos,
  materialesPisos,
  origenesAgua,
  drenajes,
  combustibles,
  basura,
  bienes,
  escolaridad,
  estadosCiviles,
  tiposTrabajo,
  institucionesSalud,
  tiposEscuela,
  quienCuida,
  resultadosEntrevista,
  lugarCocina,
  aguaAcarreo,
  aguaDiasSemana,
  tipoSanitario,
  sanitarioAgua,
  tenencia,
  adquisicion,
  financiamiento,
  fogonChimenea,
  escritura,
  equipamientoItems,
  problemasEstructurales,
} from './catalogs'
import {
  getLabel,
  getEntries,
  isValidCode,
  getValidRange,
  getCatalogByName,
} from './catalog-helpers'

describe('Catalog structure', () => {
  it('CATALOGS has all 30 named catalogs', () => {
    const catalogNames = Object.keys(CATALOGS)
    expect(catalogNames).toHaveLength(30)
    expect(catalogNames).toContain('entidades')
    expect(catalogNames).toContain('parentescos')
    expect(catalogNames).toContain('resultadosEntrevista')
  })
})

describe('entidades catalog', () => {
  it('has 32 entity entries from 01 to 32', () => {
    expect(getEntries(entidades)).toHaveLength(32)
  })

  it('entity 14 is Jalisco', () => {
    expect(getLabel(entidades, '14')).toBe('Jalisco')
  })

  it('entity 01 is Aguascalientes', () => {
    expect(getLabel(entidades, '01')).toBe('Aguascalientes')
  })

  it('entity 32 is Zacatecas', () => {
    expect(getLabel(entidades, '32')).toBe('Zacatecas')
  })
})

describe('parentescos catalog', () => {
  it('has 9 entries', () => {
    expect(getEntries(parentescos)).toHaveLength(9)
  })

  it('code 1 is Jefe(a) del hogar', () => {
    expect(getLabel(parentescos, '1')).toBe('Jefe(a) del hogar')
  })
})

describe('clasesVivienda catalog', () => {
  it('has 7 entries', () => {
    expect(getEntries(clasesVivienda)).toHaveLength(7)
  })
})

describe('materialesParedes catalog', () => {
  it('has 8 entries', () => {
    expect(getEntries(materialesParedes)).toHaveLength(8)
  })
})

describe('materialesTechos catalog', () => {
  it('has 10 entries', () => {
    expect(getEntries(materialesTechos)).toHaveLength(10)
  })
})

describe('materialesPisos catalog', () => {
  it('has 3 entries', () => {
    expect(getEntries(materialesPisos)).toHaveLength(3)
  })
})

describe('origenesAgua catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(origenesAgua)).toHaveLength(6)
  })
})

describe('drenajes catalog', () => {
  it('has 5 entries', () => {
    expect(getEntries(drenajes)).toHaveLength(5)
  })
})

describe('combustibles catalog', () => {
  it('has 4 entries', () => {
    expect(getEntries(combustibles)).toHaveLength(4)
  })
})

describe('basura catalog', () => {
  it('has 7 entries', () => {
    expect(getEntries(basura)).toHaveLength(7)
  })
})

describe('bienes catalog', () => {
  it('has 12 entries', () => {
    expect(getEntries(bienes)).toHaveLength(12)
  })
})

describe('escolaridad catalog', () => {
  it('has 11 entries', () => {
    expect(getEntries(escolaridad)).toHaveLength(11)
  })
})

describe('estadosCiviles catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(estadosCiviles)).toHaveLength(6)
  })
})

describe('tiposTrabajo catalog', () => {
  it('has 4 entries', () => {
    expect(getEntries(tiposTrabajo)).toHaveLength(4)
  })
})

describe('institucionesSalud catalog', () => {
  it('has 8 entries', () => {
    expect(getEntries(institucionesSalud)).toHaveLength(8)
  })
})

describe('tiposEscuela catalog', () => {
  it('has 2 entries', () => {
    expect(getEntries(tiposEscuela)).toHaveLength(2)
  })

  it('code 1 is Pública', () => {
    expect(getLabel(tiposEscuela, '1')).toBe('Pública')
  })
})

describe('quienCuida catalog', () => {
  it('has 4 entries', () => {
    expect(getEntries(quienCuida)).toHaveLength(4)
  })
})

describe('resultadosEntrevista catalog', () => {
  it('has 7 entries A1-A7', () => {
    expect(getEntries(resultadosEntrevista)).toHaveLength(7)
  })

  it('code A1 is Entrevista completa', () => {
    expect(getLabel(resultadosEntrevista, 'A1')).toBe('Entrevista completa')
  })
})

describe('lugarCocina catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(lugarCocina)).toHaveLength(6)
  })
})

describe('aguaAcarreo catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(aguaAcarreo)).toHaveLength(6)
  })
})

describe('aguaDiasSemana catalog', () => {
  it('has 5 entries', () => {
    expect(getEntries(aguaDiasSemana)).toHaveLength(5)
  })
})

describe('tipoSanitario catalog', () => {
  it('has 3 entries', () => {
    expect(getEntries(tipoSanitario)).toHaveLength(3)
  })
})

describe('sanitarioAgua catalog', () => {
  it('has 3 entries', () => {
    expect(getEntries(sanitarioAgua)).toHaveLength(3)
  })
})

describe('tenencia catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(tenencia)).toHaveLength(6)
  })
})

describe('adquisicion catalog', () => {
  it('has 6 entries', () => {
    expect(getEntries(adquisicion)).toHaveLength(6)
  })
})

describe('financiamiento catalog', () => {
  it('has 8 entries', () => {
    expect(getEntries(financiamiento)).toHaveLength(8)
  })
})

describe('fogonChimenea catalog', () => {
  it('has 2 entries', () => {
    expect(getEntries(fogonChimenea)).toHaveLength(2)
  })
})

describe('escritura catalog', () => {
  it('has 4 entries', () => {
    expect(getEntries(escritura)).toHaveLength(4)
  })
})

describe('equipamientoItems catalog', () => {
  it('has 14 entries', () => {
    expect(getEntries(equipamientoItems)).toHaveLength(14)
  })
})

describe('problemasEstructurales catalog', () => {
  it('has 7 entries', () => {
    expect(getEntries(problemasEstructurales)).toHaveLength(7)
  })
})

describe('getLabel', () => {
  it('returns the label for a known code', () => {
    expect(getLabel(entidades, '01')).toBe('Aguascalientes')
  })

  it('returns a fallback for an unknown code', () => {
    expect(getLabel(entidades, '99')).toContain('99')
  })
})

describe('isValidCode', () => {
  it('returns true for a valid code', () => {
    expect(isValidCode(entidades, '14')).toBe(true)
  })

  it('returns false for an invalid code', () => {
    expect(isValidCode(entidades, '99')).toBe(false)
  })
})

describe('getEntries', () => {
  it('returns entries sorted by code', () => {
    const entries = getEntries(entidades)
    expect(entries[0].code).toBe('01')
    expect(entries[entries.length - 1].code).toBe('32')
  })
})

describe('getValidRange', () => {
  it('returns a range string for a large catalog', () => {
    const range = getValidRange(entidades)
    expect(range).toBe('01-32')
  })

  it('returns a comma-separated list for a small catalog', () => {
    const range = getValidRange(tiposEscuela)
    expect(range).toBe('1, 2')
  })
})

describe('getCatalogByName', () => {
  it('returns the parentescos catalog by name', () => {
    expect(getCatalogByName('parentescos')).toBe(parentescos)
  })

  it('returns the entidades catalog by name', () => {
    expect(getCatalogByName('entidades')).toBe(entidades)
  })
})