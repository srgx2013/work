import type { CrossSectionError } from './types'

// The cross-section validator operates on a slim view of the store —
// only the data slices needed for cross-section consistency checks.
// This avoids importing the full Zustand store into the domain layer.

export type CrossSectionStore = {
  portada: {
    folioViv: string
    folioHog: string
    // Optional fields used by date-related cross-section rules.
    resultadoEntrevista?: string
    fechaInicio?: string // DD/MM/AAAA
    fechaTermino?: string // DD/MM/AAAA
  }
  hogares: {
    folioViv: string
    folioHog: string
    integrantes: Array<{
      numPer: string
      parentesco?: string
      edad: number
    }>
  }
  menores12: {
    menores: Array<{
      numPer: string
      edad: number
      folioViv: string
      folioHog: string
    }>
  }
  personas12plus: {
    personas: Array<{
      numPer: string
      edad: number
      folioViv: string
      folioHog: string
    }>
  }
  negocios: {
    folioViv: string
    folioHog: string
    tieneNegocio: string
    negocios: Array<{
      numPerOperador: string
    }>
  }
  gastosHogar: {
    folioViv: string
    folioHog: string
    [key: string]: unknown
  }
  gastosDiarios: {
    folioViv: string
    folioHog: string
    informanteNumPer: string
    dias: Array<{
      gastos: Array<{ monto: number }>
    }>
    estimacionMensual: Record<string, number | undefined>
  }
}

function isNonEmpty(s: string | undefined): boolean {
  return s !== undefined && s !== '' && s !== null
}

// Helper: extract all folioViv values from the store
function getAllFolioVivs(store: CrossSectionStore): string[] {
  const vivs: string[] = []
  if (isNonEmpty(store.portada.folioViv)) vivs.push(store.portada.folioViv)
  if (isNonEmpty(store.hogares.folioViv)) vivs.push(store.hogares.folioViv)
  for (const m of store.menores12.menores) {
    if (isNonEmpty(m.folioViv)) vivs.push(m.folioViv)
  }
  for (const p of store.personas12plus.personas) {
    if (isNonEmpty(p.folioViv)) vivs.push(p.folioViv)
  }
  if (isNonEmpty(store.negocios.folioViv)) vivs.push(store.negocios.folioViv)
  if (isNonEmpty(store.gastosHogar.folioViv)) vivs.push(store.gastosHogar.folioViv)
  if (isNonEmpty(store.gastosDiarios.folioViv)) vivs.push(store.gastosDiarios.folioViv)
  return vivs
}

function getAllFolioHogs(store: CrossSectionStore): string[] {
  const hogs: string[] = []
  if (isNonEmpty(store.portada.folioHog)) hogs.push(store.portada.folioHog)
  if (isNonEmpty(store.hogares.folioHog)) hogs.push(store.hogares.folioHog)
  for (const m of store.menores12.menores) {
    if (isNonEmpty(m.folioHog)) hogs.push(m.folioHog)
  }
  for (const p of store.personas12plus.personas) {
    if (isNonEmpty(p.folioHog)) hogs.push(p.folioHog)
  }
  if (isNonEmpty(store.negocios.folioHog)) hogs.push(store.negocios.folioHog)
  if (isNonEmpty(store.gastosHogar.folioHog)) hogs.push(store.gastosHogar.folioHog)
  if (isNonEmpty(store.gastosDiarios.folioHog)) hogs.push(store.gastosDiarios.folioHog)
  return hogs
}

// Parse a DD/MM/AAAA date string into a Date (null when invalid / out-of-range).
function parseDate(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, dd, mm, yyyy] = match
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  // Reject rollovers like 31/02/2024 that Date would silently normalize.
  if (
    date.getFullYear() !== Number(yyyy) ||
    date.getMonth() !== Number(mm) - 1 ||
    date.getDate() !== Number(dd)
  ) {
    return null
  }
  return date
}

function sumGastosHogar(store: CrossSectionStore): number {
  const gh = store.gastosHogar
  let total = 0
  for (const [key, val] of Object.entries(gh)) {
    if (key === 'folioViv' || key === 'folioHog') continue
    if (typeof val === 'number' && !isNaN(val)) {
      total += val
    }
  }
  return total
}

function sumGastosDiarios(store: CrossSectionStore): number {
  let total = 0
  for (const dia of store.gastosDiarios.dias) {
    for (const gasto of dia.gastos) {
      total += gasto.monto
    }
  }
  return total
}

