import { describe, it, expect } from 'vitest'
import type { TimerEntry, TimerData } from './timer'

describe('TimerEntry', () => {
  it('holds step, label, elapsed, and status', () => {
    const entry: TimerEntry = {
      step: 1,
      stepLabel: 'Portada',
      elapsedSeconds: 120,
      status: 'stopped',
    }
    expect(entry.step).toBe(1)
    expect(elapsedSecondsOf(entry)).toBe(120)
    expect(entry.status).toBe('stopped')
  })

  it('has optional startedAt when running', () => {
    const entry: TimerEntry = {
      step: 2,
      stepLabel: 'Hogares',
      elapsedSeconds: 0,
      status: 'running',
      startedAt: 1700000000,
    }
    expect(entry.startedAt).toBe(1700000000)
  })
})

function elapsedSecondsOf(entry: TimerEntry): number {
  return entry.elapsedSeconds
}

describe('TimerData', () => {
  it('holds entries keyed by step, total, running flag, current step', () => {
    const timer: TimerData = {
      entries: {
        1: { step: 1, stepLabel: 'Portada', elapsedSeconds: 0, status: 'stopped' },
      },
      totalElapsedSeconds: 0,
      isRunning: false,
      currentStep: 1,
    }
    expect(timer.entries[1].stepLabel).toBe('Portada')
    expect(timer.isRunning).toBe(false)
  })
})