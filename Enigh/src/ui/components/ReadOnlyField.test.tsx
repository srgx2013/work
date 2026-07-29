import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadOnlyField } from './ReadOnlyField'

describe('ReadOnlyField', () => {
  it('renders label and value', () => {
    render(<ReadOnlyField label="Entidad" value="Jalisco" />)
    expect(screen.getByText('Entidad')).toBeInTheDocument()
    expect(screen.getByText('Jalisco')).toBeInTheDocument()
  })

  it('renders with grayed-out background and no input border', () => {
    render(<ReadOnlyField label="L" value="V" />)
    const valueBox = screen.getByText('V')
    expect(valueBox.closest('div')?.className).toMatch(/bg-neutral-100|bg-neutral-200/)
  })

  it('does not render an input element (display-only)', () => {
    const { container } = render(<ReadOnlyField label="L" value="V" />)
    expect(container.querySelector('input')).toBeNull()
    expect(container.querySelector('textarea')).toBeNull()
  })

  it('renders empty value as "-" placeholder', () => {
    render(<ReadOnlyField label="L" value="" />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })
})