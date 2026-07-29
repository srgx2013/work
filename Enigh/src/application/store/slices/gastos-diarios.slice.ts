// Gastos Diarios slice — manages the Cuadernillo de Gastos Diarios questionnaire data.
// 7 days with dynamic gasto arrays + estimation fields.

import type { StateCreator } from 'zustand'
import type { GastosDiariosData, GastoDiario, EstimacionMensual } from '@/domain/models/gastosDiarios'
import { createInitialGastosDiarios } from '../initial-state'

export type GastosDiariosSliceState = {
  gastosDiarios: GastosDiariosData

  setInformante: (numPer: string) => void
  addGastoDia: (diaIndex: number) => void
  removeGastoDia: (diaIndex: number, gastoId: string) => void
  updateGastoDia: (diaIndex: number, gastoId: string, data: Partial<GastoDiario>) => void
  updateEstimacion: (data: Partial<EstimacionMensual>) => void
  updateGastosDiarios: (data: Partial<GastosDiariosData>) => void
  resetGastosDiarios: () => void
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `gasto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function blankGasto(): GastoDiario {
  return {
    id: generateId(),
    concepto: '',
    monto: 0,
  }
}

export const createGastosDiariosSlice: StateCreator<
  GastosDiariosSliceState,
  [],
  [],
  GastosDiariosSliceState
> = (set, _get) => ({
  gastosDiarios: createInitialGastosDiarios(),

  setInformante: (numPer) =>
    set((state) => ({
      gastosDiarios: { ...state.gastosDiarios, informanteNumPer: numPer },
    })),

  addGastoDia: (diaIndex) =>
    set((state) => ({
      gastosDiarios: {
        ...state.gastosDiarios,
        dias: state.gastosDiarios.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, gastos: [...dia.gastos, blankGasto()] }
            : dia
        ),
      },
    })),

  removeGastoDia: (diaIndex, gastoId) =>
    set((state) => ({
      gastosDiarios: {
        ...state.gastosDiarios,
        dias: state.gastosDiarios.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, gastos: dia.gastos.filter((g) => g.id !== gastoId) }
            : dia
        ),
      },
    })),

  updateGastoDia: (diaIndex, gastoId, data) =>
    set((state) => ({
      gastosDiarios: {
        ...state.gastosDiarios,
        dias: state.gastosDiarios.dias.map((dia, i) =>
          i === diaIndex
            ? {
                ...dia,
                gastos: dia.gastos.map((g) =>
                  g.id === gastoId ? { ...g, ...data } : g
                ),
              }
            : dia
        ),
      },
    })),

  updateEstimacion: (data) =>
    set((state) => ({
      gastosDiarios: {
        ...state.gastosDiarios,
        estimacionMensual: { ...state.gastosDiarios.estimacionMensual, ...data },
      },
    })),

  updateGastosDiarios: (data) =>
    set((state) => ({
      gastosDiarios: { ...state.gastosDiarios, ...data },
    })),

  resetGastosDiarios: () => set({ gastosDiarios: createInitialGastosDiarios() }),
})