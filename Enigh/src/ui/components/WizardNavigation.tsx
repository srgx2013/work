// WizardNavigation — Anterior / Siguiente buttons for wizard footer.
// On the last step, "Siguiente" label becomes "Ver Reporte".
// Anterior is disabled on the first step; Siguiente is disabled when !canGoNext.

interface WizardNavigationProps {
  onNext: () => void
  onBack: () => void
  canGoNext: boolean
  isFirstStep: boolean
  isLastStep: boolean
  nextLabel?: string
  onReset?: () => void
  resetLabel?: string
}

export function WizardNavigation({
  onNext,
  onBack,
  canGoNext,
  isFirstStep,
  isLastStep,
  nextLabel,
  onReset,
  resetLabel = 'Reiniciar',
}: WizardNavigationProps) {
  const label = isLastStep ? nextLabel ?? 'Ver Reporte' : nextLabel ?? 'Siguiente'
  return (
    <nav className="flex items-center justify-between" aria-label="Navegación">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100"
        >
          {resetLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
    </nav>
  )
}