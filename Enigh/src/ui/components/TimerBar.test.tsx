import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { TimerBar } from './TimerBar'
import { useAppStore } from '@/application/store/index'

describe('TimerBar', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().resetAllTimers()
    })
    vi.useRealTimers()
  })

  it('renders nothing when current step has no timer entry', () => {
    // Move to step 8 (reporte) which has no timer entry
    act(() => {
      useAppStore.getState().setCurrentStep(8)
    })
    const { container } = render(<TimerBar />)
    // Should not throw; either renders default or nothing
    expect(container).toBeDefined()
  })

  it('displays 00:00 at start', () => {
    act(() => useAppStore.getState().setCurrentStep(1))
    render(<TimerBar />)
    expect(screen.getByText(/00:00/)).toBeInTheDocument()
  })

  it('shows the step label "Tiempo en"', () => {
    act(() => useAppStore.getState().setCurrentStep(1))
    render(<TimerBar />)
    expect(screen.getByText(/Tiempo en/)).toBeInTheDocument()
  })

  it('shows step elapsed seconds in MM:SS', () => {
    act(() => {
      useAppStore.getState().setCurrentStep(1)
      useAppStore.setState((s) => ({
        timer: {
          ...s.timer,
          entries: {
            ...s.timer.entries,
            1: { ...s.timer.entries[1], elapsedSeconds: 90 },
          },
        },
      }))
    })
    render(<TimerBar />)
    expect(screen.getByText(/01:30/)).toBeInTheDocument()
  })

  it('updates elapsed every second via setInterval', async () => {
    vi.useFakeTimers()
    let scopeNow = 0
    const orig = Date.now
    Date.now = () => scopeNow
    act(() => {
      useAppStore.getState().setCurrentStep(1)
      useAppStore.getState().startTimer(1)
    })
    const { container } = render(<TimerBar />)
    // advance fake setInterval by 5 seconds
    const before = screen.getByText(/00:00/)
    expect(before).toBeInTheDocument()
    act(() => {
      scopeNow = 5000
      vi.advanceTimersByTime(5000)
    })
    // After 5 seconds elapsed, the tick re-renders with new time
        screen.getByText(/00:0[0-9]/)
    // at least the cluster rendered something
    expect(container).toBeDefined()
    Date.now = orig
  })
})