export function validateCrossSection(store: CrossSectionStore): CrossSectionError[] {
  const errors: CrossSectionError[] = []

  // CS-001: folioViv consistency
  const allVivs = getAllFolioVivs(store)
  if (allVivs.length > 0 && new Set(allVivs).size > 1) {
    errors.push({
      ruleId: 'CS-001',
      severity: 'BLOCKER',
      message: 'FOLIOVIV no coincide en todos los cuestionarios',
      sections: ['Portada', 'Hogares', 'Menores 12', '12+', 'Negocios', 'Gastos Hogar', 'Gastos Diarios'],
    })
  }

  // CS-002: folioHog consistency
  const allHogs = getAllFolioHogs(store)
  if (allHogs.length > 0 && new Set(allHogs).size > 1) {
    errors.push({
      ruleId: 'CS-002',
      severity: 'BLOCKER',
      message: 'FOLIOHOG no coincide en todos los cuestionarios',
      sections: ['Portada', 'Hogares', 'Menores 12', '12+', 'Negocios', 'Gastos Hogar', 'Gastos Diarios'],
    })
  }

  // CS-003: first integrante must be numPer='01' and parentesco='1' (Jefe)
  if (store.hogares.integrantes.length > 0) {
    const jefe = store.hogares.integrantes[0]
    if (jefe.numPer !== '01' || jefe.parentesco !== '1') {
      errors.push({
        ruleId: 'CS-003',
        severity: 'BLOCKER',
        message: 'El primer integrante debe ser el/la Jefe(a) del hogar (NUMPER=01, parentesco=1)',
        sections: ['Hogares'],
      })
    }
  }

  // CS-FECHA-001: fechaTermino before fechaInicio → BLOCKER
  if (isNonEmpty(store.portada.fechaInicio)) {
    const inicio = parseDate(store.portada.fechaInicio!)
    const terminoStr = store.portada.fechaTermino ?? ''
    if (isNonEmpty(terminoStr)) {
      const termino = parseDate(terminoStr)
      if (inicio !== null && termino !== null && termino.getTime() < inicio.getTime()) {
        errors.push({
          ruleId: 'CS-FECHA-001',
          severity: 'BLOCKER',
          message: 'Fecha de término debe ser igual o posterior a fecha de inicio',
          sections: ['Portada'],
        })
      }
    }
  }

  // CS-FECHA-002: resultado=A1 requires a non-empty fechaTermino
  if (store.portada.resultadoEntrevista === 'A1' && !isNonEmpty(store.portada.fechaTermino)) {
    errors.push({
      ruleId: 'CS-FECHA-002',
      severity: 'BLOCKER',
      message: 'Fecha de término es obligatoria para entrevista completa (resultado A1)',
      sections: ['Portada'],
    })
  }

  // CS-004: menores12 + personas12+ count == hogares.integrantes.length
  const totalMenoresCount = store.menores12.menores.length
  const totalPersonas12plusCount = store.personas12plus.personas.length
  const totalIntegrantes = store.hogares.integrantes.length
  if (totalIntegrantes > 0 && totalMenoresCount + totalPersonas12plusCount !== totalIntegrantes) {
    errors.push({
      ruleId: 'CS-004',
      severity: 'BLOCKER',
      message: `El total de cuestionarios de persona (${totalMenoresCount + totalPersonas12plusCount}) no coincide con la cantidad de integrantes (${totalIntegrantes})`,
      sections: ['Menores 12', '12+', 'Hogares'],
    })
  }

  // CS-005: all numPer in Menores12 must exist in Hogares
  const hogaresNumPers = new Set(store.hogares.integrantes.map((i) => i.numPer))
  for (const menor of store.menores12.menores) {
    if (!hogaresNumPers.has(menor.numPer)) {
      errors.push({
        ruleId: 'CS-005',
        severity: 'BLOCKER',
        message: `NUMPER ${menor.numPer} en Menores de 12 no existe en la lista de integrantes de Hogares`,
        sections: ['Menores 12', 'Hogares'],
      })
    }
  }

  // CS-006: integrantes with edad < 12 must have a corresponding Menor12 entry
  const menoresNumPers = new Set(store.menores12.menores.map((m) => m.numPer))
  for (const integrante of store.hogares.integrantes) {
    if (integrante.edad < 12 && !menoresNumPers.has(integrante.numPer)) {
      errors.push({
        ruleId: 'CS-006',
        severity: 'BLOCKER',
        message: `NUMPER ${integrante.numPer} (edad ${integrante.edad}) debería estar en Menores de 12`,
        sections: ['Hogares', 'Menores 12'],
      })
    }
  }

  // CS-007: integrantes with edad >= 12 must have a corresponding 12+ entry
  const personas12plusNumPers = new Set(store.personas12plus.personas.map((p) => p.numPer))
  for (const integrante of store.hogares.integrantes) {
    if (integrante.edad >= 12 && !personas12plusNumPers.has(integrante.numPer)) {
      errors.push({
        ruleId: 'CS-007',
        severity: 'BLOCKER',
        message: `NUMPER ${integrante.numPer} (edad ${integrante.edad}) debería estar en Personas de 12+`,
        sections: ['Hogares', '12+'],
      })
    }
  }

  // CS-008: all numPer in 12+ must exist in Hogares
  for (const persona of store.personas12plus.personas) {
    if (!hogaresNumPers.has(persona.numPer)) {
      errors.push({
        ruleId: 'CS-008',
        severity: 'BLOCKER',
        message: `NUMPER ${persona.numPer} en 12+ no existe en la lista de integrantes de Hogares`,
        sections: ['12+', 'Hogares'],
      })
    }
  }

  // CS-009: all numPer in Menores12 must have edad < 12 in Hogares
  for (const menor of store.menores12.menores) {
    const integrante = store.hogares.integrantes.find((i) => i.numPer === menor.numPer)
    if (integrante && integrante.edad >= 12) {
      errors.push({
        ruleId: 'CS-009',
        severity: 'BLOCKER',
        message: `NUMPER ${menor.numPer} en Menores de 12 tiene edad ${integrante.edad} (debería ser < 12)`,
        sections: ['Menores 12', 'Hogares'],
      })
    }
  }

  // CS-010: all numPer in 12+ must have edad >= 12 in Hogares
  for (const persona of store.personas12plus.personas) {
    const integrante = store.hogares.integrantes.find((i) => i.numPer === persona.numPer)
    if (integrante && integrante.edad < 12) {
      errors.push({
        ruleId: 'CS-010',
        severity: 'BLOCKER',
        message: `NUMPER ${persona.numPer} en 12+ tiene edad ${integrante.edad} (debería ser >= 12)`,
        sections: ['12+', 'Hogares'],
      })
    }
  }

  // CS-013: tieneNegocio=1 requires at least one negocio
  if (store.negocios.tieneNegocio === '1' && store.negocios.negocios.length === 0) {
    errors.push({
      ruleId: 'CS-013',
      severity: 'BLOCKER',
      message: 'Si tiene negocio, debe capturar al menos uno',
      sections: ['Negocios'],
    })
  }

  // CS-014: numPerOperador of each negocio must exist in Hogares
  for (const neg of store.negocios.negocios) {
    if (!hogaresNumPers.has(neg.numPerOperador)) {
      errors.push({
        ruleId: 'CS-014',
        severity: 'BLOCKER',
        message: `El NUMPER del operador (${neg.numPerOperador}) no existe en la lista de integrantes`,
        sections: ['Negocios', 'Hogares'],
      })
    }
  }

  // CS-015: daily gastos > 4x trimestral (WARNING)
  const trimestralTotal = sumGastosHogar(store)
  const dailyTotal = sumGastosDiarios(store)
  if (trimestralTotal > 0 && dailyTotal > 4 * trimestralTotal) {
    errors.push({
      ruleId: 'CS-015',
      severity: 'WARNING',
      message: 'Gastos diarios totales son significativamente mayores a los gastos trimestrales',
      sections: ['Gastos Diarios', 'Gastos Hogar'],
    })
  }

  // CS-016: informanteNumPer must exist in Hogares
  if (isNonEmpty(store.gastosDiarios.informanteNumPer) && !hogaresNumPers.has(store.gastosDiarios.informanteNumPer)) {
    errors.push({
      ruleId: 'CS-016',
      severity: 'BLOCKER',
      message: `El NUMPER del informante (${store.gastosDiarios.informanteNumPer}) debe existir en la lista de integrantes`,
      sections: ['Gastos Diarios', 'Hogares'],
    })
  }

  return errors
}