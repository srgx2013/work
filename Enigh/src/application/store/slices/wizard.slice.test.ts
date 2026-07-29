import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createWizardSlice, type WizardSliceState } from './wizard.slice'

function createTestStore() {
  return create<WizardSliceState>()((...a) => ({
    ...createWizardSlice(...a),
  }))
}

describe('WizardSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  describe('initial state', () => {
    it('starts at step 1, subStep 0', () => {
      expect(store.getState().currentStep).toBe(1)
      expect(store.getState().currentSubStep).toBe(0)
    })

    it('starts with empty completedSteps', () => {
      expect(store.getState().completedSteps).toEqual([])
    })
  })

  describe('setCurrentStep', () => {
    it('sets current step to 5', () => {
      store.getState().setCurrentStep(5)
      expect(store.getState().currentStep).toBe(5)
    })

    it('sets current step to 8 (reporte step)', () => {
      store.getState().setCurrentStep(8)
      expect(store.getState().currentStep).toBe(8)
    })
  })

  describe('setCurrentSubStep', () => {
    it('sets current subStep to 2', () => {
      store.getState().setCurrentSubStep(2)
      expect(store.getState().currentSubStep).toBe(2)
    })
  })

  describe('nextStep', () => {
    it('advances from 1 to 2', () => {
      store.getState().nextStep()
      expect(store.getState().currentStep).toBe(2)
    })

    it('advances from 6 to 7', () => {
      store.getState().setCurrentStep(6)
      store.getState().nextStep()
      expect(store.getState().currentStep).toBe(7)
    })

    it('advances from 7 to 8 (reporte step)', () => {
      store.getState().setCurrentStep(7)
      store.getState().nextStep()
      expect(store.getState().currentStep).toBe(8)
    })

    it('does not advance past 8 (reporte is terminal)', () => {
      store.getState().setCurrentStep(8)
      store.getState().nextStep()
      expect(store.getState().currentStep).toBe(8)
    })

    it('resets subStep to 0 on advance', () => {
      store.getState().setCurrentSubStep(3)
      store.getState().nextStep()
      expect(store.getState().currentSubStep).toBe(0)
    })

    it('marks current step as completed on advance', () => {
      store.getState().nextStep()
      expect(store.getState().completedSteps).toContain(1)
    })
  })

  describe('prevStep', () => {
    it('goes back from 3 to 2', () => {
      store.getState().setCurrentStep(3)
      store.getState().prevStep()
      expect(store.getState().currentStep).toBe(2)
    })

    it('does not go below 1', () => {
      store.getState().prevStep()
      expect(store.getState().currentStep).toBe(1)
    })

    it('resets subStep to 0 on go back', () => {
      store.getState().setCurrentStep(3)
      store.getState().setCurrentSubStep(2)
      store.getState().prevStep()
      expect(store.getState().currentSubStep).toBe(0)
    })
  })

  describe('resetAll', () => {
    it('resets to step 1, subStep 0, empty completedSteps', () => {
      store.getState().setCurrentStep(5)
      store.getState().setCurrentSubStep(2)
      store.getState().nextStep()
      store.getState().resetAll()
      expect(store.getState().currentStep).toBe(1)
      expect(store.getState().currentSubStep).toBe(0)
      expect(store.getState().completedSteps).toEqual([])
    })
  })
})