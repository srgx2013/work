import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ValidationSummary } from './ValidationSummary'
import type { FieldError } from '@/domain/validation/types'

function makeError(field: string, message: string): FieldError {
  return { field, message }
}

describe('ValidationSummary', () => {
  it('renders nothing when errors array is empty', () => {
    const { container } = render(<ValidationSummary errors={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders heading "Corrija los siguientes errores:" when errors exist', () => {
    render(<ValidationSummary errors={[makeError('x', 'msg')]} />)
    expect(screen.getByText(/Corrija los siguientes errores:/)).toBeInTheDocument()
  })

  it('renders all errors as bullet list', () => {
    render(
      <ValidationSummary
        errors={[makeError('a', 'error 1'), makeError('b', 'error 2')]}
      />
    )
    expect(screen.getByText('error 1')).toBeInTheDocument()
    expect(screen.getByText('error 2')).toBeInTheDocument()
  })

  it('clicking an error bullet calls onFocusField with the field name', () => {
    const onFocusField = vi.fn()
    render(
      <ValidationSummary
        errors={[makeError('folioViv', 'Formato inválido')]}
        onFocusField={onFocusField}
      />
    )
    fireEvent.click(screen.getByText('Formato inválido'))
    expect(onFocusField).toHaveBeenCalledWith('folioViv')
  })

  it('does not error when onFocusField not provided', () => {
    render(
      <ValidationSummary errors={[makeError('x', 'msg')]} />
    )
    expect(screen.getByText('msg')).toBeInTheDocument()
  })

describe('ValidationSummary — cross-section errors', () => {
  it('renders cross-section errors with their source sections', () => {
    const crossErrors = [
      {
        ruleId: 'CS-001',
        severity: 'BLOCKER' as const,
        message: 'FOLIOVIV no coincide en todos los cuestionarios',
        sections: ['Portada', 'Hogares'],
      },
    ]
    render(<ValidationSummary errors={[]} crossSectionErrors={crossErrors} />)
    expect(screen.getByText(/FOLIOVIV no coincide/)).toBeInTheDocument()
    expect(screen.getByText(/Portada.*Hogares/)).toBeInTheDocument()
  })

  it('renders nothing when both errors and crossSectionErrors are empty', () => {
    const { container } = render(
      <ValidationSummary errors={[]} crossSectionErrors={[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows severity badges BLOCKER for cross-section errors', () => {
    const crossErrors = [
      {
        ruleId: 'CS-015',
        severity: 'WARNING' as const,
        message: 'Gastos diarios significativamente mayores',
        sections: ['Gastos Diarios', 'Gastos Hogar'],
      },
    ]
    render(<ValidationSummary errors={[]} crossSectionErrors={crossErrors} />)
    expect(screen.getByText(/Gastos diarios significativamente mayores/)).toBeInTheDocument()
    expect(screen.getByText('AVISO')).toBeInTheDocument()
  })
})

})
