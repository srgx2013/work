import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WizardNavigation } from './WizardNavigation'

describe('WizardNavigation', () => {
  it('renders Anterior and Siguiente buttons', () => {
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={() => {}}
        canGoNext
        isFirstStep={false}
        isLastStep={false}
      />
    )
    expect(screen.getByRole('button', { name: /Anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Siguiente/i })).toBeInTheDocument()
  })

  it('Anterior is disabled on first step', () => {
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={() => {}}
        canGoNext
        isFirstStep
        isLastStep={false}
      />
    )
    expect((screen.getByRole('button', { name: /Anterior/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('Siguiente is disabled when canGoNext is false', () => {
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={() => {}}
        canGoNext={false}
        isFirstStep={false}
        isLastStep={false}
      />
    )
    expect((screen.getByRole('button', { name: /Siguiente/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('calls onBack when Anterior clicked', () => {
    const onBack = vi.fn()
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={onBack}
        canGoNext
        isFirstStep={false}
        isLastStep={false}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Anterior/i }))
    expect(onBack).toHaveBeenCalled()
  })

  it('calls onNext when Siguiente clicked', () => {
    const onNext = vi.fn()
    render(
      <WizardNavigation
        onNext={onNext}
        onBack={() => {}}
        canGoNext
        isFirstStep={false}
        isLastStep={false}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }))
    expect(onNext).toHaveBeenCalled()
  })

  it('renders "Ver Reporte" instead of "Siguiente" on last step', () => {
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={() => {}}
        canGoNext
        isFirstStep={false}
        isLastStep
      />
    )
    expect(screen.getByRole('button', { name: /Ver Reporte/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Siguiente/i })).not.toBeInTheDocument()
  })

  it('uses nextLabel override when provided', () => {
    render(
      <WizardNavigation
        onNext={() => {}}
        onBack={() => {}}
        canGoNext
        isFirstStep={false}
        isLastStep={false}
        nextLabel="Guarde y siga"
      />
    )
    expect(screen.getByRole('button', { name: /Guarde y siga/i })).toBeInTheDocument()
  })
})