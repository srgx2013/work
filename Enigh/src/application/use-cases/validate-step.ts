// validate-step — converts Zod errors to FieldError[] for a given step number.
// Used by WizardLayout's handleNext to run full-step validation on "Siguiente".

import type { ZodType } from 'zod'
import type { FieldError } from '@/domain/validation/types'
import {
  portadaSchema,
  hogaresSchema,
  negociosSchema,
  gastosHogarSchema,
  gastosDiariosSchema,
} from '@/domain/validation/schemas'

export type StepSchemaEntry = {
  schema: ZodType<unknown>
  getData: (state: unknown) => unknown
}

// Helper: inject folios from Portada into step data so schemas that require
// folioViv/folioHog don't fail on empty strings from unpropagated stores.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withFolios(state: any, data: unknown) {
  return {
    ...(data as Record<string, unknown>),
    folioViv: state.portada?.folioViv ?? '',
    folioHog: state.portada?.folioHog ?? '',
  }
}

// Step number → { schema, getData }.
// Only steps that have a schema are listed; others pass through (no validation).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const STEP_SCHEMAS: Record<number, StepSchemaEntry> = {
  1: {
    schema: portadaSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: (state: any) => state.portada,
  },
  2: {
    schema: hogaresSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: (state: any) => withFolios(state, state.hogares),
  },
  5: {
    schema: negociosSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: (state: any) => withFolios(state, state.negocios),
  },
  6: {
    schema: gastosHogarSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: (state: any) => withFolios(state, state.gastosHogar),
  },
  7: {
    schema: gastosDiariosSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: (state: any) => withFolios(state, state.gastosDiarios),
  },
}

/**
 * Run the schema for `step` against the data in `state`.
 * Returns a list of FieldError entries; empty list means valid.
 */
export function validateStep(step: number, state: unknown): FieldError[] {
  const entry = STEP_SCHEMAS[step]
  if (!entry) return [] // No schema → pass through

  const data = entry.getData(state)
  const result = entry.schema.safeParse(data)
  if (result.success) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.error.issues.map((issue: any) => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
  }))
}
