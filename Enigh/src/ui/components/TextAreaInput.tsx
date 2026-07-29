// TextAreaInput — multi-line text input (observaciones, etc.).
// Connected to FieldWrapper for label + validation message.

import { FieldWrapper } from './FieldWrapper'

interface TextAreaInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  error?: string | null
  rows?: number
  placeholder?: string
  disabled?: boolean
}

export function TextAreaInput({
  name,
  value,
  onChange,
  label,
  required,
  error = null,
  rows = 4,
  placeholder,
  disabled,
}: TextAreaInputProps) {
  const inputId = `textarea-${name}`
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={inputId}>
      <textarea
        id={inputId}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full max-w-2xl px-3 py-2 rounded-md border text-base focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 ${
          error ? 'border-danger focus:ring-danger/50' : 'border-neutral-300 focus:border-primary'
        }`}
      />
    </FieldWrapper>
  )
}