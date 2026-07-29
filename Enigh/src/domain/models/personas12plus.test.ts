import { describe, it, expect } from 'vitest'
import type { Persona12PlusData, Personas12PlusSection } from './personas12plus'

describe('Persona12PlusData', () => {
  it('holds all 6 sub-sections of fields', () => {
    const persona: Persona12PlusData = {
      folioViv: '1234567890',
      folioHog: '1',
      numPer: '01',
      nombre: 'Juan',
      edad: 47,
      sexo: '1',
      parentesco: '1',
      // Educación
      nivelAprobado: '09',
      asisteEscuela: '2',
      sabeLeerEscribir: '1',
      // Salud
      tieneDerechohabiencia: '1',
      institucionSalud: '1',
      problemaSalud2Semanas: '2',
      fuma: '2',
      consumeAlcohol: '1',
      frecuenciaAlcohol: 'Semanal',
      // Actividad Económica
      trabajoSemanaPasada: '1',
      ocupacionPrincipal: 'Maestro',
      tipoTrabajo: '1',
      horasTrabajadas: 40,
      ingresoMensualNeto: 15000,
      recibeAguinaldo: '1',
      recibeVacaciones: '1',
      contratoEscrito: '1',
      prestacionesLey: '1',
      tieneOtroTrabajo: '2',
      // Ingresos No Laborales
      recibeJubilacion: '2',
      recibeRemesas: '2',
      recibeProgGobierno: '1',
      progGobiernoNombre: 'Bienestar',
      progGobiernoMonto: 2500,
      progGobiernoPeriodicidad: '3',
      recibeAyudaOtros: '1',
      ayudaMonto: 500,
      ayudaPeriodicidad: '1',
      // Gastos Personales
      gastosTransporte: 200,
      gastosComidasFuera: 150,
      gastosCuidadoPersonal: 100,
      gastosEntretenimiento: 50,
    }
    expect(persona.nivelAprobado).toBe('09')
    expect(persona.trabajoSemanaPasada).toBe('1')
    expect(persona.gastosEntretenimiento).toBe(50)
  })

  it('allows optional conditional fields to be omitted', () => {
    const persona: Persona12PlusData = {
      folioViv: '1234567890',
      folioHog: '1',
      numPer: '02',
      nombre: 'María',
      edad: 16,
      sexo: '2',
      parentesco: '3',
      nivelAprobado: '07',
      asisteEscuela: '1',
      sabeLeerEscribir: '1',
      tieneDerechohabiencia: '2',
      problemaSalud2Semanas: '2',
      fuma: '2',
      consumeAlcohol: '2',
      trabajoSemanaPasada: '2',
      buscaTrabajo: '1',
      motivoNoTrabaja: 'Estudia',
      recibeJubilacion: '2',
      recibeRemesas: '2',
      recibeProgGobierno: '2',
      recibeAyudaOtros: '2',
    }
    expect(persona.ocupacionPrincipal).toBeUndefined()
    expect(persona.buscaTrabajo).toBe('1')
  })
})

describe('Personas12PlusSection', () => {
  it('holds an array of personas', () => {
    const section: Personas12PlusSection = { personas: [] }
    expect(section.personas).toEqual([])
  })
})