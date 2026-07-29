import { describe, it, expect } from 'vitest'
import type { Integrante, IngresoIntegrante, HogaresViviendaData } from './hogares'

describe('Integrante', () => {
  it('holds all integrante fields', () => {
    const integrante: Integrante = {
      numPer: '01',
      nombre: 'Juan',
      parentesco: '1',
      sexo: '1',
      edad: 47,
      fechaNacimiento: '15/03/1977',
      estadoCivil: '2',
      sabeLeerEscribir: '1',
      nivelEscolaridad: '09',
      asisteEscuela: '2',
    }
    expect(integrante.numPer).toBe('01')
    expect(integrante.edad).toBe(47)
    expect(integrante.parentesco).toBe('1')
  })
})

describe('IngresoIntegrante', () => {
  it('holds required fields when not working', () => {
    const ingreso: IngresoIntegrante = {
      numPer: '01',
      trabajoSemanaPasada: '2',
      recibeJubilacion: '2',
      recibeProgGobierno: '1',
      progGobiernoNombre: 'Bienestar',
      progGobiernoMonto: 2500,
      progGobiernoPeriodicidad: '3',
    }
    expect(ingreso.trabajoSemanaPasada).toBe('2')
    expect(ingreso.progGobiernoMonto).toBe(2500)
  })

  it('holds conditional fields when working', () => {
    const ingreso: IngresoIntegrante = {
      numPer: '01',
      trabajoSemanaPasada: '1',
      ocupacionPrincipal: 'Maestro',
      tipoTrabajo: '1',
      horasTrabajadas: 40,
      ingresoMensualTrabajo: 15000,
      tieneOtroTrabajo: '2',
      recibeJubilacion: '2',
      recibeProgGobierno: '2',
    }
    expect(ingreso.ocupacionPrincipal).toBe('Maestro')
    expect(ingreso.horasTrabajadas).toBe(40)
  })
})

describe('HogaresViviendaData', () => {
  it('holds all sections I, II, III, IV, VII', () => {
    const data: HogaresViviendaData = {
      folioViv: '1234567890',
      folioHog: '1',
      claseVivienda: '1',
      materialParedes: '8',
      materialTecho: '10',
      materialPiso: '3',
      antiguedadVivienda: 10,
      tieneCuartoCocina: '1',
      duermenEnCocina: '2',
      numeroDormitorios: 2,
      numeroCuartos: 4,
      aguaTipo: '1',
      aguaOrigen: '1',
      drenaje: '1',
      tieneElectricidad: '1',
      numeroFocos: 10,
      focosAhorradores: 5,
      combustibleCocina: '3',
      eliminaBasura: '1',
      bienes: ['1', '4', '7'],
      integrantes: [],
      ingresosIntegrantes: [],
      alimentosPocaVariedad: '2',
      alimentosDejoComida: '2',
      alimentosComioMenos: '2',
      alimentosSinComida: '2',
      alimentosSintioHambre: '2',
      alimentosUnaVez: '2',
      climaSequia: '2',
      climaInundacion: '2',
      climaHelada: '2',
      climaIncendio: '2',
      climaHuracan: '2',
    }
    expect(data.integrantes).toEqual([])
    expect(data.bienes).toEqual(['1', '4', '7'])
    expect(data.numeroCuartos).toBe(4)
    expect(data.alimentosPocaVariedad).toBe('2')
    expect(data.climaHuracan).toBe('2')
  })
})