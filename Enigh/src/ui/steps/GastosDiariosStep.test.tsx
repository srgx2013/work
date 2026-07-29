// GastosDiariosStep.test.tsx — Tests for the Gastos Diarios (daily expenses) step.
// Verifies 7-day rendering with Spanish day names, gasto add/remove, per-day
// subtotals, estimación mensual section, informante auto-fill, and validation.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GastosDiariosStep } from './GastosDiariosStep'
import { useAppStore } from '@/application/store/index'
import { validateStep } from '@/application/use-cases/validate-step'
import type { Integrante } from '@/domain/models/hogares'

function makeIntegrante(overrides: Partial<Integrante> = {}): Integrante {
  return {
    numPer: '01',
    nombre: 'Juan',
    parentesco: '1',
    sexo: '1',
    edad: 30,
    fechaNacimiento: '01/01/1995',
    estadoCivil: '1',
    sabeLeerEscribir: '2',
    sabeLeerEscribar: '2',
    nivelEscolaridad: '01',
    asisteEscuela: '2',
    ...overrides,
  } as Integrante
}

describe('GastosDiariosStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('initial render', () => {
    it('renders the step title', () => {
      render(<GastosDiariosStep />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/gastos diarios/i)
    })

    it('renders read-only folioViv and folioHog from Portada', () => {
      act(() => {
        useAppStore.getState().updatePortada({ folioViv: '1234567890', folioHog: '1' })
      })
      render(<GastosDiariosStep />)
      expect(screen.getByText('FOLIOVIV')).toBeInTheDocument()
      expect(screen.getByText('1234567890')).toBeInTheDocument()
      expect(screen.getByText('FOLIOHOG')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('informante section', () => {
    it('renders informante NUMPER input field', () => {
      render(<GastosDiariosStep />)
      expect(screen.getByText(/numper del informante/i)).toBeInTheDocument()
    })

    it('auto-fills informante name when NUMPER matches an integrante', () => {
      act(() => {
        useAppStore.getState().updateHogares({
          integrantes: [makeIntegrante({ numPer: '01', nombre: 'María González' })],
        })
        useAppStore.getState().setInformante('01')
      })
      render(<GastosDiariosStep />)
      expect(screen.getByText('María González')).toBeInTheDocument()
    })

    it('shows dash when informante NUMPER does not match any integrante', () => {
      act(() => {
        useAppStore.getState().setInformante('99')
      })
      render(<GastosDiariosStep />)
      // ReadOnlyField shows '-' for empty values
      const fields = screen.getAllByText('-')
      expect(fields.length).toBeGreaterThan(0)
    })
  })

  describe('7 days rendering', () => {
    it('renders all 7 day names in Spanish', () => {
      render(<GastosDiariosStep />)
      expect(screen.getByText(/lunes/i)).toBeInTheDocument()
      expect(screen.getByText(/martes/i)).toBeInTheDocument()
      expect(screen.getByText(/miércoles/i)).toBeInTheDocument()
      expect(screen.getByText(/jueves/i)).toBeInTheDocument()
      expect(screen.getByText(/viernes/i)).toBeInTheDocument()
      expect(screen.getByText(/sábado/i)).toBeInTheDocument()
      expect(screen.getByText(/domingo/i)).toBeInTheDocument()
    })

    it('renders each day as a section with "+ Agregar gasto" button', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      expect(addButtons).toHaveLength(7)
    })

    it('renders a "Subtotal" label for each day', () => {
      render(<GastosDiariosStep />)
      // Each day has a subtotal row
      const subtotals = screen.getAllByText(/subtotal del día/i)
      expect(subtotals.length).toBeGreaterThanOrEqual(7)
    })
  })

  describe('gasto item add/remove per day', () => {
    it('adds a gasto item when "Agregar gasto" is clicked', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      // Add a gasto to the first day (Lunes)
      fireEvent.click(addButtons[0])
      // Now concept input should appear for the first day
      const conceptInputs = screen.getAllByPlaceholderText(/concepto del gasto/i)
      expect(conceptInputs.length).toBeGreaterThanOrEqual(1)
    })

    it('can remove a gasto item when more than 1 exists', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      // Add 2 gastos to the first day
      fireEvent.click(addButtons[0])
      fireEvent.click(addButtons[0])
      // Remove buttons should now appear
      const removeButtons = screen.getAllByRole('button', { name: /eliminar/i })
      expect(removeButtons.length).toBeGreaterThanOrEqual(2)
      // Remove the first one
      fireEvent.click(removeButtons[0])
      // Should still have at least 1 gasto remaining
      const conceptInputs = screen.getAllByPlaceholderText(/concepto del gasto/i)
      expect(conceptInputs.length).toBeGreaterThanOrEqual(1)
    })

    it('does not show remove button when only 1 gasto exists', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      fireEvent.click(addButtons[0])
      // With only 1 gasto, no remove button for day 1
      const removeButtons = screen.queryAllByRole('button', { name: /eliminar/i })
      expect(removeButtons.length).toBe(0)
    })
  })

  describe('per-day subtotal', () => {
    it('updates subtotal when a gasto monto changes', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      fireEvent.click(addButtons[0]) // Lunes
      // Type an amount in the money input for this gasto
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      fireEvent.change(moneyInputs[0], { target: { value: '150' } })
      // The subtotal should show $150.00
      expect(screen.getAllByText(/\$150\.00/).length).toBeGreaterThan(0)
    })

    it('sums multiple gastos in the same day subtotal', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      fireEvent.click(addButtons[0]) // Lunes — gasto 1
      fireEvent.click(addButtons[0]) // Lunes — gasto 2
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      fireEvent.change(moneyInputs[0], { target: { value: '100' } })
      fireEvent.change(moneyInputs[1], { target: { value: '250.50' } })
      // Subtotal should be 350.50
      expect(screen.getAllByText(/\$350\.50/).length).toBeGreaterThan(0)
    })
  })

  describe('estimación mensual section', () => {
    it('renders the estimación mensual header', () => {
      render(<GastosDiariosStep />)
      expect(screen.getByText(/estimación mensual/i)).toBeInTheDocument()
    })

    it('renders all 6 estimation fields', () => {
      render(<GastosDiariosStep />)
      expect(screen.getByText(/tortillería/i)).toBeInTheDocument()
      expect(screen.getByText(/carnicería/i)).toBeInTheDocument()
      expect(screen.getByText(/verdulería/i)).toBeInTheDocument()
      expect(screen.getByText(/abarrotes/i)).toBeInTheDocument()
      expect(screen.getByText(/transporte público/i)).toBeInTheDocument()
      expect(screen.getByText(/gasolina/i)).toBeInTheDocument()
    })

    it('persists estimation changes to the store', () => {
      render(<GastosDiariosStep />)
      // Find estimation money inputs — they're after the daily gasto inputs
      // Type into the first estimation field (tortillería)
      const moneyLabels = screen.getAllByText(/tortillería/i)
      expect(moneyLabels.length).toBeGreaterThan(0)
      // Find the money input inside the estimation section
      // We'll interact via the store to verify persistence
      act(() => {
        useAppStore.getState().updateEstimacion({ tortilleria: 500 })
      })
      expect(useAppStore.getState().gastosDiarios.estimacionMensual.tortilleria).toBe(500)
    })
  })

  describe('data persistence to store', () => {
    it('updates informanteNumPer in the store when typed', () => {
      render(<GastosDiariosStep />)
      const numInput = document.querySelector('input[inputmode="numeric"][maxlength="2"]') as HTMLInputElement
      expect(numInput).not.toBeNull()
      fireEvent.change(numInput, { target: { value: '01' } })
      expect(useAppStore.getState().gastosDiarios.informanteNumPer).toBe('01')
    })

    it('persists gasto concepto to the store when typed', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      fireEvent.click(addButtons[0]) // Lunes
      const conceptInput = screen.getByPlaceholderText(/concepto del gasto/i) as HTMLInputElement
      fireEvent.change(conceptInput, { target: { value: 'Pan' } })
      const dia = useAppStore.getState().gastosDiarios.dias[0]
      expect(dia.gastos[0].concepto).toBe('Pan')
    })

    it('persists gasto monto to the store when typed', () => {
      render(<GastosDiariosStep />)
      const addButtons = screen.getAllByRole('button', { name: /agregar gasto/i })
      fireEvent.click(addButtons[0]) // Lunes
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      fireEvent.change(moneyInputs[0], { target: { value: '75.50' } })
      const dia = useAppStore.getState().gastosDiarios.dias[0]
      expect(dia.gastos[0].monto).toBe(75.50)
    })
  })

  describe('validation on Siguiente', () => {
    it('stores validate with empty informante when called through validateStep', () => {
      // Step 7 validation — informanteNumPer must be 2 digits
      const errors = validateStep(7, useAppStore.getState())
      // Empty informante should produce errors
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})