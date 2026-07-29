// Menores12 slice — manages the Menores de 12 años questionnaire section.
// Driven by the Hogares slice (receives numPer references).

import type { StateCreator } from 'zustand'
import type { Menores12Section, Menor12Data } from '@/domain/models/menores12'
import { createInitialMenores12 } from '../initial-state'

export type Menores12SliceState = {
  menores12: Menores12Section

  setMenores: (menores: Menor12Data[]) => void
  updateMenor12: (numPer: string, data: Partial<Menor12Data>) => void
  resetMenores12: () => void
}

export const createMenores12Slice: StateCreator<
  Menores12SliceState,
  [],
  [],
  Menores12SliceState
> = (set) => ({
  menores12: createInitialMenores12(),

  setMenores: (menores) =>
    set({ menores12: { menores } }),

  updateMenor12: (numPer, data) =>
    set((state) => ({
      menores12: {
        menores: state.menores12.menores.map((m) =>
          m.numPer === numPer ? { ...m, ...data } : m
        ),
      },
    })),

  resetMenores12: () => set({ menores12: createInitialMenores12() }),
})