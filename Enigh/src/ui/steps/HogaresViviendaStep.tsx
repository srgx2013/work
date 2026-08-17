// HogaresViviendaStep — the most complex wizard step.
// Organized as 5 sub-sections: Vivienda, Residentes (dynamic), Ingresos, Alimentación, Clima.

import { useAppStore } from '@/application/store/index'
import { CodeInput } from '@/ui/components/CodeInput'
import { TextInput } from '@/ui/components/TextInput'
import { DateInput } from '@/ui/components/DateInput'
import { MoneyInput } from '@/ui/components/MoneyInput'
import { CATALOGS } from '@/domain/constants/catalogs'
import type { HogaresViviendaData, Integrante, IngresoIntegrante } from '@/domain/models/hogares'

// ── Catalog code arrays ──

const claseViviendaCodes = Object.values(CATALOGS.clasesVivienda)
const materialParedesCodes = Object.values(CATALOGS.materialesParedes)
const materialTechoCodes = Object.values(CATALOGS.materialesTechos)
const materialPisoCodes = Object.values(CATALOGS.materialesPisos)
const lugarCocinaCodes = Object.values(CATALOGS.lugarCocina)
const origenAguaCodes = Object.values(CATALOGS.origenesAgua)
const aguaAcarreoCodes = Object.values(CATALOGS.aguaAcarreo)
const aguaDiasSemanaCodes = Object.values(CATALOGS.aguaDiasSemana)
const tipoSanitarioCodes = Object.values(CATALOGS.tipoSanitario)
const sanitarioAguaCodes = Object.values(CATALOGS.sanitarioAgua)
const drenajeCodes = Object.values(CATALOGS.drenajes)
const combustibleCodes = Object.values(CATALOGS.combustibles)
const fogonChimeneaCodes = Object.values(CATALOGS.fogonChimenea)
const basuraCodes = Object.values(CATALOGS.basura)
const tenenciaCodes = Object.values(CATALOGS.tenencia)
const adquisicionCodes = Object.values(CATALOGS.adquisicion)
const financiamientoCodes = Object.values(CATALOGS.financiamiento)
const escrituraCodes = Object.values(CATALOGS.escritura)
const equipamientoItems = Object.values(CATALOGS.equipamientoItems)
const problemasItems = Object.values(CATALOGS.problemasEstructurales)

const parentescoCodes = Object.values(CATALOGS.parentescos)
const lugaresNacimientoCodes = Object.values(CATALOGS.lugaresNacimiento)
const discapacidadNivelCodes = Object.values(CATALOGS.discapacidadNivel)
const sexoCodes = [
  { code: '1', label: 'Hombre' },
  { code: '2', label: 'Mujer' },
]
const estadoCivilCodes = Object.values(CATALOGS.estadosCiviles)
const escolaridadCodes = Object.values(CATALOGS.escolaridad)
const yesNoCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
]
const yesNoNoSabeCodes = [
  { code: '1', label: 'Sí' },
  { code: '2', label: 'No' },
  { code: '9', label: 'No sabe' },
]
const tipoTrabajoCodes = Object.values(CATALOGS.tiposTrabajo)
const periodicidadCodes = [
  { code: '1', label: 'Semanal' },
  { code: '2', label: 'Quincenal' },
  { code: '3', label: 'Mensual' },
  { code: '4', label: 'Bimestral' },
]

// ── Section title helper ──

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-8 border-b border-neutral-200 pb-1 text-lg font-bold text-primary">
      {children}
    </h2>
  )
}

// ── Sub-section title helper ──

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="col-span-full mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
      {children}
    </h3>
  )
}

// ── Vivienda Section ──

