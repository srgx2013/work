// ReporteStep — Step 8: Final report view.
// Read-only summary of all captured data: datos generales, residentes table,
// totales, tiempos por cuestionario, alertas de consistencia, and Reiniciar button.
// Print-friendly layout. No Anterior/Siguiente navigation.

import { useMemo, useState } from 'react'
import { useAppStore } from '@/application/store/index'
import { CATALOGS } from '@/domain/constants/catalogs'
import { validateCrossSection } from '@/domain/validation/cross-section'
import { ConfirmModal } from '@/ui/components/ConfirmModal'
import type { GastosHogarData } from '@/domain/models/gastosHogar'

// ── Formatting helpers ──

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatMoney(amount: number): string {
  return amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getCatalogLabel(catalogName: keyof typeof CATALOGS, code: string): string {
  const catalog = CATALOGS[catalogName]
  return catalog?.[code]?.label ?? code
}

// ── Gastos Hogar section total computation ──

const GASTOS_HOGAR_SECTIONS: { title: string; fields: (keyof GastosHogarData)[] }[] = [
  { title: 'Alimentos', fields: ['alimentosCarnes', 'alimentosCereales', 'alimentosVerduras', 'alimentosFrutas', 'alimentosLacteos', 'alimentosHuevo', 'alimentosAceites', 'alimentosAzucar', 'alimentosCafe', 'alimentosBebidasNoAlcohol', 'alimentosBebidasAlcohol', 'alimentosFueraHogar', 'alimentosOtros'] },
  { title: 'Transporte', fields: ['transportePublico', 'gasolina', 'mantenimientoAuto', 'telefonoCelular', 'internet'] },
  { title: 'Vivienda', fields: ['viviendaRenta', 'viviendaElectricidad', 'viviendaAgua', 'viviendaGas', 'viviendaPredial', 'viviendaMantenimiento'] },
  { title: 'Educación', fields: ['educacionUtiles', 'educacionUniformes', 'educacionCuotas', 'educacionEntretenimiento'] },
  { title: 'Salud', fields: ['saludMedicamentos', 'saludConsultas', 'saludLentes'] },
  { title: 'Vestido', fields: ['vestidoRopa', 'vestidoCalzado'] },
  { title: 'Cuidados', fields: ['cuidadosHigiene', 'cuidadosEstetica', 'cuidadosPañales'] },
  { title: 'Enseres', fields: ['enseresDetergentes', 'enseresUtensilios', 'enseresBlancos'] },
]

function sumGastosHogarTotal(data: GastosHogarData): number {
  return GASTOS_HOGAR_SECTIONS.reduce((total, section) => {
    return total + section.fields.reduce((sum, field) => {
      const val = data[field]
      return sum + (typeof val === 'number' ? val : 0)
    }, 0)
  }, 0)
}

// ── Section title helper ──

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-base font-bold text-primary">
      {children}
    </h3>
  )
}

// ── Timer step labels ──

const TIMER_STEP_ROWS = [
  { step: 1, label: 'Portada' },
  { step: 2, label: 'Hogares y Vivienda' },
  { step: 3, label: 'Menores de 12 años' },
  { step: 4, label: 'Personas de 12+ años' },
  { step: 5, label: 'Negocios del Hogar' },
  { step: 6, label: 'Gastos del Hogar' },
  { step: 7, label: 'Gastos Diarios' },
]

// ── Main ReporteStep ──

