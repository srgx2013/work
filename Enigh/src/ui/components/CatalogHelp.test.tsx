import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CatalogHelp } from './CatalogHelp'

describe('CatalogHelp', () => {
  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <CatalogHelp
        isOpen={false}
        codes={[{ code: '01', label: 'Aguascalientes' }]}
        onClose={() => {}}
        fieldLabel="Entidad"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders table with code and label columns when open', () => {
    render(
      <CatalogHelp
        isOpen
        codes={[
          { code: '01', label: 'Aguascalientes' },
          { code: '14', label: 'Jalisco' },
        ]}
        onClose={() => {}}
        fieldLabel="Entidad"
      />
    )
    expect(screen.getByText('Código')).toBeInTheDocument()
    expect(screen.getByText('Descripción')).toBeInTheDocument()
    expect(screen.getByText('Aguascalientes')).toBeInTheDocument()
    expect(screen.getByText('Jalisco')).toBeInTheDocument()
  })

  it('has role=dialog and aria-label set', () => {
    render(
      <CatalogHelp
        isOpen
        codes={[{ code: '01', label: 'Aguascalientes' }]}
        onClose={() => {}}
        fieldLabel="Entidad"
      />
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-label', 'Catálogo: Entidad')
  })

  it('closes when Escape is pressed', () => {
    const onClose = vi.fn()
    render(
      <CatalogHelp
        isOpen
        codes={[{ code: '01', label: 'Aguascalientes' }]}
        onClose={onClose}
        fieldLabel="Entidad"
      />
    )
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('table is scrollable (max-height ~300px via class)', () => {
    render(
      <CatalogHelp
        isOpen
        codes={[{ code: '01', label: 'Aguascalientes' }]}
        onClose={() => {}}
        fieldLabel="Entidad"
      />
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/max-h-(72|75|80|72rem|300)/)
  })
})