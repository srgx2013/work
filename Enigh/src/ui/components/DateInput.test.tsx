import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { DateInput } from './DateInput'

function getInputs() {
  return {
    day: screen.getByPlaceholderText('DD') as HTMLInputElement,
    month: screen.getByPlaceholderText('MM') as HTMLInputElement,
    year: screen.getByPlaceholderText('AAAA') as HTMLInputElement,
  }
}

// Stateful wrapper so DateInput behaves like controlled component in a real app
function Stateful({
  initialValue = '',
  onChangeSpy,
  ...rest
}: {
  initialValue?: string
  onChangeSpy?: (v: string) => void
} & Omit<React.ComponentProps<typeof DateInput>, 'value' | 'onChange'>) {
  const [val, setVal] = useState(initialValue)
  return (
    <DateInput
      {...rest}
      value={val}
      onChange={(v) => {
        setVal(v)
        onChangeSpy?.(v)
      }}
    />
  )
}

describe('DateInput', () => {
  it('renders three separate number inputs (DD, MM, AAAA)', () => {
    render(<Stateful name="fechaInicio" label="Fecha de inicio" />)
    const { day, month, year } = getInputs()
    expect(day).toBeInTheDocument()
    expect(month).toBeInTheDocument()
    expect(year).toBeInTheDocument()
    expect(day.maxLength).toBe(2)
    expect(month.maxLength).toBe(2)
    expect(year.maxLength).toBe(4)
  })

  it('combines values to DD/MM/AAAA on change', () => {
    const onChange = vi.fn()
    render(<Stateful name="x" label="Fecha" onChangeSpy={onChange} />)
    const { day, month, year } = getInputs()
    fireEvent.change(day, { target: { value: '01' } })
    fireEvent.change(month, { target: { value: '07' } })
    fireEvent.change(year, { target: { value: '2025' } })
    // last call should be the final combined value
    expect(onChange).toHaveBeenLastCalledWith('01/07/2025')
  })

  it('splits initialValue "01/07/2025" into the three sub-inputs', () => {
    render(<Stateful name="x" initialValue="01/07/2025" label="Fecha" />)
    const { day, month, year } = getInputs()
    expect(day.value).toBe('01')
    expect(month.value).toBe('07')
    expect(year.value).toBe('2025')
  })

  it('auto-tabs from day to month when 2 digits entered', () => {
    render(<Stateful name="x" label="Fecha" />)
    const { day, month } = getInputs()
    day.focus()
    fireEvent.change(day, { target: { value: '15' } })
    fireEvent.blur(day)
    expect(document.activeElement).toBe(month)
  })

  it('shows error message', () => {
    render(<Stateful name="x" label="Fecha" error="Fecha inválida" />)
    expect(screen.getByText(/Fecha inválida/)).toBeInTheDocument()
  })

  it('clearing all fields yields empty string', () => {
    const onChange = vi.fn()
    render(<Stateful name="x" initialValue="01/07/2025" label="Fecha" onChangeSpy={onChange} />)
    const { day, month, year } = getInputs()
    fireEvent.change(day, { target: { value: '' } })
    fireEvent.change(month, { target: { value: '' } })
    fireEvent.change(year, { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith('')
  })
})