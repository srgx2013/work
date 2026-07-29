// Wizard slice — manages step navigation and completion state for the 8-step wizard.
// Steps 1-7 are questionnaire steps; step 8 is the report step.

import type { StateCreator } from 'zustand'

export type WizardSliceState = {
  currentStep: number       // 1-8 (8 = reporte)
  currentSubStep: number    // 0-based index for dynamic steps (Menores12, 12+)
  completedSteps: number[]  // steps that have been completed

  setCurrentStep: (step: number) => void
  setCurrentSubStep: (subStep: number) => void
  nextStep: () => void
  prevStep: () => void
  resetAll: () => void
}

const REPORT_STEP = 8   // reporte — terminal
const MIN_STEP = 1

export const createWizardSlice: StateCreator<
  WizardSliceState,
  [],
  [],
  WizardSliceState
> = (set) => ({
  currentStep: 1,
  currentSubStep: 0,
  completedSteps: [],

  setCurrentStep: (step) => set({ currentStep: step }),

  setCurrentSubStep: (subStep) => set({ currentSubStep: subStep }),

  nextStep: () =>
    set((state) => {
      if (state.currentStep >= REPORT_STEP) {
        return state // reporte is terminal
      }
      const completed = state.completedSteps.includes(state.currentStep)
        ? state.completedSteps
        : [...state.completedSteps, state.currentStep]
      return {
        currentStep: state.currentStep + 1,
        currentSubStep: 0,
        completedSteps: completed,
      }
    }),

  prevStep: () =>
    set((state) => {
      if (state.currentStep <= MIN_STEP) {
        return state // Can't go below step 1
      }
      return {
        currentStep: state.currentStep - 1,
        currentSubStep: 0,
      }
    }),

  resetAll: () =>
    set({
      currentStep: 1,
      currentSubStep: 0,
      completedSteps: [],
    }),
})