// Personas12PlusStep.test.tsx — Tests for the dynamic Personas de 12+ años step.
// Verifies empty state, sub-step tabs, all 6 sub-sections, conditional fields,
// and data persistence to the Zustand store.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Personas12PlusStep } from './Personas12PlusStep'
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
    estadoCivil: '2',
    sabeLeerEscribir: '1',
    nivelEscolaridad: '09',
    asisteEscuela: '2',
    ...overrides,
  }
}

function setIntegrantes(integrantes: Integrante[]) {
  act(() => {
    useAppStore.getState().updateHogares({ integrantes })
    useAppStore.getState().setPersonas([])
  })
}

describe('Personas12PlusStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('empty state', () => {
    it('shows "No hay personas" message when no integrantes 12+', () => {
      setIntegrantes([makeIntegrante({ edad: 8, numPer: '01' })])
      render(<Personas12PlusStep />)
      expect(
        screen.getByText(/No hay integrantes de 12 o más años/i)
      ).toBeInTheDocument()
    })

    it('does not show sub-step tabs when no personas 12+', () => {
      setIntegrantes([makeIntegrante({ edad: 8, numPer: '01' })])
      render(<Personas12PlusStep />)
      expect(screen.queryByRole('tab')).toBeNull()
    })
  })

  describe('sub-step tabs', () => {
    it('renders one tab per persona 12+', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
        makeIntegrante({ numPer: '02', nombre: 'Beto', edad: 5 }),
        makeIntegrante({ numPer: '03', nombre: 'Carlos', edad: 40 }),
      ])
      render(<Personas12PlusStep />)
      // Two personas 12+: Ana and Carlos
      expect(screen.getByRole('tab', { name: /Ana/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Carlos/i })).toBeInTheDocument()
      // Beto (5 years old) should NOT appear in a tab
      expect(screen.queryByRole('tab', { name: /Beto/i })).toBeNull()
    })

    it('clicking a tab switches the active persona sub-form', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
        makeIntegrante({ numPer: '02', nombre: 'Carlos', edad: 40 }),
      ])
      render(<Personas12PlusStep />)
      // First persona (Ana) active by default — read-only age "25 años"
      expect(screen.getByText('25 años')).toBeInTheDocument()
      // Click Carlos tab
      fireEvent.click(screen.getByRole('tab', { name: /Carlos/i }))
      // Now Carlos's age (40) should be visible
      expect(screen.getByText('40 años')).toBeInTheDocument()
    })
  })

  describe('read-only pre-filled fields', () => {
    it('displays nombre, edad, sexo, parentesco from Hogares', () => {
      setIntegrantes([
        makeIntegrante({
          numPer: '01',
          nombre: 'Ana López',
          edad: 30,
          sexo: '2',
          parentesco: '1',
        }),
      ])
      render(<Personas12PlusStep />)
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Ana López')).toBeInTheDocument()
      expect(screen.getByText('Edad')).toBeInTheDocument()
      expect(screen.getByText('30 años')).toBeInTheDocument()
      expect(screen.getByText('Sexo')).toBeInTheDocument()
      expect(screen.getAllByText(/Mujer/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Parentesco')).toBeInTheDocument()
    })
  })

  describe('section rendering — all 6 sections', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
    })

    it('renders II. Educación section', () => {
      render(<Personas12PlusStep />)
      expect(screen.getByText(/II\.\s*Educación/i)).toBeInTheDocument()
    })

    it('renders III. Salud section', () => {
      render(<Personas12PlusStep />)
      expect(screen.getByText(/III\.\s*Salud/i)).toBeInTheDocument()
    })

    it('renders IV. Actividad Económica section', () => {
      render(<Personas12PlusStep />)
      expect(screen.getByText(/IV\.\s*Actividad Económica/i)).toBeInTheDocument()
    })

    it('renders V. Ingresos No Laborales section', () => {
      render(<Personas12PlusStep />)
      expect(screen.getByText(/V\.\s*Ingresos No Laborales/i)).toBeInTheDocument()
    })

    it('renders VI. Gastos Personales section', () => {
      render(<Personas12PlusStep />)
      expect(screen.getByText(/VI\.\s*Gastos Personales/i)).toBeInTheDocument()
    })
  })

  describe('conditional fields — salud', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
    })

    it('shows institucionSalud when tieneDerechohabiencia is "1"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '1' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getAllByText(/Institución de salud/i).length).toBeGreaterThanOrEqual(1)
    })

    it('does NOT show institucionSalud when tieneDerechohabiencia is "2"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '2' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.queryByText(/Institución de salud/i)).toBeNull()
    })

    it('shows frecuenciaAlcohol when consumeAlcohol is "1"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '1' as never,
            trabajoSemanaPasada: '' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getByText(/Frecuencia/i)).toBeInTheDocument()
    })
  })

  describe('conditional fields — actividad económica', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
    })

    it('shows ocupacion and tipo trabajo when trabajoSemanaPasada is "1"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '1' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getByText(/Ocupación/i)).toBeInTheDocument()
      expect(screen.getByText(/Tipo de trabajo/i)).toBeInTheDocument()
      expect(screen.getByText(/Horas trabajadas/i)).toBeInTheDocument()
      expect(screen.getByText(/Ingreso mensual neto/i)).toBeInTheDocument()
    })

    it('shows buscaTrabajo and motivoNoTrabaja when trabajoSemanaPasada is "2"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '2' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getByText(/Busca trabajo/i)).toBeInTheDocument()
      expect(screen.getByText(/Motivo por el cual no trabaja/i)).toBeInTheDocument()
    })

    it('does NOT show ocupacion when trabajoSemanaPasada is empty', () => {
      render(<Personas12PlusStep />)
      expect(screen.queryByText(/Ocupación principal/i)).toBeNull()
    })
  })

  describe('conditional fields — ingresos no laborales', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
    })

    it('shows programa fields when recibeProgGobierno is "1"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '1' as never,
            recibeAyudaOtros: '' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getByText(/Nombre del programa/i)).toBeInTheDocument()
      expect(screen.getByText(/Monto del programa/i)).toBeInTheDocument()
      expect(screen.getByText(/Periodicidad/i)).toBeInTheDocument()
    })

    it('shows ayuda fields when recibeAyudaOtros is "1"', () => {
      act(() => {
        useAppStore.getState().setPersonas([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 25,
            sexo: '2',
            parentesco: '1',
            nivelAprobado: '',
            asisteEscuela: '' as never,
            sabeLeerEscribir: '' as never,
            tieneDerechohabiencia: '' as never,
            problemaSalud2Semanas: '' as never,
            fuma: '' as never,
            consumeAlcohol: '' as never,
            trabajoSemanaPasada: '' as never,
            recibeJubilacion: '' as never,
            recibeRemesas: '' as never,
            recibeProgGobierno: '' as never,
            recibeAyudaOtros: '1' as never,
          },
        ])
      })
      render(<Personas12PlusStep />)
      expect(screen.getByText(/Monto de la ayuda/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Periodicidad/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('data persistence', () => {
    it('auto-initializes persona data from Hogares integrantes', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
      render(<Personas12PlusStep />)
      const personas = useAppStore.getState().personas12plus.personas
      expect(personas).toHaveLength(1)
      expect(personas[0].nombre).toBe('Ana')
      expect(personas[0].edad).toBe(25)
    })
  })

  describe('single persona — no tabs needed', () => {
    it('shows the form directly when only one persona 12+ exists', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 25 }),
      ])
      render(<Personas12PlusStep />)
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Ana')).toBeInTheDocument()
    })
  })
})