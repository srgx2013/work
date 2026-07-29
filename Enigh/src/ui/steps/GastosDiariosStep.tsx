// GastosDiariosStep — Questionnaire 7: Cuadernillo de Gastos Diarios.
// 7 days (Lunes–Domingo) with dynamic gasto items per day + Estimación Mensual.
// Read-only folioViv/folioHog from Portada. Informante auto-fills from Hogares.

import { useMemo, useCallback, useEffect } from 'react'
import { useAppStore } from '@/application/store/index'
import { MoneyInput } from '@/ui/components/MoneyInput'
import { TextInput } from '@/ui/components/TextInput'
import { ReadOnlyField } from '@/ui/components/ReadOnlyField'
import { FieldWrapper } from '@/ui/components/FieldWrapper'
import type { GastosDiariosData, EstimacionMensual } from '@/domain/models/gastosDiarios'

// ── Estimación Mensual field definitions ──

interface EstimacionFieldDef {
  key: keyof EstimacionMensual
  label: string
}

const ESTIMACION_FIELDS: EstimacionFieldDef[] = [
  { key: 'tortilleria', label: 'Tortillería' },
  { key: 'carniceria', label: 'Carnicería' },
  { key: 'verduleria', label: 'Verdulería / Frutería' },
  { key: 'abarrotes', label: 'Abarrotes' },
  { key: 'transporte', label: 'Transporte público' },
  { key: 'gasolina', label: 'Gasolina' },
]

// ── Formatting helpers ──

function formatMoney(amount: number): string {
  return amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// ── Section title helper ──

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-base font-bold text-primary">
      {children}
    </h3>
  )
}

// ── DiaGastosForm — single day section ──

interface DiaGastosFormProps {
  diaIndex: number
  nombreDia: string
  fecha: string
  gastos: GastosDiariosData['dias'][number]['gastos']
  onAddGasto: (diaIndex: number) => void
  onRemoveGasto: (diaIndex: number, gastoId: string) => void
  onUpdateGasto: (diaIndex: number, gastoId: string, data: { concepto?: string; monto?: number }) => void
}

