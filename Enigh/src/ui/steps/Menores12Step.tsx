// Menores12Step — dynamic step for "Menores de 12 años" questionnaire.
// Generates one sub-form per integrante with edad < 12 from the Hogares store.
// Pre-filled read-only fields: folioViv, folioHog, numPer, nombre, edad, sexo.
// Sub-step tabs allow switching between multiple menores.

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/application/store/index'
import { CodeInput } from '@/ui/components/CodeInput'
import { ReadOnlyField } from '@/ui/components/ReadOnlyField'
import { CATALOGS } from '@/domain/constants/catalogs'
import type { Integrante } from '@/domain/models/hogares'
import type { Menor12Data } from '@/domain/models/menores12'

// ── Catalog code arrays ──

const institucionesSaludCodes = Object.values(CATALOGS.institucionesSalud)
const tiposEscuelaCodes = Object.values(CATALOGS.tiposEscuela)
const quienCuidaCodes = Object.values(CATALOGS.quienCuida)
const escolaridadCodes = Object.values(CATALOGS.escolaridad)
const yesNoCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
]
const yesNoUnkCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
  { code: '9', label: 'No sabe' },
]

// ── Section title helper ──

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-base font-bold text-primary">
      {children}
    </h3>
  )
}

// ── Build a blank Menor12Data from an Integrante ──

function buildMenorFromIntegrante(integrante: Integrante, folioViv: string, folioHog: string): Menor12Data {
  return {
    folioViv,
    folioHog,
    numPer: integrante.numPer,
    nombre: integrante.nombre,
    edad: integrante.edad,
    sexo: integrante.sexo,
    tieneDerechohabiencia: '' as never,
    institucionSalud: '',
    problemaSalud2Semanas: '' as never,
    vacunacionCompleta: '' as never,
    asisteEscuela: '' as never,
    gradoEscolar: '',
    tipoEscuela: '',
    recibeBeca: '' as never,
    quienCuida: '',
  } as Menor12Data
}

// ── Menor12SubForm — fields for a single menor ──

interface Menor12SubFormProps {
  menor: Menor12Data
  integrante: Integrante
  onChange: (numPer: string, data: Partial<Menor12Data>) => void
}

function getSexoLabel(sexo: string): string {
  if (sexo === '1') return 'Hombre'
  if (sexo === '2') return 'Mujer'
  return sexo
}

function Menor12SubForm({ menor, integrante, onChange }: Menor12SubFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label={`Cuestionario Menores 12 — ${integrante.nombre}`}
      className="pb-8"
    >
      {/* Read-only pre-filled fields */}
      <SectionTitle>Datos del Integrante (Solo lectura)</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <ReadOnlyField label="Nombre" value={menor.nombre} />
        <ReadOnlyField label="Edad" value={`${menor.edad} años`} />
        <ReadOnlyField label="Sexo" value={getSexoLabel(menor.sexo)} />
      </div>

      {/* Salud */}
      <SectionTitle>Salud</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`menor12-${menor.numPer}-tieneDerechohabiencia`}
          value={menor.tieneDerechohabiencia ?? ''}
          onChange={(v) => onChange(menor.numPer, { tieneDerechohabiencia: v as never })}
          label="¿Tiene derechohabiencia?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {menor.tieneDerechohabiencia === '1' && (
          <CodeInput
            name={`menor12-${menor.numPer}-institucionSalud`}
            value={menor.institucionSalud ?? ''}
            onChange={(v) => onChange(menor.numPer, { institucionSalud: v })}
            label="Institución de salud"
            required
            catalogCodes={institucionesSaludCodes}
            placeholder="1-8"
            maxLength={1}
          />
        )}
        <CodeInput
          name={`menor12-${menor.numPer}-problemaSalud2Semanas`}
          value={menor.problemaSalud2Semanas ?? ''}
          onChange={(v) => onChange(menor.numPer, { problemaSalud2Semanas: v as never })}
          label="¿Problema de salud en últimas 2 semanas?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        <CodeInput
          name={`menor12-${menor.numPer}-vacunacionCompleta`}
          value={menor.vacunacionCompleta ?? ''}
          onChange={(v) => onChange(menor.numPer, { vacunacionCompleta: v as never })}
          label="¿Vacunación completa para su edad?"
          required
          catalogCodes={yesNoUnkCodes}
          placeholder="1,2,9"
          maxLength={1}
        />
      </div>

      {/* Educación */}
      <SectionTitle>Educación</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`menor12-${menor.numPer}-asisteEscuela`}
          value={menor.asisteEscuela ?? ''}
          onChange={(v) => onChange(menor.numPer, { asisteEscuela: v as never })}
          label="¿Asiste a la escuela?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {menor.asisteEscuela === '1' && (
          <>
            <CodeInput
              name={`menor12-${menor.numPer}-gradoEscolar`}
              value={menor.gradoEscolar ?? ''}
              onChange={(v) => onChange(menor.numPer, { gradoEscolar: v })}
              label="Grado que cursa"
              required
              catalogCodes={escolaridadCodes}
              placeholder="00-10"
              maxLength={2}
            />
            <CodeInput
              name={`menor12-${menor.numPer}-tipoEscuela`}
              value={menor.tipoEscuela ?? ''}
              onChange={(v) => onChange(menor.numPer, { tipoEscuela: v })}
              label="Tipo de escuela"
              required
              catalogCodes={tiposEscuelaCodes}
              placeholder="1-2"
              maxLength={1}
            />
          </>
        )}
        <CodeInput
          name={`menor12-${menor.numPer}-recibeBeca`}
          value={menor.recibeBeca ?? ''}
          onChange={(v) => onChange(menor.numPer, { recibeBeca: v as never })}
          label="¿Recibió beca escolar?"
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
      </div>

      {/* Cuidado */}
      <SectionTitle>Cuidado</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`menor12-${menor.numPer}-quienCuida`}
          value={menor.quienCuida ?? ''}
          onChange={(v) => onChange(menor.numPer, { quienCuida: v })}
          label="¿Quién lo/la cuida durante el día?"
          required
          catalogCodes={quienCuidaCodes}
          placeholder="1-4"
          maxLength={1}
        />
      </div>
    </form>
  )
}

