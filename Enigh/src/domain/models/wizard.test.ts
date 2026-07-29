import { describe, it, expect } from 'vitest'
import type { WizardStep, WizardState } from './wizard'

describe('WizardStep', () => {
  it('has id, label, and status', () => {
    const step: WizardStep = { id: 1, label: 'Portada', status: 'current' }
    expect(step.id).toBe(1)
    expect(step.status).toBe('current')
  })

  it('has optional count for dynamic steps', () => {
    const step: WizardStep = { id: 3, label: 'Menores 12', status: 'pending', count: 2 }
    expect(step.count).toBe(2)
  })
})

describe('WizardState', () => {
  it('tracks current step, sub-step, and completed steps', () => {
    const state: WizardState = {
      currentStep: 3,
      currentSubStep: 1,
      completedSteps: [1, 2],
    }
    expect(state.currentStep).toBe(3)
    expect(state.currentSubStep).toBe(1)
    expect(state.completedSteps).toEqual([1, 2])
  })
})