function DiaGastosForm({
  diaIndex,
  nombreDia,
  fecha,
  gastos,
  onAddGasto,
  onRemoveGasto,
  onUpdateGasto,
}: DiaGastosFormProps) {
  const subtotal = useMemo(
    () => gastos.reduce((sum, g) => sum + (g.monto || 0), 0),
    [gastos]
  )

  const handleAdd = useCallback(() => onAddGasto(diaIndex), [diaIndex, onAddGasto])
  const handleRemove = useCallback(
    (gastoId: string) => onRemoveGasto(diaIndex, gastoId),
    [diaIndex, onRemoveGasto]
  )
  const handleConceptoChange = useCallback(
    (gastoId: string, value: string) => onUpdateGasto(diaIndex, gastoId, { concepto: value }),
    [diaIndex, onUpdateGasto]
  )
  const handleMontoChange = useCallback(
    (gastoId: string, value: string) => {
      onUpdateGasto(diaIndex, gastoId, { monto: value === '' ? 0 : Number(value) })
    },
    [diaIndex, onUpdateGasto]
  )

  return (
    <div className="mb-4 rounded-lg border border-neutral-200">
      {/* Day header */}
      <div className="rounded-t-lg bg-neutral-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-primary">
            {nombreDia} {fecha && <span className="font-normal text-muted">— {fecha}</span>}
          </span>
        </div>
      </div>

      {/* Gasto items */}
      <div className="p-4">
        {gastos.length === 0 && (
          <p className="mb-2 text-sm text-muted">No hay gastos registrados para este día.</p>
        )}
        {gastos.map((gasto) => (
          <div key={gasto.id} className="mb-2 flex items-end gap-3">
            <div className="flex-1">
              <TextInput
                name={`dia-${diaIndex}-gasto-${gasto.id}-concepto`}
                value={gasto.concepto}
                onChange={(v) => handleConceptoChange(gasto.id, v)}
                label="Concepto"
                placeholder="Concepto del gasto"
              />
            </div>
            <div className="w-40">
              <MoneyInput
                name={`dia-${diaIndex}-gasto-${gasto.id}-monto`}
                value={gasto.monto ? String(gasto.monto) : ''}
                onChange={(v) => handleMontoChange(gasto.id, v)}
                label="Monto"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="self-end mb-4 mr-1 rounded-md bg-primary px-2 py-2 text-xs font-medium text-white hover:bg-primary-light"
              aria-label={`Agregar gasto para ${nombreDia}`}
            >
              + Agregar
            </button>
            {gastos.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(gasto.id)}
                className="mb-4 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-danger hover:bg-red-50"
                aria-label="Eliminar gasto"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        {/* Add gasto button (always visible) */}
        <div className="mb-2 flex justify-center">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light"
            aria-label={`Agregar gasto para ${nombreDia}`}
          >
            + Agregar gasto
          </button>
        </div>

        {/* Day subtotal */}
        <div className="mt-2 border-t border-neutral-200 pt-2 text-right">
          <span className="text-sm font-bold text-primary">
            Subtotal del día: ${formatMoney(subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main GastosDiariosStep ──

export function GastosDiariosStep() {
  const folioViv = useAppStore((s) => s.portada.folioViv)
  const folioHog = useAppStore((s) => s.portada.folioHog)
  const gastosDiarios = useAppStore((s) => s.gastosDiarios)
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const setInformante = useAppStore((s) => s.setInformante)
  const addGastoDia = useAppStore((s) => s.addGastoDia)
  const removeGastoDia = useAppStore((s) => s.removeGastoDia)
  const updateGastoDia = useAppStore((s) => s.updateGastoDia)
  const updateEstimacion = useAppStore((s) => s.updateEstimacion)
  const updateGastosDiarios = useAppStore((s) => s.updateGastosDiarios)

  // Sync folioViv/folioHog from Portada
  useEffect(() => {
    if (folioViv && folioHog && (folioViv !== gastosDiarios.folioViv || folioHog !== gastosDiarios.folioHog)) {
      updateGastosDiarios({ folioViv, folioHog } as never)
    }
  }, [folioViv, folioHog, gastosDiarios.folioViv, gastosDiarios.folioHog, updateGastosDiarios])

  // Auto-fill informante name from Hogares integrantes
  const informanteNombre = useMemo(() => {
    const integrante = integrantes.find((i) => i.numPer === gastosDiarios.informanteNumPer)
    return integrante?.nombre ?? ''
  }, [integrantes, gastosDiarios.informanteNumPer])

  const handleEstimacionChange = useCallback(
    (key: keyof EstimacionMensual, value: string) => {
      if (value === '') {
        updateEstimacion({ [key]: undefined } as never)
      } else {
        updateEstimacion({ [key]: Number(value) } as never)
      }
    },
    [updateEstimacion]
  )

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Cuadernillo de Gastos Diarios"
      className="pb-8"
    >
      <h2 className="mb-4 text-lg font-bold text-primary">
        Gastos Diarios — Cuadernillo de Gastos
      </h2>

      {/* Read-only folio fields */}
      <div className="mb-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <ReadOnlyField label="FOLIOVIV" value={folioViv} />
        <ReadOnlyField label="FOLIOHOG" value={folioHog} />
      </div>

      {/* Informante section */}
      <SectionTitle>Informante</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <FieldWrapper label="NUMPER del informante" required htmlFor="code-gastosDiarios-informanteNumPer">
          <input
            id="code-gastosDiarios-informanteNumPer"
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={gastosDiarios.informanteNumPer}
            placeholder="01-99"
            onChange={(e) => setInformante(e.target.value)}
            className="w-20 px-2 py-2 rounded-md border border-neutral-300 text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
          />
        </FieldWrapper>
        <ReadOnlyField label="Nombre del informante" value={informanteNombre} />
      </div>

      {/* 7 days */}
      <SectionTitle>Gastos por Día</SectionTitle>
      {gastosDiarios.dias.map((dia, index) => (
        <DiaGastosForm
          key={index}
          diaIndex={index}
          nombreDia={dia.nombreDia}
          fecha={dia.fecha}
          gastos={dia.gastos}
          onAddGasto={addGastoDia}
          onRemoveGasto={removeGastoDia}
          onUpdateGasto={updateGastoDia}
        />
      ))}

      {/* Estimación Mensual */}
      <SectionTitle>Estimación Mensual</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {ESTIMACION_FIELDS.map((field) => (
          <MoneyInput
            key={field.key}
            name={`gastosDiarios-estimacion-${field.key}`}
            value={
              gastosDiarios.estimacionMensual[field.key] != null
                ? String(gastosDiarios.estimacionMensual[field.key])
                : ''
            }
            onChange={(v) => handleEstimacionChange(field.key, v)}
            label={field.label}
          />
        ))}
      </div>

      {/* Suma total de gastos diarios */}
      <div className="mt-4 rounded-lg bg-primary/10 p-4 text-right">
        <span className="text-base font-bold text-primary">
          Total de gastos diarios: ${formatMoney(
            gastosDiarios.dias.reduce(
              (daySum, dia) => daySum + dia.gastos.reduce((s, g) => s + (g.monto || 0), 0),
              0
            )
          )}
        </span>
      </div>
    </form>
  )
}