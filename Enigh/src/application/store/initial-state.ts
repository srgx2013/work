// Initial state factory functions for all questionnaire data slices.
// Each returns a fully empty/default object matching the domain TypeScript interfaces.
// Empty strings serve as "unfilled" sentinels for code fields until the user enters data.

import type { PortadaData } from '@/domain/models/portada'
import type { HogaresViviendaData } from '@/domain/models/hogares'
import type { Menores12Section } from '@/domain/models/menores12'
import type { Personas12PlusSection } from '@/domain/models/personas12plus'
import type { NegociosData } from '@/domain/models/negocios'
import type { GastosHogarData } from '@/domain/models/gastosHogar'
import type { GastosDiariosData, DiaGastos } from '@/domain/models/gastosDiarios'
import type { TimerData } from '@/domain/models/timer'

export function createInitialPortada(): PortadaData {
  return {
    entidad: '',
    folioViv: '',
    folioHog: '',
    decena: '',
    nombreEntrevistador: '',
    nombreSupervisor: '',
    resultadoEntrevista: '',
    fechaInicio: '',
    fechaTermino: '',
    observaciones: '',
  } as unknown as PortadaData
}

export function createInitialHogares(): HogaresViviendaData {
  return {
    folioViv: '',
    folioHog: '',
    // Section I — Vivienda (P1–P33)
    claseVivienda: '',
    materialParedes: '',
    materialTecho: '',
    materialPiso: '',
    tieneCuartoCocina: '' as never,
    duermenEnCocina: '',
    numeroDormitorios: 0,
    numeroCuartos: 0,
    lugarCocina: '',
    aguaTipo: '',
    aguaOrigen: '',
    aguaAcarreo: '',
    aguaDiasSemana: '',
    tipoSanitario: '',
    sanitarioCompartido: '',
    sanitarioAgua: '',
    biodigestor: '',
    banosConExcReg: undefined,
    banosSoloExc: undefined,
    banosSoloReg: undefined,
    drenaje: '',
    tieneElectricidad: '' as never,
    fogonChimenea: '',
    combustibleCocina: '',
    eliminaBasura: '',
    tenencia: '',
    montoRentaMensual: undefined,
    estimacionRenta: undefined,
    pagoMensual: undefined,
    pagoMesPasado: '',
    adquisicion: '',
    viviendaUsada: '',
    financiamiento: [],
    escritura: '',
    equipamiento: {},
    problemasEstructurales: {},
    bienes: [],
    // Section II — Residentes
    integrantes: [],
    // Section III — Ingresos
    ingresosIntegrantes: [],
    // Section IV — Alimentación
    alimentosPocaVariedad: '' as never,
    alimentosDejoComida: '' as never,
    alimentosComioMenos: '' as never,
    alimentosSinComida: '' as never,
    alimentosSintioHambre: '' as never,
    alimentosUnaVez: '' as never,
    // Section VII — Cambio Climático
    climaSequia: '' as never,
    climaInundacion: '' as never,
    climaHelada: '' as never,
    climaIncendio: '' as never,
    climaHuracan: '' as never,
  } as HogaresViviendaData
}

export function createInitialMenores12(): Menores12Section {
  return { menores: [] }
}

export function createInitialPersonas12Plus(): Personas12PlusSection {
  return { personas: [] }
}

export function createInitialNegocios(): NegociosData {
  return {
    folioViv: '',
    folioHog: '',
    tieneNegocio: '2',
    negocios: [],
  } as NegociosData
}

export function createInitialGastosHogar(): GastosHogarData {
  return {
    folioViv: '',
    folioHog: '',
    // All 43 amount fields default to undefined
  } as GastosHogarData
}

const DAY_NAMES: DiaGastos['nombreDia'][] = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
]

export function createInitialGastosDiarios(): GastosDiariosData {
  const dias: DiaGastos[] = DAY_NAMES.map((nombreDia, i) => ({
    diaNumero: (i + 1) as DiaGastos['diaNumero'],
    nombreDia,
    fecha: '',
    gastos: [],
  }))

  return {
    folioViv: '',
    folioHog: '',
    informanteNumPer: '',
    dias,
    estimacionMensual: {},
  }
}

const STEP_LABELS: Record<number, string> = {
  1: 'Portada',
  2: 'Hogares y Vivienda',
  3: 'Menores de 12 años',
  4: 'Personas de 12+ años',
  5: 'Negocios del Hogar',
  6: 'Gastos del Hogar',
  7: 'Gastos Diarios',
}

export function createInitialTimer(): TimerData {
  const entries: Record<number, TimerData['entries'][number]> = {}
  for (let step = 1; step <= 7; step++) {
    entries[step] = {
      step,
      stepLabel: STEP_LABELS[step],
      elapsedSeconds: 0,
      status: 'stopped',
    }
  }

  return {
    entries,
    totalElapsedSeconds: 0,
    isRunning: false,
    currentStep: 1,
  }
}
