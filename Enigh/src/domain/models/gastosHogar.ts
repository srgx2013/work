import type { SharedFolioFields } from './shared'

export type GastosHogarData = SharedFolioFields & {
  // Section I — Alimentos, Bebidas y Tabaco
  alimentosCarnes?: number
  alimentosCereales?: number
  alimentosVerduras?: number
  alimentosFrutas?: number
  alimentosLacteos?: number
  alimentosHuevo?: number
  alimentosAceites?: number
  alimentosAzucar?: number
  alimentosCafe?: number
  alimentosBebidasNoAlcohol?: number
  alimentosBebidasAlcohol?: number
  alimentosFueraHogar?: number
  alimentosOtros?: number

  // Section II — Transporte y Comunicaciones
  transportePublico?: number
  gasolina?: number
  mantenimientoAuto?: number
  telefonoCelular?: number
  internet?: number

  // Section III — Vivienda y Servicios
  viviendaRenta?: number
  viviendaElectricidad?: number
  viviendaAgua?: number
  viviendaGas?: number
  viviendaPredial?: number
  viviendaMantenimiento?: number

  // Section IV — Educación y Esparcimiento
  educacionUtiles?: number
  educacionUniformes?: number
  educacionCuotas?: number
  educacionEntretenimiento?: number

  // Section V — Salud
  saludMedicamentos?: number
  saludConsultas?: number
  saludLentes?: number

  // Section VI — Vestido y Calzado
  vestidoRopa?: number
  vestidoCalzado?: number

  // Section VII — Cuidados Personales
  cuidadosHigiene?: number
  cuidadosEstetica?: number
  cuidadosPañales?: number

  // Section VIII — Enseres Domésticos y Limpieza
  enseresDetergentes?: number
  enseresUtensilios?: number
  enseresBlancos?: number
}