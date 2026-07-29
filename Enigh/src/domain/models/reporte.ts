export type FolioStatus = 'CONCLUIDO' | 'INCOMPLETO'

export type ReporteData = {
  // Estado del folio
  folioStatus: FolioStatus

  // Datos generales
  folioViv: string
  folioHog: string
  entidad: string
  entidadNombre: string
  entrevistador: string
  fechaInicio: string
  fechaTermino: string

  // Residentes
  totalIntegrantes: number

  // Ingresos
  ingresoLaboralTotal: number
  otrosIngresosTotal: number
  ingresoTotal: number

  // Gastos
  gastosTrimestralTotal: number
  gastosDiariosTotal: number
  gastosDiariosEstimado: number

  // Tiempos
  tiempoTotal: number
  tiemposPorStep: Record<number, number>

  // Alertas
  warnings: string[]
}