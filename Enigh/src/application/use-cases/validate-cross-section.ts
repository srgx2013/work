// validate-cross-section — application-layer use case that wraps the domain
// cross-section validator against the slim store view it requires.
// Keeps a stable seam so UI components do not import domain validators directly.

import { validateCrossSection } from '@/domain/validation/cross-section'
import type { CrossSectionError } from '@/domain/validation/types'

// Re-export the slim store view the validator expects so callers can shape
// the store snapshot they pass in.
export type CrossSectionStoreShape = Parameters<typeof validateCrossSection>[0]

/**
 * Run every cross-section rule and return the full list of CrossSectionError
 * entries. Undefined/empty when the folio is consistent.
 */
export function runCrossSectionValidation(store: CrossSectionStoreShape): CrossSectionError[] {
  return validateCrossSection(store)
}

/**
 * Split cross-section errors into BLOCKER and WARNING buckets. UI code uses
 * the BLOCKER list to block advancement and the WARNING list to surface
 * informational alerts that do not block.
 */
export function partitionBySeverity(errors: CrossSectionError[]): {
  blockers: CrossSectionError[]
  warnings: CrossSectionError[]
} {
  return {
    blockers: errors.filter((e) => e.severity === 'BLOCKER'),
    warnings: errors.filter((e) => e.severity === 'WARNING'),
  }
}