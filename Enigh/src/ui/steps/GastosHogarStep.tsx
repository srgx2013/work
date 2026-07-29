// GastosHogarStep — Questionnaire 6: Gastos del Hogar (Trimestral).
// 8 collapsible sections with MoneyInput fields. All amounts in pesos,
// quarterly (trimestre julio-septiembre 2024).
// Section subtotals and grand total shown.
// Read-only folioViv/folioHog from Portada.

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useAppStore } from '@/application/store/index'
import { MoneyInput } from '@/ui/components/MoneyInput'
import { ReadOnlyField } from '@/ui/components/ReadOnlyField'
import type { GastosHogarData } from '@/domain/models/gastosHogar'

// ── Types ──

interface FieldDef {
  key: keyof GastosHogarData
  label: string
}

interface SectionDef {
  title: string
  fields: FieldDef[]
}

// ── Section definitions (spec section 7.1) ──

const SECTIONS: SectionDef[] = [
  {
    title: 'Sección I — Alimentos, Bebidas y Tabaco',
    fields: [
      { key: 'alimentosCarnes', label: 'Carnes' },
      { key: 'alimentosCereales', label: 'Cereales' },
      { key: 'alimentosVerduras', label: 'Verduras y legumbres' },
      { key: 'alimentosFrutas', label: 'Frutas' },
      { key: 'alimentosLacteos', label: 'Leche y derivados' },
      { key: 'alimentosHuevo', label: 'Huevo' },
      { key: 'alimentosAceites', label: 'Aceites y grasas' },
      { key: 'alimentosAzucar', label: 'Azúcar y mieles' },
      { key: 'alimentosCafe', label: 'Café/té/chocolate' },
      { key: 'alimentosBebidasNoAlcohol', label: 'Bebidas no alcohólicas' },
      { key: 'alimentosBebidasAlcohol', label: 'Bebidas alcohólicas' },
      { key: 'alimentosFueraHogar', label: 'Alimentos fuera del hogar' },
      { key: 'alimentosOtros', label: 'Otros alimentos' },
    ],
  },
  {
    title: 'Sección II — Transporte y Comunicaciones',
    fields: [
      { key: 'transportePublico', label: 'Transporte público' },
      { key: 'gasolina', label: 'Gasolina' },
      { key: 'mantenimientoAuto', label: 'Mantenimiento del auto' },
      { key: 'telefonoCelular', label: 'Teléfono celular' },
      { key: 'internet', label: 'Internet' },
    ],
  },
  {
    title: 'Sección III — Vivienda y Servicios',
    fields: [
      { key: 'viviendaRenta', label: 'Renta' },
      { key: 'viviendaElectricidad', label: 'Electricidad' },
      { key: 'viviendaAgua', label: 'Agua' },
      { key: 'viviendaGas', label: 'Gas' },
      { key: 'viviendaPredial', label: 'Predial' },
      { key: 'viviendaMantenimiento', label: 'Mantenimiento del hogar' },
    ],
  },
  {
    title: 'Sección IV — Educación y Esparcimiento',
    fields: [
      { key: 'educacionUtiles', label: 'Útiles escolares' },
      { key: 'educacionUniformes', label: 'Uniformes' },
      { key: 'educacionCuotas', label: 'Cuotas escolares' },
      { key: 'educacionEntretenimiento', label: 'Cine/eventos/entretenimiento' },
    ],
  },
  {
    title: 'Sección V — Salud',
    fields: [
      { key: 'saludMedicamentos', label: 'Medicamentos' },
      { key: 'saludConsultas', label: 'Consultas médicas' },
      { key: 'saludLentes', label: 'Lentes o aparatos' },
    ],
  },
  {
    title: 'Sección VI — Vestido y Calzado',
    fields: [
      { key: 'vestidoRopa', label: 'Ropa' },
      { key: 'vestidoCalzado', label: 'Calzado' },
    ],
  },
  {
    title: 'Sección VII — Cuidados Personales',
    fields: [
      { key: 'cuidadosHigiene', label: 'Jabón/shampoo/pasta dental' },
      { key: 'cuidadosEstetica', label: 'Corte de cabello/estética' },
      { key: 'cuidadosPañales', label: 'Pañales/toallas' },
    ],
  },
  {
    title: 'Sección VIII — Enseres Domésticos y Limpieza',
    fields: [
      { key: 'enseresDetergentes', label: 'Detergentes y limpiadores' },
      { key: 'enseresUtensilios', label: 'Utensilios de cocina' },
      { key: 'enseresBlancos', label: 'Blancos (sábanas, toallas)' },
    ],
  },
]

// ── Formatting helpers ──

