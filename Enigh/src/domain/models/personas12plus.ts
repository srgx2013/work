import type { SharedFolioFields, YesNo } from './shared'

export type Persona12PlusData = SharedFolioFields & {
  numPer: string
  nombre: string
  edad: number
  sexo: string
  parentesco: string

  // II. Educación
  nivelAprobado: string
  asisteEscuela: YesNo
  tipoEscuela?: string
  sabeLeerEscribir: YesNo

  // III. Salud
  tieneDerechohabiencia: YesNo
  institucionSalud?: string
  problemaSalud2Semanas: YesNo
  fuma: YesNo
  consumeAlcohol: YesNo
  frecuenciaAlcohol?: string

  // IV. Actividad Económica
  trabajoSemanaPasada: YesNo
  ocupacionPrincipal?: string
  tipoTrabajo?: string
  horasTrabajadas?: number
  ingresoMensualNeto?: number
  recibeAguinaldo?: string
  recibeVacaciones?: string
  contratoEscrito?: string
  prestacionesLey?: string
  tieneOtroTrabajo?: string
  buscaTrabajo?: string
  motivoNoTrabaja?: string

  // V. Ingresos No Laborales
  recibeJubilacion: YesNo
  recibeRemesas: YesNo
  recibeProgGobierno: YesNo
  progGobiernoNombre?: string
  progGobiernoMonto?: number
  progGobiernoPeriodicidad?: string
  recibeAyudaOtros: YesNo
  ayudaMonto?: number
  ayudaPeriodicidad?: string

  // VI. Gastos Personales
  gastosTransporte?: number
  gastosComidasFuera?: number
  gastosCuidadoPersonal?: number
  gastosEntretenimiento?: number
}

export type Personas12PlusSection = {
  personas: Persona12PlusData[]
}