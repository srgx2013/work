// ReporteStep.test.tsx — Tests for the Reporte Final step.
// Verifies datos generales, residentes table, totales, timer data per
// questionnaire + total, alertas de consistencia, and Reiniciar button.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ReporteStep } from './ReporteStep'
import { useAppStore } from '@/application/store/index'
import type { Integrante } from '@/domain/models/hogares'

function makeIntegrante(overrides: Partial<Integrante> = {}): Integrante {
  return {
    numPer: '01',
    nombre: 'Juan',
    parentesco: '1',
    sexo: '1',
    edad: 35,
    fechaNacimiento: '01/01/1990',
    estadoCivil: '1',
    sabeLeerEscribir: '1',
    sabeLeerEscribar: '1',
    nivelEscolaridad: '09',
    asisteEscuela: '2',
    ...overrides,
  } as Integrante
}

function setupCompleteStore() {
  act(() => {
    useAppStore.getState().resetAll()
    useAppStore.getState().updatePortada({
      folioViv: '1234567890',
      folioHog: '1',
      entidad: '14',
      nombreEntrevistador: 'Ana López',
      nombreSupervisor: 'Carlos Ruiz',
      fechaInicio: '18/09/2024',
      fechaTermino: '20/09/2024',
      resultadoEntrevista: 'A1',
      decena: '1',
    })
    useAppStore.getState().updateHogares({
      integrantes: [makeIntegrante({ numPer: '01', nombre: 'Juan', edad: 35 })],
    })
    useAppStore.getState().updateGastosHogar({
      alimentosCarnes: 1000,
      transportePublico: 500,
    })
    useAppStore.getState().updateGastosDiarios({
      informanteNumPer: '01',
    })
    // Set timer data
    useAppStore.setState((s) => ({
      timer: {
        ...s.timer,
        entries: {
          ...s.timer.entries,
          1: { ...s.timer.entries[1], elapsedSeconds: 120 },
          2: { ...s.timer.entries[2], elapsedSeconds: 300 },
        },
      },
    }))
  })
}

