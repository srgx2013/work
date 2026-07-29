// TextInput — standard free-text input (names, occupation, observations).
// For nombres, capitalize first letter of each word on blur when `capitalize`.

import { FieldWrapper } from './FieldWrapper'

interface TextInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  label: string
  required?: boolean
  error?: string | null
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  capitalize?: boolean
}

function capitalizeWords(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function TextInput({
  name,
  value,
  onChange,
  onBlur,
  label,
  required,
  error = null,
  maxLength,
  placeholder,
  disabled,
  readOnly,
  capitalize,
}: TextInputProps) {
  const inputId = `text-${name}`

  function handleBlur() {
    if (capitalize && value) {
      onChange(capitalizeWords(value))
    }
    onBlur?.(value)
  }

  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={inputId}>
      <input
        id={inputId}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        className={`w-full max-w-md px-3 py-2 rounded-md border text-base focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 read-only:bg-neutral-100 read-only:text-muted ${
          error ? 'border-danger focus:ring-danger/50' : 'border-neutral-300 focus:border-primary'
        }`}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
    </FieldWrapper>
  )
}