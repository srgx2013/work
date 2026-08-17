import type { SharedFolioFields, YesNo } from './shared'

export type Integrante = {
  numPer: string          // 01-99, auto-assigned
  nombre: string
  parentesco: string      // ParentescoCode (1-9)
  sexo: string            // SexoCode (1-2)
  edad: number
  fechaNacimiento: string // DD/MM/AAAA
  estadoCivil: string     // EstadoCivilCode (1-6)
  sabeLeerEscribir: YesNo
  nivelEscolaridad: string // EscolaridadCode (00-16)
  asisteEscuela: YesNo
  // Sección III — Sociodemográficos (para TODAS las personas)
  viveMadre: YesNo           // Q5 — ¿Vive la madre?
  madreNumPer?: string        // Q5.1 — ¿Quién es?
  vivePadre: YesNo           // Q6 — ¿Vive el padre?
  padreNumPer?: string        // Q6.1 — ¿Quién es?
  lugarNacimiento: string    // Q7 — 1-4 catalog
  afrodescendiente: YesNo    // Q8
  discapacidad: Record<string, string>  // Q9 A-H, valores 1-4
  hablaLenguaIndigena: YesNo // Q12
  lenguaIndigena?: string     // Q13 — nombre de la lengua
  hablaEspanol?: YesNo       // Q14 — conditional
  entiendeLenguaIndigena?: YesNo // Q15 — conditional
  autoAdscripcionIndigena: YesNo // Q16
}

export type IngresoIntegrante = {
  numPer: string
  trabajoSemanaPasada: string
  ocupacionPrincipal?: string
  tipoTrabajo?: string
  horasTrabajadas?: number
  ingresoMensualTrabajo?: number
  tieneOtroTrabajo?: string
  recibeJubilacion: string
  recibeProgGobierno: string
  progGobiernoNombre?: string
  progGobiernoMonto?: number
  progGobiernoPeriodicidad?: string
}

export type HogaresViviendaData = SharedFolioFields & {
  // Section I — Vivienda (P1–P33)
  // P1
  claseVivienda: string
  // P2
  materialParedes: string
  // P3
  materialTecho: string
  // P4
  materialPiso: string
  // P5
  antiguedadVivienda?: number
  // P6
  tieneCuartoCocina: YesNo
  // P7 (conditional on P6 = 1)
  duermenEnCocina?: string
  // P8
  numeroDormitorios: number
  // P9
  numeroCuartos: number
  // P10 (conditional on P6 context)
  lugarCocina?: string
  // P11
  aguaTipo: string
  // P12 (conditional on P11 = 1 or 2)
  aguaOrigen?: string
  // P13 (conditional on P11 = 3)
  aguaAcarreo?: string
  // P14
  aguaDiasSemana?: string
  // P15
  tipoSanitario?: string
  // P16 (conditional on P15 = 1 or 2)
  sanitarioCompartido?: string
  // P17 (conditional on P15 = 1 or 2)
  sanitarioAgua?: string
  // P18
  biodigestor?: string
  // P19
  banosConExcReg?: number
  banosSoloExc?: number
  banosSoloReg?: number
  // P20
  drenaje: string
  // P21
  tieneElectricidad: YesNo
  // P22 (conditional on P21 = 1)
  numeroFocos?: number
  focosAhorradores?: number
  // P23
  combustibleCocina: string
  // P24 (conditional on P23 = 1 or 2)
  fogonChimenea?: string
  // P25
  eliminaBasura: string
  // P26
  tenencia?: string
  // P26.1 (conditional on tenencia = 1)
  montoRentaMensual?: number
  // P26.2 (conditional on tenencia = 2 or 4 or 5)
  estimacionRenta?: number
  // P26.3 (conditional on tenencia = 3)
  pagoMensual?: number
  // P26.4 (conditional on tenencia = 3)
  pagoMesPasado?: string
  // P27
  adquisicion?: string
  // P28 (conditional on P27 = 1)
  viviendaUsada?: string
  // P29 (up to 3 codes)
  financiamiento?: string[]
  // P30
  duenoViviendaNombres?: string
  duenoViviendaNR?: string
  duenoViviendaNH?: string
  // P31
  escritura?: string
  // P32
  equipamiento?: Record<string, string>
  // P33
  problemasEstructurales?: Record<string, string>
  
  // Bienes (legacy free-text or catalog field)
  bienes: string[]

  // Section II — Residentes e Identificación de Hogares
  // Q1
  totalPersonas?: number
  // Q2
  compartenGasto: YesNo
  // Q3 (conditional on Q2 = 2)
  hogaresGastoSeparado?: number
  // Q4
  tieneHuespedes: YesNo
  // Q5 (conditional on Q4 = 1)
  totalHuespedes?: number
  // Q6 (conditional on Q4 = 1)
  huespedesPaganComida?: number
  // Q7
  tieneTrabajoDomestico: YesNo
  // Q8 (conditional on Q7 = 1)
  totalTrabajoDomestico?: number
  // Q9 (conditional on Q7 = 1)
  trabajoDomesticoComen?: number

  integrantes: Integrante[]

  // Section III — Ingresos
  ingresosIntegrantes: IngresoIntegrante[]

  // Section IV — Alimentación
  alimentosPocaVariedad: YesNo
  alimentosDejoComida: YesNo
  alimentosComioMenos: YesNo
  alimentosSinComida: YesNo
  alimentosSintioHambre: YesNo
  alimentosUnaVez: YesNo

  // Section VII — Cambio Climático
  climaSequia: YesNo
  climaInundacion: YesNo
  climaHelada: YesNo
  climaIncendio: YesNo
  climaHuracan: YesNo
}"