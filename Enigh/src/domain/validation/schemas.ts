import { z } from 'zod'

// ── Shared primitive schemas ──

export const folioVivSchema = z
  .string()
  .length(10, 'FOLIOVIV debe contener exactamente 10 dígitos numéricos')
  .regex(/^\d{10}$/, 'FOLIOVIV debe contener solo dígitos numéricos')

export const folioHogSchema = z
  .string()
  .length(1, 'FOLIOHOG debe ser 1 dígito')
  .regex(/^[1-5]$/, 'FOLIOHOG debe ser un dígito del 1 al 5')

export const yesNoSchema = z.enum(['1', '2'], {
  message: 'Seleccione 1=Sí o 2=No',
})

export const yesNoUnkSchema = z.enum(['1', '2', '9'], {
  message: 'Seleccione 1=Sí, 2=No o 9=No sabe',
})

export const moneySchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Ingrese el monto sin signo de pesos ni comas (ej: 18500.00)')
  .refine((val) => Number(val) >= 0, 'El monto no puede ser negativo')

export const dateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato de fecha inválido (DD/MM/AAAA)')
  .refine(
    (val) => {
      const [d, m, y] = val.split('/').map(Number)
      if (m < 1 || m > 12) return false
      if (d < 1 || d > 31) return false
      const dt = new Date(y, m - 1, d)
      return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    },
    'Fecha inválida (DD/MM/AAAA)'
  )

export const codigoEntidadSchema = z
  .string()
  .length(2, 'ENTIDAD debe ser 2 dígitos')
  .regex(/^(0[1-9]|[12]\d|3[0-2])$/, 'ENTIDAD debe ser un código de 2 dígitos (01–32)')

export const decenaSchema = z
  .string()
  .length(1, 'DECENA debe ser 1 dígito')
  .regex(/^[0-9]$/, 'DECENA debe ser un dígito del 1 al 9, o 0 para decena 10')

export const resultadoEntrevistaSchema = z.enum(
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
  { message: 'Seleccione un resultado de entrevista válido (A1–A7)' }
)

// ── Per-questionnaire schemas (added incrementally below) ──

// Portada schema — implements P-001 through P-013

export const portadaSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    entidad: codigoEntidadSchema,
    decena: decenaSchema,
    nombreEntrevistador: z.string().min(1, 'El nombre del entrevistador es obligatorio'),
    nombreSupervisor: z.string().min(1, 'El nombre del supervisor es obligatorio'),
    resultadoEntrevista: resultadoEntrevistaSchema,
    fechaInicio: dateSchema,
    fechaTermino: dateSchema,
    observaciones: z.string().optional().default(''),
  })
  .refine(
    (data) => {
      // P-012: fechaTermino >= fechaInicio
      const [d1, m1, y1] = data.fechaInicio.split('/').map(Number)
      const [d2, m2, y2] = data.fechaTermino.split('/').map(Number)
      const inicio = new Date(y1, m1 - 1, d1)
      const termino = new Date(y2, m2 - 1, d2)
      return termino >= inicio
    },
    {
      message: 'Fecha de término debe ser igual o posterior a fecha de inicio',
      path: ['fechaTermino'],
    }
  )
  .refine(
    (data) => {
      // P-013: if resultado = A1, fechaTermino must exist (already required as date)
      if (data.resultadoEntrevista === 'A1') {
        return data.fechaTermino.length > 0
      }
      return true
    },
    {
      message: 'Fecha de término es obligatoria para entrevista completa',
      path: ['fechaTermino'],
    }
  )

// Integrante schema (nested in hogares)

export const integranteSchema = z.object({
  numPer: z.string().regex(/^\d{2}$/, 'NUMPER debe ser 2 dígitos'),
  nombre: z.string().min(1, 'El nombre del integrante es obligatorio'),
  parentesco: z.string().min(1, 'El parentesco es obligatorio'),
  sexo: z.string().regex(/^[12]$/, 'Sexo debe ser 1 o 2'),
  edad: z.number().int().min(0, 'Edad debe ser entre 0 y 120').max(120, 'Edad debe ser entre 0 y 120'),
  fechaNacimiento: dateSchema,
  estadoCivil: z.string().min(1, 'El estado civil es obligatorio'),
  sabeLeerEscribir: yesNoSchema,
  nivelEscolaridad: z.string().min(1, 'La escolaridad es obligatoria'),
  asisteEscuela: yesNoSchema,
})

