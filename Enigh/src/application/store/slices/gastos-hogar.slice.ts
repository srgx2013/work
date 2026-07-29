// Gastos Hogar slice — manages the Gastos del Hogar (trimestral) questionnaire data.
// All 8 sections, ~43 optional amount fields.

import type { StateCreator } from 'zustand'
import type { GastosHogarData } from '@/domain/models/gastosHogar'
import { createInitialGastosHogar } from '../initial-state'

export type GastosHogarSliceState = {
  gastosHogar: GastosHogarData

  updateGastosHogar: (data: Partial<GastosHogarData>) => void
  resetGastosHogar: () => void
}

export const createGastosHogarSlice: StateCreator<
  GastosHogarSliceState,
  [],
  [],
  GastosHogarSliceState
> = (set) => ({
  gastosHogar: createInitialGastosHogar(),

  updateGastosHogar: (data) =>
    set((state) => ({
      gastosHogar: { ...state.gastosHogar, ...data },
    })),

  resetGastosHogar: () => set({ gastosHogar: createInitialGastosHogar() }),
})