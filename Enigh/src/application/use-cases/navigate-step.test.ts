// Tests for the navigate-step use case.
// Pure function — no React, no store, just computeNextStep(step, snapshot).

import { describe, it, expect } from 'vitest'
import { computeNextStep } from './navigate-step'

const baseIntegrante = {
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

function makeStore(overrides: any = {}) {
  return {
    portada: {
      folioViv: '1234567890',
      folioHog: '1',
      entidad: '14',
      decena: '1',
      nombreEntrevistador: 'X',
      nombreSupervisor: 'Y',
      resultadoEntrevista: 'A1',
      fechaInicio: '01/07/2024',
      fechaTermino: '02/07/2024',
      observaciones: '',
    },
    hogares: {
      folioViv: '1234567890',
      folioHog: '1',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      integrantes: [baseIntegrante] as any,
    },
    negocios: {
      folioViv: '1234567890',
      folioHog: '1',
      tieneNegocio: '2',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      negocios: [] as any,
    },
    ...overrides,
  }
}

describe('computeNextStep', () => {
  it('advances from step 1 to step 2', () => {
    expect(computeNextStep(1, makeStore())).toBe(2)
  })

  it('advances from step 2 to step 3 when there are menores in hogares', () => {
    const store = makeStore({
      hogares: {
        folioViv: '1234567890',
        folioHog: '1',
        integrantes: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { ...baseIntegrante, edad: 47 } as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { ...baseIntegrante, numPer: '02', edad: 8 } as any,
        ],
      },
    })
    expect(computeNextStep(2, store)).toBe(3)
  })

  it('skips step 3 (advances to step 4) when there are no menores', () => {
    const store = makeStore({
      hogares: {
        folioViv: '1234567890',
        folioHog: '1',
        integrantes: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { ...baseIntegrante, edad: 47 } as any,
        ],
      },
    })
    expect(computeNextStep(2, store)).toBe(4)
  })

  it('advances normally through the middle steps (3 → 4, 4 → 5, 5 → 6, 6 → 7)', () => {
    const store = makeStore()
    expect(computeNextStep(3, store)).toBe(4)
    expect(computeNextStep(4, store)).toBe(5)
    expect(computeNextStep(5, store)).toBe(6)
    expect(computeNextStep(6, store)).toBe(7)
  })

  it('advances from step 7 to reporte step (8)', () => {
    expect(computeNextStep(7, makeStore())).toBe(8)
  })

  it('stays on step 8 (reporte) — no further advancement', () => {
    expect(computeNextStep(8, makeStore())).toBe(8)
  })

  it('returns the reporte step (8) when resultado is A3 — skip the entire survey', () => {
    const store = makeStore({
      portada: {
        folioViv: '1234567890',
        folioHog: '1',
        entidad: '14',
        decena: '1',
        nombreEntrevistador: 'X',
        nombreSupervisor: 'Y',
        resultadoEntrevista: 'A3',
        fechaInicio: '01/07/2024',
        fechaTermino: '',
        observaciones: '',
      },
    })
    // From step 1 (Portada), A3 résultat goes directly to Reporte.
    expect(computeNextStep(1, store)).toBe(8)
  })

  it('returns the reporte step (8) when resultado is A6', () => {
    const store = makeStore({
      portada: {
        folioViv: '1234567890',
        folioHog: '1',
        entidad: '14',
        decena: '1',
        nombreEntrevistador: 'X',
        nombreSupervisor: 'Y',
        resultadoEntrevista: 'A6',
        fechaInicio: '01/07/2024',
        fechaTermino: '',
        observaciones: '',
      },
    })
    expect(computeNextStep(1, store)).toBe(8)
  })
})