// Ingreso integrante schema

export const ingresoIntegranteSchema = z.object({
  numPer: z.string().regex(/^\d{2}$/, 'NUMPER debe ser 2 dígitos'),
  trabajoSemanaPasada: z.string().optional(),
  ocupacionPrincipal: z.string().optional(),
  tipoTrabajo: z.string().optional(),
  horasTrabajadas: z.number().optional(),
  ingresoMensualTrabajo: z.number().min(0).optional(),
  tieneOtroTrabajo: z.string().optional(),
  recibeJubilacion: z.string().optional(),
  recibeProgGobierno: z.string().optional(),
  progGobiernoNombre: z.string().optional(),
  progGobiernoMonto: z.number().min(0).optional(),
  progGobiernoPeriodicidad: z.string().optional(),
})

// Hogares y Vivienda schema — implements HV-001 through HV-011

export const hogaresSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    // P1–P9
    claseVivienda: z.string().min(1),
    materialParedes: z.string().min(1),
    materialTecho: z.string().min(1),
    materialPiso: z.string().min(1),
    antiguedadVivienda: z.number().optional(),
    tieneCuartoCocina: yesNoSchema,
    duermenEnCocina: z.string().optional(),
    numeroDormitorios: z.number().int().min(0).max(20),
    numeroCuartos: z.number().int().min(1).max(30),
    // P10
    lugarCocina: z.string().optional(),
    // P11–P14
    aguaTipo: z.string().min(1),
    aguaOrigen: z.string().optional(),
    aguaAcarreo: z.string().optional(),
    aguaDiasSemana: z.string().optional(),
    // P15–P19
    tipoSanitario: z.string().optional(),
    sanitarioCompartido: z.string().optional(),
    sanitarioAgua: z.string().optional(),
    biodigestor: z.string().optional(),
    banosConExcReg: z.number().int().min(0).optional(),
    banosSoloExc: z.number().int().min(0).optional(),
    banosSoloReg: z.number().int().min(0).optional(),
    // P20–P25
    drenaje: z.string().min(1),
    tieneElectricidad: yesNoSchema,
    numeroFocos: z.number().int().min(1).max(99).optional(),
    focosAhorradores: z.number().int().min(0).max(99).optional(),
    combustibleCocina: z.string().min(1),
    fogonChimenea: z.string().optional(),
    eliminaBasura: z.string().min(1),
    // P26–P29
    tenencia: z.string().optional(),
    montoRentaMensual: z.number().min(0).optional(),
    estimacionRenta: z.number().min(0).optional(),
    pagoMensual: z.number().min(0).optional(),
    pagoMesPasado: z.string().optional(),
    adquisicion: z.string().optional(),
    viviendaUsada: z.string().optional(),
    financiamiento: z.array(z.string()).optional(),
    // P31
    escritura: z.string().optional(),
    // P32–P33
    equipamiento: z.record(z.string()).optional(),
    problemasEstructurales: z.record(z.string()).optional(),
    // Bienes
    bienes: z.array(z.string()).default([]),
    integrantes: z.array(integranteSchema).min(1, 'Debe capturar al menos un integrante del hogar (el/la jefe/a)'),
    ingresosIntegrantes: z.array(ingresoIntegranteSchema).default([]),
    alimentosPocaVariedad: yesNoSchema,
    alimentosDejoComida: yesNoSchema,
    alimentosComioMenos: yesNoSchema,
    alimentosSinComida: yesNoSchema,
    alimentosSintioHambre: yesNoSchema,
    alimentosUnaVez: yesNoSchema,
    climaSequia: yesNoSchema,
    climaInundacion: yesNoSchema,
    climaHelada: yesNoSchema,
    climaIncendio: yesNoSchema,
    climaHuracan: yesNoSchema,
  })
  .refine(
    (data) => data.numeroCuartos >= data.numeroDormitorios,
    { message: 'El número de cuartos no puede ser menor al de dormitorios', path: ['numeroCuartos'] }
  )
  .refine(
    (data) => {
      if (data.tieneElectricidad === '1' && data.numeroFocos !== undefined && data.focosAhorradores !== undefined) {
        return data.focosAhorradores <= data.numeroFocos
      }
      return true
    },
    { message: 'Los focos ahorradores no pueden exceder el total de focos', path: ['focosAhorradores'] }
  )
  .refine(
    (data) => {
      // HV-005: first integrante's parentesco must be '1' (Jefe)
      if (data.integrantes.length > 0) {
        return data.integrantes[0].parentesco === '1'
      }
      return true
    },
    { message: 'El primer integrante debe ser el/la Jefe(a) del hogar', path: ['integrantes', 0, 'parentesco'] }
  )
  .refine(
    (data) => {
      // HV-004: numPer must be unique
      const numPers = data.integrantes.map((i) => i.numPer)
      return new Set(numPers).size === numPers.length
    },
    { message: 'El NUMPER debe ser único dentro del hogar', path: ['integrantes'] }
  )

