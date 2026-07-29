// Portada slice — manages the Portada (cover page) questionnaire data.

import type { StateCreator } from 'zustand'
import type { PortadaData } from '@/domain/models/portada'
import { createInitialPortada } from '../initial-state'

export type PortadaSliceState = {
  portada: PortadaData

  updatePortada: (data: Partial<PortadaData>) => void
  resetPortada: () => void
}

export const createPortadaSlice: StateCreator<
  PortadaSliceState,
  [],
  [],
  PortadaSliceState
> = (set) => ({
  portada: createInitialPortada(),

  updatePortada: (data) =>
    set((state) => ({
      portada: { ...state.portada, ...data },
    })),

  resetPortada: () => set({ portada: createInitialPortada() }),
})