function formatMoney(amount: number): string {
  return amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// ── CollapsibleSection ──

interface CollapsibleSectionProps {
  section: SectionDef
  gastosHogar: GastosHogarData
  onFieldChange: (key: keyof GastosHogarData, value: string) => void
  sectionIndex: number
  isExpanded: boolean
  onToggle: () => void
}

function CollapsibleSection({
  section,
  gastosHogar,
  onFieldChange,
  sectionIndex,
  isExpanded,
  onToggle,
}: CollapsibleSectionProps) {
  const subtotal = useMemo(() => {
    return section.fields.reduce((sum, field) => {
      const val = gastosHogar[field.key]
      return sum + (typeof val === 'number' ? val : 0)
    }, 0)
  }, [section.fields, gastosHogar])

  return (
    <div className="mb-4 rounded-lg border border-neutral-200">
      {/* Section header — clickable */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-t-lg bg-neutral-50 px-4 py-3 text-left transition-colors hover:bg-neutral-100"
        aria-label={`Sección ${sectionIndex + 1}`}
        aria-expanded={isExpanded}
      >
        <span className="text-base font-bold text-primary">
          {section.title}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted">
            Subtotal: ${formatMoney(subtotal)}
          </span>
          <span
            className={`text-lg text-muted transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          >
            ▶
          </span>
        </div>
      </button>

      {/* Section fields — only when expanded */}
      {isExpanded && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 p-4 sm:grid-cols-2">
          {section.fields.map((field) => (
            <MoneyInput
              key={field.key}
              name={`gastosHogar-${field.key}`}
              value={
                gastosHogar[field.key] != null
                  ? String(gastosHogar[field.key])
                  : ''
              }
              onChange={(v) => onFieldChange(field.key, v)}
              label={field.label}
            />
          ))}
          {/* Subtotal row inside expanded section */}
          <div className="col-span-full mt-2 border-t border-neutral-200 pt-2 text-right text-sm font-bold text-primary">
            Subtotal: ${formatMoney(subtotal)}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main GastosHogarStep ──

export function GastosHogarStep() {
  const folioViv = useAppStore((s) => s.portada.folioViv)
  const folioHog = useAppStore((s) => s.portada.folioHog)
  const gastosHogar = useAppStore((s) => s.gastosHogar)
  const updateGastosHogar = useAppStore((s) => s.updateGastosHogar)

  // Sync folioViv/folioHog from Portada to GastosHogar data
  useEffect(() => {
    if (folioViv && folioHog && (folioViv !== gastosHogar.folioViv || folioHog !== gastosHogar.folioHog)) {
      updateGastosHogar({ folioViv, folioHog } as never)
    }
  }, [folioViv, folioHog, gastosHogar.folioViv, gastosHogar.folioHog, updateGastosHogar])

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    () => new Set(SECTIONS.map((_, i) => i)) // all expanded by default
  )

  const handleToggle = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const handleFieldChange = useCallback(
    (key: keyof GastosHogarData, value: string) => {
      if (value === '') {
        updateGastosHogar({ [key]: undefined } as never)
      } else {
        updateGastosHogar({ [key]: Number(value) } as never)
      }
    },
    [updateGastosHogar]
  )

  // Grand total
  const grandTotal = useMemo(() => {
    return SECTIONS.reduce((sectionSum, section) => {
      return (
        sectionSum +
        section.fields.reduce((fieldSum, field) => {
          const val = gastosHogar[field.key]
          return fieldSum + (typeof val === 'number' ? val : 0)
        }, 0)
      )
    }, 0)
  }, [gastosHogar])

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Cuestionario de Gastos del Hogar (Trimestral)"
      className="pb-8"
    >
      <h2 className="mb-4 text-lg font-bold text-primary">
        Gastos del Hogar — Trimestre julio-septiembre 2024
      </h2>

      {/* Read-only folio fields */}
      <div className="mb-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <ReadOnlyField label="FOLIOVIV" value={folioViv} />
        <ReadOnlyField label="FOLIOHOG" value={folioHog} />
      </div>

      {/* 8 collapsible sections */}
      {SECTIONS.map((section, index) => (
        <CollapsibleSection
          key={index}
          section={section}
          gastosHogar={gastosHogar}
          onFieldChange={handleFieldChange}
          sectionIndex={index}
          isExpanded={expandedSections.has(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}

      {/* Grand total */}
      <div className="mt-4 rounded-lg bg-primary/10 p-4 text-right">
        <span className="text-base font-bold text-primary">
          Total trimestral: ${formatMoney(grandTotal)}
        </span>
      </div>
    </form>
  )
}