describe('ReporteStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('initial render', () => {
    it('renders the report title', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/reporte final/i)).toBeInTheDocument()
    })

    it('renders "Datos Generales" section', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/datos generales/i)).toBeInTheDocument()
    })

    it('renders "Resumen de Residentes" section', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/resumen de residentes/i)).toBeInTheDocument()
    })

    it('renders "Totales" section', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/totales/i)).toBeInTheDocument()
    })

    it('renders "Tiempos por Cuestionario" section', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/tiempos por cuestionario/i)).toBeInTheDocument()
    })

    it('renders "Alertas de Consistencia" section', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/alertas de consistencia/i)).toBeInTheDocument()
    })
  })

  describe('datos generales', () => {
    it('shows folioViv, folioHog, entidad, entrevistador, fechas from store', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      expect(screen.getByText('1234567890')).toBeInTheDocument()
      // folioHog '1' appears in multiple places — check within the Datos Generales table
      const folioHogCell = screen.getByText('FOLIOHOG').closest('tr')?.querySelector('td')
      expect(folioHogCell?.textContent).toBe('1')
      expect(screen.getByText('Ana López')).toBeInTheDocument()
      expect(screen.getByText('18/09/2024')).toBeInTheDocument()
      expect(screen.getByText('20/09/2024')).toBeInTheDocument()
    })

    it('shows estado del folio badge', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/concluido|incompleto/i)).toBeInTheDocument()
    })
  })

  describe('residentes table', () => {
    it('shows integrantes in the residentes table', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      expect(screen.getByText('Juan')).toBeInTheDocument()
    })

    it('shows table headers for residentes', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/numper/i)).toBeInTheDocument()
      expect(screen.getByText(/nombre/i)).toBeInTheDocument()
      expect(screen.getByText(/parentesco/i)).toBeInTheDocument()
      expect(screen.getByText(/sexo/i)).toBeInTheDocument()
      expect(screen.getByText(/edad/i)).toBeInTheDocument()
    })
  })

  describe('totales', () => {
    it('shows ingreso total del hogar', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      expect(screen.getByText(/ingreso total/i)).toBeInTheDocument()
    })

    it('shows gasto trimestral total', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      expect(screen.getByText(/gasto trimestral/i)).toBeInTheDocument()
    })

    it('shows gasto diario total', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      expect(screen.getByText(/gasto diario/i)).toBeInTheDocument()
    })
  })

  describe('tiempos por cuestionario', () => {
    it('shows each questionnaire name in the timer table', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/portada/i)).toBeInTheDocument()
      expect(screen.getByText(/hogares y vivienda/i)).toBeInTheDocument()
      expect(screen.getByText(/menores de 12/i)).toBeInTheDocument()
      expect(screen.getByText(/personas de 12/i)).toBeInTheDocument()
      expect(screen.getByText(/negocios del hogar/i)).toBeInTheDocument()
      expect(screen.getByText(/gastos del hogar/i)).toBeInTheDocument()
      expect(screen.getByText(/gastos diarios/i)).toBeInTheDocument()
    })

    it('shows tiempo total', () => {
      render(<ReporteStep />)
      expect(screen.getByText('Tiempo total')).toBeInTheDocument()
    })

    it('shows timer in MM:SS format', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      // Portada timer is 120 seconds = 02:00
      expect(screen.getByText('02:00')).toBeInTheDocument()
      // Hogares timer is 300 seconds = 05:00
      expect(screen.getByText('05:00')).toBeInTheDocument()
    })
  })

  describe('alertas de consistencia', () => {
    it('shows "Sin incidencias" when no warnings', () => {
      render(<ReporteStep />)
      expect(screen.getByText(/sin incidencias/i)).toBeInTheDocument()
    })
  })

  describe('Reiniciar button', () => {
    it('renders a Reiniciar button', () => {
      render(<ReporteStep />)
      expect(screen.getByRole('button', { name: /reiniciar/i })).toBeInTheDocument()
    })

    it('opens ConfirmModal when Reiniciar is clicked', () => {
      render(<ReporteStep />)
      fireEvent.click(screen.getByRole('button', { name: /reiniciar/i }))
      // ConfirmModal should appear with the reset message
      expect(screen.getByText(/¿está seguro/i)).toBeInTheDocument()
    })

    it('resets the store when confirmed', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      // Verify data exists
      expect(useAppStore.getState().portada.folioViv).toBe('1234567890')
      // Click Reiniciar
      fireEvent.click(screen.getByRole('button', { name: /reiniciar/i }))
      // Click confirm button
      const confirmBtn = screen.getByRole('button', { name: /sí, reiniciar/i })
      fireEvent.click(confirmBtn)
      // Store should be reset
      expect(useAppStore.getState().portada.folioViv).toBe('')
      expect(useAppStore.getState().currentStep).toBe(1)
    })

    it('closes modal when cancel is clicked', () => {
      setupCompleteStore()
      render(<ReporteStep />)
      fireEvent.click(screen.getByRole('button', { name: /reiniciar/i }))
      expect(screen.getByText(/¿está seguro/i)).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
      // Modal should close
      expect(screen.queryByText(/¿está seguro/i)).toBeNull()
      // Data should NOT be reset
      expect(useAppStore.getState().portada.folioViv).toBe('1234567890')
    })
  })

  describe('no navigation buttons', () => {
    it('does NOT render "Siguiente" button', () => {
      render(<ReporteStep />)
      expect(screen.queryByRole('button', { name: /^siguiente$/i })).toBeNull()
    })

    it('does NOT render "Anterior" button', () => {
      render(<ReporteStep />)
      expect(screen.queryByRole('button', { name: /^anterior$/i })).toBeNull()
    })
  })
})