export function ReporteStep() {
  const portada = useAppStore((s) => s.portada)
  const hogares = useAppStore((s) => s.hogares)
  const gastosHogar = useAppStore((s) => s.gastosHogar)
  const gastosDiarios = useAppStore((s) => s.gastosDiarios)
  const timer = useAppStore((s) => s.timer)
  const resetAll = useAppStore((s) => s.resetAll)
  const setCurrentStep = useAppStore((s) => s.setCurrentStep)

  const [confirmOpen, setConfirmOpen] = useState(false)

  // Cross-section warnings (only WARNING severity)
  const warnings = useMemo(() => {
    const errors = validateCrossSection({
      portada,
      hogares,
      menores12: useAppStore.getState().menores12,
      personas12plus: useAppStore.getState().personas12plus,
      negocios: useAppStore.getState().negocios,
      gastosHogar,
      gastosDiarios,
    })
    return errors.filter((e) => e.severity === 'WARNING').map((e) => e.message)
  }, [portada, hogares, gastosHogar, gastosDiarios])

  // Total household income (sum of all ingresos integrantes)
  const ingresoTotal = useMemo(() => {
    return hogares.ingresosIntegrantes.reduce((sum, ing) => {
      return sum + (ing.ingresoMensualTrabajo ?? 0)
    }, 0)
  }, [hogares.ingresosIntegrantes])

  // Gastos trimestral total
  const gastoTrimestralTotal = useMemo(() => {
    return sumGastosHogarTotal(gastosHogar)
  }, [gastosHogar])

  // Gasto diario total (sum of 7 days)
  const gastoDiarioTotal = useMemo(() => {
    return gastosDiarios.dias.reduce((daySum, dia) => {
      return daySum + dia.gastos.reduce((s, g) => s + (g.monto || 0), 0)
    }, 0)
  }, [gastosDiarios.dias])

  // Gasto mensual estimado (sum of estimacionMensual)
  const gastoMensualEstimado = useMemo(() => {
    const e = gastosDiarios.estimacionMensual
    return (e.tortilleria ?? 0) + (e.carniceria ?? 0) + (e.verduleria ?? 0) +
      (e.abarrotes ?? 0) + (e.transporte ?? 0) + (e.gasolina ?? 0)
  }, [gastosDiarios.estimacionMensual])

  // Total time
  const tiempoTotal = useMemo(() => {
    return TIMER_STEP_ROWS.reduce((sum, row) => {
      const entry = timer.entries[row.step]
      return sum + (entry?.elapsedSeconds ?? 0)
    }, 0)
  }, [timer.entries])

  // Folio status: CONCLUIDO if cross-section has no BLOCKER errors
  const folioStatus = useMemo(() => {
    const errors = validateCrossSection({
      portada,
      hogares,
      menores12: useAppStore.getState().menores12,
      personas12plus: useAppStore.getState().personas12plus,
      negocios: useAppStore.getState().negocios,
      gastosHogar,
      gastosDiarios,
    })
    const hasBlockers = errors.some((e) => e.severity === 'BLOCKER')
    return hasBlockers ? 'INCOMPLETO' : 'CONCLUIDO'
  }, [portada, hogares, gastosHogar, gastosDiarios])

  function handleReset() {
    resetAll()
    setCurrentStep(1)
    setConfirmOpen(false)
  }

  return (
    <div className="pb-8">
      <h2 className="mb-4 text-lg font-bold text-primary">Reporte Final</h2>

      {/* Estado del folio */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-muted">Estado del folio:</span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold text-white ${
            folioStatus === 'CONCLUIDO' ? 'bg-success' : 'bg-danger'
          }`}
        >
          {folioStatus}
        </span>
      </div>

      {/* Datos Generales */}
      <SectionTitle>Datos Generales</SectionTitle>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">FOLIOVIV</th>
              <td className="py-1">{portada.folioViv || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">FOLIOHOG</th>
              <td className="py-1">{portada.folioHog || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Entidad</th>
              <td className="py-1">
                {portada.entidad ? `${portada.entidad} — ${getCatalogLabel('entidades', portada.entidad)}` : '-'}
              </td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Decena</th>
              <td className="py-1">{portada.decena || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Entrevistador</th>
              <td className="py-1">{portada.nombreEntrevistador || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Supervisor</th>
              <td className="py-1">{portada.nombreSupervisor || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Fecha inicio</th>
              <td className="py-1">{portada.fechaInicio || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Fecha término</th>
              <td className="py-1">{portada.fechaTermino || '-'}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Resultado de entrevista</th>
              <td className="py-1">
                {portada.resultadoEntrevista || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Resumen de Residentes */}
      <SectionTitle>Resumen de Residentes</SectionTitle>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-2 pr-4 text-left font-bold text-primary">NUMPER</th>
              <th className="py-2 pr-4 text-left font-bold text-primary">Nombre</th>
              <th className="py-2 pr-4 text-left font-bold text-primary">Parentesco</th>
              <th className="py-2 pr-4 text-left font-bold text-primary">Sexo</th>
              <th className="py-2 pr-4 text-left font-bold text-primary">Edad</th>
              <th className="py-2 pr-4 text-left font-bold text-primary">Escolaridad</th>
            </tr>
          </thead>
          <tbody>
            {hogares.integrantes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-3 text-center text-muted">Sin residentes registrados</td>
              </tr>
            )}
            {hogares.integrantes.map((integrante) => (
              <tr key={integrante.numPer} className="border-b border-neutral-100">
                <td className="py-1 pr-4">{integrante.numPer}</td>
                <td className="py-1 pr-4">{integrante.nombre}</td>
                <td className="py-1 pr-4">{getCatalogLabel('parentescos', integrante.parentesco)}</td>
                <td className="py-1 pr-4">{integrante.sexo === '1' ? 'Hombre' : integrante.sexo === '2' ? 'Mujer' : integrante.sexo}</td>
                <td className="py-1 pr-4">{integrante.edad}</td>
                <td className="py-1 pr-4">{getCatalogLabel('escolaridad', integrante.nivelEscolaridad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <SectionTitle>Totales</SectionTitle>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Ingreso total del hogar</th>
              <td className="py-1 text-right font-mono">${formatMoney(ingresoTotal)}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Gasto trimestral total</th>
              <td className="py-1 text-right font-mono">${formatMoney(gastoTrimestralTotal)}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Gasto diario total estimado</th>
              <td className="py-1 text-right font-mono">${formatMoney(gastoDiarioTotal)}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-1 pr-4 text-left font-medium text-muted">Gasto mensual estimado (diarios)</th>
              <td className="py-1 text-right font-mono">${formatMoney(gastoMensualEstimado)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tiempos por Cuestionario */}
      <SectionTitle>Tiempos por Cuestionario</SectionTitle>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-2 pr-4 text-left font-bold text-primary">Cuestionario</th>
              <th className="py-2 pr-4 text-right font-bold text-primary">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {TIMER_STEP_ROWS.map((row) => {
              const entry = timer.entries[row.step]
              return (
                <tr key={row.step} className="border-b border-neutral-100">
                  <td className="py-1 pr-4">{row.label}</td>
                  <td className="py-1 pr-4 text-right font-mono">{formatTime(entry?.elapsedSeconds ?? 0)}</td>
                </tr>
              )
            })}
            <tr className="border-t-2 border-neutral-300 bg-neutral-50">
              <td className="py-2 pr-4 font-bold text-primary">Tiempo total</td>
              <td className="py-2 pr-4 text-right font-mono font-bold text-primary">{formatTime(tiempoTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Alertas de Consistencia */}
      <SectionTitle>Alertas de Consistencia</SectionTitle>
      <div className="mb-4">
        {warnings.length === 0 ? (
          <p className="text-sm text-muted">Sin incidencias</p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-warning">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Reiniciar button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="rounded-md border border-danger bg-white px-6 py-2 font-medium text-danger hover:bg-red-50"
        >
          Reiniciar
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Reiniciar folio"
        message="¿Está seguro de que desea reiniciar el folio? Se perderán todos los datos capturados."
        confirmLabel="Sí, reiniciar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}