import { describe, it, expect } from 'vitest'
import { validateCrossSection } from './cross-section'
import type { CrossSectionStore } from './cross-section'

// Extended Portada view for rules that need more than folio fields.
const validCleanPortada = {
  folioViv: '1234567890',
  folioHog: '1',
  resultadoEntrevista: 'A1' as const,
  fechaInicio: '01/07/2024',
  fechaTermino: '02/07/2024',
}

const validIntegrante: any = {
  numPer: '01',
  nombre: 'Juan',
  parentesco: '1',
  sexo: '1',
  edad: 47,
  fechaNacimiento: '15/03/1977',
  estadoCivil: '2',
  sabeLeerEscribir: '1',
  nivelEscolaridad: '09',
  asisteEscuela: '2',
}

const integranteMenor = { ...validIntegrante, numPer: '02', edad: 8, parentesco: '2' }

function makeStore(overrides: any = {}) {
  return {
    portada: { folioViv: '1234567890', folioHog: '1' },
    hogares: {
      folioViv: '1234567890',
      folioHog: '1',
      integrantes: [validIntegrante],
    },
    menores12: { menores: [] },
    personas12plus: { personas: [] },
    negocios: {
      folioViv: '1234567890',
      folioHog: '1',
      tieneNegocio: '2',
      negocios: [],
    },
    gastosHogar: {
      folioViv: '1234567890',
      folioHog: '1',
      alimentosCarnes: 500,
    },
    gastosDiarios: {
      folioViv: '1234567890',
      folioHog: '1',
      informanteNumPer: '01',
      dias: [],
      estimacionMensual: {},
    },
    ...overrides,
  }
}

describe('CS-001 folioViv consistency', () => {
  it('returns no errors when all folioViv match', () => {
    const errors = validateCrossSection(makeStore())
    const cs001 = errors.filter((e) => e.ruleId === 'CS-001')
    expect(cs001).toHaveLength(0)
  })

  it('returns BLOCKER when folioViv mismatches', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '9999999999',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
      })
    )
    const cs001 = errors.find((e) => e.ruleId === 'CS-001')
    expect(cs001).toBeDefined()
    expect(cs001!.severity).toBe('BLOCKER')
  })
})

describe('CS-002 folioHog consistency', () => {
  it('returns BLOCKER when folioHog mismatches', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '2',
          integrantes: [validIntegrante],
        },
      })
    )
    const cs002 = errors.find((e) => e.ruleId === 'CS-002')
    expect(cs002).toBeDefined()
    expect(cs002!.severity).toBe('BLOCKER')
  })
})

describe('CS-004 total integrantes consistency', () => {
  it('returns BLOCKER when menores + 12plus != total integrantes', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          integrantes: [validIntegrante, validIntegrante],
        },
        menores12: { menores: [] },
        personas12plus: { personas: [] },
      })
    )
    const cs004 = errors.find((e) => e.ruleId === 'CS-004')
    expect(cs004).toBeDefined()
    expect(cs004!.severity).toBe('BLOCKER')
  })

  it('passes when counts match', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '1',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
      })
    )
    const cs004 = errors.filter((e) => e.ruleId === 'CS-004')
    expect(cs004).toHaveLength(0)
  })
})

describe('CS-006 edad < 12 must be in Menores12', () => {
  it('returns BLOCKER when a menor is not in Menores12 section', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          integrantes: [validIntegrante, integranteMenor],
        },
        menores12: { menores: [] },
        personas12plus: { personas: [] },
      })
    )
    const cs006 = errors.find((e) => e.ruleId === 'CS-006')
    expect(cs006).toBeDefined()
    expect(cs006!.severity).toBe('BLOCKER')
  })
})

describe('CS-007 edad >= 12 must be in Personas12+', () => {
  it('returns BLOCKER when a 12+ person is not in Personas12+ section', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
        personas12plus: { personas: [] },
      })
    )
    const cs007 = errors.find((e) => e.ruleId === 'CS-007')
    expect(cs007).toBeDefined()
    expect(cs007!.severity).toBe('BLOCKER')
  })
})

describe('CS-005 numPer referenced in Menores12 must exist in Hogares', () => {
  it('returns BLOCKER for unknown numPer in Menores12', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
        menores12: {
          menores: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '99',
              nombre: 'Ghost',
              edad: 5,
              sexo: '2',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              vacunacionCompleta: '1',
              asisteEscuela: '2',
              recibeBeca: '2',
              quienCuida: '1',
            },
          ],
        },
      })
    )
    const cs005 = errors.find((e) => e.ruleId === 'CS-005')
    expect(cs005).toBeDefined()
    expect(cs005!.severity).toBe('BLOCKER')
  })
})

describe('CS-013 tieneNegocio=1 requires at least one negocio', () => {
  it('returns BLOCKER when tieneNegocio=1 and no negocios', () => {
    const errors = validateCrossSection(
      makeStore({
        negocios: {
          folioViv: '1234567890',
          folioHog: '1',
          tieneNegocio: '1',
          negocios: [],
        },
      })
    )
    const cs013 = errors.find((e) => e.ruleId === 'CS-013')
    expect(cs013).toBeDefined()
    expect(cs013!.severity).toBe('BLOCKER')
  })
})

describe('CS-016 informanteNumPer must exist in Hogares', () => {
  it('returns BLOCKER for unknown informanteNumPer', () => {
    const errors = validateCrossSection(
      makeStore({
        gastosDiarios: {
          folioViv: '1234567890',
          folioHog: '1',
          informanteNumPer: '99',
          dias: [],
          estimacionMensual: {},
        },
      })
    )
    const cs016 = errors.find((e) => e.ruleId === 'CS-016')
    expect(cs016).toBeDefined()
    expect(cs016!.severity).toBe('BLOCKER')
  })
})

