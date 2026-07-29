// ReadOnlyField — display-only field for pre-filled or propagated values
// (e.g. folioViv in non-Portada steps, integrante names in sub-forms).
// Grayed-out background, no input element.

import { FieldLabel } from './FieldLabel'

interface ReadOnlyFieldProps {
  label: string
  value: string
  htmlFor?: string
}

export function ReadOnlyField({ label, value, htmlFor }: ReadOnlyFieldProps) {
  return (
    <div className="mb-4">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      <div className="w-full max-w-md rounded-md border border-transparent bg-neutral-100 px-3 py-2 text-base text-muted">
        {value || '-'}
      </div>
    </div>
  )
}