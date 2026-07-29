import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

const stepsFixture = [
  { id: '1', label: 'Portada', status: 'completed' as const },
  { id: '2', label: 'Hogar', status: 'active' as const },
  { id: '3', label: '<12', status: 'pending' as const },
  { id: '4', label: '12+', status: 'pending' as const },
  { id: '5', label: 'Neg.', status: 'pending' as const },
  { id: '6', label: 'Gastos', status: 'pending' as const },
  { id: '7', label: 'Diario', status: 'pending' as const },
  { id: '8', label: 'Reporte', status: 'skipped' as const },
]

describe('ProgressBar', () => {
  it('renders all step labels', () => {
    render(<ProgressBar steps={stepsFixture} currentStep={2} />)
    expect(screen.getByText('Portada')).toBeInTheDocument()
    expect(screen.getByText('Hogar')).toBeInTheDocument()
    expect(screen.getByText('<12')).toBeInTheDocument()
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('Reporte')).toBeInTheDocument()
  })

  it('highlights the active step', () => {
    render(<ProgressBar steps={stepsFixture} currentStep={2} />)
    const activeNode = screen.getByRole('button', { name: /Hogar/ })
    expect(activeNode).toHaveClass('bg-primary')
    expect(activeNode).toHaveClass('text-white')
  })

  it('marks completed steps with a checkmark', () => {
    render(<ProgressBar steps={stepsFixture} currentStep={2} />)
    // Portada is completed
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders pending steps without checkmark and dimmed', () => {
    render(<ProgressBar steps={stepsFixture} currentStep={2} />)
    const pending = screen.getByRole('button', { name: /12\+/ })
    expect(pending).not.toHaveTextContent('✓')
    expect(pending).toHaveClass('bg-neutral-200')
  })

  it('clicking a completed step calls onStepClick', () => {
    const onStepClick = vi.fn()
    render(<ProgressBar steps={stepsFixture} currentStep={2} onStepClick={onStepClick} />)
    fireEvent.click(screen.getByRole('button', { name: /Portada/ }))
    expect(onStepClick).toHaveBeenCalledWith('1')
  })

  it('clicking a pending step does NOT call onStepClick', () => {
    const onStepClick = vi.fn()
    render(<ProgressBar steps={stepsFixture} currentStep={2} onStepClick={onStepClick} />)
    fireEvent.click(screen.getByRole('button', { name: /12\+/ }))
    expect(onStepClick).not.toHaveBeenCalled()
  })
})