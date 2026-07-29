// Validation slice — manages per-step error maps and cross-section error lists.
// Transient state: not persisted to localStorage.

import type { StateCreator } from 'zustand'
import type { FieldError, CrossSectionError } from '@/domain/validation/types'

export type ValidationSliceState = {
  stepErrors: Record<number, FieldError[]>
  crossSectionErrors: CrossSectionError[]

  setStepErrors: (step: number, errors: FieldError[]) => void
  clearStepErrors: (step: number) => void
  setCrossSectionErrors: (errors: CrossSectionError[]) => void
  clearAllErrors: () => void
}

export const createValidationSlice: StateCreator<
  ValidationSliceState,
  [],
  [],
  ValidationSliceState
> = (set) => ({
  stepErrors: {},
  crossSectionErrors: [],

  setStepErrors: (step, errors) =>
    set((state) => ({
      stepErrors: { ...state.stepErrors, [step]: errors },
    })),

  clearStepErrors: (step) =>
    set((state) => {
      const newStepErrors = { ...state.stepErrors }
      delete newStepErrors[step]
      return { stepErrors: newStepErrors }
    }),

  setCrossSectionErrors: (errors) =>
    set({ crossSectionErrors: errors }),

  clearAllErrors: () =>
    set({ stepErrors: {}, crossSectionErrors: [] }),
})