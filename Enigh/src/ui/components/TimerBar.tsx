// TimerBar — current step timer display.
// Reads elapsed ms from the timer store entry keyed by currentStep,
// updates display every second using setInterval calling setState local,
// so re-renders are stable.

import { useEffect, useState } from 'react'
import { useAppStore } from '@/application/store/index'

function format(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function computeLiveElapsed(entry: { elapsedSeconds: number; status: string; startedAt?: number }): number {
  if (entry.status === 'running' && entry.startedAt !== undefined) {
    return entry.elapsedSeconds + Math.floor((Date.now() - entry.startedAt) / 1000)
  }
  return entry.elapsedSeconds
}

export function TimerBar() {
  const currentStep = useAppStore((s) => s.currentStep)
  const entries = useAppStore((s) => s.timer.entries)
  const stopTimer = useAppStore((s) => s.stopTimer)
  const startTimer = useAppStore((s) => s.startTimer)
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Page Visibility API — pause timer while tab is hidden.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) {
        stopTimer()
      } else if (useAppStore.getState().timer.isRunning === false) {
        startTimer(useAppStore.getState().currentStep)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [startTimer, stopTimer])

  const entry = entries[currentStep]
  if (!entry) return null

  const live = computeLiveElapsed(entry)
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 font-mono text-sm text-text"
      aria-live="off"
      aria-label={`Tiempo en ${entry.stepLabel}: ${format(live)}`}
    >
      <span aria-hidden="true">⏱</span>
      <span>Tiempo en {entry.stepLabel}: {format(live)}</span>
    </div>
  )
}