// Hogares slice — manages the Hogares y Vivienda questionnaire data.
// Includes dynamic integrante list with auto-numbering and re-numbering.

import type { StateCreator } from 'zustand'
import type { HogaresViviendaData, Integrante, IngresoIntegrante } from '@/domain/models/hogares'
import { createInitialHogares } from '../initial-state'

export type HogaresSliceState = {
  hogares: HogaresViviendaData

  updateHogares: (data: Partial<HogaresViviendaData>) => void
  addIntegrante: () => void
  removeIntegrante: (numPer: string) => void
  updateIntegrante: (numPer: string, data: Partial<Integrante>) => void
  updateIngresoIntegrante: (numPer: string, data: Partial<IngresoIntegrante>) => void
  resetHogares: () => void
}

function blankIntegrante(numPer: string): Integrante {
  return {
    numPer,
    nombre: '',
    parentesco: '',
    sexo: '',
    edad: 0,
    fechaNacimiento: '',
    estadoCivil: '',
    sabeLeerEscribir: '' as never,
    nivelEscolaridad: '',
    asisteEscuela: '' as never,
    viveMadre: '' as never,
    vivePadre: '' as never,
    lugarNacimiento: '',
    afrodescendiente: '' as never,
    discapacidad: {} as Record<string, string>,
    hablaLenguaIndigena: '' as never,
    hablaEspanol: '' as never,
    entiendeLenguaIndigena: '' as never,
    autoAdscripcionIndigena: '' as never,
  }
}

function blankIngresoIntegrante(numPer: string): IngresoIntegrante {
  return {
    numPer,
    trabajoSemanaPasada: '',
    recibeJubilacion: '',
    recibeProgGobierno: '',
  }
}

function padNumPer(n: number): string {
  return String(n).padStart(2, '0')
}

function renumberIntegrantes(integrantes: Integrante[]): Integrante[] {
  return integrantes.map((i, idx) => ({
    ...i,
    numPer: padNumPer(idx + 1),
  }))
}

export const createHogaresSlice: StateCreator<
  HogaresSliceState,
  [],
  [],
  HogaresSliceState
> = (set, _get) => ({
  hogares: createInitialHogares(),

  updateHogares: (data) =>
    set((state) => ({
      hogares: { ...state.hogares, ...data },
    })),

  addIntegrante: () =>
    set((state) => {
      const nextNum = state.hogares.integrantes.length + 1
      const newIntegrante = blankIntegrante(padNumPer(nextNum))
      return {
        hogares: {
          ...state.hogares,
          integrantes: [...state.hogares.integrantes, newIntegrante],
        },
      }
    }),

  removeIntegrante: (numPer) =>
    set((state) => {
      const integrantes = state.hogares.integrantes
      // Can't remove the last integrante (jefe)
      if (integrantes.length <= 1) return state

      const filtered = integrantes.filter((i) => i.numPer !== numPer)
      // If nothing was removed, return state unchanged
      if (filtered.length === integrantes.length) return state

      const renumbered = renumberIntegrantes(filtered)

      // Also remove/re-number corresponding ingresos
      const oldIngresos = state.hogares.ingresosIntegrantes
      const oldIngresoIdx = oldIngresos.findIndex((igi) => igi.numPer === numPer)
      let newIngresos: IngresoIntegrante[]
      if (oldIngresoIdx >= 0) {
        newIngresos = oldIngresos.filter((_, idx) => idx !== oldIngresoIdx)
      } else {
        newIngresos = [...oldIngresos]
      }

      return {
        hogares: {
          ...state.hogares,
          integrantes: renumbered,
          ingresosIntegrantes: newIngresos,
        },
      }
    }),

  updateIntegrante: (numPer, data) =>
    set((state) => ({
      hogares: {
        ...state.hogares,
        integrantes: state.hogares.integrantes.map((i) =>
          i.numPer === numPer ? { ...i, ...data } : i
        ),
      },
    })),

  updateIngresoIntegrante: (numPer, data) =>
    set((state) => {
      const existing = state.hogares.ingresosIntegrantes.find(
        (igi) => igi.numPer === numPer
      )
      if (existing) {
        return {
          hogares: {
            ...state.hogares,
            ingresosIntegrantes: state.hogares.ingresosIntegrantes.map((igi) =>
              igi.numPer === numPer ? { ...igi, ...data } : igi
            ),
          },
        }
      }
      // Create new ingreso entry
      return {
        hogares: {
          ...state.hogares,
          ingresosIntegrantes: [
            ...state.hogares.ingresosIntegrantes,
            { ...blankIngresoIntegrante(numPer), ...data },
          ],
        },
      }
    }),

  resetHogares: () => set({ hogares: createInitialHogares() }),
})