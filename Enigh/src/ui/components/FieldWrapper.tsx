// FieldWrapper — composes FieldLabel + the field input + CatalogHelp toggle +
// inline ValidationMessage. Used by all field components.

import { useState, type ReactNode } from 'react'
import { FieldLabel } from './FieldLabel'
import { CatalogHelp } from './CatalogHelp'
import { ValidationMessage } from './ValidationMessage'

interface CatalogCode {
  code: string
  label: string
}

interface FieldWrapperProps {
  label: string
  required?: boolean
  error?: string | null
  catalogInfo?: { codes: CatalogCode[] }
  children: ReactNode
  htmlFor?: string
  hint?: string  // e.g. "(1-7)"
}

export function FieldWrapper({
  label,
  required,
  error = null,
  catalogInfo,
  children,
  htmlFor,
  hint,
}: FieldWrapperProps) {
  const [showCatalog, setShowCatalog] = useState(false)

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={htmlFor} required={required} hint={hint}>
          {label}
        </FieldLabel>
        {catalogInfo && (
          <button
            type="button"
            onClick={() => setShowCatalog((v) => !v)}
            className="text-xs text-primary-light hover:text-primary"
            aria-label={`Ver códigos para ${label}`}
            aria-expanded={showCatalog}
          >
            📖 Códigos
          </button>
        )}
      </div>
      {children}
      {error !== null && error !== undefined && (
        <ValidationMessage message={error} type="error" />
      )}
      {catalogInfo && (
        <CatalogHelp
          codes={catalogInfo.codes}
          isOpen={showCatalog}
          onClose={() => setShowCatalog(false)}
          fieldLabel={label}
        />
      )}
    </div>
  )
}