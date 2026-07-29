// CatalogHelp — expandable catalog reference table shown beneath a CodeInput.
// Closes on Escape key or parent's onClose. Renders nothing when closed.

import { useEffect } from 'react'

interface CatalogCode {
  code: string
  label: string
}

interface CatalogHelpProps {
  codes: CatalogCode[]
  isOpen: boolean
  onClose: () => void
  fieldLabel: string
}

export function CatalogHelp({ codes, isOpen, onClose, fieldLabel }: CatalogHelpProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-label={`Catálogo: ${fieldLabel}`}
      className="mt-2 max-h-72 overflow-auto rounded-md border border-neutral-200 bg-white shadow-sm"
      tabIndex={-1}
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-neutral-100">
          <tr>
            <th className="px-3 py-1 text-left font-semibold">Código</th>
            <th className="px-3 py-1 text-left font-semibold">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.code} className="border-t border-neutral-100">
              <td className="px-3 py-1 font-mono">{c.code}</td>
              <td className="px-3 py-1">{c.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}