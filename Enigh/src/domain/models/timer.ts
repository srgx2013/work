export type TimerStatus = 'running' | 'stopped'

export type TimerEntry = {
  step: number      // 1-7
  stepLabel: string
  elapsedSeconds: number
  status: TimerStatus
  startedAt?: number  // Unix timestamp when current segment started
}

export type TimerData = {
  entries: Record<number, TimerEntry>
  totalElapsedSeconds: number
  isRunning: boolean
  currentStep: number
}