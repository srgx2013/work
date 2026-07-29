import type { SharedFolioFields, YesNo } from './shared'

export type Negocio = {
  id: string
  numPerOperador: string
  tipoNegocio: string
  esActividadPrincipal: YesNo
  tieneLocal: YesNo
  llevaContabilidad: YesNo
  dadoAltaHacienda: YesNo
  ingresoMensual: number
  gastosMensuales: number
}

export type NegociosData = SharedFolioFields & {
  tieneNegocio: YesNo
  negocios: Negocio[]
}