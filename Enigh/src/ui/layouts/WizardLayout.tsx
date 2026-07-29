// WizardLayout — full page grid layout.
// header (title + ProgressBar + TimerBar) | main (children, scrollable) | footer (ValidationSummary + Nav).
//
// On "Siguiente":
//   1. Run the per-step Zod schema (validateStep) — field-level BLOCKERs.
//   2. When leaving decision-precedent steps (1 / 7), run cross-section
//      validation. BLOCKER cross-section errors prevent Step 7 → Reporte.
//      WARNING errors are persisted to the store so the report can surface
//      them but do not block navigation.
//   3. Advance via computeNextStep — handles skip (step 2→3 → step 4 when no
//      menores) and early-close (Portada resultado A3/A6 → Reporte).
// On "Anterior":
//   - No validation runs; the per-step errors are cleared so the user can edit
//     without persistent red highlights.
// localStorage unavailability is detected in App.tsx; this component focuses
// on validation, navigation, timer lifecycle and the reset modal.

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useAppStore } from '@/application/store/index'
import { ProgressBar, type ProgressStep } from '@/ui/components/ProgressBar'
import { TimerBar } from '@/ui/components/TimerBar'
import { WizardNavigation } from '@/ui/components/WizardNavigation'
import { ValidationSummary } from '@/ui/components/ValidationSummary'
import { ConfirmModal } from '@/ui/components/ConfirmModal'
import { validateStep } from '@/application/use-cases/validate-step'
import {
  runCrossSectionValidation,
  partitionBySeverity,
} from '@/application/use-cases/validate-cross-section'
import { computeNextStep } from '@/application/use-cases/navigate-step'

interface WizardLayoutProps {
  children?: ReactNode
}

const STEP_LABELS = [
  'Portada', 'Hogar', '<12', '12+', 'Neg.', 'Gastos', 'Diario', 'Reporte',
]

