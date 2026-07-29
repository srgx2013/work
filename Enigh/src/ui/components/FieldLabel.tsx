// FieldLabel — accessible label for a form field.
// Shows Spanish label text, optional red asterisk for required fields,
// and optional hint text (e.g. "(1-7)").

import { type ReactNode } from 'react'

interface FieldLabelProps {
  htmlFor?: string
  required?: boolean
  hint?: string
  children: ReactNode
}

export function FieldLabel({ htmlFor, required, hint, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-text">
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
      {hint && <span className="ml-1 text-xs text-muted">{hint}</span>}
    </label>
  )
}