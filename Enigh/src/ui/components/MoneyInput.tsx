// MoneyInput — decimal text input (string-based, no $ stripping).
// Accepts digits and one decimal point. On blur, when the value has no
// fractional part, formats it with 2 decimal places (e.g. "500" → "500.00").
// Parent runs Zod moneySchema via onBlur.

import { FieldWrapper } from './FieldWrapper'

interface MoneyInputProps {
  name: string
  value: string                       // already string form, e.g. "1234.50"
  onChange: (value: string) => void   // raw string
  onBlur?: (value: string) => void
  label: string
  required?: boolean
  error?: string | null
  placeholder?: string
  disabled?: boolean
}

function formatTwoDecimals(s: string): string {
  if (!s) return s
  const num = Number(s)
  if (Number.isNaN(num)) return s
  return num.toFixed(2)
}

// Accepts only digits and a single decimal point. Strips $ and commas;
// collapses multiple dots onto the first one.
function filterMoneyInput(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
}

export function MoneyInput({
  name,
  value,
  onChange,
  onBlur,
  label,
  required,
  error = null,
  placeholder = 'sin $ ni comas',
  disabled,
}: MoneyInputProps) {
  const inputId = `money-${name}`

  function handleBlur() {
    if (value) {
      const formatted = formatTwoDecimals(value)
      if (formatted !== value) onChange(formatted)
    }
    onBlur?.(value)
  }

  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={inputId}>
      <div className="flex items-center">
        <span className="mr-1 text-sm text-muted" aria-hidden="true">$</span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(filterMoneyInput(e.target.value))}
          onBlur={handleBlur}
          className={`w-40 px-3 py-2 rounded-md border text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 ${
            error ? 'border-danger focus:ring-danger/50' : 'border-neutral-300 focus:border-primary'
          }`}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
    </FieldWrapper>
  )
}