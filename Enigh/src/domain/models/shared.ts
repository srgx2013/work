// Shared domain types and runtime constants for the ENIGH IKTAN Simulator.
// All closed-answer fields use numeric string codes (matching INEGI conventions).

// ── Shared folio fields (repeated in every questionnaire) ──

export type SharedFolioFields = {
  folioViv: string  // exactly 10 numeric digits
  folioHog: string  // exactly 1 digit, range 1–5
}

// ── Yes/No type ──

export type YesNo = '1' | '2'           // 1=Sí, 2=No
export type YesNoUnk = '1' | '2' | '9'  // 9=No sabe

export const YES_NO_VALUES: readonly YesNo[] = ['1', '2']
export const YES_NO_UNK_VALUES: readonly YesNoUnk[] = ['1', '2', '9']

// ── Catalog code types ──

export type EntidadCode =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08'
  | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16'
  | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24'
  | '25' | '26' | '27' | '28' | '29' | '30' | '31' | '32'

export const ENTIDAD_CODES: readonly EntidadCode[] = Array.from(
  { length: 32 },
  (_, i) => String(i + 1).padStart(2, '0') as EntidadCode
)

export type DecenaCode = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type ResultadoEntrevista = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7'

export const RESULTADO_ENTREVISTA_CODES: readonly ResultadoEntrevista[] = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'
]

export type ParentescoCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type SexoCode = '1' | '2'  // 1=Hombre, 2=Mujer

export type EstadoCivilCode = '1' | '2' | '3' | '4' | '5' | '6'

export type EscolaridadCode =
  | '00' | '01' | '02' | '03' | '04' | '05' | '06'
  | '07' | '08' | '09' | '10' | '11' | '12' | '13'
  | '14' | '15' | '16'

export type TipoTrabajoCode = '1' | '2' | '3' | '4'

export type DerechohabienciaCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

export type TipoEscuelaCode = '1' | '2'

export type QuienCuidaCode = '1' | '2' | '3' | '4'

export type ClaseViviendaCode = '1' | '2' | '3' | '4' | '5' | '6' | '7'

export type MaterialCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type MaterialPisoCode = '1' | '2' | '3'

export type OrigenAguaCode = '1' | '2' | '3' | '4' | '5' | '6'

export type DrenajeCode = '1' | '2' | '3' | '4' | '5'

export type CombustibleCode = '1' | '2' | '3' | '4'

export type BasuraCode = '1' | '2' | '3' | '4' | '5' | '6' | '7'

// ── Runtime validation helpers ──

export function isValidEntidadCode(code: string): code is EntidadCode {
  return ENTIDAD_CODES.includes(code as EntidadCode)
}

export function isValidResultadoEntrevista(code: string): code is ResultadoEntrevista {
  return RESULTADO_ENTREVISTA_CODES.includes(code as ResultadoEntrevista)
}

export function isValidYesNo(code: string): code is YesNo {
  return YES_NO_VALUES.includes(code as YesNo)
}

export function isValidYesNoUnk(code: string): code is YesNoUnk {
  return YES_NO_UNK_VALUES.includes(code as YesNoUnk)
}