// ── Main component ──

export function Menores12Step() {
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const folioViv = useAppStore((s) => s.portada.folioViv)
  const folioHog = useAppStore((s) => s.portada.folioHog)
  const menores12 = useAppStore((s) => s.menores12)
  const setMenores = useAppStore((s) => s.setMenores)
  const updateMenor12 = useAppStore((s) => s.updateMenor12)
  const currentSubStep = useAppStore((s) => s.currentSubStep)
  const setCurrentSubStep = useAppStore((s) => s.setCurrentSubStep)

  // Derive menores from Hogares integrantes (edad < 12)
  const menoresIntegrantes = integrantes.filter((i) => i.edad < 12)

  // Auto-initialize/sync menores12 data from Hogares integrantes
  // When integrantes change (e.g., user adds/removes in Hogares step),
  // we rebuild the menores list preserving existing data for unchanged numPers.
  useEffect(() => {
    if (menoresIntegrantes.length === 0) {
      if (menores12.menores.length > 0) setMenores([])
      return
    }

    // Check if we need to rebuild — if the set of numPers doesn't match
    const existingNumPers = new Set(menores12.menores.map((m) => m.numPer))
    const currentNumPers = new Set(menoresIntegrantes.map((i) => i.numPer))

    const needsRebuild =
      existingNumPers.size !== currentNumPers.size ||
      [...currentNumPers].some((np) => !existingNumPers.has(np))

    if (needsRebuild) {
      // Build new menores array, preserving existing data for matching numPers
      const newMenores = menoresIntegrantes.map((integrante) => {
        const existing = menores12.menores.find((m) => m.numPer === integrante.numPer)
        if (existing) {
          // Update nombre/edad/sexo from integrante (in case they changed)
          return {
            ...existing,
            nombre: integrante.nombre,
            edad: integrante.edad,
            sexo: integrante.sexo,
            folioViv,
            folioHog,
          }
        }
        return buildMenorFromIntegrante(integrante, folioViv, folioHog)
      })
      setMenores(newMenores)
    }
  }, [menoresIntegrantes, menores12.menores, setMenores, folioViv, folioHog])

  // Clamp currentSubStep if out of range
  useEffect(() => {
    if (currentSubStep >= menoresIntegrantes.length && menoresIntegrantes.length > 0) {
      setCurrentSubStep(0)
    }
  }, [currentSubStep, menoresIntegrantes.length, setCurrentSubStep])

  const handleTabClick = useCallback(
    (index: number) => {
      setCurrentSubStep(index)
    },
    [setCurrentSubStep]
  )

  // ── Empty state ──
  if (menoresIntegrantes.length === 0) {
    return (
      <div className="py-8 text-center text-muted" role="status">
        <h2 className="text-xl font-bold text-primary">
          No hay integrantes menores de 12 años en este hogar.
        </h2>
        <p className="mt-2">Pase al siguiente cuestionario.</p>
      </div>
    )
  }

  // ── Active menor ──
  const activeIndex = Math.min(currentSubStep, menoresIntegrantes.length - 1)
  const activeIntegrante = menoresIntegrantes[activeIndex]
  const activeMenor = menores12.menores.find(
    (m) => m.numPer === activeIntegrante?.numPer
  )

  return (
    <div className="pb-8">
      <h2 className="mb-4 text-lg font-bold text-primary">
        Cuestionario de Menores de 12 Años
      </h2>

      {/* Sub-step tabs (only if more than 1 menor) */}
      {menoresIntegrantes.length > 1 && (
        <div
          className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-2"
          role="tablist"
          aria-label="Seleccione menor"
        >
          {menoresIntegrantes.map((integrante, i) => (
            <button
              key={integrante.numPer}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => handleTabClick(i)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                i === activeIndex
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-muted hover:bg-neutral-200'
              }`}
              aria-label={integrante.nombre}
            >
              {integrante.nombre} ({integrante.edad} años)
            </button>
          ))}
        </div>
      )}

      {/* Single menor tab label (still show the name badge) */}
      {menoresIntegrantes.length === 1 && (
        <div className="mb-4 inline-block rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white">
          {activeIntegrante.nombre} ({activeIntegrante.edad} años)
        </div>
      )}

      {/* Active sub-form */}
      {activeMenor && activeIntegrante && (
        <Menor12SubForm
          menor={activeMenor}
          integrante={activeIntegrante}
          onChange={updateMenor12}
        />
      )}
    </div>
  )
}