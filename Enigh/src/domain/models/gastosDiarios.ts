import type { SharedFolioFields } from './shared'

export type GastoDiario = {
  id: string
  concepto: string
  monto: number
}

export type DiaGastos = {
  diaNumero: 1 | 2 | 3 | 4 | 5 | 6 | 7
  nombreDia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  fecha: string // DD/MM/AAAA
  gastos: GastoDiario[]
}

export type EstimacionMensual = {
  tortilleria?: number
  carniceria?: number
  verduleria?: number
  abarrotes?: number
  transporte?: number
  gasolina?: number
}

export type GastosDiariosData = SharedFolioFields & {
  informanteNumPer: string
  dias: DiaGastos[]
  estimacionMensual: EstimacionMensual
}