function ViviendaSection() {
  const hogares = useAppStore((s) => s.hogares)
  const updateHogares = useAppStore((s) => s.updateHogares)

  return (
    <>
      <SectionTitle>I. Características de la Vivienda</SectionTitle>

      {/* ── P1–P5: Clase, materiales, antigüedad ── */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="claseVivienda"
          value={hogares.claseVivienda}
          onChange={(v) => updateHogares({ claseVivienda: v })}
          label="P1. Clase de Vivienda"
          required
          error={null}
          catalogCodes={claseViviendaCodes}
          placeholder="1-7"
        />

        <CodeInput
          name="materialParedes"
          value={hogares.materialParedes}
          onChange={(v) => updateHogares({ materialParedes: v })}
          label="P2. Material de Paredes"
          required
          error={null}
          catalogCodes={materialParedesCodes}
          placeholder="1-8"
        />

        <CodeInput
          name="materialTecho"
          value={hogares.materialTecho}
          onChange={(v) => updateHogares({ materialTecho: v })}
          label="P3. Material de Techos"
          required
          error={null}
          catalogCodes={materialTechoCodes}
          placeholder="1-10"
        />

        <CodeInput
          name="materialPiso"
          value={hogares.materialPiso}
          onChange={(v) => updateHogares({ materialPiso: v })}
          label="P4. Material de Pisos"
          required
          error={null}
          catalogCodes={materialPisoCodes}
          placeholder="1-3"
        />

        <TextInput
          name="antiguedadVivienda"
          value={hogares.antiguedadVivienda != null ? String(hogares.antiguedadVivienda) : ''}
          onChange={(v) => updateHogares({ antiguedadVivienda: v ? Number(v) : undefined })}
          label="P5. Antigüedad (años)"
          placeholder="0-999"
        />
      </div>

      {/* ── P6–P9: Cocina, dormitorios, cuartos ── */}
      <SubSectionTitle>Cocina y Espacios</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="tieneCuartoCocina"
          value={hogares.tieneCuartoCocina}
          onChange={(v) => updateHogares({ tieneCuartoCocina: v as never })}
          label="P6. ¿Esta vivienda tiene un cuarto para cocinar?"
          required
          error={null}
          catalogCodes={yesNoCodes}
          placeholder="1-2"
        />

        {hogares.tieneCuartoCocina === '1' && (
          <CodeInput
            name="duermenEnCocina"
            value={hogares.duermenEnCocina ?? ''}
            onChange={(v) => updateHogares({ duermenEnCocina: v })}
            label="P7. ¿En el cuarto donde cocinan, también duermen?"
            error={null}
            catalogCodes={yesNoCodes}
            placeholder="1-2"
          />
        )}

        <TextInput
          name="numeroDormitorios"
          value={hogares.numeroDormitorios ? String(hogares.numeroDormitorios) : ''}
          onChange={(v) => updateHogares({ numeroDormitorios: v ? Number(v) : 0 })}
          label="P8. ¿Cuántos cuartos se usan para dormir?"
          required
          placeholder="0-20"
        />

        <TextInput
          name="numeroCuartos"
          value={hogares.numeroCuartos ? String(hogares.numeroCuartos) : ''}
          onChange={(v) => updateHogares({ numeroCuartos: v ? Number(v) : 0 })}
          label="P9. ¿Cuántos cuartos tiene en total esta vivienda?"
          required
          placeholder="1-30"
        />
      </div>

      {/* P10: Lugar donde cocinan */}
      {hogares.tieneCuartoCocina !== '' && (
        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          <CodeInput
            name="lugarCocina"
            value={hogares.lugarCocina ?? ''}
            onChange={(v) => updateHogares({ lugarCocina: v })}
            label="P10. ¿El espacio para cocinar está..."
            error={null}
            catalogCodes={lugarCocinaCodes}
            placeholder="1-6"
          />
        </div>
      )}

      {/* ── P11–P14: Agua ── */}
      <SubSectionTitle>Agua</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="aguaTipo"
          value={hogares.aguaTipo}
          onChange={(v) => updateHogares({ aguaTipo: v })}
          label="P11. ¿El agua la obtienen de llaves o mangueras que están..."
          required
          error={null}
          catalogCodes={[
            { code: '1', label: 'Dentro de la vivienda' },
            { code: '2', label: 'Sólo en el patio o terreno' },
            { code: '3', label: 'No tienen agua entubada' },
          ]}
          placeholder="1-3"
        />

        {(hogares.aguaTipo === '1' || hogares.aguaTipo === '2') && (
          <CodeInput
            name="aguaOrigen"
            value={hogares.aguaOrigen ?? ''}
            onChange={(v) => updateHogares({ aguaOrigen: v })}
            label="P12. ¿El agua proviene..."
            error={null}
            catalogCodes={origenAguaCodes}
            placeholder="1-6"
          />
        )}

        {hogares.aguaTipo === '3' && (
          <CodeInput
            name="aguaAcarreo"
            value={hogares.aguaAcarreo ?? ''}
            onChange={(v) => updateHogares({ aguaAcarreo: v })}
            label="P13. ¿Acarrean el agua de..."
            error={null}
            catalogCodes={aguaAcarreoCodes}
            placeholder="1-6"
          />
        )}

        <CodeInput
          name="aguaDiasSemana"
          value={hogares.aguaDiasSemana ?? ''}
          onChange={(v) => updateHogares({ aguaDiasSemana: v })}
          label="P14. ¿Cuántos días a la semana llega el agua?"
          error={null}
          catalogCodes={aguaDiasSemanaCodes}
          placeholder="1-5"
        />
      </div>

      {/* ── P15–P19: Sanitario y Baños ── */}
      <SubSectionTitle>Sanitario y Baños</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="tipoSanitario"
          value={hogares.tipoSanitario ?? ''}
          onChange={(v) => updateHogares({ tipoSanitario: v })}
          label="P15. ¿Tienen..."
          error={null}
          catalogCodes={tipoSanitarioCodes}
          placeholder="1-3"
        />

        {(hogares.tipoSanitario === '1' || hogares.tipoSanitario === '2') && (
          <>
            <CodeInput
              name="sanitarioCompartido"
              value={hogares.sanitarioCompartido ?? ''}
              onChange={(v) => updateHogares({ sanitarioCompartido: v })}
              label="P16. ¿La taza de baño (letrina) es compartida con otra vivienda?"
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
            />

            <CodeInput
              name="sanitarioAgua"
              value={hogares.sanitarioAgua ?? ''}
              onChange={(v) => updateHogares({ sanitarioAgua: v })}
              label="P17. ¿La taza de baño (letrina)..."
              error={null}
              catalogCodes={sanitarioAguaCodes}
              placeholder="1-3"
            />
          </>
        )}

        <CodeInput
          name="biodigestor"
          value={hogares.biodigestor ?? ''}
          onChange={(v) => updateHogares({ biodigestor: v })}
          label="P18. ¿El servicio sanitario cuenta con biodigestor?"
          error={null}
          catalogCodes={yesNoCodes}
          placeholder="1-2"
        />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
        <TextInput
          name="banosConExcReg"
          value={hogares.banosConExcReg != null ? String(hogares.banosConExcReg) : ''}
          onChange={(v) => updateHogares({ banosConExcReg: v ? Number(v) : undefined })}
          label="P19. Baños con excusado y regadera"
          placeholder="0-9"
        />
        <TextInput
          name="banosSoloExc"
          value={hogares.banosSoloExc != null ? String(hogares.banosSoloExc) : ''}
          onChange={(v) => updateHogares({ banosSoloExc: v ? Number(v) : undefined })}
          label="P19. Baños sólo con excusado"
          placeholder="0-9"
        />
        <TextInput
          name="banosSoloReg"
          value={hogares.banosSoloReg != null ? String(hogares.banosSoloReg) : ''}
          onChange={(v) => updateHogares({ banosSoloReg: v ? Number(v) : undefined })}
          label="P19. Baños sólo con regadera"
          placeholder="0-9"
        />
      </div>

      {/* ── P20–P22: Drenaje, Electricidad, Focos ── */}
      <SubSectionTitle>Drenaje y Electricidad</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="drenaje"
          value={hogares.drenaje}
          onChange={(v) => updateHogares({ drenaje: v })}
          label="P20. ¿Esta vivienda tiene drenaje conectado a..."
          required
          error={null}
          catalogCodes={drenajeCodes}
          placeholder="1-5"
        />

        <CodeInput
          name="tieneElectricidad"
          value={hogares.tieneElectricidad}
          onChange={(v) => updateHogares({ tieneElectricidad: v as never })}
          label="P21. ¿En esta vivienda la luz eléctrica la obtienen..."
          required
          error={null}
          catalogCodes={[
            { code: '1', label: 'Del servicio público' },
            { code: '2', label: 'De una planta particular' },
            { code: '3', label: 'De panel solar' },
            { code: '4', label: 'De otra fuente' },
            { code: '5', label: 'No tiene luz eléctrica' },
          ]}
          placeholder="1-5"
        />

        {hogares.tieneElectricidad !== '5' && hogares.tieneElectricidad !== '' && (
          <>
            <TextInput
              name="numeroFocos"
              value={hogares.numeroFocos != null ? String(hogares.numeroFocos) : ''}
              onChange={(v) => updateHogares({ numeroFocos: v ? Number(v) : undefined })}
              label="P22. ¿Cuántos focos tiene esta vivienda?"
              placeholder="1-99"
            />
            <TextInput
              name="focosAhorradores"
              value={hogares.focosAhorradores != null ? String(hogares.focosAhorradores) : ''}
              onChange={(v) => updateHogares({ focosAhorradores: v ? Number(v) : undefined })}
              label="P22.1 ¿Cuántos focos son ahorradores?"
              placeholder="0-99"
            />
          </>
        )}
      </div>

      {/* ── P23–P25: Combustible, Fogón, Basura ── */}
      <SubSectionTitle>Combustible y Basura</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="combustibleCocina"
          value={hogares.combustibleCocina}
          onChange={(v) => updateHogares({ combustibleCocina: v })}
          label="P23. ¿El combustible que más usan para cocinar es..."
          required
          error={null}
          catalogCodes={combustibleCodes}
          placeholder="1-6"
        />

        {(hogares.combustibleCocina === '1' || hogares.combustibleCocina === '2') && (
          <CodeInput
            name="fogonChimenea"
            value={hogares.fogonChimenea ?? ''}
            onChange={(v) => updateHogares({ fogonChimenea: v })}
            label="P24. ¿El fogón donde cocinan con leña o carbón..."
            error={null}
            catalogCodes={fogonChimeneaCodes}
            placeholder="1-2"
          />
        )}

        <CodeInput
          name="eliminaBasura"
          value={hogares.eliminaBasura}
          onChange={(v) => updateHogares({ eliminaBasura: v })}
          label="P25. ¿La basura de esta vivienda..."
          required
          error={null}
          catalogCodes={basuraCodes}
          placeholder="1-8"
        />
      </div>

      {/* ── P26: Tenencia ── */}
      <SubSectionTitle>Tenencia de la Vivienda</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="tenencia"
          value={hogares.tenencia ?? ''}
          onChange={(v) => updateHogares({ tenencia: v })}
          label="P26. ¿Esta vivienda..."
          error={null}
          catalogCodes={tenenciaCodes}
          placeholder="1-6"
        />

        {hogares.tenencia === '1' && (
          <TextInput
            name="montoRentaMensual"
            value={hogares.montoRentaMensual != null ? String(hogares.montoRentaMensual) : ''}
            onChange={(v) => updateHogares({ montoRentaMensual: v ? Number(v) : undefined })}
            label="P26.1 ¿Cuál es el monto de la renta mensual?"
            placeholder="0.00"
          />
        )}

        {(hogares.tenencia === '2' || hogares.tenencia === '4' || hogares.tenencia === '5') && (
          <TextInput
            name="estimacionRenta"
            value={hogares.estimacionRenta != null ? String(hogares.estimacionRenta) : ''}
            onChange={(v) => updateHogares({ estimacionRenta: v ? Number(v) : undefined })}
            label="P26.2 ¿Cuánto pagaría mensualmente si la estuviera rentando?"
            placeholder="0.00"
          />
        )}

        {hogares.tenencia === '3' && (
          <>
            <TextInput
              name="pagoMensual"
              value={hogares.pagoMensual != null ? String(hogares.pagoMensual) : ''}
              onChange={(v) => updateHogares({ pagoMensual: v ? Number(v) : undefined })}
              label="P26.3 ¿Cuánto está pagando al mes?"
              placeholder="0.00"
            />
            <CodeInput
              name="pagoMesPasado"
              value={hogares.pagoMesPasado ?? ''}
              onChange={(v) => updateHogares({ pagoMesPasado: v })}
              label="P26.4 ¿La pagó el mes pasado?"
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
            />
          </>
        )}
      </div>

      {/* ── P27–P29: Adquisición y Financiamiento ── */}
      <SubSectionTitle>Adquisición y Financiamiento</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="adquisicion"
          value={hogares.adquisicion ?? ''}
          onChange={(v) => updateHogares({ adquisicion: v })}
          label="P27. ¿La persona dueña de esta vivienda..."
          error={null}
          catalogCodes={adquisicionCodes}
          placeholder="1-6"
        />

        {hogares.adquisicion === '1' && (
          <CodeInput
            name="viviendaUsada"
            value={hogares.viviendaUsada ?? ''}
            onChange={(v) => updateHogares({ viviendaUsada: v })}
            label="P28. Cuando compraron esta vivienda, ¿era usada?"
            error={null}
            catalogCodes={yesNoCodes}
            placeholder="1-2"
          />
        )}
      </div>

      {/* P29: Financiamiento (multi-select, comma-separated) */}
      <div className="mt-2">
        <TextInput
          name="financiamiento"
          value={hogares.financiamiento ? hogares.financiamiento.join(',') : ''}
          onChange={(v) =>
            updateHogares({
              financiamiento: v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [],
            })
          }
          label="P29. ¿Para pagar o construir esta vivienda... (hasta 3 códigos, separados por coma)"
          placeholder="ej: 1,5,8"
        />
        <div className="mb-4">
          <button
            type="button"
            className="text-xs text-primary-light hover:text-primary"
            aria-label="Ver códigos para Financiamiento"
          >
            📖 Códigos: {financiamientoCodes.map((c) => `${c.code}=${c.label}`).join(' | ')}
          </button>
        </div>
      </div>

      {/* P31: Escritura */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="escritura"
          value={hogares.escritura ?? ''}
          onChange={(v) => updateHogares({ escritura: v })}
          label="P31. ¿Esta vivienda cuenta con escrituras o título de propiedad..."
          error={null}
          catalogCodes={escrituraCodes}
          placeholder="1-4"
        />
      </div>

      {/* ── P32: Equipamiento ── */}
      <SubSectionTitle>Equipamiento de la Vivienda</SubSectionTitle>
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
        {equipamientoItems.map((item) => (
          <div key={item.code} className="mb-2">
            <CodeInput
              name={`equipamiento-${item.code}`}
              value={hogares.equipamiento?.[item.code] ?? ''}
              onChange={(v) =>
                updateHogares({
                  equipamiento: { ...(hogares.equipamiento ?? {}), [item.code]: v },
                })
              }
              label={`P32. ${item.label}`}
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
            />
          </div>
        ))}
      </div>

      {/* ── P33: Problemas Estructurales ── */}
      <SubSectionTitle>Problemas Estructurales en la Vivienda</SubSectionTitle>
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
        {problemasItems.map((item) => (
          <div key={item.code} className="mb-2">
            <CodeInput
              name={`problema-${item.code}`}
              value={hogares.problemasEstructurales?.[item.code] ?? ''}
              onChange={(v) =>
                updateHogares({
                  problemasEstructurales: { ...(hogares.problemasEstructurales ?? {}), [item.code]: v },
                })
              }
              label={`P33. ${item.label}`}
              error={null}
              catalogCodes={yesNoNoSabeCodes}
              placeholder="1/2/9"
            />
          </div>
        ))}
      </div>
    </>
  )
}

// ── Sección II: Residentes e Identificación de Hogares ──

function ResidentesIdentificacionSection() {
  const hogares = useAppStore((s) => s.hogares)
  const updateHogares = useAppStore((s) => s.updateHogares)

  const totalIntegrantes = hogares.integrantes.length

  return (
    <>
      <SectionTitle>II. Residentes e Identificación de Hogares</SectionTitle>
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <strong>Importante:</strong> En IKTAN el número de personas se determina por la lista de integrantes.
        Las preguntas de identificación de hogares, huéspedes y trabajo doméstico se registran aquí.
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {/* Q1 — Total de personas que viven en la vivienda */}
        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
          <label className="mb-1 block text-sm font-medium text-text">
            Q1. Personas que viven en esta vivienda
          </label>
          <p className="text-lg font-bold text-primary">{totalIntegrantes}</p>
          <p className="text-xs text-muted">
            Determinado por la lista de integrantes del hogar.
          </p>
        </div>

        {/* Q2 — ¿Comparten mismo gasto? */}
        <CodeInput
          name="compartenGasto"
          value={hogares.compartenGasto}
          onChange={(v) => updateHogares({ compartenGasto: v as never })}
          label="Q2. ¿Todas las personas comparten un mismo gasto para comer?"
          required
          error={null}
          catalogCodes={[
            { code: '1', label: 'Sí, todas comparten' },
            { code: '2', label: 'No, hay gasto separado' },
          ]}
          placeholder="1-2"
          maxLength={1}
        />

        {/* Q3 (conditional on Q2 = 2) */}
        {hogares.compartenGasto === '2' && (
          <TextInput
            name="hogaresGastoSeparado"
            value={hogares.hogaresGastoSeparado != null ? String(hogares.hogaresGastoSeparado) : ''}
            onChange={(v) => updateHogares({ hogaresGastoSeparado: v ? Number(v) : undefined })}
            label="Q3. ¿Cuántos hogares o grupos tienen gasto separado?"
            placeholder="1-9"
          />
        )}
      </div>

      {/* ── Huéspedes ── */}
      <SubSectionTitle>Huéspedes</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="tieneHuespedes"
          value={hogares.tieneHuespedes}
          onChange={(v) => updateHogares({ tieneHuespedes: v as never })}
          label="Q4. ¿Hay personas que paguen por dormir aquí (huéspedes)?"
          required
          error={null}
          catalogCodes={[
            { code: '1', label: 'Sí' },
            { code: '2', label: 'No' },
          ]}
          placeholder="1-2"
          maxLength={1}
        />

        {hogares.tieneHuespedes === '1' && (
          <>
            <TextInput
              name="totalHuespedes"
              value={hogares.totalHuespedes != null ? String(hogares.totalHuespedes) : ''}
              onChange={(v) => updateHogares({ totalHuespedes: v ? Number(v) : undefined })}
              label="Q5. ¿Cuántos huéspedes?"
              placeholder="1-6"
            />
            <TextInput
              name="huespedesPaganComida"
              value={hogares.huespedesPaganComida != null ? String(hogares.huespedesPaganComida) : ''}
              onChange={(v) => updateHogares({ huespedesPaganComida: v ? Number(v) : undefined })}
              label="Q6. ¿Cuántos también pagan para comer?"
              placeholder="0-6"
            />
          </>
        )}
      </div>

      {/* ── Trabajo Doméstico ── */}
      <SubSectionTitle>Trabajo Doméstico</SubSectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <CodeInput
          name="tieneTrabajoDomestico"
          value={hogares.tieneTrabajoDomestico}
          onChange={(v) => updateHogares({ tieneTrabajoDomestico: v as never })}
          label="Q7. ¿Hay personas contratadas para trabajo doméstico que duerman aquí?"
          required
          error={null}
          catalogCodes={[
            { code: '1', label: 'Sí' },
            { code: '2', label: 'No' },
          ]}
          placeholder="1-2"
          maxLength={1}
        />

        {hogares.tieneTrabajoDomestico === '1' && (
          <>
            <TextInput
              name="totalTrabajoDomestico"
              value={hogares.totalTrabajoDomestico != null ? String(hogares.totalTrabajoDomestico) : ''}
              onChange={(v) => updateHogares({ totalTrabajoDomestico: v ? Number(v) : undefined })}
              label="Q8. ¿Cuántas personas contratadas (incluyendo familiares)?"
              placeholder="1-9"
            />
            <TextInput
              name="trabajoDomesticoComen"
              value={hogares.trabajoDomesticoComen != null ? String(hogares.trabajoDomesticoComen) : ''}
              onChange={(v) => updateHogares({ trabajoDomesticoComen: v ? Number(v) : undefined })}
              label="Q9. ¿Cuántas comen de los alimentos del hogar?"
              placeholder="0-9"
            />
          </>
        )}
      </div>
    </>
  )
}


// ── Integrante Card ──

function IntegranteCard({ integrante, index }: { integrante: Integrante; index: number }) {
  const updateIntegrante = useAppStore((s) => s.updateIntegrante)
  const removeIntegrante = useAppStore((s) => s.removeIntegrante)
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const [expanded, setExpanded] = useCallbackState(true)

  const canRemove = integrantes.length > 1

  return (
    <div className="mb-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-medium text-primary"
        >
          <span className="text-sm">{expanded ? '▼' : '▶'}</span>
          <span className="font-mono text-lg font-bold">{integrante.numPer}</span>
          <span className="text-sm text-muted">
            {integrante.nombre || `Integrante ${index + 1}`}
          </span>
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Eliminar integrante ${integrante.numPer}?`)) {
                removeIntegrante(integrante.numPer)
              }
            }}
            className="rounded-md border border-danger/30 px-3 py-1 text-sm text-danger hover:bg-red-50"
          >
            Eliminar
          </button>
        )}
      </div>

      {expanded && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {/* NUMPER — read-only */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-text">NUMPER</label>
              <div className="w-20 rounded-md border border-transparent bg-neutral-100 px-2 py-2 text-center font-mono text-base text-muted">
                {integrante.numPer}
              </div>
            </div>

            <TextInput
              name={`integrante-${integrante.numPer}-nombre`}
              value={integrante.nombre}
              onChange={(v) => updateIntegrante(integrante.numPer, { nombre: v })}
              label="Nombre"
              required
              placeholder="Nombre completo"
              capitalize
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-parentesco`}
              value={integrante.parentesco}
              onChange={(v) => updateIntegrante(integrante.numPer, { parentesco: v })}
              label="Parentesco"
              required
              error={null}
              catalogCodes={parentescoCodes}
              placeholder="1-9"
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-sexo`}
              value={integrante.sexo}
              onChange={(v) => updateIntegrante(integrante.numPer, { sexo: v })}
              label="Sexo"
              required
              error={null}
              catalogCodes={sexoCodes}
              placeholder="1-2"
            />

            <TextInput
              name={`integrante-${integrante.numPer}-edad`}
              value={integrante.edad ? String(integrante.edad) : ''}
              onChange={(v) => updateIntegrante(integrante.numPer, { edad: v ? Number(v) : 0 })}
              label="Edad"
              required
              placeholder="0-120"
            />

            <DateInput
              name={`integrante-${integrante.numPer}-fechaNacimiento`}
              value={integrante.fechaNacimiento}
              onChange={(v) => updateIntegrante(integrante.numPer, { fechaNacimiento: v })}
              label="Fecha de Nacimiento"
              required
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-estadoCivil`}
              value={integrante.estadoCivil}
              onChange={(v) => updateIntegrante(integrante.numPer, { estadoCivil: v })}
              label="Estado Civil"
              required
              error={null}
              catalogCodes={estadoCivilCodes}
              placeholder="1-6"
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-sabeLeerEscribir`}
              value={integrante.sabeLeerEscribir}
              onChange={(v) => updateIntegrante(integrante.numPer, { sabeLeerEscribir: v as never })}
              label="¿Sabe leer y escribir?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-nivelEscolaridad`}
              value={integrante.nivelEscolaridad}
              onChange={(v) => updateIntegrante(integrante.numPer, { nivelEscolaridad: v })}
              label="Nivel Escolaridad"
              required
              error={null}
              catalogCodes={escolaridadCodes}
              maxLength={2}
              placeholder="00-10"
            />

            <CodeInput
              name={`integrante-${integrante.numPer}-asisteEscuela`}
              value={integrante.asisteEscuela}
              onChange={(v) => updateIntegrante(integrante.numPer, { asisteEscuela: v as never })}
              label="¿Asiste a la escuela?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
            />
          </div>

          {/* Sección III: Padres (Q5-Q6) */}
        <CollapsibleSection title="Padres (Q5-Q6)" icon="👪">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <CodeInput
              name={`integrante-${integrante.numPer}-viveMadre`}
              value={integrante.viveMadre}
              onChange={(v) => updateIntegrante(integrante.numPer, { viveMadre: v as never })}
              label="Q5. ¿Vive la madre de (NOMBRE) en este hogar?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            {integrante.viveMadre === '1' && (
              <CodeInput
                name={`integrante-${integrante.numPer}-madreNumPer`}
                value={integrante.madreNumPer ?? ''}
                onChange={(v) => updateIntegrante(integrante.numPer, { madreNumPer: v })}
                label="Q5.1 ¿Quién es? (NUMPER)"
                error={null}
                catalogCodes={integrantes.map((i) => ({ code: i.numPer, label: `${i.numPer} — ${i.nombre || 'Sin nombre'}` }))}
                placeholder="01-99"
                maxLength={2}
              />
            )}
            <CodeInput
              name={`integrante-${integrante.numPer}-vivePadre`}
              value={integrante.vivePadre}
              onChange={(v) => updateIntegrante(integrante.numPer, { vivePadre: v as never })}
              label="Q6. ¿Vive el padre de (NOMBRE) en este hogar?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            {integrante.vivePadre === '1' && (
              <CodeInput
                name={`integrante-${integrante.numPer}-padreNumPer`}
                value={integrante.padreNumPer ?? ''}
                onChange={(v) => updateIntegrante(integrante.numPer, { padreNumPer: v })}
                label="Q6.1 ¿Quién es? (NUMPER)"
                error={null}
                catalogCodes={integrantes.map((i) => ({ code: i.numPer, label: `${i.numPer} — ${i.nombre || 'Sin nombre'}` }))}
                placeholder="01-99"
                maxLength={2}
              />
            )}
          </div>
        </CollapsibleSection>

        {/* ── Nacimiento y Etnicidad (Q7-Q8) ── */}
        <CollapsibleSection title="Nacimiento y Etnicidad (Q7-Q8)" icon="🌍">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <CodeInput
              name={`integrante-${integrante.numPer}-lugarNacimiento`}
              value={integrante.lugarNacimiento}
              onChange={(v) => updateIntegrante(integrante.numPer, { lugarNacimiento: v })}
              label="Q7. ¿En qué estado o país nació?"
              required
              error={null}
              catalogCodes={lugaresNacimientoCodes}
              placeholder="1-4"
              maxLength={1}
            />
            <CodeInput
              name={`integrante-${integrante.numPer}-afrodescendiente`}
              value={integrante.afrodescendiente}
              onChange={(v) => updateIntegrante(integrante.numPer, { afrodescendiente: v as never })}
              label="Q8. ¿Se considera afromexicano(a), negro(a) o afrodescendiente?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
          </div>
        </CollapsibleSection>

        {/* ── Discapacidad (Q9 A-H) ── */}
        <CollapsibleSection title="Discapacidad (Q9 A-H)" icon="♿">
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <p className="mb-3 text-sm text-muted">
              En su vida diaria (NOMBRE), ¿cuánta dificultad tiene para...
            </p>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {(['A','B','C','D','E','F','G','H'] as const).map((letter) => {
                const labels: Record<string, string> = {
                  A: 'Ver, aun usando lentes',
                  B: 'Oír, aun usando aparato auditivo',
                  C: 'Mover o usar brazos o manos',
                  D: 'Caminar, subir o bajar usando las piernas',
                  E: 'Recordar o concentrarse',
                  F: 'Bañarse, vestirse o comer',
                  G: 'Hablar o comunicarse',
                  H: 'Realizar actividades diarias por problemas emocionales o mentales',
                }
                return (
                  <CodeInput
                    key={letter}
                    name={`integrante-${integrante.numPer}-disc-${letter}`}
                    value={(integrante.discapacidad ?? {})[letter] ?? ''}
                    onChange={(v) => updateIntegrante(integrante.numPer, {
                      discapacidad: { ...(integrante.discapacidad ?? {}), [letter]: v }
                    })}
                    label={`${letter}. ${labels[letter]}`}
                    error={null}
                    catalogCodes={discapacidadNivelCodes}
                    placeholder="1-4"
                    maxLength={1}
                  />
                )
              })}
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Lengua Indígena (Q12-Q16) ── */}
        <CollapsibleSection title="Lengua Indígena (Q12-Q16)" icon="🗣️">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <CodeInput
              name={`integrante-${integrante.numPer}-hablaLenguaIndigena`}
              value={integrante.hablaLenguaIndigena}
              onChange={(v) => updateIntegrante(integrante.numPer, { hablaLenguaIndigena: v as never })}
              label="Q12. ¿Habla alguna lengua indígena o dialecto?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
            {integrante.hablaLenguaIndigena === '1' && (
              <>
                <TextInput
                  name={`integrante-${integrante.numPer}-lenguaIndigena`}
                  value={integrante.lenguaIndigena ?? ''}
                  onChange={(v) => updateIntegrante(integrante.numPer, { lenguaIndigena: v })}
                  label="Q13. ¿Qué dialecto o lengua indígena habla?"
                  placeholder="Nombre de la lengua"
                />
                <CodeInput
                  name={`integrante-${integrante.numPer}-hablaEspanol`}
                  value={integrante.hablaEspanol ?? ''}
                  onChange={(v) => updateIntegrante(integrante.numPer, { hablaEspanol: v as never })}
                  label="Q14. ¿Habla también español?"
                  error={null}
                  catalogCodes={yesNoCodes}
                  placeholder="1-2"
                  maxLength={1}
                />
              </>
            )}
            {integrante.hablaLenguaIndigena === '2' && (
              <CodeInput
                name={`integrante-${integrante.numPer}-entiendeLenguaIndigena`}
                value={integrante.entiendeLenguaIndigena ?? ''}
                onChange={(v) => updateIntegrante(integrante.numPer, { entiendeLenguaIndigena: v as never })}
                label="Q15. ¿Entiende alguna lengua indígena?"
                error={null}
                catalogCodes={yesNoCodes}
                placeholder="1-2"
                maxLength={1}
              />
            )}
            <CodeInput
              name={`integrante-${integrante.numPer}-autoAdscripcionIndigena`}
              value={integrante.autoAdscripcionIndigena}
              onChange={(v) => updateIntegrante(integrante.numPer, { autoAdscripcionIndigena: v as never })}
              label="Q16. ¿Se considera indígena?"
              required
              error={null}
              catalogCodes={yesNoCodes}
              placeholder="1-2"
              maxLength={1}
            />
          </div>
        </CollapsibleSection>
          </>
      )}
    </div>
  )
}

