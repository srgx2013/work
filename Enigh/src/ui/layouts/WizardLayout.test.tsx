import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { WizardLayout } from './WizardLayout'
import { useAppStore } from '@/application/store/index'

describe('WizardLayout', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().resetAllTimers()
    })
  })

  it('renders header with app title', () => {
    render(<WizardLayout>{null}</WizardLayout>)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText(/IKTAN Simulator/)).toBeInTheDocument()
    expect(screen.getByText(/ENIGH/)).toBeInTheDocument()
  })

  it('renders main content area with children', () => {
    render(
      <WizardLayout>
        <div data-testid="step-content">Step content</div>
      </WizardLayout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('step-content')).toBeInTheDocument()
  })

  it('renders ProgressBar at top', () => {
    render(<WizardLayout>{null}</WizardLayout>)
    expect(screen.getByRole('navigation', { name: /Progreso/i })).toBeInTheDocument()
  })

  it('renders TimerBar in header area', () => {
    render(<WizardLayout>{null}</WizardLayout>)
    expect(screen.getByText(/Tiempo en/)).toBeInTheDocument()
  })

  it('renders WizardNavigation at bottom', () => {
    render(<WizardLayout>{null}</WizardLayout>)
    expect(screen.getByRole('button', { name: /Siguiente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Anterior/i })).toBeInTheDocument()
  })

  it('renders "Reiniciar" button which when clicked opens a ConfirmModal', () => {
    render(<WizardLayout>{null}</WizardLayout>)
    // BEFORE modal opens: header Reiniciar button (only one)
    const btn = screen.getByRole('button', { name: /^Reiniciar$/ })
    fireEvent.click(btn)
    // ConfirmModal appears
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Modal title should match (unique)
    expect(screen.getByText('Reiniciar folio')).toBeInTheDocument()
  })

  it('navigates forward when Siguiente clicked with valid portada data', () => {
    expect(useAppStore.getState().currentStep).toBe(1)
    // Fill valid portada data so validation passes
    act(() => {
      useAppStore.getState().updatePortada({
        entidad: '14',
        folioViv: '1234567890',
        folioHog: '1',
        decena: '5',
        nombreEntrevistador: 'Juan Pérez',
        nombreSupervisor: 'María López',
        resultadoEntrevista: 'A1',
        fechaInicio: '01/07/2024',
        fechaTermino: '02/07/2024',
        observaciones: '',
      })
    })
    render(<WizardLayout>{null}</WizardLayout>)
    const next = screen.getByRole('button', { name: /^Siguiente$/ })
    fireEvent.click(next)
    // Valid data → wizard advances via store.nextStep()
    expect(useAppStore.getState().currentStep).toBe(2)
  })

  it('blocks navigation when Siguiente clicked with invalid (empty) data', () => {
    expect(useAppStore.getState().currentStep).toBe(1)
    render(<WizardLayout>{null}</WizardLayout>)
    const next = screen.getByRole('button', { name: /^Siguiente$/ })
    fireEvent.click(next)
    // Invalid data → wizard stays on step 1 with errors
    expect(useAppStore.getState().currentStep).toBe(1)
    const errors = useAppStore.getState().stepErrors[1]
    expect(errors).toBeDefined()
    expect(errors!.length).toBeGreaterThan(0)
  })
})

describe('WizardLayout — cross-section validation on step 7→8', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().resetAllTimers()
    })
  })

  it('advances from step 7 to step 8 when cross-section rules pass', () => {
    // Build a statistically consistent store: Portada A1, 1 integrante jefe,
    // 1 persona 12+, no negocios, gastos consistentes.
    act(() => {
      useAppStore.getState().updatePortada({
        entidad: '14',
        folioViv: '1234567890',
        folioHog: '1',
        decena: '5',
        nombreEntrevistador: 'X',
        nombreSupervisor: 'Y',
        resultadoEntrevista: 'A1',
        fechaInicio: '01/07/2024',
        fechaTermino: '02/07/2024',
        observaciones: '',
      })
      const state = useAppStore.getState()
      state.updateHogares({
        folioViv: '1234567890',
        folioHog: '1',
        integrantes: [
          { numPer: '01', nombre: 'Juan', parentesco: '1', sexo: '1', edad: 47, fechaNacimiento: '15/03/1977', estadoCivil: '2', sabeLeerEscribir: '1', nivelEscolaridad: '09', asisteEscuela: '2' },
        ],
      })
      state.setMenores([])
      state.setPersonas([
        {
          folioViv: '1234567890',
          folioHog: '1',
          numPer: '01', nombre: 'Juan', edad: 47, sexo: '1', parentesco: '1',
          nivelAprobado: '09', asisteEscuela: '2', sabeLeerEscribir: '1',
          tieneDerechohabiencia: '2', problemaSalud2Semanas: '2',
          fuma: '2', consumeAlcohol: '2', trabajoSemanaPasada: '2',
          recibeJubilacion: '2', recibeRemesas: '2',
          recibeProgGobierno: '2', recibeAyudaOtros: '2',
        },
      ])
      state.updateNegociosData({ folioViv: '1234567890', folioHog: '1', tieneNegocio: '2', negocios: [] })
      // Enable step 7 zod: each day needs a valid fecha and at least 1 gasto.
      const nombresDia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const
      const dias = nombresDia.map((nombreDia, i) => ({
        diaNumero: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        nombreDia,
        fecha: '01/07/2024',
        gastos: [{ id: `g${i + 1}`, concepto: 'Comida', monto: 0 }],
      }))
      state.updateGastosDiarios({
        folioViv: '1234567890', folioHog: '1',
        informanteNumPer: '01',
        dias,
        estimacionMensual: {},
      })
      useAppStore.getState().setCurrentStep(7)
    })
    render(<WizardLayout>{null}</WizardLayout>)
    fireEvent.click(screen.getByRole('button', { name: /^Siguiente$/ }))
    expect(useAppStore.getState().currentStep).toBe(8)
  })

  it('blocks step 7→8 when cross-section has BLOCKER errors (folio mismatches)', () => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().updatePortada({
        entidad: '14', folioViv: '1234567890', folioHog: '1',
        decena: '5', nombreEntrevistador: 'X', nombreSupervisor: 'Y',
        resultadoEntrevista: 'A1',
        fechaInicio: '01/07/2024', fechaTermino: '02/07/2024',
        observaciones: '',
      })
      // Populate valid step 7 data so the per-step Zod passes, but
      // give the gastos diarios a DIFFERENT folioViv so CS-001 fires.
      const nombresDia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const
      const dias = nombresDia.map((nombreDia, i) => ({
        diaNumero: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        nombreDia,
        fecha: '01/07/2024',
        gastos: [{ id: `g${i + 1}`, concepto: 'Comida', monto: 0 }],
      }))
      useAppStore.getState().updateGastosDiarios({
        folioViv: '9999999999', // mismatch to trigger CS-001 BLOCKER
        folioHog: '1',
        informanteNumPer: '01',
        dias,
        estimacionMensual: {},
      })
      useAppStore.getState().setCurrentStep(7)
    })
    render(<WizardLayout>{null}</WizardLayout>)
    fireEvent.click(screen.getByRole('button', { name: /^Siguiente$/ }))
    // Per-step Zod passes, but CS-001 fires a BLOCKER that prevents navigation.
    expect(useAppStore.getState().currentStep).toBe(7)
    const cross = useAppStore.getState().crossSectionErrors
    expect(cross.length).toBeGreaterThan(0)
    expect(cross.some((e) => e.severity === 'BLOCKER' && e.ruleId === 'CS-001')).toBe(true)
  })
})