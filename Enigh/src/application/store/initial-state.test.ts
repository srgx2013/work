import { describe, it, expect } from 'vitest'
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

describe('createInitialPortada', () => {
  it('returns an object with all PortadaData fields as empty strings', () => {
    const state = createInitialPortada()
    expect(state.entidad).toBe('')
    expect(state.folioViv).toBe('')
    expect(state.folioHog).toBe('')
    expect(state.decena).toBe('')
    expect(state.nombreEntrevistador).toBe('')
    expect(state.nombreSupervisor).toBe('')
    expect(state.resultadoEntrevista).toBe('')
    expect(state.fechaInicio).toBe('')
    expect(state.fechaTermino).toBe('')
    expect(state.observaciones).toBe('')
  })
})

describe('createInitialHogares', () => {
  it('returns empty integrantes and ingresosIntegrantes arrays', () => {
    const state = createInitialHogares()
    expect(state.integrantes).toEqual([])
    expect(state.ingresosIntegrantes).toEqual([])
  })

  it('returns empty bienes array', () => {
    const state = createInitialHogares()
    expect(state.bienes).toEqual([])
  })

  it('returns empty strings for all vivienda code fields', () => {
    const state = createInitialHogares()
    expect(state.claseVivienda).toBe('')
    expect(state.materialParedes).toBe('')
    expect(state.materialTecho).toBe('')
    expect(state.materialPiso).toBe('')
    expect(state.drenaje).toBe('')
    expect(state.combustibleCocina).toBe('')
    expect(state.eliminaBasura).toBe('')
  })

  it('returns empty strings for YesNo fields (unfilled sentinel)', () => {
    const state = createInitialHogares()
    expect(state.tieneCuartoCocina).toBe('')
    expect(state.tieneElectricidad).toBe('')
    expect(state.alimentosPocaVariedad).toBe('')
    expect(state.climaSequia).toBe('')
  })

  it('returns 0 for numeric fields with defaults', () => {
    const state = createInitialHogares()
    expect(state.numeroDormitorios).toBe(0)
    expect(state.numeroCuartos).toBe(0)
  })
})

describe('createInitialMenores12', () => {
  it('returns empty menores array', () => {
    const state = createInitialMenores12()
    expect(state.menores).toEqual([])
  })
})

describe('createInitialPersonas12Plus', () => {
  it('returns empty personas array', () => {
    const state = createInitialPersonas12Plus()
    expect(state.personas).toEqual([])
  })
})

describe('createInitialNegocios', () => {
  it('returns tieneNegocio as "2" (No) by default', () => {
    const state = createInitialNegocios()
    expect(state.tieneNegocio).toBe('2')
  })

  it('returns empty negocios array', () => {
    const state = createInitialNegocios()
    expect(state.negocios).toEqual([])
  })
})

describe('createInitialGastosHogar', () => {
  it('returns empty strings for folio fields', () => {
    const state = createInitialGastosHogar()
    expect(state.folioViv).toBe('')
    expect(state.folioHog).toBe('')
  })

  it('returns undefined for all amount fields', () => {
    const state = createInitialGastosHogar()
    expect(state.alimentosCarnes).toBeUndefined()
    expect(state.transportePublico).toBeUndefined()
    expect(state.viviendaRenta).toBeUndefined()
    expect(state.enseresBlancos).toBeUndefined()
  })
})

describe('createInitialGastosDiarios', () => {
  it('returns 7 days with correct day names', () => {
    const state = createInitialGastosDiarios()
    expect(state.dias).toHaveLength(7)
    expect(state.dias[0].nombreDia).toBe('Lunes')
    expect(state.dias[1].nombreDia).toBe('Martes')
    expect(state.dias[2].nombreDia).toBe('Miércoles')
    expect(state.dias[3].nombreDia).toBe('Jueves')
    expect(state.dias[4].nombreDia).toBe('Viernes')
    expect(state.dias[5].nombreDia).toBe('Sábado')
    expect(state.dias[6].nombreDia).toBe('Domingo')
  })

  it('returns days with correct diaNumero 1-7', () => {
    const state = createInitialGastosDiarios()
    state.dias.forEach((dia, i) => {
      expect(dia.diaNumero).toBe(i + 1)
    })
  })

  it('returns each day with empty gastos array and empty fecha', () => {
    const state = createInitialGastosDiarios()
    state.dias.forEach((dia) => {
      expect(dia.gastos).toEqual([])
      expect(dia.fecha).toBe('')
    })
  })

  it('returns empty informanteNumPer', () => {
    const state = createInitialGastosDiarios()
    expect(state.informanteNumPer).toBe('')
  })
})

describe('createInitialTimer', () => {
  it('returns entries for steps 1-7', () => {
    const timer = createInitialTimer()
    expect(Object.keys(timer.entries)).toHaveLength(7)
    expect(timer.entries[1]).toBeDefined()
    expect(timer.entries[7]).toBeDefined()
  })

  it('returns all entries with 0 elapsedSeconds and "stopped" status', () => {
    const timer = createInitialTimer()
    for (let step = 1; step <= 7; step++) {
      expect(timer.entries[step].elapsedSeconds).toBe(0)
      expect(timer.entries[step].status).toBe('stopped')
      expect(timer.entries[step].startedAt).toBeUndefined()
    }
  })

  it('returns totalElapsedSeconds as 0 and currentStep as 1', () => {
    const timer = createInitialTimer()
    expect(timer.totalElapsedSeconds).toBe(0)
    expect(timer.currentStep).toBe(1)
  })

  it('sets correct step labels', () => {
    const timer = createInitialTimer()
    expect(timer.entries[1].stepLabel).toBe('Portada')
    expect(timer.entries[2].stepLabel).toBe('Hogares y Vivienda')
    expect(timer.entries[3].stepLabel).toBe('Menores de 12 años')
    expect(timer.entries[4].stepLabel).toBe('Personas de 12+ años')
    expect(timer.entries[5].stepLabel).toBe('Negocios del Hogar')
    expect(timer.entries[6].stepLabel).toBe('Gastos del Hogar')
    expect(timer.entries[7].stepLabel).toBe('Gastos Diarios')
  })
})