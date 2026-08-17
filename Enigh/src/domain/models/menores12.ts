import type { SharedFolioFields, YesNo, YesNoUnk } from './shared'

export type Menor12Data = SharedFolioFields & {
  numPer: string
  nombre: string
  edad: number
  sexo: string

  // Salud
  tieneDerechohabiencia: YesNo
  institucionSalud?: string
  problemaSalud2Semanas: YesNo
  vacunacionCompleta: YesNoUnk

  // Educación
  asisteEscuela: YesNo
  gradoEscolar?: string
  tipoEscuela?: string
  recibeBeca: YesNo
  // Q10-Q11 — Educación inicial (0-2 años)
  asistenciaEducacionInicial?: string
  razonNoAsistenciaInicial?: string
  // Q19 — Razón de no asistencia escolar
  razonNoAsisteEscuela?: string
  // Q20 — Nivel al que asiste
  nivelEducativo?: string

  // Cuidado
  quienCuida: string
}

export type Menores12Section = {
  menores: Menor12Data[]
}