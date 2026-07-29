// DateInput — three sub-inputs (DD, MM, AAAA) that merge to a "DD/MM/AAAA" string.
// Auto-tabs to the next field when the current field reaches its max length.
// Validates on blur (parent runs Zod dateSchema via onBlur).

import { useRef, type FocusEvent } from 'react'
import { FieldWrapper } from './FieldWrapper'

interface DateInputProps {
  name: string
  value: string           // "DD/MM/AAAA" or ""
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  label: string
  required?: boolean
  error?: string | null
  disabled?: boolean
}

function splitValue(value: string): { day: string; month: string; year: string } {
  if (!value) return { day: '', month: '', year: '' }
  const [day, month, year] = value.split('/')
  return { day: day ?? '', month: month ?? '', year: year ?? '' }
}

function combine(day: string, month: string, year: string): string {
  if (!day && !month && !year) return ''
  return `${day}/${month}/${year}`
}

export function DateInput({
  name,
  value,
  onChange,
  onBlur,
  label,
  required,
  error = null,
  disabled,
}: DateInputProps) {
  const { day, month, year } = splitValue(value)
  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  function emit(next: { day: string; month: string; year: string }) {
    onChange(combine(next.day, next.month, next.year))
  }

  function autoTab(
    e: FocusEvent<HTMLInputElement>,
    maxLength: number,
    nextRef: React.RefObject<HTMLInputElement | null>
  ) {
    if (e.target.value.length >= maxLength && nextRef.current) {
      nextRef.current.focus()
    }
  }

  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={`date-${name}-day`}>
      <div className="flex items-center gap-1" role="group" aria-label={label}>
        <input
          id={`date-${name}-day`}
          ref={dayRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={day}
          disabled={disabled}
          placeholder="DD"
          aria-label="Día"
          onChange={(e) => emit({ day: e.target.value, month, year })}
          onBlur={(e) => {
            autoTab(e, 2, monthRef)
            onBlur?.(combine(e.target.value, month, year))
          }}
          className={`w-14 px-2 py-2 rounded-md border text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 ${
            error ? 'border-danger' : 'border-neutral-300'
          }`}
        />
        <span aria-hidden="true">/</span>
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={month}
          disabled={disabled}
          placeholder="MM"
          aria-label="Mes"
          onChange={(e) => emit({ day, month: e.target.value, year })}
          onBlur={(e) => {
            autoTab(e, 2, yearRef)
            onBlur?.(combine(day, e.target.value, year))
          }}
          className={`w-14 px-2 py-2 rounded-md border text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 ${
            error ? 'border-danger' : 'border-neutral-300'
          }`}
        />
        <span aria-hidden="true">/</span>
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={year}
          disabled={disabled}
          placeholder="AAAA"
          aria-label="Año"
          onChange={(e) => emit({ day, month, year: e.target.value })}
          onBlur={() => onBlur?.(combine(day, month, year))}
          className={`w-20 px-2 py-2 rounded-md border text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 ${
            error ? 'border-danger' : 'border-neutral-300'
          }`}
        />
      </div>
    </FieldWrapper>
  )
}