describe('CS-015 daily gastos > 4x trimestral returns WARNING', () => {
  it('returns WARNING when daily total exceeds 4x trimestral', () => {
    const errors = validateCrossSection(
      makeStore({
        gastosHogar: {
          folioViv: '1234567890',
          folioHog: '1',
          alimentosCarnes: 100,
        },
        gastosDiarios: {
          folioViv: '1234567890',
          folioHog: '1',
          informanteNumPer: '01',
          dias: [
            {
              diaNumero: 1,
              nombreDia: 'Lunes',
              fecha: '01/07/2024',
              gastos: [{ monto: 200 }, { monto: 200 }, { monto: 200 }],
            },
          ],
          estimacionMensual: {},
        },
      })
    )
    const cs015 = errors.find((e) => e.ruleId === 'CS-015')
    expect(cs015).toBeDefined()
    expect(cs015!.severity).toBe('WARNING')
  })
})

describe('validateCrossSection — no errors for clean store', () => {
  it('returns empty array for a perfectly consistent store', () => {
    const errors = validateCrossSection(makeStore({
      hogares: {
        folioViv: '1234567890',
        folioHog: '1',
        integrantes: [validIntegrante],
      },
      personas12plus: {
        personas: [
          {
            folioViv: '1234567890',
            folioHog: '1',
            numPer: '01',
            nombre: 'Juan',
            edad: 47,
            sexo: '1',
            parentesco: '1',
            nivelAprobado: '09',
            asisteEscuela: '2',
            sabeLeerEscribir: '1',
            tieneDerechohabiencia: '2',
            problemaSalud2Semanas: '2',
            fuma: '2',
            consumeAlcohol: '2',
            trabajoSemanaPasada: '2',
            recibeJubilacion: '2',
            recibeRemesas: '2',
            recibeProgGobierno: '2',
            recibeAyudaOtros: '2',
          },
        ],
      },
      portada: validCleanPortada,
    }))
    expect(errors).toHaveLength(0)
  })
})

describe('CS-FECHA-001 fechaTermino < fechaInicio returns BLOCKER', () => {
  it('returns BLOCKER when terminar antes que iniciar', () => {
    const errors = validateCrossSection(
      makeStore({
        portada: {
          folioViv: '1234567890',
          folioHog: '1',
          resultadoEntrevista: 'A1',
          fechaInicio: '05/07/2024',
          fechaTermino: '01/07/2024',
        } as unknown as CrossSectionStore['portada'],
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '1',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
      })
    )
    const rule = errors.find((e) => e.ruleId === 'CS-FECHA-001')
    expect(rule).toBeDefined()
    expect(rule!.severity).toBe('BLOCKER')
  })

  it('passes when fechaTermino is vacía and resultado no es A1', () => {
    const errors = validateCrossSection(
      makeStore({
        portada: {
          folioViv: '1234567890',
          folioHog: '1',
          resultadoEntrevista: 'A2',
          fechaInicio: '01/07/2024',
          fechaTermino: '',
        } as unknown as CrossSectionStore['portada'],
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '1',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
      })
    )
    const rule = errors.find((e) => e.ruleId === 'CS-FECHA-001')
    expect(rule).toBeUndefined()
  })
})

describe('CS-FECHA-002 resultado A1 sin fechaTermino returns BLOCKER', () => {
  it('returns BLOCKER when resultado=A1 but fechaTermino vacía', () => {
    const errors = validateCrossSection(
      makeStore({
        portada: {
          folioViv: '1234567890',
          folioHog: '1',
          resultadoEntrevista: 'A1',
          fechaInicio: '01/07/2024',
          fechaTermino: '',
        } as unknown as CrossSectionStore['portada'],
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '1',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
      })
    )
    const rule = errors.find((e) => e.ruleId === 'CS-FECHA-002')
    expect(rule).toBeDefined()
    expect(rule!.severity).toBe('BLOCKER')
  })

  it('passes when resultado is A2 con fechaTermino vacía', () => {
    const errors = validateCrossSection(
      makeStore({
        portada: {
          folioViv: '1234567890',
          folioHog: '1',
          resultadoEntrevista: 'A2',
          fechaInicio: '01/07/2024',
          fechaTermino: '',
        } as unknown as CrossSectionStore['portada'],
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '1',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
      })
    )
    const rule = errors.find((e) => e.ruleId === 'CS-FECHA-002')
    expect(rule).toBeUndefined()
  })
})

describe('CS-003 first integrante must be jefe', () => {
  it('returns BLOCKER when first integrante is not numPer=01 parentesco=1', () => {
    const errors = validateCrossSection(
      makeStore({
        hogares: {
          folioViv: '1234567890',
          folioHog: '1',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          integrantes: [{ ...validIntegrante, numPer: '01', parentesco: '2' } as any],
        },
        personas12plus: {
          personas: [
            {
              folioViv: '1234567890',
              folioHog: '1',
              numPer: '01',
              nombre: 'Juan',
              edad: 47,
              sexo: '1',
              parentesco: '2',
              nivelAprobado: '09',
              asisteEscuela: '2',
              sabeLeerEscribir: '1',
              tieneDerechohabiencia: '2',
              problemaSalud2Semanas: '2',
              fuma: '2',
              consumeAlcohol: '2',
              trabajoSemanaPasada: '2',
              recibeJubilacion: '2',
              recibeRemesas: '2',
              recibeProgGobierno: '2',
              recibeAyudaOtros: '2',
            },
          ],
        },
        portada: validCleanPortada,
      })
    )
    const rule = errors.find((e) => e.ruleId === 'CS-003')
    expect(rule).toBeDefined()
    expect(rule!.severity).toBe('BLOCKER')
  })
})