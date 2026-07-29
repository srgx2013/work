import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { createValidationSlice, type ValidationSliceState } from './validation.slice'
import type { FieldError } from '@/domain/validation/types'
import type { CrossSectionError } from '@/domain/validation/types'

function createTestStore() {
  return create<ValidationSliceState>()((...a) => ({
    ...createValidationSlice(...a),
  }))
}

describe('ValidationSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('starts with empty stepErrors and crossSectionErrors', () => {
    expect(store.getState().stepErrors).toEqual({})
    expect(store.getState().crossSectionErrors).toEqual([])
  })

  describe('setStepErrors', () => {
    it('stores errors for step 2', () => {
      const errors: FieldError[] = [
        { field: 'folioViv', message: 'Required' },
      ]
      store.getState().setStepErrors(2, errors)
      expect(store.getState().stepErrors[2]).toEqual(errors)
    })

    it('replaces previous errors for the same step', () => {
      store.getState().setStepErrors(1, [{ field: 'entidad', message: 'Invalid' }])
      store.getState().setStepErrors(1, [{ field: 'folioViv', message: 'Required' }])
      expect(store.getState().stepErrors[1]).toHaveLength(1)
      expect(store.getState().stepErrors[1][0].field).toBe('folioViv')
    })
  })

  describe('clearStepErrors', () => {
    it('clears errors for step 2 only', () => {
      store.getState().setStepErrors(1, [{ field: 'a', message: 'err' }])
      store.getState().setStepErrors(2, [{ field: 'b', message: 'err' }])
      store.getState().clearStepErrors(2)
      expect(store.getState().stepErrors[2]).toBeUndefined()
      expect(store.getState().stepErrors[1]).toBeDefined()
    })
  })

  describe('setCrossSectionErrors', () => {
    it('stores cross-section errors', () => {
      const errors: CrossSectionError[] = [
        { ruleId: 'CS-001', severity: 'BLOCKER', message: 'Folio mismatch', sections: ['Portada'] },
      ]
      store.getState().setCrossSectionErrors(errors)
      expect(store.getState().crossSectionErrors).toEqual(errors)
    })
  })

  describe('clearAllErrors', () => {
    it('clears both stepErrors and crossSectionErrors', () => {
      store.getState().setStepErrors(1, [{ field: 'a', message: 'err' }])
      store.getState().setStepErrors(2, [{ field: 'b', message: 'err' }])
      store.getState().setCrossSectionErrors([
        { ruleId: 'CS-001', severity: 'BLOCKER', message: 'err', sections: [] },
      ])
      store.getState().clearAllErrors()
      expect(store.getState().stepErrors).toEqual({})
      expect(store.getState().crossSectionErrors).toEqual([])
    })
  })
})