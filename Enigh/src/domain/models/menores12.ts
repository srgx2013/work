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

  // Cuidado
  quienCuida: string
}

export type Menores12Section = {
  menores: Menor12Data[]
}