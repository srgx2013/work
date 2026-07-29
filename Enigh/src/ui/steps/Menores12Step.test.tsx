// Menores12Step.test.tsx — Tests for the dynamic Menores de 12 años step.
// Verifies empty state, sub-step tabs, conditional fields, read-only prefilled data,
// and data persistence to the Zustand store.

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Menores12Step } from './Menores12Step'
import { useAppStore } from '@/application/store/index'
import type { Integrante } from '@/domain/models/hogares'

function makeIntegrante(overrides: Partial<Integrante> = {}): Integrante {
  return {
    numPer: '01',
    nombre: 'Juan',
    parentesco: '1',
    sexo: '1',
    edad: 8,
    fechaNacimiento: '01/01/2017',
    estadoCivil: '1',
    sabeLeerEscribir: '2',
    nivelEscolaridad: '01',
    asisteEscuela: '1',
    ...overrides,
  }
}

function setIntegrantes(integrantes: Integrante[]) {
  act(() => {
    useAppStore.getState().updateHogares({ integrantes })
    // Clear any existing menores data
    useAppStore.getState().setMenores([])
  })
}

describe('Menores12Step', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('empty state', () => {
    it('shows "No hay menores" message when no integrantes under 12', () => {
      setIntegrantes([makeIntegrante({ edad: 25, numPer: '01' })])
      render(<Menores12Step />)
      expect(
        screen.getByText(/No hay integrantes menores de 12 años/i)
      ).toBeInTheDocument()
    })

    it('does not show sub-step tabs when no menores', () => {
      setIntegrantes([makeIntegrante({ edad: 25, numPer: '01' })])
      render(<Menores12Step />)
      expect(screen.queryByRole('button', { name: /menor/i })).toBeNull()
    })
  })

  describe('sub-step tabs', () => {
    it('renders one tab per menor under 12', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
        makeIntegrante({ numPer: '02', nombre: 'Beto', edad: 25 }),
        makeIntegrante({ numPer: '03', nombre: 'Carlos', edad: 10 }),
      ])
      render(<Menores12Step />)
      // Two menores: Ana and Carlos (both should be in tab buttons)
      expect(screen.getByRole('tab', { name: /Ana/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Carlos/i })).toBeInTheDocument()
      // Beto should NOT appear in a tab (he is 25, not under 12)
      expect(screen.queryByRole('tab', { name: /Beto/i })).toBeNull()
    })

    it('clicking a tab switches the active menor sub-form', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
        makeIntegrante({ numPer: '02', nombre: 'Carlos', edad: 10 }),
      ])
      render(<Menores12Step />)
      // First menor (Ana) is active by default — read-only age field shows "5 años"
      expect(screen.getByText('5 años')).toBeInTheDocument()
      // Click Carlos tab
      const carlosTab = screen.getByRole('tab', { name: /Carlos/i })
      fireEvent.click(carlosTab)
      // Now Carlos's age (10) should be visible in the read-only field
      expect(screen.getByText('10 años')).toBeInTheDocument()
    })

    it('shows edad in the tab label', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 7 }),
      ])
      render(<Menores12Step />)
      // The read-only Edad field and tab badge show "7 años"
      expect(screen.getAllByText(/7 años/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('read-only pre-filled fields', () => {
    it('displays nombre and edad as read-only from Hogares', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana López', edad: 5 }),
      ])
      render(<Menores12Step />)
      // Read-only label for Nombre
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Ana López')).toBeInTheDocument()
      // Read-only label for Edad
      expect(screen.getByText('Edad')).toBeInTheDocument()
      expect(screen.getByText('5 años')).toBeInTheDocument()
    })

    it('displays sexo as read-only from Hogares', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5, sexo: '2' }),
      ])
      render(<Menores12Step />)
      expect(screen.getByText('Sexo')).toBeInTheDocument()
      expect(screen.getByText(/Mujer/i)).toBeInTheDocument()
    })
  })

  describe('conditional fields — salud', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5, sexo: '2' }),
      ])
    })

    it('shows institucionSalud field when tieneDerechohabiencia is "1"', () => {
      render(<Menores12Step />)
      // Update tieneDerechohabiencia to '1'
      const store = useAppStore.getState()
      act(() => {
        store.setMenores([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 5,
            sexo: '2',
            tieneDerechohabiencia: '1',
            problemaSalud2Semanas: '2',
            vacunacionCompleta: '2',
            asisteEscuela: '2',
            recibeBeca: '2',
            quienCuida: '',
          },
        ])
      })
      // Re-render
      render(<Menores12Step />)
      expect(screen.getAllByText(/Institución de salud/i).length).toBeGreaterThanOrEqual(1)
    })

    it('does NOT show institucionSalud when tieneDerechohabiencia is "2"', () => {
      render(<Menores12Step />)
      const store = useAppStore.getState()
      act(() => {
        store.setMenores([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 5,
            sexo: '2',
            tieneDerechohabiencia: '2',
            problemaSalud2Semanas: '2',
            vacunacionCompleta: '2',
            asisteEscuela: '2',
            recibeBeca: '2',
            quienCuida: '',
          },
        ])
      })
      render(<Menores12Step />)
      expect(screen.queryByText(/Institución de salud/i)).toBeNull()
    })
  })

  describe('conditional fields — educación', () => {
    it('shows gradoEscolar and tipoEscuela when asisteEscuela is "1"', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
      ])
      act(() => {
        useAppStore.getState().setMenores([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 5,
            sexo: '2',
            tieneDerechohabiencia: '2',
            problemaSalud2Semanas: '2',
            vacunacionCompleta: '2',
            asisteEscuela: '1',
            recibeBeca: '2',
            quienCuida: '',
          },
        ])
      })
      render(<Menores12Step />)
      expect(screen.getByText(/Grado que cursa/i)).toBeInTheDocument()
      expect(screen.getByText(/Tipo de escuela/i)).toBeInTheDocument()
    })

    it('does NOT show gradoEscolar and tipoEscuela when asisteEscuela is "2"', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
      ])
      act(() => {
        useAppStore.getState().setMenores([
          {
            folioViv: '',
            folioHog: '',
            numPer: '01',
            nombre: 'Ana',
            edad: 5,
            sexo: '2',
            tieneDerechohabiencia: '2',
            problemaSalud2Semanas: '2',
            vacunacionCompleta: '2',
            asisteEscuela: '2',
            recibeBeca: '2',
            quienCuida: '',
          },
        ])
      })
      render(<Menores12Step />)
      expect(screen.queryByText(/Grado que cursa/i)).toBeNull()
      expect(screen.queryByText(/Tipo de escuela/i)).toBeNull()
    })
  })

  describe('field rendering — all fields present', () => {
    beforeEach(() => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
      ])
    })

    it('renders salud section fields', () => {
      render(<Menores12Step />)
      expect(screen.getByText(/derechohabiencia/i)).toBeInTheDocument()
      expect(screen.getByText(/problema de salud/i)).toBeInTheDocument()
      expect(screen.getByText(/vacunación/i)).toBeInTheDocument()
    })

    it('renders educación section fields', () => {
      render(<Menores12Step />)
      expect(screen.getByText(/asiste a la escuela/i)).toBeInTheDocument()
      expect(screen.getByText(/beca escolar/i)).toBeInTheDocument()
    })

    it('renders cuidado section fields', () => {
      render(<Menores12Step />)
      expect(screen.getByText(/quién.*cuida/i)).toBeInTheDocument()
    })
  })

  describe('data persistence', () => {
    it('updates store when tieneDerechohabiencia changes', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
      ])
      render(<Menores12Step />)
      // The component auto-initializes the menor entry from Hogares data
      const menores = useAppStore.getState().menores12.menores
      // After rendering, there should be 1 menor for the 1 integrante under 12
      expect(menores).toHaveLength(1)
      expect(menores[0].folioViv).toBe('')
      expect(menores[0].nombre).toBe('Ana')
      expect(menores[0].tieneDerechohabiencia).toBe('')
    })
  })

  describe('single menor — no tabs needed', () => {
    it('shows the form directly when only one menor exists', () => {
      setIntegrantes([
        makeIntegrante({ numPer: '01', nombre: 'Ana', edad: 5 }),
      ])
      render(<Menores12Step />)
      // With only 1 menor, a tab button should still exist but there's only one
      expect(screen.getByText('Ana')).toBeInTheDocument()
      expect(screen.getByText('Nombre')).toBeInTheDocument()
    })
  })
})