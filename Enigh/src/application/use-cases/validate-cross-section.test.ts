// Tests for the validate-cross-section application use case.
// It wraps the domain cross-section validator against a slim store view.

import { describe, it, expect } from 'vitest'
import { runCrossSectionValidation, partitionBySeverity } from './validate-cross-section'

const validIntegrante = {
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

const validPersona12Plus = {
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
}

function makeStore(overrides: any = {}) {
  return {
    portada: { folioViv: '1234567890', folioHog: '1' },
    hogares: {
      folioViv: '1234567890',
      folioHog: '1',
      integrantes: [validIntegrante],
    },
    menores12: { menores: [] },
    personas12plus: { personas: [validPersona12Plus] },
    negocios: {
      folioViv: '1234567890',
      folioHog: '1',
      tieneNegocio: '2',
      negocios: [],
    },
    gastosHogar: {
      folioViv: '1234567890',
      folioHog: '1',
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

describe('runCrossSectionValidation', () => {
  it('returns no errors for a clean store', () => {
    const errors = runCrossSectionValidation(makeStore())
    expect(errors).toHaveLength(0)
  })

  it('returns BLOCKER errors when folioViv mismatches', () => {
    const errors = runCrossSectionValidation(
      makeStore({
        hogares: {
          folioViv: '9999999999',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
      })
    )
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.every((e) => e.severity === 'BLOCKER')).toBe(true)
  })

  it('returns WARNING for gastos improbable but allows advance', () => {
    const errors = runCrossSectionValidation(
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
              gastos: [
                { monto: 500 },
              ],
            },
          ],
          estimacionMensual: {},
        },
      })
    )
    const warnings = errors.filter((e) => e.severity === 'WARNING')
    expect(warnings.length).toBeGreaterThanOrEqual(1)
  })
})

describe('partitionBySeverity', () => {
  it('partitions errors into blockers and warnings', () => {
    const errors = runCrossSectionValidation(
      makeStore({
        hogares: {
          folioViv: '9999999999',
          folioHog: '1',
          integrantes: [validIntegrante],
        },
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
              gastos: [
                { monto: 500 },
              ],
            },
          ],
          estimacionMensual: {},
        },
      })
    )
    const { blockers, warnings } = partitionBySeverity(errors)
    expect(blockers.every((e) => e.severity === 'BLOCKER')).toBe(true)
    expect(warnings.every((e) => e.severity === 'WARNING')).toBe(true)
  })

  it('returns empty arrays for no errors', () => {
    const errors = runCrossSectionValidation(makeStore())
    const { blockers, warnings } = partitionBySeverity(errors)
    expect(blockers).toHaveLength(0)
    expect(warnings).toHaveLength(0)
  })
})