// Menores 12 schema — implements M12-001 through M12-007

export const menor12Schema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    numPer: z.string().regex(/^\d{2}$/, 'NUMPER debe ser 2 dígitos'),
    nombre: z.string(),
    edad: z.number().int().max(11, 'Este cuestionario es solo para menores de 12 años'),
    sexo: z.string(),
    tieneDerechohabiencia: yesNoSchema,
    institucionSalud: z.string().optional(),
    problemaSalud2Semanas: yesNoSchema,
    vacunacionCompleta: yesNoUnkSchema,
    asisteEscuela: yesNoSchema,
    gradoEscolar: z.string().optional(),
    tipoEscuela: z.string().optional(),
    recibeBeca: yesNoSchema,
    quienCuida: z.string().min(1, 'Indique quién cuida al menor'),
  })
  .refine(
    (data) => {
      // M12-005: institucionSalud required when tieneDerechohabiencia = '1'
      if (data.tieneDerechohabiencia === '1') {
        return data.institucionSalud !== undefined && data.institucionSalud !== ''
      }
      return true
    },
    { message: 'Seleccione la institución de salud', path: ['institucionSalud'] }
  )
  .refine(
    (data) => {
      // M12-006 & M12-007: gradoEscolar and tipoEscuela required when asisteEscuela = '1'
      if (data.asisteEscuela === '1') {
        return data.gradoEscolar !== undefined && data.gradoEscolar !== ''
      }
      return true
    },
    { message: 'Capture el grado escolar que cursa', path: ['gradoEscolar'] }
  )
  .refine(
    (data) => {
      if (data.asisteEscuela === '1') {
        return data.tipoEscuela !== undefined && data.tipoEscuela !== ''
      }
      return true
    },
    { message: 'Seleccione el tipo de escuela', path: ['tipoEscuela'] }
  )

// Personas 12+ schema — implements P12-001 through P12-015