function buildSteps(currentStep: number, menoresCount = 0, personas12PlusCount = 0): ProgressStep[] {
  const labels: string[] = STEP_LABELS.map((label, i) => {
    const stepNum = i + 1
    if (stepNum === 3) return `Menores 12 (${menoresCount})`
    if (stepNum === 4) return `12+ (${personas12PlusCount})`
    return label
  })
  return labels.map((label, i) => {
    const stepNum = i + 1
    let status: ProgressStep['status'] = 'pending'
    if (stepNum === currentStep) status = 'active'
    else if (stepNum < currentStep) status = 'completed'
    else if (stepNum > currentStep) status = 'pending'
    return { id: String(stepNum), label, status }
  })
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const currentStep = useAppStore((s) => s.currentStep)
  const stepErrors = useAppStore((s) => s.stepErrors)
  // derive dynamic counts for ProgressBar labels of steps 3 and 4
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const menoresCount = integrantes.filter((i) => i.edad < 12).length
  const personas12PlusCount = integrantes.filter((i) => i.edad >= 12).length

  const setCurrentStep = useAppStore((s) => s.setCurrentStep)
  const prevStep = useAppStore((s) => s.prevStep)
  const resetAll = useAppStore((s) => s.resetAll)

  const setStepErrors = useAppStore((s) => s.setStepErrors)
  const clearStepErrors = useAppStore((s) => s.clearStepErrors)
  const setCrossSectionErrors = useAppStore((s) => s.setCrossSectionErrors)
  const crossSectionErrors = useAppStore((s) => s.crossSectionErrors)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [validationOpen, setValidationOpen] = useState(false)

  // Scroll-to-top on every step change so the user starts at the top of the
  // new form regardless of where the previous scroll position was.
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    // Some test environments (jsdom) don't implement scrollTo on actual
    // elements. Guard with a typeof check so the app still renders.
    const behavior = 'instant' as ScrollBehavior
    if (mainRef.current && typeof mainRef.current.scrollTo === 'function') {
      mainRef.current.scrollTo({ top: 0, left: 0, behavior })
    }
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, left: 0, behavior })
    }
  }, [currentStep])

  // ── Timer lifecycle: start when entering a step, pause when leaving ──
  const startTimer = useAppStore((s) => s.startTimer)
  const stopTimer = useAppStore((s) => s.stopTimer)

  useEffect(() => {
    // Only timer for questionnaire steps (1-7), not reporte (8)
    if (currentStep >= 1 && currentStep <= 7) {
      startTimer(currentStep)
      return () => {
        stopTimer()
      }
    }
  }, [currentStep, startTimer, stopTimer])

  const stepErrorsList = stepErrors[currentStep] ?? []
  const canGoNext = stepErrorsList.length === 0

  // Active cross-section BLOCKER errors relevant for the current step view
  // (shown in the footer summary panel when validation is open).
  const crossBlockers = crossSectionErrors.filter((e) => e.severity === 'BLOCKER')

  function handleNext() {
    // 1. Per-step Zod validation.
    const freshErrors = validateStep(currentStep, useAppStore.getState())
    if (freshErrors.length > 0) {
      setStepErrors(currentStep, freshErrors)
      // Clear any stale cross-section panel while we focus on the step itself.
      setCrossSectionErrors([])
      setValidationOpen(true)
      return
    }
    clearStepErrors(currentStep)

    const snapshot = useAppStore.getState()

    // 2. Step 7 → step 8: run cross-section master validation.
    if (currentStep === 7) {
      const csErrors = runCrossSectionValidation({
        portada: snapshot.portada,
        hogares: snapshot.hogares,
        menores12: snapshot.menores12,
        personas12plus: snapshot.personas12plus,
        negocios: snapshot.negocios,
        gastosHogar: snapshot.gastosHogar,
        gastosDiarios: snapshot.gastosDiarios,
      })
      setCrossSectionErrors(csErrors)
      const { blockers } = partitionBySeverity(csErrors)
      if (blockers.length > 0) {
        setValidationOpen(true)
        return
      }
      setValidationOpen(false)
      setCurrentStep(computeNextStep(currentStep, snapshot))
      return
    }

    // 3. Step 1 — early close on resultado A3/A6 → Reporte.
    if (currentStep === 1) {
      const nextNum = computeNextStep(currentStep, snapshot)
      if (nextNum === 8) {
        const csErrors = runCrossSectionValidation({
          portada: snapshot.portada,
          hogares: snapshot.hogares,
          menores12: snapshot.menores12,
          personas12plus: snapshot.personas12plus,
          negocios: snapshot.negocios,
          gastosHogar: snapshot.gastosHogar,
          gastosDiarios: snapshot.gastosDiarios,
        })
        setCrossSectionErrors(csErrors)
        // Do NOT block — early close is valid; report shows "INCOMPLETO".
        setValidationOpen(false)
        setCurrentStep(8)
        return
      }
      setCrossSectionErrors([])
      setValidationOpen(false)
      setCurrentStep(nextNum)
      return
    }

    // 4. Normal steps — but still let computeNextStep skip 2→3 when no menores.
    setCrossSectionErrors([])
    setValidationOpen(false)
    setCurrentStep(computeNextStep(currentStep, snapshot))
  }

  function handleBack() {
    setValidationOpen(false)
    // Clear persisted errors for the current step so the user can edit
    // without stale red highlights following them backward.
    clearStepErrors(currentStep)
    setCrossSectionErrors([])
    prevStep()
  }

  function handleReset() {
    resetAll()
    setConfirmOpen(false)
  }

  function handleStepClick(id: string) {
    const target = Number(id)
    if (target <= currentStep) setCurrentStep(target)
  }

  // Escape closes any open ConfirmModal.
  useEffect(() => {
    if (!confirmOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmOpen])

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] bg-surfaceDim">
      <header
        role="banner"
        className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3"
      >
        <div>
          <h1 className="text-xl font-bold text-primary">
            IKTAN Simulator — Captura ENIGH 2024
          </h1>
        </div>
        <ProgressBar
          steps={buildSteps(currentStep, menoresCount, personas12PlusCount)}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        <div className="flex items-center gap-3">
          <TimerBar />
        </div>
      </header>

      <main role="main" ref={mainRef} className="overflow-y-auto px-4 py-6">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>

      <footer className="border-t border-neutral-200 bg-white px-4 py-3">
        {validationOpen && (stepErrorsList.length > 0 || crossBlockers.length > 0) && (
          <ValidationSummary
            errors={stepErrorsList}
            crossSectionErrors={crossBlockers}
          />
        )}
        <WizardNavigation
          onNext={handleNext}
          onBack={handleBack}
          canGoNext={canGoNext || validationOpen}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 8}
          onReset={() => setConfirmOpen(true)}
        />
      </footer>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Reiniciar folio"
        message="¿Está seguro de que desea reiniciar el folio? Se perderán todos los datos capturados."
        confirmLabel="Sí, reiniciar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}