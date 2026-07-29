import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { PortadaStep } from './PortadaStep'
import { WizardLayout } from '@/ui/layouts/WizardLayout'
import { useAppStore } from '@/application/store/index'
import { CATALOGS } from '@/domain/constants/catalogs'

// Helper: get catalog entries as CodeInput expects
const entidadCodes = Object.values(CATALOGS.entidades)
const resultadoCodes = Object.values(CATALOGS.resultadosEntrevista)
const decenaCodes = [
  { code: '1', label: '1' }, { code: '2', label: '2' }, { code: '3', label: '3' },
  { code: '4', label: '4' }, { code: '5', label: '5' }, { code: '6', label: '6' },
  { code: '7', label: '7' }, { code: '8', label: '8' }, { code: '9', label: '9' },
  { code: '0', label: '0 (decena 10)' },
]

// Silence unused-variable warnings (these are reference data)
void entidadCodes
void resultadoCodes
void decenaCodes

describe('PortadaStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('rendering', () => {
    it('renders all 10 Portada fields in Spanish', () => {
      render(<PortadaStep />)
      // ENTIDAD
      expect(screen.getByText('ENTIDAD')).toBeInTheDocument()
      // FOLIOVIV
      expect(screen.getByText(/FOLIOVIV/)).toBeInTheDocument()
      // FOLIOHOG
      expect(screen.getByText(/FOLIOHOG/)).toBeInTheDocument()
      // DECENA
      expect(screen.getByText('DECENA')).toBeInTheDocument()
      // Nombre del Entrevistador
      expect(screen.getByText(/Nombre del Entrevistador/)).toBeInTheDocument()
      // Nombre del Supervisor
      expect(screen.getByText(/Nombre del Supervisor/)).toBeInTheDocument()
      // Resultado de Entrevista
      expect(screen.getByText(/Resultado de Entrevista/)).toBeInTheDocument()
      // Fecha de Inicio
      expect(screen.getByText(/Fecha de Inicio/)).toBeInTheDocument()
      // Fecha de Término
      expect(screen.getByText(/Fecha de Término/)).toBeInTheDocument()
      // Observaciones — appears in heading and label; verify at least one
      expect(screen.getAllByText(/Observaciones/).length).toBeGreaterThanOrEqual(1)
    })

    it('renders 📖 Códigos button for entidad (catalog provided)', () => {
      render(<PortadaStep />)
      const codeButtons = screen.getAllByRole('button', { name: /Ver códigos para/ })
      // At least for ENTIDAD and resultadoEntrevista
      expect(codeButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('renders the Observaciones textarea', () => {
      render(<PortadaStep />)
      expect(screen.getByPlaceholderText(/observaciones/i)).toBeInTheDocument()
    })
  })

  describe('data persistence', () => {
    it('persists FOLIOVIV to store on change', () => {
      render(<PortadaStep />)
      const folioVivInput = screen.getByPlaceholderText('10 dígitos')
      fireEvent.change(folioVivInput, { target: { value: '1234567890' } })
      expect(useAppStore.getState().portada.folioViv).toBe('1234567890')
    })

    it('persists FOLIOHOG to store on change', () => {
      render(<PortadaStep />)
      const folioHogInput = screen.getByPlaceholderText('1-5')
      fireEvent.change(folioHogInput, { target: { value: '3' } })
      expect(useAppStore.getState().portada.folioHog).toBe('3')
    })
    it('persists entidad to store on change', () => {
      render(<PortadaStep />)
      // Find CodeInput for entidad — input with id "code-entidad"
      const entidadInput = document.getElementById('code-entidad') as HTMLInputElement
      fireEvent.change(entidadInput, { target: { value: '14' } })
      expect(useAppStore.getState().portada.entidad).toBe('14')
    })
  })

  describe('inline validation on blur', () => {
    it('shows error when FOLIOVIV has less than 10 digits on blur', async () => {
      const user = userEvent.setup()
      render(<PortadaStep />)
      const input = screen.getByPlaceholderText('10 dígitos')
      await user.click(input)
      await user.type(input, '12345')
      await user.tab() // blur
      // Should show some validation error about 10 digits
      expect(screen.getByText(/debe contener exactamente 10 dígitos/)).toBeInTheDocument()
    })

    it('shows no error when FOLIOVIV has valid 10 digits on blur', async () => {
      const user = userEvent.setup()
      render(<PortadaStep />)
      const input = screen.getByPlaceholderText('10 dígitos')
      await user.click(input)
      await user.type(input, '1234567890')
      await user.tab()
      // No error about "10 dígitos numéricos" should appear
      const errorMessages = screen.queryAllByText(/debe contener exactamente 10 dígitos/)
      expect(errorMessages).toHaveLength(0)
    })

    it('shows error when FOLIOHOG is out of range (6) on blur', async () => {
      const user = userEvent.setup()
      render(<PortadaStep />)
      const input = screen.getByPlaceholderText('1-5')
      await user.click(input)
      await user.type(input, '6')
      await user.tab()
      expect(screen.getByText(/1 al 5/)).toBeInTheDocument()
    })
  })

  describe('Siguiente click — full step validation (via WizardLayout)', () => {
    it('sets step errors in store when Siguiente is clicked with empty fields', async () => {
      const user = userEvent.setup()
      render(
        <WizardLayout>
          <PortadaStep />
        </WizardLayout>
      )
      const siguienteBtn = screen.getByRole('button', { name: /Siguiente/i })
      await user.click(siguienteBtn)
      // The store should have errors for step 1
      const errors = useAppStore.getState().stepErrors[1]
      expect(errors).toBeDefined()
      expect(errors!.length).toBeGreaterThan(0)
    })

    it('does NOT advance to step 2 when there are errors', async () => {
      const user = userEvent.setup()
      render(
        <WizardLayout>
          <PortadaStep />
        </WizardLayout>
      )
      const siguienteBtn = screen.getByRole('button', { name: /Siguiente/i })
      await user.click(siguienteBtn)
      expect(useAppStore.getState().currentStep).toBe(1)
    })
  })
})
