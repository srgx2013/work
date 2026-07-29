// Negocios slice — manages the Negocios del Hogar questionnaire data.
// Supports add/remove negocios with UUID-style IDs.

import type { StateCreator } from 'zustand'
import type { NegociosData, Negocio } from '@/domain/models/negocios'
import { createInitialNegocios } from '../initial-state'

export type NegociosSliceState = {
  negocios: NegociosData

  updateNegociosData: (data: Partial<NegociosData>) => void
  addNegocio: () => void
  removeNegocio: (id: string) => void
  updateNegocio: (id: string, data: Partial<Negocio>) => void
  resetNegocios: () => void
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `neg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function blankNegocio(): Negocio {
  return {
    id: generateId(),
    numPerOperador: '',
    tipoNegocio: '',
    esActividadPrincipal: '' as never,
    tieneLocal: '' as never,
    llevaContabilidad: '' as never,
    dadoAltaHacienda: '' as never,
    ingresoMensual: 0,
    gastosMensuales: 0,
  } as Negocio
}

export const createNegociosSlice: StateCreator<
  NegociosSliceState,
  [],
  [],
  NegociosSliceState
> = (set) => ({
  negocios: createInitialNegocios(),

  updateNegociosData: (data) =>
    set((state) => ({
      negocios: { ...state.negocios, ...data },
    })),

  addNegocio: () =>
    set((state) => ({
      negocios: {
        ...state.negocios,
        negocios: [...state.negocios.negocios, blankNegocio()],
      },
    })),

  removeNegocio: (id) =>
    set((state) => ({
      negocios: {
        ...state.negocios,
        negocios: state.negocios.negocios.filter((n) => n.id !== id),
      },
    })),

  updateNegocio: (id, data) =>
    set((state) => ({
      negocios: {
        ...state.negocios,
        negocios: state.negocios.negocios.map((n) =>
          n.id === id ? { ...n, ...data } : n
        ),
      },
    })),

  resetNegocios: () => set({ negocios: createInitialNegocios() }),
})