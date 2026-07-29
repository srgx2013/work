// NegociosStep.test.tsx — Tests for the Negocios del Hogar step.
// Verifies conditional rendering (tieneNegocio Sí/No), add/remove negocio cards,
// read-only folio fields, NUMPER validation against integrantes, and data persistence.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { NegociosStep } from './NegociosStep'
import { useAppStore } from '@/application/store/index'
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
    sabeLeerEscribar: '2',
    sabeLeerEscribir: '2',
    nivelEscolaridad: '01',
    asisteEscuela: '2',
    ...overrides,
  } as Integrante
}

describe('NegociosStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('initial render', () => {
    it('renders the tieneNegocio question', () => {
      render(<NegociosStep />)
      expect(
        screen.getByText(/algún integrante del hogar tiene un negocio/i)
      ).toBeInTheDocument()
    })

    it('renders read-only folioViv and folioHog from Portada', () => {
      act(() => {
        useAppStore.getState().updatePortada({ folioViv: '1234567890', folioHog: '1' })
      })
      render(<NegociosStep />)
      expect(screen.getByText('FOLIOVIV')).toBeInTheDocument()
      expect(screen.getByText('1234567890')).toBeInTheDocument()
      expect(screen.getByText('FOLIOHOG')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('tieneNegocio = No (2)', () => {
    it('shows "No aplica" message when tieneNegocio is "2"', () => {
      render(<NegociosStep />)
      // Default initial state has tieneNegocio = '2'
      expect(
        screen.getByText(/no aplica — puede continuar/i)
      ).toBeInTheDocument()
    })

    it('does NOT show negocio form fields when tieneNegocio is "2"', () => {
      render(<NegociosStep />)
      expect(screen.queryByText(/tipo de negocio/i)).toBeNull()
      expect(screen.queryByText(/actividad principal/i)).toBeNull()
    })

    it('does NOT show "Agregar negocio" button when tieneNegocio is "2"', () => {
      render(<NegociosStep />)
      expect(screen.queryByRole('button', { name: /agregar negocio/i })).toBeNull()
    })
  })

  describe('tieneNegocio = Sí (1)', () => {
    beforeEach(() => {
      act(() => {
        useAppStore.getState().updatePortada({ folioViv: '1234567890', folioHog: '1' })
        useAppStore.getState().updateNegociosData({ tieneNegocio: '1' })
      })
    })

    it('shows "Agregar negocio" button when tieneNegocio is "1"', () => {
      render(<NegociosStep />)
      expect(
        screen.getByRole('button', { name: /agregar negocio/i })
      ).toBeInTheDocument()
    })

    it('does NOT show "No aplica" message when tieneNegocio is "1"', () => {
      render(<NegociosStep />)
      expect(screen.queryByText(/no aplica/i)).toBeNull()
    })

    it('adds a new negocio card when "Agregar negocio" is clicked', () => {
      render(<NegociosStep />)
      // Initially no negocio cards (button exists but no cards yet)
      expect(screen.queryByText(/tipo de negocio/i)).toBeNull()
      // Click add
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      // Now fields should appear
      expect(screen.getByText(/tipo de negocio/i)).toBeInTheDocument()
    })

    it('can add multiple negocios', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      // Two sets of negocio fields — each has "Tipo de negocio"
      expect(screen.getAllByText(/tipo de negocio/i)).toHaveLength(2)
    })

    it('renders all negocio form fields in each card', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      expect(screen.getByText(/numper del operador/i)).toBeInTheDocument()
      expect(screen.getByText(/tipo de negocio/i)).toBeInTheDocument()
      expect(screen.getByText(/actividad principal/i)).toBeInTheDocument()
      expect(screen.getByText(/local o establecimiento/i)).toBeInTheDocument()
      expect(screen.getByText(/contabilidad/i)).toBeInTheDocument()
      expect(screen.getByText(/dado de alta en hacienda/i)).toBeInTheDocument()
      expect(screen.getByText(/ingreso mensual del negocio/i)).toBeInTheDocument()
      expect(screen.getByText(/gastos mensuales del negocio/i)).toBeInTheDocument()
    })

    it('shows "Eliminar" button on each negocio card', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      // Two "Eliminar" buttons
      expect(screen.getAllByRole('button', { name: /eliminar/i })).toHaveLength(2)
    })

    it('removes a negocio when "Eliminar" is clicked', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      expect(screen.getAllByText(/tipo de negocio/i)).toHaveLength(2)
      // Remove the first one
      fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0])
      expect(screen.getAllByText(/tipo de negocio/i)).toHaveLength(1)
    })

    it('shows "Eliminar" button only when more than 1 negocio exists', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      // With only 1 card, remove button should NOT be visible
      expect(screen.queryAllByRole('button', { name: /eliminar/i })).toHaveLength(0)
      // Add second card
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      expect(screen.getAllByRole('button', { name: /eliminar/i })).toHaveLength(2)
    })

    it('persisted negocio data survives re-render (store ↔ UI)', () => {
      act(() => {
        useAppStore.getState().updateNegociosData({ tieneNegocio: '1' })
      })
      const { rerender } = render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      const negocios = useAppStore.getState().negocios.negocios
      const negocioId = negocios[0].id
      act(() => {
        useAppStore.getState().updateNegocio(negocioId, { tipoNegocio: 'Tortillería' })
      })
      // Re-render
      rerender(<NegociosStep />)
      expect(screen.getByDisplayValue('Tortillería')).toBeInTheDocument()
    })

    it('updates store when tipoNegocio field is typed', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      // Find the tipoNegocio text input by its id pattern: text-negocio-<id>-tipoNegocio
      const tipoInput = document.querySelector(
        'input[id^="text-negocio-"][id$="-tipoNegocio"]'
      ) as HTMLInputElement
      fireEvent.change(tipoInput, { target: { value: 'Abarrotes' } })
      const negocios = useAppStore.getState().negocios.negocios
      expect(negocios[0].tipoNegocio).toBe('Abarrotes')
    })

    it('updates store when ingresoMensual is typed', () => {
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      const moneyInputs = document.querySelectorAll('input[inputmode="decimal"]')
      const ingresoInput = moneyInputs[0] as HTMLInputElement
      fireEvent.change(ingresoInput, { target: { value: '5000' } })
      const negocios = useAppStore.getState().negocios.negocios
      expect(negocios[0].ingresoMensual).toBe(5000)
    })
  })

  describe('data persistence', () => {
    it('updates store tieneNegocio when the code input changes', () => {
      render(<NegociosStep />)
      // Default initial state has tieneNegocio = '2'
      const initialNegocio = useAppStore.getState().negocios.tieneNegocio
      expect(initialNegocio).toBe('2')
      // Type '1' in the tieneNegocio CodeInput
      const codeInputs = document.querySelectorAll('input[inputmode="numeric"]')
      // The tieneNegocio input is the first numeric CodeInput on the page
      fireEvent.change(codeInputs[0], { target: { value: '1' } })
      expect(useAppStore.getState().negocios.tieneNegocio).toBe('1')
    })

    it('persists added negocios to the store', () => {
      act(() => {
        useAppStore.getState().updateNegociosData({ tieneNegocio: '1' })
      })
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      const negocios = useAppStore.getState().negocios.negocios
      expect(negocios).toHaveLength(1)
      expect(negocios[0].ingresoMensual).toBe(0)
      expect(negocios[0].gastosMensuales).toBe(0)
    })
  })

  describe('NUMPER operator against integrantes', () => {
    it('renders NUMPER del operador field as a number input', () => {
      act(() => {
        useAppStore.getState().updateNegociosData({ tieneNegocio: '1' })
        useAppStore.getState().updateHogares({
          integrantes: [makeIntegrante({ numPer: '01', nombre: 'Juan' })],
        })
      })
      render(<NegociosStep />)
      fireEvent.click(screen.getByRole('button', { name: /agregar negocio/i }))
      expect(screen.getByText(/numper del operador/i)).toBeInTheDocument()
      // The NUMPER field should be an input element with inputMode=numeric
      const numperInput = document.querySelector(
        'input[inputmode="numeric"][maxlength="2"]'
      ) as HTMLInputElement
      expect(numperInput).not.toBeNull()
    })
  })
})