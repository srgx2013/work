// ConfirmModal — overlay modal for confirming destructive actions (reset),
// closing via Escape or backdrop click. Active focus trap inside the dialog.

import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

const variantButton: Record<NonNullable<ConfirmModalProps['variant']>, string> = {
  danger: 'bg-danger text-white hover:bg-red-700',
  warning: 'bg-warning text-white hover:bg-orange-600',
  info: 'bg-primary text-white hover:bg-primary-light',
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCancel()
        return
      }
      // Focus trap: keep Tab cycling within the dialog buttons.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey, true)
    // focus the dialog when opened
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey, true)
      // restore focus when modal closes
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        // click on the backdrop (not the modal content) closes
        if (e.target === e.currentTarget) onCancel()
      }}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        tabIndex={-1}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg outline-none"
      >
        <h2 id="confirm-modal-title" className="mb-2 text-lg font-semibold">
          {title}
        </h2>
        <p className="mb-4 text-base text-text">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 font-medium ${variantButton[variant]}`}
            data-testid="confirm-button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}