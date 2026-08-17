// Combined Zustand store with persist middleware.
// All slices are combined into a single store with localStorage persistence.
// Only data fields are persisted; transient state (errors, _hasHydrated) is excluded.

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateCreator } from 'zustand'



import {
  createInitialPortada,
  createInitialHogares,
  createInitialMenores12,
  createInitialPersonas12Plus,
  createInitialNegocios,
  createInitialGastosHogar,
  createInitialGastosDiarios,
  createInitialTimer,
} from './initial-state'

import type { WizardSliceState } from './slices/wizard.slice'
import type { TimerSliceState } from './slices/timer.slice'
import type { PortadaSliceState } from './slices/portada.slice'
import type { HogaresSliceState } from './slices/hogares.slice'
import type { Menores12SliceState } from './slices/menores12.slice'
import type { Personas12PlusSliceState } from './slices/personas12plus.slice'
import type { NegociosSliceState } from './slices/negocios.slice'
import type { GastosHogarSliceState } from './slices/gastos-hogar.slice'
import type { GastosDiariosSliceState } from './slices/gastos-diarios.slice'
import type { ValidationSliceState } from './slices/validation.slice'

import { createWizardSlice } from './slices/wizard.slice'
import { createTimeSlice } from './slices/timer.slice'
import { createPortadaSlice } from './slices/portada.slice'
import { createHogaresSlice } from './slices/hogares.slice'
import { createMenores12Slice } from './slices/menores12.slice'
import { createPersonas12PlusSlice } from './slices/personas12plus.slice'
import { createNegociosSlice } from './slices/negocios.slice'
import { createGastosHogarSlice } from './slices/gastos-hogar.slice'
import { createGastosDiariosSlice } from './slices/gastos-diarios.slice'
import { createValidationSlice } from './slices/validation.slice'

export type AppStore = WizardSliceState &
  TimerSliceState &
  PortadaSliceState &
  HogaresSliceState &
  Menores12SliceState &
  Personas12PlusSliceState &
  NegociosSliceState &
  GastosHogarSliceState &
  GastosDiariosSliceState &
  ValidationSliceState & {
    _hasHydrated: boolean
    setHasHydrated: (hydrated: boolean) => void
    resetAll: () => void
  }

const initialState = {
  portada: createInitialPortada(),
  hogares: createInitialHogares(),
  menores12: createInitialMenores12(),
  personas12plus: createInitialPersonas12Plus(),
  negocios: createInitialNegocios(),
  gastosHogar: createInitialGastosHogar(),
  gastosDiarios: createInitialGastosDiarios(),
  timer: createInitialTimer(),
}

const storeCreator: StateCreator<AppStore, [], [], AppStore> = (...a) => ({
  ...createWizardSlice(...a),
  ...createTimeSlice(...a),
  ...createPortadaSlice(...a),
  ...createHogaresSlice(...a),
  ...createMenores12Slice(...a),
  ...createPersonas12PlusSlice(...a),
  ...createNegociosSlice(...a),
  ...createGastosHogarSlice(...a),
  ...createGastosDiariosSlice(...a),
  ...createValidationSlice(...a),

  _hasHydrated: false,
  setHasHydrated: (hydrated) => a[0]({ _hasHydrated: hydrated }),

  resetAll: () =>
    a[0]({
      ...initialState,
      currentStep: 1,
      currentSubStep: 0,
      completedSteps: [],
      stepErrors: {},
      crossSectionErrors: [],
      _hasHydrated: (a[1] as () => AppStore)()._hasHydrated,
    }),
})

export const useAppStore = create<AppStore>()(
  persist(storeCreator, {
    name: 'iktan-folio-storage',
    version: 1,
    migrate: (persistedState: unknown, version: number) => {
      if (version === 0) {
        // v0 stored data is wrapped as {state, version}. Extract the state
        // and deep-merge each slice with fresh defaults so new fields
        // (compartenGasto, alimentos*, clima*, etc.) are populated.
        const wrapper = persistedState as { state?: Record<string, unknown>; version?: number }
        const oldState = wrapper.state ?? (persistedState as Record<string, unknown>)
        const fresh = initialState
        return {
          ...fresh,
          ...oldState,
          portada: { ...fresh.portada, ...(oldState.portada as Record<string, unknown>) },
          hogares: { ...fresh.hogares, ...(oldState.hogares as Record<string, unknown>) },
          menores12: { ...fresh.menores12, ...(oldState.menores12 as Record<string, unknown>) },
          personas12plus: { ...fresh.personas12plus, ...(oldState.personas12plus as Record<string, unknown>) },
          negocios: { ...fresh.negocios, ...(oldState.negocios as Record<string, unknown>) },
          gastosHogar: { ...fresh.gastosHogar, ...(oldState.gastosHogar as Record<string, unknown>) },
          gastosDiarios: { ...fresh.gastosDiarios, ...(oldState.gastosDiarios as Record<string, unknown>) },
          timer: { ...fresh.timer, ...(oldState.timer as Record<string, unknown>) },
        } as AppStore
      }
      // Normal path: extract state from wrapper
      const wrapper = persistedState as { state?: AppStore; version?: number }
      return (wrapper.state ?? persistedState) as AppStore
    },
    storage: createJSONStorage(() => {
      if (typeof localStorage !== 'undefined') return localStorage
      // Fallback for non-DOM environments (SSR, test runners without jsdom)
      const map = new Map<string, string>()
      return {
        getItem: (key: string) => map.get(key) ?? null,
        setItem: (key: string, value: string) => void map.set(key, value),
        removeItem: (key: string) => void map.delete(key),
      } as Storage
    }),
    partialize: (state) => ({
      currentStep: state.currentStep,
      currentSubStep: state.currentSubStep,
      completedSteps: state.completedSteps,
      portada: state.portada,
      hogares: state.hogares,
      menores12: state.menores12,
      personas12plus: state.personas12plus,
      negocios: state.negocios,
      gastosHogar: state.gastosHogar,
      gastosDiarios: state.gastosDiarios,
      timer: state.timer,
      // Excluded: stepErrors, crossSectionErrors, _hasHydrated
    }),
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true)
    },
  })
)