export const persona12PlusSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    numPer: z.string().regex(/^\d{2}$/, 'NUMPER debe ser 2 dígitos'),
    nombre: z.string(),
    edad: z.number().int().min(12, 'Este cuestionario es solo para personas de 12 o más años'),
    sexo: z.string(),
    parentesco: z.string(),
    // Educación
    nivelAprobado: z.string().min(1, 'El nivel de escolaridad es obligatorio'),
    asisteEscuela: yesNoSchema,
    tipoEscuela: z.string().optional(),
    sabeLeerEscribir: yesNoSchema,
    // Salud
    tieneDerechohabiencia: yesNoSchema,
    institucionSalud: z.string().optional(),
    problemaSalud2Semanas: yesNoSchema,
    fuma: yesNoSchema,
    consumeAlcohol: yesNoSchema,
    frecuenciaAlcohol: z.string().optional(),
    // Actividad Económica
    trabajoSemanaPasada: yesNoSchema,
    ocupacionPrincipal: z.string().optional(),
    tipoTrabajo: z.string().optional(),
    horasTrabajadas: z.number().int().min(1).max(168).optional(),
    ingresoMensualNeto: z.number().min(0).optional(),
    recibeAguinaldo: z.string().optional(),
    recibeVacaciones: z.string().optional(),
    contratoEscrito: z.string().optional(),
    prestacionesLey: z.string().optional(),
    tieneOtroTrabajo: z.string().optional(),
    buscaTrabajo: z.string().optional(),
    motivoNoTrabaja: z.string().optional(),
    // Ingresos No Laborales
    recibeJubilacion: yesNoSchema,
    recibeRemesas: yesNoSchema,
    recibeProgGobierno: yesNoSchema,
    progGobiernoNombre: z.string().optional(),
    progGobiernoMonto: z.number().min(0).optional(),
    progGobiernoPeriodicidad: z.string().optional(),
    recibeAyudaOtros: yesNoSchema,
    ayudaMonto: z.number().min(0).optional(),
    ayudaPeriodicidad: z.string().optional(),
    // Gastos Personales
    gastosTransporte: z.number().min(0).optional(),
    gastosComidasFuera: z.number().min(0).optional(),
    gastosCuidadoPersonal: z.number().min(0).optional(),
    gastosEntretenimiento: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // P12-006: institucionSalud required when tieneDerechohabiencia = '1'
      if (data.tieneDerechohabiencia === '1') {
        return data.institucionSalud !== undefined && data.institucionSalud !== ''
      }
      return true
    },
    { message: 'Seleccione la institución de salud', path: ['institucionSalud'] }
  )
  .refine(
    (data) => {
      // P12-007: tipoEscuela required when asisteEscuela = '1'
      if (data.asisteEscuela === '1') {
        return data.tipoEscuela !== undefined && data.tipoEscuela !== ''
      }
      return true
    },
    { message: 'Seleccione el tipo de escuela', path: ['tipoEscuela'] }
  )
  .refine(
    (data) => {
      // P12-008: ocupacionPrincipal required when trabajoSemanaPasada = '1'
      if (data.trabajoSemanaPasada === '1') {
        return data.ocupacionPrincipal !== undefined && data.ocupacionPrincipal !== ''
      }
      return true
    },
    { message: 'Capture la ocupación principal', path: ['ocupacionPrincipal'] }
  )
  .refine(
    (data) => {
      // P12-009: tipoTrabajo required when trabajoSemanaPasada = '1'
      if (data.trabajoSemanaPasada === '1') {
        return data.tipoTrabajo !== undefined && data.tipoTrabajo !== ''
      }
      return true
    },
    { message: 'Seleccione el tipo de trabajo', path: ['tipoTrabajo'] }
  )
  .refine(
    (data) => {
      // P12-010: horasTrabajadas required when trabajoSemanaPasada = '1'
      if (data.trabajoSemanaPasada === '1') {
        return data.horasTrabajadas !== undefined
      }
      return true
    },
    { message: 'Capture las horas trabajadas (1–168)', path: ['horasTrabajadas'] }
  )
  .refine(
    (data) => {
      // P12-011: ingresoMensualNeto required when trabajoSemanaPasada = '1'
      if (data.trabajoSemanaPasada === '1') {
        return data.ingresoMensualNeto !== undefined
      }
      return true
    },
    { message: 'Capture el ingreso mensual neto', path: ['ingresoMensualNeto'] }
  )
  .refine(
    (data) => {
      // P12-012: progGobiernoNombre required when recibeProgGobierno = '1'
      if (data.recibeProgGobierno === '1') {
        return data.progGobiernoNombre !== undefined && data.progGobiernoNombre !== ''
      }
      return true
    },
    { message: 'Capture el nombre del programa de gobierno', path: ['progGobiernoNombre'] }
  )
  .refine(
    (data) => {
      // P12-013: progGobiernoMonto required when recibeProgGobierno = '1'
      if (data.recibeProgGobierno === '1') {
        return data.progGobiernoMonto !== undefined
      }
      return true
    },
    { message: 'Capture el monto del programa de gobierno', path: ['progGobiernoMonto'] }
  )
  .refine(
    (data) => {
      // P12-014: ayudaMonto required when recibeAyudaOtros = '1'
      if (data.recibeAyudaOtros === '1') {
        return data.ayudaMonto !== undefined
      }
      return true
    },
    { message: 'Capture el monto de la ayuda', path: ['ayudaMonto'] }
  )
  .refine(
    (data) => {
      // P12-015: motivoNoTrabaja required when trabajoSemanaPasada = '2' and age >= 14
      if (data.trabajoSemanaPasada === '2' && data.edad >= 14) {
        return data.motivoNoTrabaja !== undefined && data.motivoNoTrabaja !== ''
      }
      return true
    },
    { message: 'Capture el motivo por el cual no trabaja', path: ['motivoNoTrabaja'] }
  )

// Negocios schema — implements NEG-001 through NEG-007

export const negocioSchema = z.object({
  id: z.string().min(1),
  numPerOperador: z.string().regex(/^\d{2}$/, 'NUMPER debe ser 2 dígitos'),
  tipoNegocio: z.string().min(1, 'Capture el tipo de negocio'),
  esActividadPrincipal: yesNoSchema,
  tieneLocal: yesNoSchema,
  llevaContabilidad: yesNoSchema,
  dadoAltaHacienda: yesNoSchema,
  ingresoMensual: z.number().min(0, 'Ingrese el monto sin signo de pesos ni comas'),
  gastosMensuales: z.number().min(0, 'Ingrese el monto sin signo de pesos ni comas'),
})

