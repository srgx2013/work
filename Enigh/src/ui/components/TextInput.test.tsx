import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextInput } from './TextInput'

describe('TextInput', () => {
  it('renders label and input', () => {
    render(<TextInput name="x" value="" onChange={() => {}} label="Nombre" />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('calls onChange with raw value', () => {
    const onChange = vi.fn()
    render(<TextInput name="x" value="" onChange={onChange} label="Nombre" />)
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    expect(onChange).toHaveBeenCalledWith('Juan')
  })

  it('capitalizes first letter of each word on blur when capitalize=true', () => {
    const onChange = vi.fn()
    render(
      <TextInput name="x" value="juan pérez" onChange={onChange} label="Nombre" capitalize />
    )
    fireEvent.blur(screen.getByLabelText('Nombre'))
    expect(onChange).toHaveBeenCalledWith('Juan Pérez')
  })

  it('does not capitalize when capitalize not set', () => {
    const onChange = vi.fn()
    render(<TextInput name="x" value="juan" onChange={onChange} label="Nombre" />)
    fireEvent.blur(screen.getByLabelText('Nombre'))
    // without capitalize, blur doesn't fire value change
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(<TextInput name="x" value="" onChange={() => {}} label="X" error="Requerido" />)
    expect(screen.getByText(/Requerido/)).toBeInTheDocument()
  })

  it('respects placeholder and maxLength', () => {
    render(
      <TextInput
        name="x"
        value=""
        onChange={() => {}}
        label="X"
        placeholder="Escribe"
        maxLength={10}
      />
    )
    const input = screen.getByLabelText('X') as HTMLInputElement
    expect(input.placeholder).toBe('Escribe')
    expect(input.maxLength).toBe(10)
  })

  it('is disabled when disabled true', () => {
    render(<TextInput name="x" value="" onChange={() => {}} label="X" disabled />)
    expect((screen.getByLabelText('X') as HTMLInputElement).disabled).toBe(true)
  })
})