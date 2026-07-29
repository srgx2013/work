// Personas12Plus slice — manages the Personas de 12+ años questionnaire section.
// Driven by the Hogares slice (receives numPer references).

import type { StateCreator } from 'zustand'
import type { Personas12PlusSection, Persona12PlusData } from '@/domain/models/personas12plus'
import { createInitialPersonas12Plus } from '../initial-state'

export type Personas12PlusSliceState = {
  personas12plus: Personas12PlusSection

  setPersonas: (personas: Persona12PlusData[]) => void
  updatePersona12: (numPer: string, data: Partial<Persona12PlusData>) => void
  resetPersonas12Plus: () => void
}

export const createPersonas12PlusSlice: StateCreator<
  Personas12PlusSliceState,
  [],
  [],
  Personas12PlusSliceState
> = (set) => ({
  personas12plus: createInitialPersonas12Plus(),

  setPersonas: (personas) =>
    set({ personas12plus: { personas } }),

  updatePersona12: (numPer, data) =>
    set((state) => ({
      personas12plus: {
        personas: state.personas12plus.personas.map((p) =>
          p.numPer === numPer ? { ...p, ...data } : p
        ),
      },
    })),

  resetPersonas12Plus: () => set({ personas12plus: createInitialPersonas12Plus() }),
})