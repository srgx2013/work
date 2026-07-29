import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CodeInput } from './CodeInput'

describe('CodeInput', () => {
  it('renders text input with inputMode numeric', () => {
    render(
      <CodeInput name="entidad" value="" onChange={() => {}} label="Entidad" />
    )
    const input = screen.getByLabelText('Entidad') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.inputMode).toBe('numeric')
  })

  it('shows label and required asterisk', () => {
    render(
      <CodeInput name="entidad" value="" onChange={() => {}} label="Entidad" required />
    )
    expect(screen.getByText('Entidad')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('calls onChange with raw string value', () => {
    const onChange = vi.fn()
    render(<CodeInput name="x" value="" onChange={onChange} label="Campo" />)
    fireEvent.change(screen.getByLabelText('Campo'), { target: { value: '14' } })
    expect(onChange).toHaveBeenCalledWith('14')
  })

  it('calls onBlur on blur', () => {
    const onBlur = vi.fn()
    render(<CodeInput name="x" value="" onChange={() => {}} onBlur={onBlur} label="Campo" />)
    fireEvent.blur(screen.getByLabelText('Campo'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('shows 📖 Códigos button when catalogCodes provided and toggles catalog', () => {
    render(
      <CodeInput
        name="entidad"
        value=""
        onChange={() => {}}
        label="Entidad"
        catalogCodes={[
          { code: '01', label: 'Aguascalientes' },
          { code: '14', label: 'Jalisco' },
        ]}
      />
    )
    const btn = screen.getByRole('button', { name: /Códigos/i })
    expect(btn).toBeInTheDocument()
    expect(screen.queryByText('Jalisco')).not.toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByText('Jalisco')).toBeInTheDocument()
  })

  it('shows validation range hint in label when catalogCodes provided (small)', () => {
    // <=8 entries -> comma separated: (1, 2, 3, 4, 5, 6, 7)
    const small = [...Array(7)].map((_, i) => ({ code: String(i + 1), label: `lvl${i + 1}` }))
    render(
      <CodeInput name="x" value="" onChange={() => {}} label="Vivienda" catalogCodes={small} />
    )
    // 7 entries -> "(1, 2, 3, 4, 5, 6, 7)"
    expect(screen.getByText(/\(1, 2, 3, 4, 5, 6, 7\)/)).toBeInTheDocument()
  })

  it('shows validation range hint in label when catalogCodes provided (large)', () => {
    // >8 entries -> range form: (01-32)
    const big = [...Array(32)].map((_, i) => ({
      code: String(i + 1).padStart(2, '0'),
      label: `ent${i}`,
    }))
    render(
      <CodeInput name="x" value="" onChange={() => {}} label="Entidad" catalogCodes={big} />
    )
    expect(screen.getByText(/\(01-32\)/)).toBeInTheDocument()
  })

  it('shows error message when error prop provided', () => {
    render(
      <CodeInput name="x" value="" onChange={() => {}} label="Campo" error="Código inválido" />
    )
    expect(screen.getByText(/Código inválido/)).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<CodeInput name="x" value="" onChange={() => {}} label="Campo" disabled />)
    expect((screen.getByLabelText('Campo') as HTMLInputElement).disabled).toBe(true)
  })

  it('respects maxLength', () => {
    render(<CodeInput name="x" value="" onChange={() => {}} label="Campo" maxLength={2} />)
    expect((screen.getByLabelText('Campo') as HTMLInputElement).maxLength).toBe(2)
  })
})