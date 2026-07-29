import { describe, it, expect, beforeEach, vi } from 'vitest'
import { create } from 'zustand'
import { createTimeSlice, type TimerSliceState } from './timer.slice'

function createTestStore() {
  return create<TimerSliceState>()((...a) => ({
    ...createTimeSlice(...a),
  }))
}

describe('TimerSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.spyOn(Date, 'now')
  })

  describe('startTimer', () => {
    it('sets step 2 entry status to "running" with startedAt', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(2)
      const entry = store.getState().timer.entries[2]
      expect(entry.status).toBe('running')
      expect(entry.startedAt).toBe(1000)
    })

    it('sets timer currentStep and isRunning', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(3)
      expect(store.getState().timer.currentStep).toBe(3)
      expect(store.getState().timer.isRunning).toBe(true)
    })
  })

  describe('stopTimer', () => {
    it('calculates elapsed correctly and sets status to "stopped"', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(1)

      Date.now = vi.fn(() => 5000)
      store.getState().stopTimer()

      const entry = store.getState().timer.entries[1]
      expect(entry.status).toBe('stopped')
      expect(entry.elapsedSeconds).toBe(4)
      expect(entry.startedAt).toBeUndefined()
    })

    it('accumulates elapsed time across multiple start/stop cycles', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(1)

      Date.now = vi.fn(() => 4000)
      store.getState().stopTimer()

      Date.now = vi.fn(() => 10000)
      store.getState().resumeTimer(1)

      Date.now = vi.fn(() => 15000)
      store.getState().stopTimer()

      expect(store.getState().timer.entries[1].elapsedSeconds).toBe(8)
    })

    it('does nothing when no timer is running', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().stopTimer()
      expect(store.getState().timer.isRunning).toBe(false)
    })

    it('sets isRunning to false', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(1)
      Date.now = vi.fn(() => 2000)
      store.getState().stopTimer()
      expect(store.getState().timer.isRunning).toBe(false)
    })
  })

  describe('resumeTimer', () => {
    it('restarts step 2 timer from accumulated time', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(2)

      Date.now = vi.fn(() => 5000)
      store.getState().stopTimer()

      expect(store.getState().timer.entries[2].elapsedSeconds).toBe(4)

      Date.now = vi.fn(() => 10000)
      store.getState().resumeTimer(2)

      const entry = store.getState().timer.entries[2]
      expect(entry.status).toBe('running')
      expect(entry.startedAt).toBe(10000)
      expect(entry.elapsedSeconds).toBe(4) // preserved from before
    })

    it('sets timer currentStep', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().resumeTimer(5)
      expect(store.getState().timer.currentStep).toBe(5)
      expect(store.getState().timer.isRunning).toBe(true)
    })
  })

  describe('resetAllTimers', () => {
    it('zeroes all entries', () => {
      Date.now = vi.fn(() => 1000)
      store.getState().startTimer(1)
      Date.now = vi.fn(() => 5000)
      store.getState().stopTimer()

      store.getState().resetAllTimers()

      const timer = store.getState().timer
      for (let step = 1; step <= 7; step++) {
        expect(timer.entries[step].elapsedSeconds).toBe(0)
        expect(timer.entries[step].status).toBe('stopped')
        expect(timer.entries[step].startedAt).toBeUndefined()
      }
      expect(timer.totalElapsedSeconds).toBe(0)
      expect(timer.isRunning).toBe(false)
    })
  })
})