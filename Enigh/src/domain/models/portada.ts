import type { SharedFolioFields, DecenaCode, ResultadoEntrevista } from './shared'

export type PortadaData = SharedFolioFields & {
  entidad: string         // 2-digit EntidadCode
  decena: DecenaCode
  nombreEntrevistador: string
  nombreSupervisor: string
  resultadoEntrevista: ResultadoEntrevista
  fechaInicio: string    // DD/MM/AAAA
  fechaTermino: string   // DD/MM/AAAA
  observaciones: string
}

export type CompleteFolioData = {
  portada: PortadaData
  hogares: unknown
  menores12: unknown
  personas12plus: unknown
  negocios: unknown
  gastosHogar: unknown
  gastosDiarios: unknown
  timer: unknown
}