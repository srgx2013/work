import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextAreaInput } from './TextAreaInput'

describe('TextAreaInput', () => {
  it('renders label and textarea element', () => {
    render(<TextAreaInput name="obs" value="" onChange={() => {}} label="Observaciones" />)
    expect(screen.getByText('Observaciones')).toBeInTheDocument()
    expect(screen.getByLabelText('Observaciones').tagName).toBe('TEXTAREA')
  })

  it('calls onChange with raw text', () => {
    const onChange = vi.fn()
    render(<TextAreaInput name="obs" value="" onChange={onChange} label="Obs" />)
    fireEvent.change(screen.getByLabelText('Obs'), { target: { value: 'Hola' } })
    expect(onChange).toHaveBeenCalledWith('Hola')
  })

  it('shows error message', () => {
    render(<TextAreaInput name="obs" value="" onChange={() => {}} label="Obs" error="Requerido" />)
    expect(screen.getByText(/Requerido/)).toBeInTheDocument()
  })

  it('is disabled when disabled provided', () => {
    render(<TextAreaInput name="obs" value="" onChange={() => {}} label="Obs" disabled />)
    expect((screen.getByLabelText('Obs') as HTMLTextAreaElement).disabled).toBe(true)
  })

  it('respects rows attribute', () => {
    render(<TextAreaInput name="obs" value="" onChange={() => {}} label="Obs" rows={5} />)
    expect((screen.getByLabelText('Obs') as HTMLTextAreaElement).rows).toBe(5)
  })
})