import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { HogaresViviendaStep } from './HogaresViviendaStep'
import { useAppStore } from '@/application/store/index'

describe('HogaresViviendaStep', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAll()
      useAppStore.getState().clearAllErrors()
    })
  })

  describe('rendering — Section I: Vivienda', () => {
    it('renders Section I header "Características de la Vivienda"', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText(/I\. Características de la Vivienda/)).toBeInTheDocument()
    })

    it('renders all vivienda CodeInputs with P-number labels', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText('P1. Clase de Vivienda')).toBeInTheDocument()
      expect(screen.getByText('P2. Material de Paredes')).toBeInTheDocument()
      expect(screen.getByText('P3. Material de Techos')).toBeInTheDocument()
      expect(screen.getByText('P4. Material de Pisos')).toBeInTheDocument()
      expect(screen.getByText('P5. Antigüedad (años)')).toBeInTheDocument()
      expect(screen.getByText('P6. ¿Esta vivienda tiene un cuarto para cocinar?')).toBeInTheDocument()
      expect(screen.getByText('P8. ¿Cuántos cuartos se usan para dormir?')).toBeInTheDocument()
      expect(screen.getByText('P9. ¿Cuántos cuartos tiene en total esta vivienda?')).toBeInTheDocument()
      expect(screen.getByText('P11. ¿El agua la obtienen de llaves o mangueras que están...')).toBeInTheDocument()
      expect(screen.getByText('P14. ¿Cuántos días a la semana llega el agua?')).toBeInTheDocument()
      expect(screen.getByText('P15. ¿Tienen...')).toBeInTheDocument()
      expect(screen.getByText('P18. ¿El servicio sanitario cuenta con biodigestor?')).toBeInTheDocument()
      expect(screen.getByText('P20. ¿Esta vivienda tiene drenaje conectado a...')).toBeInTheDocument()
      expect(screen.getByText('P21. ¿En esta vivienda la luz eléctrica la obtienen...')).toBeInTheDocument()
      expect(screen.getByText('P23. ¿El combustible que más usan para cocinar es...')).toBeInTheDocument()
      expect(screen.getByText('P25. ¿La basura de esta vivienda...')).toBeInTheDocument()
    })
  })

  describe('conditional fields — Section I', () => {
    it('shows duermenEnCocina only when tieneCuartoCocina = 1', async () => {
      render(<HogaresViviendaStep />)
      // Initially duermenEnCocina should not be visible
      expect(screen.queryByText('P7. ¿En el cuarto donde cocinan, también duermen?')).not.toBeInTheDocument()
      // Set tieneCuartoCocina = '1'
      const cocinaInput = document.getElementById('code-tieneCuartoCocina') as HTMLInputElement
      fireEvent.change(cocinaInput, { target: { value: '1' } })
      expect(await screen.findByText('P7. ¿En el cuarto donde cocinan, también duermen?')).toBeInTheDocument()
    })

    it('shows aguaOrigen only when aguaTipo is 1 or 2', async () => {
      render(<HogaresViviendaStep />)
      // Initially aguaOrigen should not be visible
      expect(screen.queryByText('P12. ¿El agua proviene...')).not.toBeInTheDocument()
      // Set aguaTipo = '1'
      const aguaInput = document.getElementById('code-aguaTipo') as HTMLInputElement
      fireEvent.change(aguaInput, { target: { value: '1' } })
      expect(await screen.findByText('P12. ¿El agua proviene...')).toBeInTheDocument()
    })

    it('hides aguaOrigen when aguaTipo is 3 (no entubada)', async () => {
      render(<HogaresViviendaStep />)
      const aguaInput = document.getElementById('code-aguaTipo') as HTMLInputElement
      // Set to '1' → shows
      fireEvent.change(aguaInput, { target: { value: '1' } })
      expect(await screen.findByText('P12. ¿El agua proviene...')).toBeInTheDocument()
      // Set to '3' → hides
      fireEvent.change(aguaInput, { target: { value: '3' } })
      expect(screen.queryByText('P12. ¿El agua proviene...')).not.toBeInTheDocument()
    })

    it('shows numeroFocos and focosAhorradores only when tieneElectricidad has power', async () => {
      render(<HogaresViviendaStep />)
      expect(screen.queryByText('P22. ¿Cuántos focos tiene esta vivienda?')).not.toBeInTheDocument()
      expect(screen.queryByText('P22.1 ¿Cuántos focos son ahorradores?')).not.toBeInTheDocument()
      const elecInput = document.getElementById('code-tieneElectricidad') as HTMLInputElement
      fireEvent.change(elecInput, { target: { value: '1' } })
      expect(await screen.findByText('P22. ¿Cuántos focos tiene esta vivienda?')).toBeInTheDocument()
      expect(screen.getByText('P22.1 ¿Cuántos focos son ahorradores?')).toBeInTheDocument()
    })

    it('shows sanitarioCompartido and sanitarioAgua when tipoSanitario is 1 or 2', async () => {
      render(<HogaresViviendaStep />)
      expect(screen.queryByText('P16. ¿La taza de baño (letrina) es compartida con otra vivienda?')).not.toBeInTheDocument()
      const sanitarioInput = document.getElementById('code-tipoSanitario') as HTMLInputElement
      fireEvent.change(sanitarioInput, { target: { value: '1' } })
      expect(await screen.findByText('P16. ¿La taza de baño (letrina) es compartida con otra vivienda?')).toBeInTheDocument()
      expect(screen.getByText('P17. ¿La taza de baño (letrina)...')).toBeInTheDocument()
    })
  })

  describe('rendering — Section II: Residentes', () => {
    it('renders Section II header "Residentes del Hogar"', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText(/II\. Residentes del Hogar/)).toBeInTheDocument()
    })

    it('renders "Agregar Integrante" button', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByRole('button', { name: /Agregar Integrante/i })).toBeInTheDocument()
    })

    it('starts with no integrantes and shows message to add one', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText(/No hay integrantes/i)).toBeInTheDocument()
    })

    it('adds an integrante when "Agregar Integrante" is clicked', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      const addBtn = screen.getByRole('button', { name: /Agregar Integrante/i })
      await user.click(addBtn)
      expect(useAppStore.getState().hogares.integrantes).toHaveLength(1)
      expect(useAppStore.getState().hogares.integrantes[0].numPer).toBe('01')
    })

    it('adds a second integrante with numPer 02', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      const addBtn = screen.getByRole('button', { name: /Agregar Integrante/i })
      await user.click(addBtn)
      await user.click(addBtn)
      expect(useAppStore.getState().hogares.integrantes).toHaveLength(2)
      expect(useAppStore.getState().hogares.integrantes[1].numPer).toBe('02')
    })

    it('renders integrante fields: Nombre, Parentesco, Sexo, Edad, etc.', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Parentesco')).toBeInTheDocument()
      expect(screen.getByText('Sexo')).toBeInTheDocument()
      expect(screen.getByText('Edad')).toBeInTheDocument()
      expect(screen.getByText('Fecha de Nacimiento')).toBeInTheDocument()
      expect(screen.getByText('Estado Civil')).toBeInTheDocument()
      expect(screen.getByText('¿Sabe leer y escribir?')).toBeInTheDocument()
      expect(screen.getByText('Nivel Escolaridad')).toBeInTheDocument()
      expect(screen.getByText('¿Asiste a la escuela?')).toBeInTheDocument()
    })

    it('shows NUMPER as read-only with value 01', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      // NUMPER is rendered as read-only text — verify the store has numPer '01'
      expect(useAppStore.getState().hogares.integrantes[0].numPer).toBe('01')
    })

    it('can remove an integrante (not the last one)', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      const addBtn = screen.getByRole('button', { name: /Agregar Integrante/i })
      await user.click(addBtn)
      await user.click(addBtn)
      expect(useAppStore.getState().hogares.integrantes).toHaveLength(2)
      // Remove the second integrante
      const removeBtns = screen.getAllByRole('button', { name: /Eliminar/i })
      // Click the last one (second integrante)
      await user.click(removeBtns[removeBtns.length - 1])
      expect(useAppStore.getState().hogares.integrantes).toHaveLength(1)
      confirmSpy.mockRestore()
    })
  })

  describe('rendering — Section III: Ingresos', () => {
    it('renders Section III header "Ingresos de los Integrantes"', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      // Set edad to 12+ so income section shows
      const edadInput = screen.getByPlaceholderText('0-120')
      fireEvent.change(edadInput, { target: { value: '25' } })
      expect(screen.getByText(/III\. Ingresos/)).toBeInTheDocument()
    })

    it('does NOT show income section for integrantes under 12', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      // Edad defaults to 0 (under 12)
      // Should NOT show "Trabajó la semana pasada"
      expect(screen.queryByText('¿Trabajó la semana pasada?')).not.toBeInTheDocument()
    })

    it('shows conditional trabajo fields when trabajoSemanaPasada = 1', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      // Set edad >= 12
      const edadInput = screen.getByPlaceholderText('0-120')
      fireEvent.change(edadInput, { target: { value: '25' } })
      // Set trabajoSemanaPasada = '1' via the CodeInput element id
      const trabajoCodeInput = document.getElementById('code-ingreso-01-trabajoSemanaPasada') as HTMLInputElement
      fireEvent.change(trabajoCodeInput, { target: { value: '1' } })
      // Conditional fields should appear
      expect(await screen.findByText('Ocupación principal')).toBeInTheDocument()
      expect(screen.getByText('Tipo de trabajo')).toBeInTheDocument()
      expect(screen.getByText('Horas trabajadas')).toBeInTheDocument()
      expect(screen.getByText('Ingreso mensual')).toBeInTheDocument()
      expect(screen.getByText('¿Tiene otro trabajo?')).toBeInTheDocument()
    })
  })

  describe('rendering — Section IV: Alimentación', () => {
    it('renders Section IV header and 6 Yes/No questions', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText(/IV\. Acceso a la Alimentación/)).toBeInTheDocument()
      expect(screen.getByText('¿Los alimentos fueron de poca variedad?')).toBeInTheDocument()
      expect(screen.getByText('¿Dejó de comer algún alimento?')).toBeInTheDocument()
      expect(screen.getByText('¿Comió menos de lo que debía?')).toBeInTheDocument()
      expect(screen.getByText('¿Se quedó sin comida?')).toBeInTheDocument()
      expect(screen.getByText('¿Sintió hambre pero no comió?')).toBeInTheDocument()
      expect(screen.getByText('¿Comió solo una vez al día?')).toBeInTheDocument()
    })
  })

  describe('rendering — Section VII: Cambio Climático', () => {
    it('renders Section VII header and 5 Yes/No questions', () => {
      render(<HogaresViviendaStep />)
      expect(screen.getByText(/VII\. Cambio Climático/)).toBeInTheDocument()
      expect(screen.getByText('¿Hubo sequía?')).toBeInTheDocument()
      expect(screen.getByText('¿Hubo inundación?')).toBeInTheDocument()
      expect(screen.getByText('¿Hubo helada?')).toBeInTheDocument()
      expect(screen.getByText('¿Hubo incendio?')).toBeInTheDocument()
      expect(screen.getByText('¿Hubo huracán?')).toBeInTheDocument()
    })
  })

  describe('data persistence', () => {
    it('persists claseVivienda to store on change', () => {
      render(<HogaresViviendaStep />)
      const input = document.getElementById('code-claseVivienda') as HTMLInputElement
      fireEvent.change(input, { target: { value: '2' } })
      expect(useAppStore.getState().hogares.claseVivienda).toBe('2')
    })

    it('persists integrante nombre to store on change', async () => {
      const user = userEvent.setup()
      render(<HogaresViviendaStep />)
      await user.click(screen.getByRole('button', { name: /Agregar Integrante/i }))
      // Find the integrante's nombre input
      const nombreInput = screen.getByPlaceholderText('Nombre completo')
      fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } })
      expect(useAppStore.getState().hogares.integrantes[0].nombre).toBe('Juan Pérez')
    })
  })
})
