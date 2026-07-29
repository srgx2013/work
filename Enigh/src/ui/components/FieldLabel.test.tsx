import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldLabel } from './FieldLabel'

describe('FieldLabel', () => {
  it('renders the label text', () => {
    render(<FieldLabel htmlFor="x">Entidad</FieldLabel>)
    expect(screen.getByText('Entidad')).toBeInTheDocument()
    expect(screen.getByText('Entidad').tagName).toBe('LABEL')
  })

  it('shows red asterisk when required=true', () => {
    render(<FieldLabel htmlFor="x" required>Entidad</FieldLabel>)
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-danger')
  })

  it('does not show asterisk when required not set', () => {
    render(<FieldLabel htmlFor="x">Entidad</FieldLabel>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(<FieldLabel htmlFor="my-id">Campo</FieldLabel>)
    expect(screen.getByText('Campo')).toHaveAttribute('for', 'my-id')
  })

  it('renders optional hint text when provided', () => {
    render(<FieldLabel htmlFor="x" hint="(1-7)">Entidad</FieldLabel>)
    expect(screen.getByText('(1-7)')).toBeInTheDocument()
  })
})