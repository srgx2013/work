// Personas12PlusStep — dynamic step for "Personas de 12+ años" questionnaire.
// Generates one sub-form per integrante with edad >= 12 from the Hogares store.
// Pre-filled read-only fields: folioViv, folioHog, numPer, nombre, edad, sexo, parentesco.
// 6 sub-sections: Educación, Salud, Actividad Económica, Ingresos No Laborales,
// Gastos Personales (plus read-only general info).

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/application/store/index'
import { CodeInput } from '@/ui/components/CodeInput'
import { TextInput } from '@/ui/components/TextInput'
import { MoneyInput } from '@/ui/components/MoneyInput'
import { ReadOnlyField } from '@/ui/components/ReadOnlyField'
import { CATALOGS } from '@/domain/constants/catalogs'
import type { Integrante } from '@/domain/models/hogares'
import type { Persona12PlusData } from '@/domain/models/personas12plus'

// ── Catalog code arrays ──

const escolaridadCodes = Object.values(CATALOGS.escolaridad)
const tiposEscuelaCodes = Object.values(CATALOGS.tiposEscuela)
const institucionesSaludCodes = Object.values(CATALOGS.institucionesSalud)
const tiposTrabajoCodes = Object.values(CATALOGS.tiposTrabajo)
const yesNoCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
]
const periodicidadCodes = [
  { code: '1', label: 'Semanal' },
  { code: '2', label: 'Quincenal' },
  { code: '3', label: 'Mensual' },
  { code: '4', label: 'Bimestral' },
]

// ── Section title helper ──

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-6 border-b border-neutral-200 pb-1 text-base font-bold text-primary">
      {children}
    </h3>
  )
}

// ── Build a blank Persona12PlusData from an Integrante ──

function buildPersonaFromIntegrante(
  integrante: Integrante,
  folioViv: string,
  folioHog: string
): Persona12PlusData {
  return {
    folioViv,
    folioHog,
    numPer: integrante.numPer,
    nombre: integrante.nombre,
    edad: integrante.edad,
    sexo: integrante.sexo,
    parentesco: integrante.parentesco,
    // II. Educación
    nivelAprobado: '',
    asisteEscuela: '' as never,
    sabeLeerEscribir: '' as never,
    // III. Salud
    tieneDerechohabiencia: '' as never,
    problemaSalud2Semanas: '' as never,
    fuma: '' as never,
    consumeAlcohol: '' as never,
    // IV. Actividad Económica
    trabajoSemanaPasada: '' as never,
    // V. Ingresos No Laborales
    recibeJubilacion: '' as never,
    recibeRemesas: '' as never,
    recibeProgGobierno: '' as never,
    recibeAyudaOtros: '' as never,
  } as Persona12PlusData
}

// ── Label helpers ──

function getSexoLabel(sexo: string): string {
  if (sexo === '1') return 'Hombre'
  if (sexo === '2') return 'Mujer'
  return sexo
}

function getParentescoLabel(parentesco: string): string {
  const entry = CATALOGS.parentescos[parentesco]
  return entry ? entry.label : parentesco
}

// ── Persona12PlusSubForm — fields for a single persona ──

interface Persona12PlusSubFormProps {
  persona: Persona12PlusData
  integrante: Integrante
  onChange: (numPer: string, data: Partial<Persona12PlusData>) => void
}

