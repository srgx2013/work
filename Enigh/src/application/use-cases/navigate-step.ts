// navigate-step — pure function that computes the next step from the wizard
// state and a slim view of the store. Handles skip logic (empty Menores 12,
// Resultado A3/A6 closing the folio early) without mutating the store.
// The store interaction order itself lives in WizardLayout.

import type { PortadaData } from '@/domain/models/portada'

// Slim store view: enough to decide the next step without coupling to the
// full Zustand store type.
export type NavigateStore = {
  portada: Pick<PortadaData, 'folioViv' | 'folioHog' | 'resultadoEntrevista' | 'fechaTermino'>
  hogares: {
    integrantes: Array<{ numPer: string; edad: number }>
  }
}

const REPORT_STEP = 8
const LAST_QUESTIONNAIRE_STEP = 7

/**
 * Compute the next step given the current step and a slim view of the store.
 *
 * Special cases:
 *  - From Portada (1): if resultadoEntrevista is A3 (nadie en hogar) or
 *    A6 (vivienda desocupada), the folio is closed early — go straight to
 *    the Reporte step (8).
 *  - From Hogares (2): skip Menores 12 (3) when there are no menores in the
 *    integrantes list and advance directly to 4.
 *  - From Last questionnaire (7): advance to the Reporte step (8).
 *  - Reporte (8): no further advancement.
 */
export function computeNextStep(currentStep: number, store: NavigateStore): number {
  // Portada A3/A6 — folio closes early.
  if (currentStep === 1) {
    const resultado = store.portada.resultadoEntrevista
    if (resultado === 'A3' || resultado === 'A6') {
      return REPORT_STEP
    }
  }

  // Hogares step — skip Menores 12 when there are no menores.
  if (currentStep === 2) {
    const menores = store.hogares.integrantes.filter((i) => i.edad < 12)
    return menores.length === 0 ? 4 : 3
  }

  // Last questionnaire step — go to Reporte.
  // Steps 3..7: advance by one until 7.
  if (currentStep >= LAST_QUESTIONNAIRE_STEP) {
    return REPORT_STEP
  }

  // Steps 1 → 2, 3 → 4, 4 → 5, 5 → 6, 6 → 7
  return currentStep + 1
}