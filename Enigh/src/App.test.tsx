import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { App } from './App'
import { useAppStore } from '@/application/store/index'

describe('App', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  it('renders the IKTAN Simulator heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /IKTAN Simulator/ })
    ).toBeInTheDocument()
  })

  it('renders the ENIGH subtitle', () => {
    render(<App />)
    expect(screen.getByText(/Captura ENIGH 2024/)).toBeInTheDocument()
  })

  it('renders PortadaStep on step 1 by default', () => {
    render(<App />)
    expect(screen.getByText('ENTIDAD')).toBeInTheDocument()
  })

  it('renders HogaresViviendaStep on step 2', () => {
    act(() => {
      useAppStore.getState().setCurrentStep(2)
    })
    render(<App />)
    expect(screen.getByText(/I\. Características de la Vivienda/)).toBeInTheDocument()
  })

  it('renders NegociosStep on step 5', () => {
    act(() => {
      useAppStore.getState().setCurrentStep(5)
    })
    render(<App />)
    // "Negocios del Hogar" may appear in step title + ProgressBar aria
    const titleMatches = screen.getAllByText(/Negocios del Hogar/)
    expect(titleMatches.length).toBeGreaterThanOrEqual(1)
    expect(
      screen.getByText(/algún integrante del hogar tiene un negocio/i)
    ).toBeInTheDocument()
  })

  it('renders GastosHogarStep on step 6', () => {
    act(() => {
      useAppStore.getState().setCurrentStep(6)
    })
    render(<App />)
    const titleMatches = screen.getAllByText(/Gastos del Hogar/)
    expect(titleMatches.length).toBeGreaterThanOrEqual(1)
    expect(
      screen.getByText(/Sección I — Alimentos, Bebidas y Tabaco/i)
    ).toBeInTheDocument()
  })
})