export const negociosSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    tieneNegocio: yesNoSchema,
    negocios: z.array(negocioSchema).default([]),
  })
  .refine(
    (data) => {
      // NEG-006: at least one negocio required when tieneNegocio = '1'
      if (data.tieneNegocio === '1') {
        return data.negocios.length >= 1
      }
      return true
    },
    { message: 'Si tiene negocio, capture al menos uno', path: ['negocios'] }
  )

// Gastos Hogar schema — all fields optional, GH-003 through GH-004
const optionalMoney = z.union([moneySchema, z.number().min(0), z.literal(''), z.undefined()]).optional()

export const gastosHogarSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    // Section I
    alimentosCarnes: optionalMoney,
    alimentosCereales: optionalMoney,
    alimentosVerduras: optionalMoney,
    alimentosFrutas: optionalMoney,
    alimentosLacteos: optionalMoney,
    alimentosHuevo: optionalMoney,
    alimentosAceites: optionalMoney,
    alimentosAzucar: optionalMoney,
    alimentosCafe: optionalMoney,
    alimentosBebidasNoAlcohol: optionalMoney,
    alimentosBebidasAlcohol: optionalMoney,
    alimentosFueraHogar: optionalMoney,
    alimentosOtros: optionalMoney,
    // Section II
    transportePublico: optionalMoney,
    gasolina: optionalMoney,
    mantenimientoAuto: optionalMoney,
    telefonoCelular: optionalMoney,
    internet: optionalMoney,
    // Section III
    viviendaRenta: optionalMoney,
    viviendaElectricidad: optionalMoney,
    viviendaAgua: optionalMoney,
    viviendaGas: optionalMoney,
    viviendaPredial: optionalMoney,
    viviendaMantenimiento: optionalMoney,
    // Section IV
    educacionUtiles: optionalMoney,
    educacionUniformes: optionalMoney,
    educacionCuotas: optionalMoney,
    educacionEntretenimiento: optionalMoney,
    // Section V
    saludMedicamentos: optionalMoney,
    saludConsultas: optionalMoney,
    saludLentes: optionalMoney,
    // Section VI
    vestidoRopa: optionalMoney,
    vestidoCalzado: optionalMoney,
    // Section VII
    cuidadosHigiene: optionalMoney,
    cuidadosEstetica: optionalMoney,
    cuidadosPañales: optionalMoney,
    // Section VIII
    enseresDetergentes: optionalMoney,
    enseresUtensilios: optionalMoney,
    enseresBlancos: optionalMoney,
  })

// Gastos Diarios schema — implements GD-001 through GD-008

export const gastoDiarioSchema = z.object({
  id: z.string().min(1),
  concepto: z.string().min(1, 'Capture el concepto del gasto'),
  monto: z.number().min(0, 'Monto inválido'),
})

export const diaGastosSchema = z
  .object({
    diaNumero: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)]),
    nombreDia: z.string(),
    fecha: z.union([dateSchema, z.literal("")]),
    gastos: z.array(gastoDiarioSchema).min(1, 'Capture al menos un gasto para este día'),
  })

export const estimacionMensualSchema = z.object({
  tortilleria: z.number().min(0).optional(),
  carniceria: z.number().min(0).optional(),
  verduleria: z.number().min(0).optional(),
  abarrotes: z.number().min(0).optional(),
  transporte: z.number().min(0).optional(),
  gasolina: z.number().min(0).optional(),
})

export const gastosDiariosSchema = z
  .object({
    folioViv: folioVivSchema,
    folioHog: folioHogSchema,
    informanteNumPer: z.string().regex(/^\d{2}$/, 'El NUMPER del informante debe ser 2 dígitos'),
    dias: z.array(diaGastosSchema),
    estimacionMensual: estimacionMensualSchema,
  })

// Step schema map: step number → schema
export const STEP_SCHEMAS_MAP = {
  portada: portadaSchema,
  hogares: hogaresSchema,
  menor12: menor12Schema,
  persona12Plus: persona12PlusSchema,
  negocios: negociosSchema,
  gastosHogar: gastosHogarSchema,
  gastosDiarios: gastosDiariosSchema,
} as const