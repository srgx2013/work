import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ValidationMessage } from './ValidationMessage'

describe('ValidationMessage', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<ValidationMessage message={null} type="error" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders error text in red when type is error', () => {
    render(<ValidationMessage message="Campo obligatorio" type="error" />)
    const msg = screen.getByText(/Campo obligatorio/)
    expect(msg).toBeInTheDocument()
    // error icon should be present
    expect(screen.getByText(/❌/)).toBeInTheDocument()
  })

  it('renders warning text in amber when type is warning', () => {
    render(<ValidationMessage message="Revise el valor" type="warning" />)
    expect(screen.getByText(/Revise el valor/)).toBeInTheDocument()
    expect(screen.getByText(/⚠️/)).toBeInTheDocument()
  })

  it('renders info text in blue when type is info', () => {
    render(<ValidationMessage message="Ayuda" type="info" />)
    expect(screen.getByText(/Ayuda/)).toBeInTheDocument()
    expect(screen.getByText(/ℹ️/)).toBeInTheDocument()
  })

  it('has fade-in animation class', () => {
    render(<ValidationMessage message="Error" type="error" />)
    const msg = screen.getByText(/Error/)
    expect(msg.closest('div')).toHaveClass('animate-iktan-fade-in')
  })
})