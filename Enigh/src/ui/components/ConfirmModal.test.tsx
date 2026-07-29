import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        title="Confirmar"
        message="¿Continuar?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.queryByText('Confirmar')).not.toBeInTheDocument()
    expect(screen.queryByText('¿Continuar?')).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it('renders title and message when open', () => {
    render(
      <ConfirmModal
        isOpen
        title="Atención"
        message="¿Desea reiniciar?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByText('Atención')).toBeInTheDocument()
    expect(screen.getByText('¿Desea reiniciar?')).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons with default labels', () => {
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('uses custom confirm/cancel labels when provided', () => {
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        confirmLabel="Sí"
        cancelLabel="No"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: 'Sí' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when Escape key pressed', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when backdrop clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )
    // backdrop is the first div
    const backdrop = screen.getByText('t').closest('div')?.parentElement
    expect(backdrop).toBeTruthy()
    if (backdrop) fireEvent.click(backdrop)
    expect(onCancel).toHaveBeenCalled()
  })

  it('danger variant has red confirm button class', () => {
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        variant="danger"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const btn = screen.getByRole('button', { name: /Confirmar/i })
    expect(btn.className).toMatch(/bg-danger|bg-red/)
  })

  it('has role=dialog and aria-modal', () => {
    render(
      <ConfirmModal
        isOpen
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })
})