// Minimal useState wrapper to avoid import noise
import { useState } from 'react'
function useCallbackState<T>(initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(initial)
  return [state, setState]
}

// Collapsible sub-section for IntegranteCard
function CollapsibleSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mt-4 border-t border-neutral-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-1 text-left text-sm font-semibold text-primary hover:text-primary-light"
      >
        <span>{open ? '▼' : '▶'}</span>
        <span>{icon}</span>
        <span>{title}</span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

// ── Integrante Section ──

function IntegranteSection() {
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const addIntegrante = useAppStore((s) => s.addIntegrante)

  return (
    <>
      <SectionTitle>II. Residentes del Hogar</SectionTitle>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => addIntegrante()}
          className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-light"
        >
          + Agregar Integrante
        </button>
      </div>

      {integrantes.length === 0 ? (
        <p className="mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-muted">
          No hay integrantes. Agregue al menos uno (el/la jefe/a del hogar).
        </p>
      ) : (
        <div>
          {integrantes.map((integrante, i) => (
            <IntegranteCard key={integrante.numPer} integrante={integrante} index={i} />
          ))}
        </div>
      )}
    </>
  )
}

// ── Ingreso Section ──

function IngresoSection() {
  const integrantes = useAppStore((s) => s.hogares.integrantes)
  const ingresosIntegrantes = useAppStore((s) => s.hogares.ingresosIntegrantes)
  const updateIngresoIntegrante = useAppStore((s) => s.updateIngresoIntegrante)

  const mayores12 = integrantes.filter((i) => i.edad >= 12)

  if (mayores12.length === 0) return null

  return (
    <>
      <SectionTitle>III. Ingresos de los Integrantes (12+ años)</SectionTitle>
      {mayores12.map((integrante) => {
        const ingreso = ingresosIntegrantes.find((ig) => ig.numPer === integrante.numPer) ?? {
          numPer: integrante.numPer,
          trabajoSemanaPasada: '',
          recibeJubilacion: '',
          recibeProgGobierno: '',
        } as IngresoIntegrante

        const prefix = `ingreso-${integrante.numPer}`

        return (
          <div key={integrante.numPer} className="mb-6 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-primary">
              {integrante.numPer} — {integrante.nombre || `Integrante ${integrante.numPer}`}
            </h3>

            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <CodeInput
                name={`${prefix}-trabajoSemanaPasada`}
                value={ingreso.trabajoSemanaPasada}
                onChange={(v) => updateIngresoIntegrante(integrante.numPer, { trabajoSemanaPasada: v })}
                label="¿Trabajó la semana pasada?"
                required
                error={null}
                catalogCodes={yesNoCodes}
                placeholder="1-2"
              />

              {ingreso.trabajoSemanaPasada === '1' && (
                <>
                  <TextInput
                    name={`${prefix}-ocupacionPrincipal`}
                    value={ingreso.ocupacionPrincipal ?? ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { ocupacionPrincipal: v })}
                    label="Ocupación principal"
                    required
                    placeholder="Ocupación"
                  />
                  <CodeInput
                    name={`${prefix}-tipoTrabajo`}
                    value={ingreso.tipoTrabajo ?? ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { tipoTrabajo: v })}
                    label="Tipo de trabajo"
                    required
                    error={null}
                    catalogCodes={tipoTrabajoCodes}
                    placeholder="1-4"
                  />
                  <TextInput
                    name={`${prefix}-horasTrabajadas`}
                    value={ingreso.horasTrabajadas != null ? String(ingreso.horasTrabajadas) : ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { horasTrabajadas: v ? Number(v) : undefined })}
                    label="Horas trabajadas"
                    required
                    placeholder="1-168"
                  />
                  <MoneyInput
                    name={`${prefix}-ingresoMensualTrabajo`}
                    value={ingreso.ingresoMensualTrabajo != null ? String(ingreso.ingresoMensualTrabajo) : ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { ingresoMensualTrabajo: v ? Number(v) : undefined })}
                    label="Ingreso mensual"
                    required
                  />
                  <CodeInput
                    name={`${prefix}-tieneOtroTrabajo`}
                    value={ingreso.tieneOtroTrabajo ?? ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { tieneOtroTrabajo: v })}
                    label="¿Tiene otro trabajo?"
                    error={null}
                    catalogCodes={yesNoCodes}
                    placeholder="1-2"
                  />
                </>
              )}

              <CodeInput
                name={`${prefix}-recibeJubilacion`}
                value={ingreso.recibeJubilacion}
                onChange={(v) => updateIngresoIntegrante(integrante.numPer, { recibeJubilacion: v })}
                label="¿Recibe jubilación?"
                required
                error={null}
                catalogCodes={yesNoCodes}
                placeholder="1-2"
              />

              <CodeInput
                name={`${prefix}-recibeProgGobierno`}
                value={ingreso.recibeProgGobierno}
                onChange={(v) => updateIngresoIntegrante(integrante.numPer, { recibeProgGobierno: v })}
                label="¿Recibe programa de gobierno?"
                required
                error={null}
                catalogCodes={yesNoCodes}
                placeholder="1-2"
              />

              {ingreso.recibeProgGobierno === '1' && (
                <>
                  <TextInput
                    name={`${prefix}-progGobiernoNombre`}
                    value={ingreso.progGobiernoNombre ?? ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { progGobiernoNombre: v })}
                    label="Nombre del programa"
                    required
                    placeholder="Nombre del programa"
                  />
                  <MoneyInput
                    name={`${prefix}-progGobiernoMonto`}
                    value={ingreso.progGobiernoMonto != null ? String(ingreso.progGobiernoMonto) : ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { progGobiernoMonto: v ? Number(v) : undefined })}
                    label="Monto del programa"
                    required
                  />
                  <CodeInput
                    name={`${prefix}-progGobiernoPeriodicidad`}
                    value={ingreso.progGobiernoPeriodicidad ?? ''}
                    onChange={(v) => updateIngresoIntegrante(integrante.numPer, { progGobiernoPeriodicidad: v })}
                    label="Periodicidad"
                    required
                    error={null}
                    catalogCodes={periodicidadCodes}
                    placeholder="1-4"
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

// ── Alimentación Section ──

function AlimentacionSection() {
  const hogares = useAppStore((s) => s.hogares)
  const updateHogares = useAppStore((s) => s.updateHogares)

  const questions: { field: keyof HogaresViviendaData; label: string }[] = [
    { field: 'alimentosPocaVariedad', label: '¿Los alimentos fueron de poca variedad?' },
    { field: 'alimentosDejoComida', label: '¿Dejó de comer algún alimento?' },
    { field: 'alimentosComioMenos', label: '¿Comió menos de lo que debía?' },
    { field: 'alimentosSinComida', label: '¿Se quedó sin comida?' },
    { field: 'alimentosSintioHambre', label: '¿Sintió hambre pero no comió?' },
    { field: 'alimentosUnaVez', label: '¿Comió solo una vez al día?' },
  ]

  return (
    <>
      <SectionTitle>IV. Acceso a la Alimentación</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {questions.map((q) => (
          <CodeInput
            key={q.field}
            name={q.field}
            value={hogares[q.field] as string}
            onChange={(v) => updateHogares({ [q.field]: v } as never)}
            label={q.label}
            required
            error={null}
            catalogCodes={yesNoCodes}
            placeholder="1-2"
          />
        ))}
      </div>
    </>
  )
}

// ── Clima Section ──

function ClimaSection() {
  const hogares = useAppStore((s) => s.hogares)
  const updateHogares = useAppStore((s) => s.updateHogares)

  const questions: { field: keyof HogaresViviendaData; label: string }[] = [
    { field: 'climaSequia', label: '¿Hubo sequía?' },
    { field: 'climaInundacion', label: '¿Hubo inundación?' },
    { field: 'climaHelada', label: '¿Hubo helada?' },
    { field: 'climaIncendio', label: '¿Hubo incendio?' },
    { field: 'climaHuracan', label: '¿Hubo huracán?' },
  ]

  return (
    <>
      <SectionTitle>VII. Cambio Climático</SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {questions.map((q) => (
          <CodeInput
            key={q.field}
            name={q.field}
            value={hogares[q.field] as string}
            onChange={(v) => updateHogares({ [q.field]: v } as never)}
            label={q.label}
            required
            error={null}
            catalogCodes={yesNoCodes}
            placeholder="1-2"
          />
        ))}
      </div>
    </>
  )
}

// ── Main HogaresViviendaStep ──

export function HogaresViviendaStep() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Cuestionario de Hogares y Vivienda"
      className="pb-8"
    >
      <ViviendaSection />
      <ResidentesIdentificacionSection />
      <IntegranteSection />
      <IngresoSection />
      <AlimentacionSection />
      <ClimaSection />
    </form>
  )
}