function Persona12PlusSubForm({ persona, integrante, onChange }: Persona12PlusSubFormProps) {
  const uid = persona.numPer

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label={`Cuestionario 12+ — ${integrante.nombre}`}
      className="pb-8"
    >
      {/* I. Características Generales (read-only) */}
      <SectionTitle>I. Características Generales</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <ReadOnlyField label="Nombre" value={persona.nombre} />
        <ReadOnlyField label="Edad" value={`${persona.edad} años`} />
        <ReadOnlyField label="Sexo" value={getSexoLabel(persona.sexo)} />
        <ReadOnlyField
          label="Parentesco"
          value={getParentescoLabel(persona.parentesco)}
        />
      </div>

      {/* II. Educación */}
      <SectionTitle>II. Educación</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`p12-${uid}-nivelAprobado`}
          value={persona.nivelAprobado ?? ''}
          onChange={(v) => onChange(persona.numPer, { nivelAprobado: v })}
          label="Nivel más alto aprobado"
          required
          catalogCodes={escolaridadCodes}
          placeholder="00-10"
          maxLength={2}
        />
        <CodeInput
          name={`p12-${uid}-asisteEscuela`}
          value={persona.asisteEscuela ?? ''}
          onChange={(v) => onChange(persona.numPer, { asisteEscuela: v as never })}
          label="¿Asiste actualmente a la escuela?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {persona.asisteEscuela === '1' && (
          <CodeInput
            name={`p12-${uid}-tipoEscuela`}
            value={persona.tipoEscuela ?? ''}
            onChange={(v) => onChange(persona.numPer, { tipoEscuela: v })}
            label="Tipo de escuela"
            required
            catalogCodes={tiposEscuelaCodes}
            placeholder="1-2"
            maxLength={1}
          />
        )}
        <CodeInput
          name={`p12-${uid}-sabeLeerEscribir`}
          value={persona.sabeLeerEscribir ?? ''}
          onChange={(v) => onChange(persona.numPer, { sabeLeerEscribir: v as never })}
          label="¿Sabe leer y escribir?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
      </div>

      {/* III. Salud */}
      <SectionTitle>III. Salud</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`p12-${uid}-tieneDerechohabiencia`}
          value={persona.tieneDerechohabiencia ?? ''}
          onChange={(v) => onChange(persona.numPer, { tieneDerechohabiencia: v as never })}
          label="¿Tiene derechohabiencia?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {persona.tieneDerechohabiencia === '1' && (
          <CodeInput
            name={`p12-${uid}-institucionSalud`}
            value={persona.institucionSalud ?? ''}
            onChange={(v) => onChange(persona.numPer, { institucionSalud: v })}
            label="Institución de salud"
            required
            catalogCodes={institucionesSaludCodes}
            placeholder="1-8"
            maxLength={1}
          />
        )}
        <CodeInput
          name={`p12-${uid}-problemaSalud2Semanas`}
          value={persona.problemaSalud2Semanas ?? ''}
          onChange={(v) => onChange(persona.numPer, { problemaSalud2Semanas: v as never })}
          label="¿Problema de salud en últimas 2 semanas?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        <CodeInput
          name={`p12-${uid}-fuma`}
          value={persona.fuma ?? ''}
          onChange={(v) => onChange(persona.numPer, { fuma: v as never })}
          label="¿Fuma?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        <CodeInput
          name={`p12-${uid}-consumeAlcohol`}
          value={persona.consumeAlcohol ?? ''}
          onChange={(v) => onChange(persona.numPer, { consumeAlcohol: v as never })}
          label="¿Consume alcohol?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {persona.consumeAlcohol === '1' && (
          <TextInput
            name={`p12-${uid}-frecuenciaAlcohol`}
            value={persona.frecuenciaAlcohol ?? ''}
            onChange={(v) => onChange(persona.numPer, { frecuenciaAlcohol: v })}
            label="Frecuencia de consumo de alcohol"
            placeholder="Ej: diario, semanal, ocasional"
          />
        )}
      </div>

      {/* IV. Actividad Económica */}
      <SectionTitle>IV. Actividad Económica</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`p12-${uid}-trabajoSemanaPasada`}
          value={persona.trabajoSemanaPasada ?? ''}
          onChange={(v) => onChange(persona.numPer, { trabajoSemanaPasada: v as never })}
          label="¿Trabajó la semana pasada?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />

        {/* Conditional: trabajoSemanaPasada = '1' → work fields */}
        {persona.trabajoSemanaPasada === '1' && (
          <>
            <TextInput
              name={`p12-${uid}-ocupacionPrincipal`}
              value={persona.ocupacionPrincipal ?? ''}
              onChange={(v) => onChange(persona.numPer, { ocupacionPrincipal: v })}
              label="Ocupación principal"
              required
              placeholder="Ej: Maestro, Comerciante"
            />
            <CodeInput
              name={`p12-${uid}-tipoTrabajo`}
              value={persona.tipoTrabajo ?? ''}
              onChange={(v) => onChange(persona.numPer, { tipoTrabajo: v })}
              label="Tipo de trabajo"
              required
              catalogCodes={tiposTrabajoCodes}
              placeholder="1-4"
              maxLength={1}
            />
            <TextInput
              name={`p12-${uid}-horasTrabajadas`}
              value={persona.horasTrabajadas !== undefined ? String(persona.horasTrabajadas) : ''}
              onChange={(v) => onChange(persona.numPer, { horasTrabajadas: v ? Number(v) : undefined })}
              label="Horas trabajadas (1-168)"
              required
              placeholder="Ej: 40"
            />
            <MoneyInput
              name={`p12-${uid}-ingresoMensualNeto`}
              value={persona.ingresoMensualNeto !== undefined ? String(persona.ingresoMensualNeto) : ''}
              onChange={(v) => onChange(persona.numPer, { ingresoMensualNeto: v ? Number(v) : undefined })}
              label="Ingreso mensual neto"
              required
            />
            <CodeInput
              name={`p12-${uid}-recibeAguinaldo`}
              value={persona.recibeAguinaldo ?? ''}
              onChange={(v) => onChange(persona.numPer, { recibeAguinaldo: v })}
              label="¿Recibe aguinaldo?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            <CodeInput
              name={`p12-${uid}-recibeVacaciones`}
              value={persona.recibeVacaciones ?? ''}
              onChange={(v) => onChange(persona.numPer, { recibeVacaciones: v })}
              label="¿Recibe vacaciones pagadas?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            <CodeInput
              name={`p12-${uid}-contratoEscrito`}
              value={persona.contratoEscrito ?? ''}
              onChange={(v) => onChange(persona.numPer, { contratoEscrito: v })}
              label="¿Tiene contrato escrito?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            <CodeInput
              name={`p12-${uid}-prestacionesLey`}
              value={persona.prestacionesLey ?? ''}
              onChange={(v) => onChange(persona.numPer, { prestacionesLey: v })}
              label="¿Recibe prestaciones de ley?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            <CodeInput
              name={`p12-${uid}-tieneOtroTrabajo`}
              value={persona.tieneOtroTrabajo ?? ''}
              onChange={(v) => onChange(persona.numPer, { tieneOtroTrabajo: v })}
              label="¿Tiene otro trabajo?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
          </>
        )}

        {/* Conditional: trabajoSemanaPasada = '2' → not working fields */}
        {persona.trabajoSemanaPasada === '2' && (
          <>
            <CodeInput
              name={`p12-${uid}-buscaTrabajo`}
              value={persona.buscaTrabajo ?? ''}
              onChange={(v) => onChange(persona.numPer, { buscaTrabajo: v })}
              label="¿Busca trabajo?"
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            <TextInput
              name={`p12-${uid}-motivoNoTrabaja`}
              value={persona.motivoNoTrabaja ?? ''}
              onChange={(v) => onChange(persona.numPer, { motivoNoTrabaja: v })}
              label="Motivo por el cual no trabaja"
              placeholder="Ej: estudiante, jubilado, hogar"
            />
          </>
        )}
      </div>

      {/* V. Ingresos No Laborales */}
      <SectionTitle>V. Ingresos No Laborales</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name={`p12-${uid}-recibeJubilacion`}
          value={persona.recibeJubilacion ?? ''}
          onChange={(v) => onChange(persona.numPer, { recibeJubilacion: v as never })}
          label="¿Recibe jubilación o pensión?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        <CodeInput
          name={`p12-${uid}-recibeRemesas`}
          value={persona.recibeRemesas ?? ''}
          onChange={(v) => onChange(persona.numPer, { recibeRemesas: v as never })}
          label="¿Recibe remesas?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        <CodeInput
          name={`p12-${uid}-recibeProgGobierno`}
          value={persona.recibeProgGobierno ?? ''}
          onChange={(v) => onChange(persona.numPer, { recibeProgGobierno: v as never })}
          label="¿Recibe programa de gobierno?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {persona.recibeProgGobierno === '1' && (
          <>
            <TextInput
              name={`p12-${uid}-progGobiernoNombre`}
              value={persona.progGobiernoNombre ?? ''}
              onChange={(v) => onChange(persona.numPer, { progGobiernoNombre: v })}
              label="Nombre del programa"
              required
              placeholder="Ej: Bienestar, Prospera"
            />
            <MoneyInput
              name={`p12-${uid}-progGobiernoMonto`}
              value={persona.progGobiernoMonto !== undefined ? String(persona.progGobiernoMonto) : ''}
              onChange={(v) => onChange(persona.numPer, { progGobiernoMonto: v ? Number(v) : undefined })}
              label="Monto del programa"
              required
            />
            <CodeInput
              name={`p12-${uid}-progGobiernoPeriodicidad`}
              value={persona.progGobiernoPeriodicidad ?? ''}
              onChange={(v) => onChange(persona.numPer, { progGobiernoPeriodicidad: v })}
              label="Periodicidad"
              required
              catalogCodes={periodicidadCodes}
              placeholder="1-4"
              maxLength={1}
            />
          </>
        )}
        <CodeInput
          name={`p12-${uid}-recibeAyudaOtros`}
          value={persona.recibeAyudaOtros ?? ''}
          onChange={(v) => onChange(persona.numPer, { recibeAyudaOtros: v as never })}
          label="¿Recibe ayuda de otros hogares?"
          required
          catalogCodes={yesNoCodes}
          placeholder="1-2"
          maxLength={1}
        />
        {persona.recibeAyudaOtros === '1' && (
          <>
            <MoneyInput
              name={`p12-${uid}-ayudaMonto`}
              value={persona.ayudaMonto !== undefined ? String(persona.ayudaMonto) : ''}
              onChange={(v) => onChange(persona.numPer, { ayudaMonto: v ? Number(v) : undefined })}
              label="Monto de la ayuda"
              required
            />
            <CodeInput
              name={`p12-${uid}-ayudaPeriodicidad`}
              value={persona.ayudaPeriodicidad ?? ''}
              onChange={(v) => onChange(persona.numPer, { ayudaPeriodicidad: v })}
              label="Periodicidad de la ayuda"
              required
              catalogCodes={periodicidadCodes}
              placeholder="1-4"
              maxLength={1}
            />
          </>
        )}
      </div>

      {/* VI. Gastos Personales */}
      <SectionTitle>VI. Gastos Personales</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <MoneyInput
          name={`p12-${uid}-gastosTransporte`}
          value={persona.gastosTransporte !== undefined ? String(persona.gastosTransporte) : ''}
          onChange={(v) => onChange(persona.numPer, { gastosTransporte: v ? Number(v) : undefined })}
          label="Transporte público mensual"
        />
        <MoneyInput
          name={`p12-${uid}-gastosComidasFuera`}
          value={persona.gastosComidasFuera !== undefined ? String(persona.gastosComidasFuera) : ''}
          onChange={(v) => onChange(persona.numPer, { gastosComidasFuera: v ? Number(v) : undefined })}
          label="Comidas fuera semanal"
        />
        <MoneyInput
          name={`p12-${uid}-gastosCuidadoPersonal`}
          value={persona.gastosCuidadoPersonal !== undefined ? String(persona.gastosCuidadoPersonal) : ''}
          onChange={(v) => onChange(persona.numPer, { gastosCuidadoPersonal: v ? Number(v) : undefined })}
          label="Cuidado personal mensual"
        />
        <MoneyInput
          name={`p12-${uid}-gastosEntretenimiento`}
          value={persona.gastosEntretenimiento !== undefined ? String(persona.gastosEntretenimiento) : ''}
          onChange={(v) => onChange(persona.numPer, { gastosEntretenimiento: v ? Number(v) : undefined })}
          label="Entretenimiento mensual"
        />
      </div>
    </form>
  )
}

