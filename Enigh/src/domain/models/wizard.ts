export type StepStatus = 'pending' | 'current' | 'completed'

export type WizardStep = {
  id: number
  label: string
  status: StepStatus
  count?: number
}

export type WizardState = {
  currentStep: number      // 1-8 (8 = reporte)
  currentSubStep: number   // 0-based index for dynamic steps
  completedSteps: number[]
}