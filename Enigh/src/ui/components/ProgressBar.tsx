// ProgressBar — horizontal step indicator showing all 7 questionnaire steps
// + Reporte. Active step highlighted; completed shows ✓; pending is dimmed.
// Clicking a completed step navigates there; pending steps are not clickable.

export type StepStatus = 'pending' | 'active' | 'completed' | 'skipped'

export interface ProgressStep {
  id: string
  label: string
  status: StepStatus
}

interface ProgressBarProps {
  steps: ProgressStep[]
  currentStep: number
  onStepClick?: (id: string) => void
}

const statusClasses: Record<StepStatus, string> = {
  active: 'bg-primary text-white border-primary',
  completed: 'bg-success text-white border-success',
  pending: 'bg-neutral-200 text-neutral-500 border-neutral-300',
  skipped: 'bg-neutral-100 text-neutral-400 border-neutral-200',
}

export function ProgressBar({ steps, onStepClick }: ProgressBarProps) {
  return (
    <nav aria-label="Progreso">
      <ol className="flex items-center justify-between gap-1">
        {steps.map((step, idx) => {
          const clickable = step.status === 'completed' && onStepClick
          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={clickable ? () => onStepClick?.(step.id) : undefined}
                aria-current={step.status === 'active' ? 'step' : undefined}
                className={`flex flex-col items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
                  statusClasses[step.status]
                } ${clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                aria-label={step.label}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                    statusClasses[step.status]
                  }`}
                >
                  {step.status === 'completed' ? '✓' : idx + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <span aria-hidden="true" className="mx-0.5 h-px w-6 bg-neutral-300 sm:w-8" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}