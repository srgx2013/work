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
  // Q19 — Razón de no asistencia escolar
  razonNoAsisteEscuela?: string
  // Q20 — Nivel al que asiste
  nivelEducativo?: string

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

  // VII. Becas (Q22-24)
  recibeBeca: YesNo
  quienOtorgaBeca?: string
  comoRecibeBeca?: string

  // VIII. Créditos educativos (Q25-27)
  recibeCreditoEducativo: YesNo
  quienOtorgaCredito?: string
  comoRecibeCredito?: string

  // IX. Antecedente escolar (Q29)
  antecedenteEscolar?: string

  // X. Residencia hace 5 años (Q30)
  residenciaHace5Anios?: string

  // XI. Situación conyugal e hijos (Q31-35)
  situacionConyugal?: string  // 1-8 catalog
  viveConyugeEnHogar?: YesNo
  conyugeNombre?: string
  conyugeNumPer?: string
  hijosNacidosVivos?: number  // Q35 — solo para mujeres
}

export type Personas12PlusSection = {
  personas: Persona12PlusData[]
}