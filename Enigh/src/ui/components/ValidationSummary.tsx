// ValidationSummary — step-level error panel listing all step errors,
// plus optional cross-section errors that span multiple questionnaires.
// Cross-section errors carry a severity (BLOCKER / WARNING), a rule id and
// the list of sections (questionnaires) they involve —— rendered inline so
// the user knows which questionnaires need a fix.

import type { FieldError, CrossSectionError } from '@/domain/validation/types'

interface ValidationSummaryProps {
  errors: FieldError[]
  crossSectionErrors?: CrossSectionError[]
  onFocusField?: (field: string) => void
}

function SeverityTag({ severity }: { severity: CrossSectionError['severity'] }) {
  if (severity === 'BLOCKER') {
    return (
      <span className="rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
        Bloqueante
      </span>
    )
  }
  return <span className="rounded bg-warning px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">AVISO</span>
}

export function ValidationSummary({
  errors,
  crossSectionErrors,
  onFocusField,
}: ValidationSummaryProps) {
  const hasFieldErrors = errors && errors.length > 0
  const cross = crossSectionErrors ?? []
  const hasCross = cross.length > 0

  if (!hasFieldErrors && !hasCross) return null

  return (
    <section
      aria-label="Resumen de errores"
      className="mb-3 rounded-md border border-danger/30 bg-red-50 p-3"
    >
      <h3 className="mb-1 font-semibold text-danger">
        Corrija los siguientes errores:
      </h3>
      <ul className="list-disc pl-5 text-sm text-danger">
        {errors.map((err, i) => (
          <li key={`field-${i}`}>
            <button
              type="button"
              disabled={!onFocusField}
              onClick={onFocusField ? () => onFocusField(err.field) : undefined}
              className="text-left text-danger underline-offset-2 disabled:cursor-default enabled:hover:underline"
            >
              {err.message}
            </button>
          </li>
        ))}
        {cross.map((err, i) => (
          <li key={`cross-${i}`} className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <SeverityTag severity={err.severity} />
              <span>{err.message}</span>
            </span>
            {err.sections.length > 0 && (
              <span className="text-xs font-normal text-danger/80">
                Cuestionarios: {err.sections.join(' ↔ ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}