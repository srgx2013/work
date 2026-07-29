// PortadaStep — ENIGH-1 cover sheet form.
// Renders all 10 Portada fields using shared components (CodeInput, TextInput,
// DateInput, TextAreaInput). Data persists to Zustand store on change.
// Inline validation runs on blur via Zod's portadaSchema.safeParse on a single field.

import { useCallback } from 'react'
import { useAppStore } from '@/application/store/index'
import { CodeInput } from '@/ui/components/CodeInput'
import { TextInput } from '@/ui/components/TextInput'
import { DateInput } from '@/ui/components/DateInput'
import { TextAreaInput } from '@/ui/components/TextAreaInput'
import { CATALOGS } from '@/domain/constants/catalogs'
import { portadaSchema } from '@/domain/validation/schemas'
import type { PortadaData } from '@/domain/models/portada'
import type { FieldError } from '@/domain/validation/types'

const entidadCodes = Object.values(CATALOGS.entidades)
const resultadoCodes = Object.values(CATALOGS.resultadosEntrevista)
const decenaCodes = [
  { code: '1', label: '1' }, { code: '2', label: '2' }, { code: '3', label: '3' },
  { code: '4', label: '4' }, { code: '5', label: '5' }, { code: '6', label: '6' },
  { code: '7', label: '7' }, { code: '8', label: '8' }, { code: '9', label: '9' },
  { code: '0', label: '0 (decena 10)' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-lg font-bold text-primary">
      {children}
    </h2>
  )
}

export function PortadaStep() {
  const portada = useAppStore((s) => s.portada)
  const updatePortada = useAppStore((s) => s.updatePortada)
  const stepErrors = useAppStore((s) => s.stepErrors)
  const setStepErrors = useAppStore((s) => s.setStepErrors)
  const clearStepErrors = useAppStore((s) => s.clearStepErrors)

  // Build inline error lookup from current persisted stepErrors
  const errors: FieldError[] = stepErrors[1] ?? []
  const inlineError = (field: keyof PortadaData): string | null => {
    const found = errors.find((e) => e.field === field)
    return found ? found.message : null
  }

  // Validate a single field on blur for inline feedback.
  // We run the full schema and look for an error on this field only.
  const validateField = useCallback(
    (field: keyof PortadaData) => {
      const current = useAppStore.getState().portada
      const result = portadaSchema.safeParse(current)
      if (result.success) {
        // Clear this field from any persisted errors
        const remaining = (useAppStore.getState().stepErrors[1] ?? []).filter(
          (e) => e.field !== field
        )
        if (remaining.length === 0) clearStepErrors(1)
        else setStepErrors(1, remaining)
        return
      }
      const fieldError = result.error.issues.find((issue) =>
        issue.path.join('.') === field
      )
      // Merge: remove existing for this field, add new if present
      const prior = (useAppStore.getState().stepErrors[1] ?? []).filter(
        (e) => e.field !== field
      )
      if (fieldError) {
        setStepErrors(1, [
          ...prior,
          { field, message: fieldError.message },
        ])
      } else {
        if (prior.length === 0) clearStepErrors(1)
        else setStepErrors(1, prior)
      }
    },
    [setStepErrors, clearStepErrors]
  )

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Cuestionario de Portada"
      className="pb-8"
    >
      <SectionTitle>Control por Folio</SectionTitle>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="entidad"
          value={portada.entidad}
          onChange={(v) => updatePortada({ entidad: v })}
          onBlur={() => validateField('entidad')}
          label="ENTIDAD"
          required
          maxLength={2}
          error={inlineError('entidad')}
          catalogCodes={entidadCodes}
          placeholder="01-32"
        />

        <CodeInput
          name="decena"
          value={portada.decena}
          onChange={(v) => updatePortada({ decena: v as never })}
          onBlur={() => validateField('decena')}
          label="DECENA"
          required
          maxLength={1}
          error={inlineError('decena')}
          catalogCodes={decenaCodes}
          placeholder="0-9"
        />

        <TextInput
          name="folioViv"
          value={portada.folioViv}
          onChange={(v) => updatePortada({ folioViv: v })}
          onBlur={() => validateField('folioViv')}
          label="FOLIOVIV (10 dígitos)"
          required
          maxLength={10}
          placeholder="10 dígitos"
          error={inlineError('folioViv')}
        />

        <TextInput
          name="folioHog"
          value={portada.folioHog}
          onChange={(v) => updatePortada({ folioHog: v })}
          onBlur={() => validateField('folioHog')}
          label="FOLIOHOG (1 dígito)"
          required
          maxLength={1}
          placeholder="1-5"
          error={inlineError('folioHog')}
        />
      </div>

      <SectionTitle>Datos del Personal</SectionTitle>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <TextInput
          name="nombreEntrevistador"
          value={portada.nombreEntrevistador}
          onChange={(v) => updatePortada({ nombreEntrevistador: v })}
          onBlur={() => validateField('nombreEntrevistador')}
          label="Nombre del Entrevistador"
          required
          placeholder="Nombre completo"
          error={inlineError('nombreEntrevistador')}
          capitalize
        />
        <TextInput
          name="nombreSupervisor"
          value={portada.nombreSupervisor}
          onChange={(v) => updatePortada({ nombreSupervisor: v })}
          onBlur={() => validateField('nombreSupervisor')}
          label="Nombre del Supervisor"
          required
          placeholder="Nombre completo"
          error={inlineError('nombreSupervisor')}
          capitalize
        />
        <CodeInput
          name="resultadoEntrevista"
          value={portada.resultadoEntrevista}
          onChange={(v) => updatePortada({ resultadoEntrevista: v as never })}
          onBlur={() => validateField('resultadoEntrevista')}
          label="Resultado de Entrevista"
          required
          maxLength={2}
          error={inlineError('resultadoEntrevista')}
          catalogCodes={resultadoCodes}
          placeholder="A1-A7"
        />
      </div>

      <SectionTitle>Fechas</SectionTitle>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <DateInput
          name="fechaInicio"
          value={portada.fechaInicio}
          onChange={(v) => updatePortada({ fechaInicio: v })}
          onBlur={() => validateField('fechaInicio')}
          label="Fecha de Inicio (DD/MM/AAAA)"
          required
          error={inlineError('fechaInicio')}
        />
        <DateInput
          name="fechaTermino"
          value={portada.fechaTermino}
          onChange={(v) => updatePortada({ fechaTermino: v })}
          onBlur={() => validateField('fechaTermino')}
          label="Fecha de Término (DD/MM/AAAA)"
          required
          error={inlineError('fechaTermino')}
        />
      </div>

      <SectionTitle>Observaciones</SectionTitle>

      <TextAreaInput
        name="observaciones"
        value={portada.observaciones}
        onChange={(v) => updatePortada({ observaciones: v })}
        label="Observaciones"
        placeholder="Observaciones (opcional)"
        rows={4}
      />
    </form>
  )
}