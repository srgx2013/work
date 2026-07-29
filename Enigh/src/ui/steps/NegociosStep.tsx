// NegociosStep — Questionnaire 5: Negocios del Hogar.
// First question: ¿Algún integrante del hogar tiene un negocio? (CodeInput 1/2)
// If Sí → renders repeatable negocio form cards with "Agregar negocio" button.
// If No → shows "No aplica — puede continuar" message.
// Read-only folioViv/folioHog from Portada.

import { useEffect } from 'react'
import { useAppStore } from '@/application/store/index'
import { CodeInput } from '@/ui/components/CodeInput'
import { TextInput } from '@/ui/components/TextInput'
import { MoneyInput } from '@/ui/components/MoneyInput'
import { ReadOnlyField } from '@/ui/components/ReadOnlyField'
import type { Negocio } from '@/domain/models/negocios'

const yesNoCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-lg font-bold text-primary">
      {children}
    </h2>
  )
}

// ── NegocioForm — single negocio card ──

interface NegocioFormProps {
  negocio: Negocio
  index: number
  canRemove: boolean
  onUpdate: (id: string, data: Partial<Negocio>) => void
  onRemove: (id: string) => void
}

function NegocioForm({ negocio, index, canRemove, onUpdate, onRemove }: NegocioFormProps) {
  return (
    <div className="mb-4 rounded-lg border border-neutral-200 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-primary">
          Negocio {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(negocio.id)}
            className="rounded-md border border-danger px-2 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger hover:text-white"
            aria-label={`Eliminar negocio ${index + 1}`}
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`negocio-${negocio.id}-numPerOperador`}
          value={negocio.numPerOperador}
          onChange={(v) => onUpdate(negocio.id, { numPerOperador: v })}
          label="NUMPER del operador"
          required
          maxLength={2}
          placeholder="01-99"
        />
        <TextInput
          name={`negocio-${negocio.id}-tipoNegocio`}
          value={negocio.tipoNegocio}
          onChange={(v) => onUpdate(negocio.id, { tipoNegocio: v })}
          label="Tipo de negocio"
          required
          placeholder="Describa el negocio"
        />
        <CodeInput
          name={`negocio-${negocio.id}-esActividadPrincipal`}
          value={negocio.esActividadPrincipal ?? ''}
          onChange={(v) => onUpdate(negocio.id, { esActividadPrincipal: v as never })}
          label="¿Es actividad principal?"
          required
          catalogCodes={yesNoCodes}
          maxLength={1}
          placeholder="1-2"
        />
        <CodeInput
          name={`negocio-${negocio.id}-tieneLocal`}
          value={negocio.tieneLocal ?? ''}
          onChange={(v) => onUpdate(negocio.id, { tieneLocal: v as never })}
          label="¿Tiene local o establecimiento?"
          required
          catalogCodes={yesNoCodes}
          maxLength={1}
          placeholder="1-2"
        />
        <CodeInput
          name={`negocio-${negocio.id}-llevaContabilidad`}
          value={negocio.llevaContabilidad ?? ''}
          onChange={(v) => onUpdate(negocio.id, { llevaContabilidad: v as never })}
          label="¿Lleva contabilidad?"
          required
          catalogCodes={yesNoCodes}
          maxLength={1}
          placeholder="1-2"
        />
        <CodeInput
          name={`negocio-${negocio.id}-dadoAltaHacienda`}
          value={negocio.dadoAltaHacienda ?? ''}
          onChange={(v) => onUpdate(negocio.id, { dadoAltaHacienda: v as never })}
          label="¿Dado de alta en Hacienda?"
          required
          catalogCodes={yesNoCodes}
          maxLength={1}
          placeholder="1-2"
        />
        <MoneyInput
          name={`negocio-${negocio.id}-ingresoMensual`}
          value={negocio.ingresoMensual ? String(negocio.ingresoMensual) : ''}
          onChange={(v) => onUpdate(negocio.id, { ingresoMensual: v ? Number(v) : 0 })}
          label="Ingreso mensual del negocio"
          required
        />
        <MoneyInput
          name={`negocio-${negocio.id}-gastosMensuales`}
          value={negocio.gastosMensuales ? String(negocio.gastosMensuales) : ''}
          onChange={(v) => onUpdate(negocio.id, { gastosMensuales: v ? Number(v) : 0 })}
          label="Gastos mensuales del negocio"
          required
        />
      </div>
    </div>
  )
}

// ── Main NegociosStep ──

export function NegociosStep() {
  const folioViv = useAppStore((s) => s.portada.folioViv)
  const folioHog = useAppStore((s) => s.portada.folioHog)
  const negociosData = useAppStore((s) => s.negocios)
  const updateNegociosData = useAppStore((s) => s.updateNegociosData)
  const addNegocio = useAppStore((s) => s.addNegocio)
  const removeNegocio = useAppStore((s) => s.removeNegocio)
  const updateNegocio = useAppStore((s) => s.updateNegocio)

  const tieneNegocio = negociosData.tieneNegocio
  const negocios = negociosData.negocios

  // Sync folioViv/folioHog from Portada to Negocios data
  useEffect(() => {
    if (folioViv && folioHog && (folioViv !== negociosData.folioViv || folioHog !== negociosData.folioHog)) {
      updateNegociosData({ folioViv, folioHog })
    }
  }, [folioViv, folioHog, negociosData.folioViv, negociosData.folioHog, updateNegociosData])

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Cuestionario de Negocios del Hogar"
      className="pb-8"
    >
      <SectionTitle>Negocios del Hogar</SectionTitle>

      {/* Read-only folio fields */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <ReadOnlyField label="FOLIOVIV" value={folioViv} />
        <ReadOnlyField label="FOLIOHOG" value={folioHog} />
      </div>

      {/* Main question */}
      <div className="mt-4">
        <CodeInput
          name="tieneNegocio"
          value={tieneNegocio}
          onChange={(v) => updateNegociosData({ tieneNegocio: v as never })}
          label="¿Algún integrante del hogar tiene un negocio?"
          required
          catalogCodes={yesNoCodes}
          maxLength={1}
          placeholder="1-2"
        />
      </div>

      {/* Conditional content */}
      {tieneNegocio === '2' && (
        <div className="mt-6 rounded-md bg-neutral-100 p-4 text-center text-muted" role="status">
          <p className="text-base font-medium">
            No aplica — puede continuar
          </p>
          <p className="mt-1 text-sm">
            Este hogar no tiene negocios. Pase al siguiente cuestionario.
          </p>
        </div>
      )}

      {tieneNegocio === '1' && (
        <div className="mt-4">
          {/* Negocio cards */}
          {negocios.map((negocio, index) => (
            <NegocioForm
              key={negocio.id}
              negocio={negocio}
              index={index}
              canRemove={negocios.length > 1}
              onUpdate={updateNegocio}
              onRemove={removeNegocio}
            />
          ))}

          {/* Add negocio button */}
          <button
            type="button"
            onClick={() => addNegocio()}
            className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            + Agregar negocio
          </button>
        </div>
      )}
    </form>
  )
}