// CodeInput — the primary input for ENIGH coded answers.
// User types the numeric code (e.g. "14" for Jalisco).
// Has a "📖 Códigos" button that toggles a catalog reference panel.
// Validates on blur (parent validates via onBlur).

import { FieldWrapper } from './FieldWrapper'

interface CatalogCode {
  code: string
  label: string
}

interface CodeInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  label: string
  required?: boolean
  error?: string | null
  catalogCodes?: CatalogCode[]
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
}

function computeRange(codes: CatalogCode[]): string {
  if (codes.length === 0) return ''
  const sorted = [...codes].sort((a, b) =>
    a.code.localeCompare(b.code, undefined, { numeric: true })
  )
  if (sorted.length <= 8) {
    return `(${sorted.map((c) => c.code).join(', ')})`
  }
  return `(${sorted[0].code}-${sorted[sorted.length - 1].code})`
}

export function CodeInput({
  name,
  value,
  onChange,
  onBlur,
  label,
  required,
  error = null,
  catalogCodes,
  maxLength,
  placeholder,
  disabled,
  readOnly,
}: CodeInputProps) {
  const inputId = `code-${name}`
  const hint = catalogCodes ? computeRange(catalogCodes) : undefined

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      htmlFor={inputId}
      hint={hint}
      catalogInfo={catalogCodes ? { codes: catalogCodes } : undefined}
    >
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        value={value}
        maxLength={maxLength ?? 2}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        className={`w-20 px-2 py-2 rounded-md border text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 read-only:bg-neutral-100 read-only:text-muted ${
          error ? 'border-danger focus:ring-danger/50' : 'border-neutral-300 focus:border-primary'
        }`}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
    </FieldWrapper>
  )
}