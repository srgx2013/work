import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FieldWrapper } from './FieldWrapper'

describe('FieldWrapper', () => {
  it('renders label with required asterisk in red', () => {
    render(
      <FieldWrapper label="Entidad" required>
        <input aria-label="entidad" />
      </FieldWrapper>
    )
    expect(screen.getByText('Entidad')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders without asterisk when not required', () => {
    render(
      <FieldWrapper label="Observaciones">
        <input aria-label="obs" />
      </FieldWrapper>
    )
    expect(screen.getByText('Observaciones')).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <FieldWrapper label="Campo">
        <input data-testid="child-input" />
      </FieldWrapper>
    )
    expect(screen.getByTestId('child-input')).toBeInTheDocument()
  })

  it('shows validation message when error provided', () => {
    render(
      <FieldWrapper label="Campo" error="Requerido">
        <input />
      </FieldWrapper>
    )
    expect(screen.getByText(/Requerido/)).toBeInTheDocument()
  })

  it('renders 📖 Códigos button when catalogInfo provided and toggles catalog table', () => {
    render(
      <FieldWrapper
        label="Entidad"
        catalogInfo={{
          codes: [
            { code: '01', label: 'Aguascalientes' },
            { code: '14', label: 'Jalisco' },
          ],
        }}
      >
        <input />
      </FieldWrapper>
    )
    const btn = screen.getByRole('button', { name: /Códigos/i })
    expect(btn).toBeInTheDocument()

    // Initially closed
    expect(screen.queryByText('Aguascalientes')).not.toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByText('Aguascalientes')).toBeInTheDocument()
    expect(screen.getByText('Jalisco')).toBeInTheDocument()
  })
})