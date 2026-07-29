// Timer slice — manages per-questionnaire elapsed time tracking.
// Uses Date.now() for start/stop/resume calculations (no setInterval).
// The component renders the ticking UI separately.

import type { StateCreator } from 'zustand'
import type { TimerData } from '@/domain/models/timer'
import { createInitialTimer } from '../initial-state'

export type TimerSliceState = {
  timer: TimerData

  startTimer: (step: number) => void
  stopTimer: () => void
  resumeTimer: (step: number) => void
  resetAllTimers: () => void
}

export const createTimeSlice: StateCreator<
  TimerSliceState,
  [],
  [],
  TimerSliceState
> = (set, get) => ({
  timer: createInitialTimer(),

  startTimer: (step) =>
    set((state) => ({
      timer: {
        ...state.timer,
        currentStep: step,
        isRunning: true,
        entries: {
          ...state.timer.entries,
          [step]: {
            ...state.timer.entries[step],
            status: 'running',
            startedAt: Date.now(),
          },
        },
      },
    })),

  stopTimer: () => {
    const state = get()
    const entry = state.timer.entries[state.timer.currentStep]
    if (!entry || entry.status !== 'running') return

    const segmentElapsed = Math.floor(
      (Date.now() - (entry.startedAt ?? Date.now())) / 1000
    )

    set({
      timer: {
        ...state.timer,
        isRunning: false,
        entries: {
          ...state.timer.entries,
          [state.timer.currentStep]: {
            ...entry,
            status: 'stopped',
            elapsedSeconds: entry.elapsedSeconds + segmentElapsed,
            startedAt: undefined,
          },
        },
      },
    })
  },

  resumeTimer: (step) =>
    set((state) => ({
      timer: {
        ...state.timer,
        currentStep: step,
        isRunning: true,
        entries: {
          ...state.timer.entries,
          [step]: {
            ...state.timer.entries[step],
            status: 'running',
            startedAt: Date.now(),
          },
        },
      },
    })),

  resetAllTimers: () => set({ timer: createInitialTimer() }),
})