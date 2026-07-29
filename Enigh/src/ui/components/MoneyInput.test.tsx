import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoneyInput } from './MoneyInput'

describe('MoneyInput', () => {
  it('renders label and shows $ prefix', () => {
    render(<MoneyInput name="x" value="" onChange={() => {}} label="Ingreso" />)
    expect(screen.getByText('Ingreso')).toBeInTheDocument()
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('calls onChange with the raw string value', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="" onChange={onChange} label="Ingreso" />)
    fireEvent.change(screen.getByLabelText('Ingreso'), { target: { value: '1234.50' } })
    expect(onChange).toHaveBeenCalledWith('1234.50')
  })

  it('accepts decimal values with . separator', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="" onChange={onChange} label="Ingreso" />)
    const input = screen.getByLabelText('Ingreso') as HTMLInputElement
    expect(input.inputMode).toBe('decimal')
    fireEvent.change(input, { target: { value: '999.99' } })
    expect(onChange).toHaveBeenLastCalledWith('999.99')
  })

  it('formats display with 2 decimal places on blur when value has decimals', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="500" onChange={onChange} label="Ingreso" />)
    const input = screen.getByLabelText('Ingreso') as HTMLInputElement
    fireEvent.blur(input)
    // on blur, formats '500' to '500.00'
    expect(onChange).toHaveBeenLastCalledWith('500.00')
  })

  it('does not format on blur if value is empty', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="" onChange={onChange} label="Ingreso" />)
    fireEvent.blur(screen.getByLabelText('Ingreso'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(<MoneyInput name="x" value="" onChange={() => {}} label="Ingreso" error="Monto inválido" />)
    expect(screen.getByText(/Monto inválido/)).toBeInTheDocument()
  })

  it('filters out $ signs and commas from typed input', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="" onChange={onChange} label="Ingreso" />)
    fireEvent.change(screen.getByLabelText('Ingreso'), { target: { value: '$1,234.50' } })
    // $ and , should be stripped; only digits and one decimal point remain
    expect(onChange).toHaveBeenLastCalledWith('1234.50')
  })

  it('only keeps one decimal point (multiple dots collapse to one)', () => {
    const onChange = vi.fn()
    render(<MoneyInput name="x" value="" onChange={onChange} label="Ingreso" />)
    fireEvent.change(screen.getByLabelText('Ingreso'), { target: { value: '1.2.3' } })
    expect(onChange).toHaveBeenLastCalledWith('1.23')
  })

  it('is disabled when disabled true', () => {
    render(<MoneyInput name="x" value="" onChange={() => {}} label="Ingreso" disabled />)
    expect((screen.getByLabelText('Ingreso') as HTMLInputElement).disabled).toBe(true)
  })
})