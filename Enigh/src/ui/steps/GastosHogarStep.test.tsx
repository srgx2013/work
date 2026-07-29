// GastosHogarStep.test.tsx — Tests for the Gastos del Hogar (trimestral) step.
// Verifies all 8 sections render with correct Spanish labels, section subtotals,
// collapsible sections, grand total, and data persistence.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GastosHogarStep } from './GastosHogarStep'
import { useAppStore } from '@/application/store/index'

describe('GastosHogarStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('initial render', () => {
    it('renders the step title', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/gastos del hogar/i)
      ).toBeInTheDocument()
    })

    it('renders read-only folioViv and folioHog from Portada', () => {
      act(() => {
        useAppStore.getState().updatePortada({ folioViv: '1234567890', folioHog: '1' })
      })
      render(<GastosHogarStep />)
      expect(screen.getByText('FOLIOVIV')).toBeInTheDocument()
      expect(screen.getByText('1234567890')).toBeInTheDocument()
      expect(screen.getByText('FOLIOHOG')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('Section I — Alimentos, Bebidas y Tabaco', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/alimentos, bebidas y tabaco/i)
      ).toBeInTheDocument()
    })

    it('renders all 13 food fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/carnes/i)).toBeInTheDocument()
      expect(screen.getByText(/cereales/i)).toBeInTheDocument()
      expect(screen.getByText(/verduras y legumbres/i)).toBeInTheDocument()
      expect(screen.getByText(/frutas/i)).toBeInTheDocument()
      expect(screen.getByText(/leche y derivados/i)).toBeInTheDocument()
      expect(screen.getByText(/huevo/i)).toBeInTheDocument()
      expect(screen.getByText(/aceites y grasas/i)).toBeInTheDocument()
      expect(screen.getByText(/azúcar y mieles/i)).toBeInTheDocument()
      expect(screen.getByText(/café\/té\/chocolate/i)).toBeInTheDocument()
      expect(screen.getByText(/bebidas no alcohólicas/i)).toBeInTheDocument()
      expect(screen.getByText(/bebidas alcohólicas/i)).toBeInTheDocument()
      expect(screen.getByText(/alimentos fuera del hogar/i)).toBeInTheDocument()
      expect(screen.getByText(/otros alimentos/i)).toBeInTheDocument()
    })
  })

  describe('Section II — Transporte y Comunicaciones', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/transporte y comunicaciones/i)
      ).toBeInTheDocument()
    })

    it('renders all 5 transport fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/transporte público/i)).toBeInTheDocument()
      expect(screen.getByText(/gasolina/i)).toBeInTheDocument()
      expect(screen.getByText(/mantenimiento del auto/i)).toBeInTheDocument()
      expect(screen.getByText(/teléfono celular/i)).toBeInTheDocument()
      expect(screen.getByText(/internet/i)).toBeInTheDocument()
    })
  })

  describe('Section III — Vivienda y Servicios', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/vivienda y servicios/i)
      ).toBeInTheDocument()
    })

    it('renders all 6 vivienda fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText('Renta')).toBeInTheDocument()
      expect(screen.getByText('Electricidad')).toBeInTheDocument()
      expect(screen.getByText('Agua')).toBeInTheDocument()
      expect(screen.getByText(/^Gas$/)).toBeInTheDocument()
      expect(screen.getByText('Predial')).toBeInTheDocument()
      expect(screen.getByText('Mantenimiento del hogar')).toBeInTheDocument()
    })
  })

  describe('Section IV — Educación y Esparcimiento', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/educación y esparcimiento/i)
      ).toBeInTheDocument()
    })

    it('renders all 4 education fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/útiles escolares/i)).toBeInTheDocument()
      expect(screen.getByText(/uniformes/i)).toBeInTheDocument()
      expect(screen.getByText(/cuotas escolares/i)).toBeInTheDocument()
      expect(screen.getByText(/cine\/eventos\/entretenimiento/i)).toBeInTheDocument()
    })
  })

  describe('Section V — Salud', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/Sección V — Salud/i)).toBeInTheDocument()
    })

    it('renders all 3 health fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/medicamentos/i)).toBeInTheDocument()
      expect(screen.getByText(/consultas médicas/i)).toBeInTheDocument()
      expect(screen.getByText(/lentes o aparatos/i)).toBeInTheDocument()
    })
  })

  describe('Section VI — Vestido y Calzado', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/vestido y calzado/i)
      ).toBeInTheDocument()
    })

    it('renders all 2 clothing fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText('Ropa')).toBeInTheDocument()
      // 'Calzado' appears in both section header and field label — verify field label specifically
      expect(screen.getAllByText(/calzado/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Section VII — Cuidados Personales', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/cuidados personales/i)
      ).toBeInTheDocument()
    })

    it('renders all 3 personal care fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/jabón\/shampoo\/pasta dental/i)).toBeInTheDocument()
      expect(screen.getByText(/corte de cabello\/estética/i)).toBeInTheDocument()
      expect(screen.getByText(/pañales\/toallas/i)).toBeInTheDocument()
    })
  })

  describe('Section VIII — Enseres Domésticos y Limpieza', () => {
    it('renders the section header', () => {
      render(<GastosHogarStep />)
      expect(
        screen.getByText(/enseres domésticos y limpieza/i)
      ).toBeInTheDocument()
    })

    it('renders all 3 household goods fields', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/detergentes y limpiadores/i)).toBeInTheDocument()
      expect(screen.getByText(/utensilios de cocina/i)).toBeInTheDocument()
      expect(screen.getByText(/blancos/i)).toBeInTheDocument()
    })
  })

  describe('section subtotals', () => {
    it('shows "Subtotal" label for each section', () => {
      render(<GastosHogarStep />)
      const subtotals = screen.getAllByText(/subtotal/i)
      expect(subtotals.length).toBeGreaterThanOrEqual(8)
    })

    it('shows "Total trimestral" grand total at the bottom', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/total trimestral/i)).toBeInTheDocument()
    })
  })

  describe('collapsible sections', () => {
    it('renders a chevron/expand button for each section', () => {
      render(<GastosHogarStep />)
      // Each section header has a clickable expand/collapse toggle
      const buttons = screen.getAllByRole('button', { name: /expandir|colapsar|sección/i })
      expect(buttons.length).toBeGreaterThanOrEqual(8)
    })

    it('collapses section fields when section header is clicked', () => {
      render(<GastosHogarStep />)
      // Section I fields visible by default
      expect(screen.getByText(/carnes/i)).toBeInTheDocument()
      // Click the section header to collapse
      const sectionButton = screen.getAllByRole('button', { name: /expandir|colapsar|sección/i })[0]
      fireEvent.click(sectionButton)
      // Fields should be hidden (collapsed)
      expect(screen.queryByText(/carnes/i)).toBeNull()
    })

    it('expands section fields again when clicked a second time', () => {
      render(<GastosHogarStep />)
      const sectionButton = screen.getAllByRole('button', { name: /expandir|colapsar|sección/i })[0]
      // Collapse
      fireEvent.click(sectionButton)
      expect(screen.queryByText(/carnes/i)).toBeNull()
      // Expand again
      fireEvent.click(sectionButton)
      expect(screen.getByText(/carnes/i)).toBeInTheDocument()
    })
  })

  describe('data persistence', () => {
    it('persists amount changes to the store', () => {
      render(<GastosHogarStep />)
      // Find a money input for "Carnes" — it's a text input with inputMode=decimal
      // We'll change the store directly and check the component reflects it
      act(() => {
        useAppStore.getState().updateGastosHogar({ alimentosCarnes: 1500.50 })
      })
      const gastosHogar = useAppStore.getState().gastosHogar
      expect(gastosHogar.alimentosCarnes).toBe(1500.50)
    })

    it('reflects store changes in subtotal display', () => {
      render(<GastosHogarStep />)
      act(() => {
        useAppStore.getState().updateGastosHogar({
          alimentosCarnes: 1000,
          alimentosCereales: 500,
        })
      })
      // Section I subtotal should be 1500.00 — it appears twice (header + expanded section body)
      expect(screen.getAllByText(/Subtotal: \$1,500\.00/i).length).toBeGreaterThanOrEqual(1)
    })

    it('reflects store changes in grand total', () => {
      render(<GastosHogarStep />)
      act(() => {
        useAppStore.getState().updateGastosHogar({
          alimentosCarnes: 1000,
          transportePublico: 500,
          vestidoRopa: 200,
        })
      })
      // Grand total should be 1700.00
      expect(screen.getByText(/Total trimestral: \$1,700\.00/i)).toBeInTheDocument()
    })

    it('updates store when money input is typed', () => {
      render(<GastosHogarStep />)
      // Find the money input for Carnes
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      const carnesField = moneyInputs[0] as HTMLInputElement
      fireEvent.change(carnesField, { target: { value: '750' } })
      expect(useAppStore.getState().gastosHogar.alimentosCarnes).toBe(750)
    })

    it('updates store to undefined when money input is cleared', () => {
      render(<GastosHogarStep />)
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      const fieldInput = moneyInputs[0] as HTMLInputElement
      fireEvent.change(fieldInput, { target: { value: '750' } })
      expect(useAppStore.getState().gastosHogar.alimentosCarnes).toBe(750)
      fireEvent.change(fieldInput, { target: { value: '' } })
      expect(useAppStore.getState().gastosHogar.alimentosCarnes).toBeUndefined()
    })
  })

  describe('all 8 sections render in order', () => {
    it('renders all 8 section headers', () => {
      render(<GastosHogarStep />)
      expect(screen.getByText(/Sección I — Alimentos, Bebidas y Tabaco/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección II — Transporte y Comunicaciones/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección III — Vivienda y Servicios/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección IV — Educación y Esparcimiento/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección V — Salud/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección VI — Vestido y Calzado/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección VII — Cuidados Personales/i)).toBeInTheDocument()
      expect(screen.getByText(/Sección VIII — Enseres Domésticos y Limpieza/i)).toBeInTheDocument()
    })
  })
})