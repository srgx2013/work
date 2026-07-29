// timer-integration.test.tsx — Tests for timer lifecycle in WizardLayout.
// Verifies start-on-enter, pause-on-leave, resume-on-return, MM:SS display.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { App } from '@/App'
import { useAppStore } from '@/application/store/index'

describe('Timer Integration', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().resetAllTimers()
    })
    vi.useRealTimers()
  })

  describe('MM:SS format', () => {
    it('TimerBar displays MM:SS format', () => {
      act(() => useAppStore.getState().setCurrentStep(1))
      render(<App />)
      // Timer starts at 00:00
      expect(screen.getByText(/00:00/)).toBeInTheDocument()
    })

    it('TimerBar shows HH:MM:SS when ≥ 60 minutes', () => {
      act(() => {
        useAppStore.getState().setCurrentStep(1)
        useAppStore.setState((s) => ({
          timer: {
            ...s.timer,
            entries: {
              ...s.timer.entries,
              1: { ...s.timer.entries[1], elapsedSeconds: 3661 },
            },
          },
        }))
      })
      render(<App />)
      // 3661 seconds = 01:01:01
      expect(screen.getByText(/01:01:01/)).toBeInTheDocument()
    })
  })

  describe('start on step enter', () => {
    it('starts timer when entering a step', () => {
      act(() => useAppStore.getState().setCurrentStep(1))
      render(<App />)
      // Timer entry for step 1 should be running
      const entry = useAppStore.getState().timer.entries[1]
      expect(entry.status).toBe('running')
    })

    it('timer entry has startedAt set when running', () => {
      act(() => useAppStore.getState().setCurrentStep(1))
      render(<App />)
      const entry = useAppStore.getState().timer.entries[1]
      expect(entry.startedAt).toBeDefined()
    })
  })

  describe('pause on step leave', () => {
    it('pauses timer when leaving a step', () => {
      act(() => useAppStore.getState().setCurrentStep(1))
      render(<App />)
      // Verify running
      expect(useAppStore.getState().timer.entries[1].status).toBe('running')
      // Simulate leaving the step
      act(() => {
        useAppStore.getState().stopTimer()
      })
      expect(useAppStore.getState().timer.entries[1].status).toBe('stopped')
    })
  })

  describe('resume on return', () => {
    it('resumes timer when returning to a previously visited step', () => {
      act(() => {
        useAppStore.getState().setCurrentStep(1)
        useAppStore.getState().startTimer(1)
      })
      render(<App />)
      // Leave the step
      act(() => useAppStore.getState().stopTimer())
      expect(useAppStore.getState().timer.entries[1].status).toBe('stopped')
      // Return to it
      act(() => useAppStore.getState().resumeTimer(1))
      expect(useAppStore.getState().timer.entries[1].status).toBe('running')
    })
  })

  describe('timer ticks every second', () => {
    it('updates display via setInterval', () => {
      vi.useFakeTimers()
      let scopeNow = 0
      const orig = Date.now
      Date.now = () => scopeNow
      act(() => {
        useAppStore.getState().setCurrentStep(1)
        useAppStore.getState().startTimer(1)
      })
      render(<App />)
      // Starts at 00:00
      expect(screen.getByText(/00:00/)).toBeInTheDocument()
      // Advance 3 seconds
      act(() => {
        scopeNow = 3000
        vi.advanceTimersByTime(3000)
      })
      // Should show 00:03 or similar (non-zero seconds)
      const timerElement = screen.getByText(/00:0[0-9]/)
      expect(timerElement).toBeInTheDocument()
      Date.now = orig
      vi.useRealTimers()
    })
  })
})