// ── Main component ──

export function Personas12PlusStep() {
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const folioViv = useAppStore((s) => s.portada.folioViv)
  const folioHog = useAppStore((s) => s.portada.folioHog)
  const personas12plus = useAppStore((s) => s.personas12plus)
  const setPersonas = useAppStore((s) => s.setPersonas)
  const updatePersona12 = useAppStore((s) => s.updatePersona12)
  const currentSubStep = useAppStore((s) => s.currentSubStep)
  const setCurrentSubStep = useAppStore((s) => s.setCurrentSubStep)

  // Derive personas 12+ from Hogares integrantes (edad >= 12)
  const personasIntegrantes = integrantes.filter((i) => i.edad >= 12)

  // Auto-initialize/sync personas12+ data from Hogares integrantes
  useEffect(() => {
    if (personasIntegrantes.length === 0) {
      if (personas12plus.personas.length > 0) setPersonas([])
      return
    }

    const existingNumPers = new Set(personas12plus.personas.map((p) => p.numPer))
    const currentNumPers = new Set(personasIntegrantes.map((i) => i.numPer))

    const needsRebuild =
      existingNumPers.size !== currentNumPers.size ||
      [...currentNumPers].some((np) => !existingNumPers.has(np))

    if (needsRebuild) {
      const newPersonas = personasIntegrantes.map((integrante) => {
        const existing = personas12plus.personas.find((p) => p.numPer === integrante.numPer)
        if (existing) {
          return {
            ...existing,
            nombre: integrante.nombre,
            edad: integrante.edad,
            sexo: integrante.sexo,
            parentesco: integrante.parentesco,
            folioViv,
            folioHog,
          }
        }
        return buildPersonaFromIntegrante(integrante, folioViv, folioHog)
      })
      setPersonas(newPersonas)
    }
  }, [personasIntegrantes, personas12plus.personas, setPersonas, folioViv, folioHog])

  // Clamp currentSubStep if out of range
  useEffect(() => {
    if (currentSubStep >= personasIntegrantes.length && personasIntegrantes.length > 0) {
      setCurrentSubStep(0)
    }
  }, [currentSubStep, personasIntegrantes.length, setCurrentSubStep])

  const handleTabClick = useCallback(
    (index: number) => {
      setCurrentSubStep(index)
    },
    [setCurrentSubStep]
  )

  // ── Empty state ──
  if (personasIntegrantes.length === 0) {
    return (
      <div className="py-8 text-center text-muted" role="status">
        <h2 className="text-xl font-bold text-primary">
          No hay integrantes de 12 o más años en este hogar.
        </h2>
        <p className="mt-2">Pase al siguiente cuestionario.</p>
      </div>
    )
  }

  // ── Active persona ──
  const activeIndex = Math.min(currentSubStep, personasIntegrantes.length - 1)
  const activeIntegrante = personasIntegrantes[activeIndex]
  const activePersona = personas12plus.personas.find(
    (p) => p.numPer === activeIntegrante?.numPer
  )

  return (
    <div className="pb-8">
      <h2 className="mb-4 text-lg font-bold text-primary">
        Cuestionario de Personas de 12 o más Años
      </h2>

      {/* Sub-step tabs (only if more than 1 persona) */}
      {personasIntegrantes.length > 1 && (
        <div
          className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-2"
          role="tablist"
          aria-label="Seleccione persona"
        >
          {personasIntegrantes.map((integrante, i) => (
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

      {/* Single persona badge */}
      {personasIntegrantes.length === 1 && (
        <div className="mb-4 inline-block rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white">
          {activeIntegrante.nombre} ({activeIntegrante.edad} años)
        </div>
      )}

      {/* Active sub-form */}
      {activePersona && activeIntegrante && (
        <Persona12PlusSubForm
          persona={activePersona}
          integrante={activeIntegrante}
          onChange={updatePersona12}
        />
      )}
    </div>
  )
}