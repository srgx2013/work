# IKTAN Simulator — Architecture Design

> **Change:** `iktan-simulator`
> **Phase:** design
> **Status:** approved
> **Date:** 2025-07-10
> **Project:** ENIGH IKTAN Simulator
> **Artifact Store:** engram + openspec

---

## Executive Summary

This design covers the complete architecture for the IKTAN Simulator — a React SPA that replicates the INEGI IKTAN electronic data capture experience. The design follows Clean Architecture (Screaming) with Container-Presentational pattern, using Vite 6 + React 19 + TypeScript strict + Zustand + Zod + Tailwind CSS v4. All closed questions use numeric code inputs (no visible radio/select/checkbox) to match the real IKTAN system.

---

## 1. Project Structure

```
src/
├── domain/                          # Pure TypeScript — zero React imports
│   ├── models/                      # TypeScript interfaces per questionnaire
│   │   ├── shared.ts                # SharedFolioFields, catalog code types (EntidadCode, YesNo, etc.)
│   │   ├── portada.ts               # PortadaData
│   │   ├── hogares.ts               # HogaresViviendaData, Integrante, IngresoIntegrante
│   │   ├── menores12.ts             # Menor12Data, Menores12Section
│   │   ├── personas12plus.ts        # Persona12PlusData, Personas12PlusSection
│   │   ├── negocios.ts              # Negocio, NegociosData
│   │   ├── gastos-hogar.ts          # GastosHogarData
│   │   ├── gastos-diarios.ts        # GastoDiario, DiaGastos, EstimacionMensual, GastosDiariosData
│   │   ├── timer.ts                 # TimerEntry, TimerData
│   │   └── folio.ts                 # CompleteFolioData (all questionnaires combined)
│   │
│   ├── constants/                   # Catalog data — lookup tables
│   │   ├── catalogs.ts              # All catalogs: entidades, parentescos, clasesVivienda, etc.
│   │   └── catalog-helpers.ts       # getLabel(catalog, code), getEntries(catalog), isValidCode(catalog, code)
│   │
│   └── validation/                  # Zod schemas & cross-section rules
│       ├── schemas.ts               # One Zod schema per questionnaire
│       ├── refinements.ts           # Custom Zod refinements (date checks, ranges, conditional required)
│       └── cross-section.ts         # Cross-section validation orchestrator
│
├── application/                     # Business logic — knows React exists but no JSX
│   ├── store/                       # Zustand store
│   │   ├── index.ts                 # Combined store with persist middleware
│   │   ├── slices/                  # Per-questionnaire slices
│   │   │   ├── portada.slice.ts
│   │   │   ├── hogares.slice.ts
│   │   │   ├── menores12.slice.ts
│   │   │   ├── personas12plus.slice.ts
│   │   │   ├── negocios.slice.ts
│   │   │   ├── gastos-hogar.slice.ts
│   │   │   ├── gastos-diarios.slice.ts
│   │   │   ├── wizard.slice.ts      # currentStep, currentSubStep, navigation actions
│   │   │   ├── timer.slice.ts       # Timer state, start/stop/resume/reset
│   │   │   └── validation.slice.ts  # Per-step error maps
│   │   └── selectors.ts            # Derived state (sub-step lists, totals, cross-section errors)
│   │
│   └── use-cases/                   # Orchestration logic
│       ├── navigate-step.ts         # nextStep/prevStep logic, sub-step derivation
│       ├── validate-step.ts         # Run Zod schema for a step, return errors
│       ├── validate-cross-section.ts # Run all cross-section rules
│       └── compute-report.ts        # Aggregate report data from all questionnaires
│
├── infrastructure/                  # External adapters
│   └── persistence/
│       └── storage-adapter.ts       # localStorage availability detection, fallback
│
└── ui/                              # React components — presentation only
    ├── components/                   # Shared/reusable components
    │   ├── layout/
    │   │   ├── WizardLayout.tsx      # App shell: header + step + navigation + validation summary
    │   │   ├── ProgressBar.tsx       # 7-step indicator with completion status
    │   │   ├── TimerDisplay.tsx      # ⏱ MM:SS for current step
    │   │   └── NavigationButtons.tsx # Anterior / Siguiente / Reiniciar
    │   │
    │   ├── fields/                   # Form field components
    │   │   ├── CodeInput.tsx         # Numeric code input with "📖 Códigos" help button
    │   │   ├── TextInput.tsx         # Free-text input
    │   │   ├── DateInput.tsx         # 3-field date input (DD / MM / AAAA)
    │   │   ├── MoneyInput.tsx        # Decimal input without currency symbol
    │   │   ├── TextAreaInput.tsx     # Multi-line text (observaciones)
    │   │   ├── ReadOnlyField.tsx     # Pre-filled display-only field
    │   │   └── FieldLabel.tsx        # Label + required indicator
    │   │
    │   ├── help/
    │   │   └── CatalogHelp.tsx       # Expandable catalog table triggered by "📖 Códigos"
    │   │
    │   ├── feedback/
    │   │   ├── ValidationMessage.tsx # Inline field error (red text)
    │   │   ├── ValidationSummary.tsx # Step-level error panel listing all errors
    │   │   └── ConfirmModal.tsx      # "¿Está seguro?" modal for destructive actions
    │   │
    │   └── sections/
    │       ├── SectionHeader.tsx     # Collapsible section with title and optional subtotal
    │       └── SubtotalRow.tsx       # Read-only subtotal display for gastos sections
    │
    ├── steps/                        # Container components — one per wizard step
    │   ├── PortadaStep.tsx
    │   ├── HogaresStep.tsx
    │   ├── Menores12Step.tsx
    │   ├── Personas12PlusStep.tsx
    │   ├── NegociosStep.tsx
    │   ├── GastosHogarStep.tsx
    │   ├── GastosDiariosStep.tsx
    │   └── ReporteStep.tsx
    │
    ├── dynamic/                      # Dynamic sub-components (add/remove items)
    │   ├── IntegranteList.tsx        # List of integrante cards with add/remove
    │   ├── IntegranteForm.tsx        # Single integrante form fields
    │   ├── IngresoIntegranteForm.tsx # Income fields for one integrante
    │   ├── DiaGastosForm.tsx         # Single day's gastos (expandable)
    │   ├── GastoItemRow.tsx          # One gasto row (concepto + monto + delete)
    │   ├── NegocioForm.tsx           # Single negocio form fields
    │   └── BienesInput.tsx           # Comma-separated code input for bienes
    │
    └── app/
        ├── App.tsx                   # Top-level: WizardLayout wraps active step
        └── main.tsx                  # ReactDOM.createRoot, mount App
```

---

## 2. Component Tree

```
<App>
  <WizardLayout>                              // Grid: header | content | footer
    <header>                                   // Sticky top bar
      <h1>IKTAN Simulator — Captura ENIGH 2024</h1>
      <ProgressBar                            // All 7 steps as labeled nodes
        steps={[
          { id:1, label:'Portada', status:'current'|'completed'|'pending' },
          { id:2, label:'Hogares', status },
          { id:3, label:'Menores 12 (1)', status },  // dynamic count in label
          { id:4, label:'12+ (3)', status },
          { id:5, label:'Negocios', status },
          { id:6, label:'Gastos Hogar', status },
          { id:7, label:'Gastos Diarios', status }
        ]}
      />
      <TimerDisplay                            // ⏱ 12:34 — current step time
        stepLabel="Portada"
        elapsedSeconds={740}
      />
    </header>

    <main>                                     // Scrollable step content
      {currentStep === 1 && <PortadaStep />}
      {currentStep === 2 && <HogaresStep />}
      {currentStep === 3 && <Menores12Step />}
      {currentStep === 4 && <Personas12PlusStep />}
      {currentStep === 5 && <NegociosStep />}
      {currentStep === 6 && <GastosHogarStep />}
      {currentStep === 7 && <GastosDiariosStep />}
      {currentStep === 8 && <ReporteStep />}
    </main>

    <footer>                                   // Sticky bottom bar
      <ValidationSummary                       // Visible only when errors exist
        errors={currentStepErrors}
      />
      <NavigationButtons
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 8}
        canAdvance={isStepValid}
      />
    </footer>
  </WizardLayout>
</App>
```

### Per-Step Component Internals

#### PortadaStep
```
<PortadaStep>
  <form onSubmit={handleSubmit}>
    <SectionHeader title="Control por Folio" />
    <CodeInput field="entidad" catalog="entidades" />            // 01-32, "📖 Códigos"
    <TextInput field="folioViv" maxLength={10} />                // 10 digits, validates format
    <TextInput field="folioHog" maxLength={1} />                 // 1-5
    <CodeInput field="decena" />                                 // 1-9, 0=10
    <TextInput field="nombreEntrevistador" />
    <TextInput field="nombreSupervisor" />
    <CodeInput field="resultadoEntrevista" catalog="resultadosEntrevista" /> // A1-A7
    <DateInput field="fechaInicio" />
    <DateInput field="fechaTermino" />
    <TextAreaInput field="observaciones" />
  </form>
</PortadaStep>
```

#### HogaresStep (most complex — 7 sections)
```
<HogaresStep>
  <!-- Section I: Vivienda -->
  <SectionHeader title="I. Características de la Vivienda" />
  <CodeInput field="claseVivienda" catalog="clasesVivienda" />
  <CodeInput field="materialParedes" catalog="materialesParedes" />
  <CodeInput field="materialTecho" catalog="materialesTechos" />
  <CodeInput field="materialPiso" catalog="materialesPisos" />
  <MoneyInput field="antiguedadVivienda" />                     // Integer, not money
  <CodeInput field="tieneCuartoCocina" />                       // 1=Sí, 2=No
  {tieneCuartoCocina === '1' && <CodeInput field="duermenEnCocina" />}
  <MoneyInput field="numeroDormitorios" />                       // Integer 0-20
  <MoneyInput field="numeroCuartos" />                           // Integer 1-30
  <CodeInput field="aguaTipo" />
  {(aguaTipo === '1' || aguaTipo === '2') && <CodeInput field="aguaOrigen" catalog="origenesAgua" />}
  <CodeInput field="drenaje" catalog="drenajes" />
  <CodeInput field="tieneElectricidad" />
  {tieneElectricidad === '1' && (
    <>
      <MoneyInput field="numeroFocos" />
      <MoneyInput field="focosAhorradores" />
    </>
  )}
  <CodeInput field="combustibleCocina" catalog="combustibles" />
  <CodeInput field="eliminaBasura" catalog="basura" />
  <BienesInput field="bienes" catalog="bienes" />               // Comma-separated codes

  <!-- Section II: Residentes -->
  <SectionHeader title="II. Residentes del Hogar" />
  <IntegranteList
    integrantes={integrantes}
    onAdd={addIntegrante}
    onRemove={removeIntegrante}
    onUpdate={updateIntegrante}
  >
    {(integrante, index) => (
      <IntegranteForm
        key={integrante.numPer}
        integrante={integrante}
        index={index}
        onChange={updateIntegrante}
        onRemove={removeIntegrante}
        canRemove={integrantes.length > 1}
      />
    )}
  </IntegranteList>

  <!-- Section III: Ingresos -->
  <SectionHeader title="III. Ingresos de los Integrantes" />
  {integrantes.map(integrante => (
    <IngresoIntegranteForm
      key={integrante.numPer}
      numPer={integrante.numPer}
      nombre={integrante.nombre}
      ingreso={ingresosIntegrantes[integrante.numPer]}
      onChange={updateIngreso}
    />
  ))}

  <!-- Section IV: Alimentación -->
  <SectionHeader title="IV. Acceso a la Alimentación" />
  {alimentosQuestions.map(q => <CodeInput key={q.field} field={q.field} />)}

  <!-- Section VII: Cambio Climático -->
  <SectionHeader title="VII. Cambio Climático" />
  {climaQuestions.map(q => <CodeInput key={q.field} field={q.field} />)}
</HogaresStep>
```

#### Menores12Step (dynamic sub-steps)
```
<Menores12Step>
  {menores.length === 0 ? (
    <p>No hay integrantes menores de 12 años. Pase al siguiente cuestionario.</p>
  ) : (
    <>
      <!-- Sub-step indicator -->
      <div className="substep-indicator">
        {menores.map((m, i) => (
          <button onClick={() => setCurrentSubStep(i)}>
            {m.nombre} ({m.edad} años)
          </button>
        ))}
      </div>

      <!-- Active sub-form -->
      <Menor12SubForm
        key={menores[currentSubStep].numPer}
        data={menores12Data[menores[currentSubStep].numPer]}
        persona={menores[currentSubStep]}
        onChange={updateMenor12}
      >
        <ReadOnlyField label="Nombre" value={persona.nombre} />
        <ReadOnlyField label="Edad" value={`${persona.edad} años`} />
        <CodeInput field="tieneDerechohabiencia" />
        {tieneDerechohabiencia === '1' && (
          <CodeInput field="institucionSalud" catalog="institucionesSalud" />
        )}
        <CodeInput field="problemaSalud2Semanas" />
        <CodeInput field="vacunacionCompleta" />                // 1=Sí, 2=No, 9=No sabe
        <CodeInput field="asisteEscuela" />
        {asisteEscuela === '1' && (
          <>
            <TextInput field="gradoEscolar" />
            <CodeInput field="tipoEscuela" catalog="tiposEscuela" />
          </>
        )}
        <CodeInput field="recibeBeca" />
        <CodeInput field="quienCuida" catalog="quienCuida" />
      </Menor12SubForm>
    </>
  )}
</Menores12Step>
```

#### Personas12PlusStep (dynamic sub-steps, similar pattern)
```
<Personas12PlusStep>
  {personas12Plus.length === 0 ? (
    <p>No hay integrantes de 12 o más años. Pase al siguiente cuestionario.</p>
  ) : (
    <>
      <SubStepTabs personas={personas12Plus} />
      <Persona12PlusSubForm ...>
        <ReadOnlyField label="Nombre" />
        <ReadOnlyField label="Edad" />
        <!-- II. Educación -->
        <CodeInput field="nivelAprobado" catalog="escolaridad" />
        <CodeInput field="asisteEscuela" />
        {asisteEscuela === '1' && <CodeInput field="tipoEscuela" />}
        <CodeInput field="sabeLeerEscribir" />
        <!-- III. Salud, IV. Actividad Económica, V. Ingresos no Laborales, VI. Gastos Personales -->
        ... (full sets of conditional fields)
      </Persona12PlusSubForm>
    </>
  )}
</Personas12PlusStep>
```

#### NegociosStep
```
<NegociosStep>
  <CodeInput field="tieneNegocio" />
  {tieneNegocio === '1' && (
    <>
      {negocios.map((neg, i) => (
        <NegocioForm
          key={neg.id}
          negocio={neg}
          onChange={...}
          onRemove={negocios.length > 1 ? removeNegocio : undefined}
        >
          <CodeInput field="numPerOperador" />                  // Must exist in Hogares
          <TextInput field="tipoNegocio" />
          <CodeInput field="esActividadPrincipal" />
          <CodeInput field="tieneLocal" />
          <CodeInput field="llevaContabilidad" />
          <CodeInput field="dadoAltaHacienda" />
          <MoneyInput field="ingresoMensual" />
          <MoneyInput field="gastosMensuales" />
        </NegocioForm>
      ))}
      <button onClick={addNegocio}>+ Agregar negocio</button>
    </>
  )}
  {tieneNegocio === '2' && (
    <p>No aplica — este hogar no tiene negocios. Pase al siguiente cuestionario.</p>
  )}
</NegociosStep>
```

#### GastosHogarStep (8 sections, all always visible)
```
<GastosHogarStep>
  {gastosHogarSections.map(section => (
    <section key={section.id}>
      <SectionHeader title={section.title}>
        <SubtotalRow amount={computeSectionTotal(section.id)} />
      </SectionHeader>
      {section.fields.map(field => (
        <MoneyInput key={field} field={field} />
      ))}
    </section>
  ))}
</GastosHogarStep>
```

#### GastosDiariosStep
```
<GastosDiariosStep>
  <SectionHeader title="Informante" />
  <CodeInput field="informanteNumPer" />                         // Must exist in Hogares
  <ReadOnlyField label="Nombre del informante" value={informanteNombre} />

  <SectionHeader title="Gastos por Día" />
  {dias.map((dia, i) => (
    <DiaGastosForm key={i} dia={dia}>
      <h3>{dia.nombreDia} — {dia.fecha}</h3>
      {dia.gastos.map((gasto, j) => (
        <GastoItemRow key={gasto.id}>
          <TextInput field={`dia[${i}].gasto[${j}].concepto`} />
          <MoneyInput field={`dia[${i}].gasto[${j}].monto`} />
          {dia.gastos.length > 1 && <button onClick={removeGasto(i,j)}>✕</button>}
        </GastoItemRow>
      ))}
      <button onClick={addGasto(i)}>+ Agregar gasto</button>
      <SubtotalRow amount={computeDayTotal(i)} />
    </DiaGastosForm>
  ))}

  <SectionHeader title="Estimación Mensual" />
  {estimacionFields.map(field => <MoneyInput key={field} field={field} />)}
</GastosDiariosStep>
```

#### ReporteStep
```
<ReporteStep>
  <SectionHeader title="Estado del Folio" />
  <FolioStatusBadge status={isComplete ? 'CONCLUIDO' : 'INCOMPLETO'} />

  <SectionHeader title="Datos Generales" />
  <table>...folioViv, folioHog, entidad+nombre, entrevistador, fechas...</table>

  <SectionHeader title="Residentes" />
  <table>...NUMPER, Nombre, Parentesco, Sexo, Edad, Escolaridad...</table>

  <SectionHeader title="Ingresos" />
  <table>...laborales, no laborales, total...</table>

  <SectionHeader title="Gastos" />
  <table>...8 section totals, total trimestral, diario estimado...</table>

  <SectionHeader title="Tiempos" />
  <table>...per-questionnaire times, total...</table>

  <SectionHeader title="Alertas" />
  {warnings.map(w => <WarningRow key={w.id}>{w.message}</WarningRow>)}

  <NavigationButtons>
    <button onClick={handleReset}>Reiniciar</button>            // Only button on report
  </NavigationButtons>
</ReporteStep>
```

---

## 3. State Management Design

### 3.1 Zustand Store Structure

```typescript
// src/application/store/index.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FolioStore {
  // ── Wizard State ──
  currentStep: number;           // 1-8
  currentSubStep: number;        // 0-based index for dynamic steps (Menores12, 12+)

  // ── Questionnaire Data ──
  portada: PortadaData;
  hogares: HogaresViviendaData;
  menores12: Menores12Section;
  personas12plus: Personas12PlusSection;
  negocios: NegociosData;
  gastosHogar: GastosHogarData;
  gastosDiarios: GastosDiariosData;

  // ── Timer ──
  timer: TimerData;

  // ── Validation ──
  stepErrors: Record<number, FieldError[]>;      // step number → errors for that step
  crossSectionErrors: CrossSectionError[];         // global errors

  // ── Initialization ──
  _hasHydrated: boolean;                           // persist hydration flag

  // ── Actions: Wizard ──
  setCurrentStep: (step: number) => void;
  setCurrentSubStep: (subStep: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetAll: () => void;

  // ── Actions: Data Updates ──
  updatePortada: (data: Partial<PortadaData>) => void;
  updateHogares: (data: Partial<HogaresViviendaData>) => void;
  updateIntegrante: (numPer: string, data: Partial<Integrante>) => void;
  addIntegrante: () => void;                         // Creates blank integrante with next numPer
  removeIntegrante: (numPer: string) => void;        // Removes and re-numbers
  updateMenor12: (numPer: string, data: Partial<Menor12Data>) => void;
  updatePersona12: (numPer: string, data: Partial<Persona12PlusData>) => void;
  updateNegocio: (id: string, data: Partial<Negocio>) => void;
  addNegocio: () => void;
  removeNegocio: (id: string) => void;
  updateGastosHogar: (data: Partial<GastosHogarData>) => void;
  updateGastosDiarios: (data: Partial<GastosDiariosData>) => void;
  addGastoDiario: (diaIndex: number) => void;
  removeGastoDiario: (diaIndex: number, gastoId: string) => void;

  // ── Actions: Timer ──
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: (step: number) => void;

  // ── Actions: Validation ──
  setStepErrors: (step: number, errors: FieldError[]) => void;
  clearStepErrors: (step: number) => void;
  setCrossSectionErrors: (errors: CrossSectionError[]) => void;
}
```

### 3.2 Persist Middleware Configuration

```typescript
const useFolioStore = create<FolioStore>()(
  persist(
    (set, get) => ({
      // ... all state and actions
    }),
    {
      name: 'iktan-folio-storage',       // localStorage key
      version: 1,                        // Schema version for migrations
      partialize: (state) => ({
        // Persist DATA only — NOT UI transient state
        currentStep: state.currentStep,
        currentSubStep: state.currentSubStep,
        portada: state.portada,
        hogares: state.hogares,
        menores12: state.menores12,
        personas12plus: state.personas12plus,
        negocios: state.negocios,
        gastosHogar: state.gastosHogar,
        gastosDiarios: state.gastosDiarios,
        timer: state.timer,
        // Do NOT persist: stepErrors, crossSectionErrors, _hasHydrated
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, resume timer if it was running
        if (state?.timer?.isRunning) {
          // Timer will recalculate elapsed based on stored startedAt
        }
      },
    }
  )
);
```

### 3.3 Initial (Blank) State

Every questionnaire starts empty. There are NO pre-filled demo values.

```typescript
const initialPortada: PortadaData = {
  entidad: '',
  folioViv: '',
  folioHog: '',
  decena: '',
  nombreEntrevistador: '',
  nombreSupervisor: '',
  resultadoEntrevista: '',
  fechaInicio: '',
  fechaTermino: '',
  observaciones: '',
};

const initialTimer: TimerData = {
  entries: {
    1: { step: 1, stepLabel: 'Portada', elapsedSeconds: 0, status: 'stopped' },
    2: { step: 2, stepLabel: 'Hogares y Vivienda', elapsedSeconds: 0, status: 'stopped' },
    3: { step: 3, stepLabel: 'Menores de 12 años', elapsedSeconds: 0, status: 'stopped' },
    4: { step: 4, stepLabel: 'Personas de 12+ años', elapsedSeconds: 0, status: 'stopped' },
    5: { step: 5, stepLabel: 'Negocios del Hogar', elapsedSeconds: 0, status: 'stopped' },
    6: { step: 6, stepLabel: 'Gastos del Hogar', elapsedSeconds: 0, status: 'stopped' },
    7: { step: 7, stepLabel: 'Gastos Diarios', elapsedSeconds: 0, status: 'stopped' },
  },
  totalElapsedSeconds: 0,
  isRunning: false,
  currentStep: 1,
};
```

### 3.4 Cross-Section Validation Flow

Cross-section validation runs at two points:
1. **On "Siguiente" from Step 7** (before showing Reporte): checks ALL cross-section rules
2. **On navigation back** (Step 2→Steps 3/4): warns if integrantes changed

```typescript
// src/domain/validation/cross-section.ts

type CrossSectionRule = {
  id: string;
  description: string;
  severity: 'BLOCKER' | 'WARNING';
  check: (store: FolioStore) => boolean;
  message: string;
};

const CROSS_SECTION_RULES: CrossSectionRule[] = [
  {
    id: 'CS-001',
    description: 'FOLIOVIV idéntico en los 7 cuestionarios',
    severity: 'BLOCKER',
    check: (store) => { /* ... */ },
    message: 'FOLIOVIV no coincide entre cuestionarios',
  },
  // ... all rules from spec sections 3.3, 4.3, 5.3, 6.3, 7.3, 8.3, 12
];

export function validateCrossSection(store: FolioStore): CrossSectionError[] {
  return CROSS_SECTION_RULES
    .filter(rule => !rule.check(store))
    .map(rule => ({
      id: rule.id,
      severity: rule.severity,
      message: rule.message,
    }));
}
```

### 3.5 Selectors (Derived State)

```typescript
// src/application/store/selectors.ts

// Derive menores list from hogares.integrantes
export const selectMenores = (state: FolioStore): Integrante[] =>
  state.hogares.integrantes.filter(i => i.edad < 12);

// Derive personas12+ list
export const selectPersonas12Plus = (state: FolioStore): Integrante[] =>
  state.hogares.integrantes.filter(i => i.edad >= 12);

// Auto-populate informanteNombre in Gastos Diarios
export const selectInformanteNombre = (state: FolioStore): string => {
  const numPer = state.gastosDiarios.informanteNumPer;
  const integrante = state.hogares.integrantes.find(i => i.numPer === numPer);
  return integrante?.nombre ?? '';
};

// Check if current step has errors
export const selectHasStepErrors = (step: number) => (state: FolioStore): boolean =>
  (state.stepErrors[step]?.length ?? 0) > 0;

// Compute all blocker errors (step + cross-section)
export const selectAllBlockers = (state: FolioStore): string[] => {
  // ...
};
```

---

## 4. Data Flow

### 4.1 Portada → Shared Fields Propagation

```
┌──────────────┐     folioViv, folioHog      ┌──────────────────────┐
│  Portada     │─────────────────────────────▶│  All other steps     │
│  (captures   │   propagated automatically  │  (read-only display) │
│   folioViv,  │                              │                      │
│   folioHog)  │                              │  Field renders as    │
└──────────────┘                              │  <ReadOnlyField />   │
                                              └──────────────────────┘
```

Implementation: When any step renders its `folioViv`/`folioHog`, it reads from `store.portada.folioViv` and `store.portada.folioHog` — not from local copies. These fields are NOT duplicated in other questionnaire models (they exist in the TS interface per spec but are rendered read-only from Portada source).

### 4.2 Integrantes → Dynamic Sub-Steps

```
┌─────────────────────────────────┐
│ HogaresStep                     │
│   integrantes: [                │
│     { numPer:'01', edad:47 },   │──────▶ Persona12PlusSubForm (numPer=01)
│     { numPer:'02', edad:43 },   │──────▶ Persona12PlusSubForm (numPer=02)
│     { numPer:'03', edad:16 },   │──────▶ Persona12PlusSubForm (numPer=03)
│     { numPer:'04', edad:8  },   │──────▶ Menor12SubForm (numPer=04)
│   ]                             │
└─────────────────────────────────┘
```

The wizard derives sub-steps from `selectMenores` and `selectPersonas12Plus` selectors. When integrantes change:
1. Remove sub-steps for deleted integrantes
2. Add sub-steps for new integrantes (if age qualifies)
3. Move sub-steps between Menores12 and 12+ if age changed across the boundary

### 4.3 Validation Error Flow

```
┌──────────────┐   onBlur (field)  ┌─────────────────────┐
│  Field Input │──────────────────▶│  Zod schema.parse()  │
│  (user types)│                   │  (single-field safe) │
└──────────────┘                   └──────────┬──────────┘
                                              │
                                    ┌─────────▼──────────┐
                                    │  ValidationMessage  │◀── inline error
                                    │  (red text below)   │
                                    └────────────────────┘

┌──────────────┐   on "Siguiente"  ┌─────────────────────┐
│  Next Button │──────────────────▶│  Zod schema.parse()  │
│  (click)     │                   │  (full step)         │
└──────────────┘                   └──────────┬──────────┘
                                              │
                                    ┌─────────▼──────────┐
                                    │  ValidationSummary  │◀── error panel
                                    │  (step-level panel) │
                                    └────────────────────┘
                                              │
                                    ┌─────────▼──────────┐
                                    │  Block navigation   │
                                    │  if BLOCKER errors  │
                                    └────────────────────┘
```

On blur: validates single field, shows inline error. Does NOT block navigation.
On "Siguiente": validates ALL fields in current step. Shows summary panel. Blocks if errors exist.
On "Anterior": NO validation. Data preserved as-is.

### 4.4 Wizard Step Navigation

```
User clicks "Siguiente"
        │
        ▼
  ┌─────────────────┐
  │ Run step         │
  │ validation (Zod) │
  └────────┬────────┘
           │
    ┌──────▼──────┐    ┌──────────────────────────┐
    │ Has errors? │───▶│ Show ValidationSummary     │
    │             │ YES │ Don't advance.             │
    └──────┬──────┘    │ Focus first error field.   │
           │ NO        └──────────────────────────┘
           ▼
  ┌─────────────────┐
  │ Stop current     │
  │ step timer       │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Determine next   │
  │ step number      │
  │                  │
  │ Step 2→3: if 0   │
  │   menores, skip  │
  │   to step 4      │
  │                  │
  │ Step 5→6: if     │
  │ tieneNegocio=2,  │
  │   just advance   │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Set currentStep, │
  │ currentSubStep=0,│
  │ start new timer   │
  └─────────────────┘
```

Edge cases:
- **Step 2→3**: If 0 menores exist, auto-advance to step 4. Step 3 shows "No hay menores" message as fallback.
- **Step 7→8**: After Step 7 "Siguiente", run cross-section validation. If BLOCKERs exist, show them and DON'T advance. If only WARNINGs, advance with warnings visible.
- **Back navigation from Step 3/4→2**: Warn user: "Modificar la lista de integrantes puede afectar los cuestionarios ya capturados."

---

## 5. Zod Schema Design

### 5.1 Organization

```
src/domain/validation/
├── schemas.ts          # One Zod object per questionnaire
├── refinements.ts      # Custom refinement functions
└── cross-section.ts    # Cross-section validator
```

### 5.2 Shared Schemas

```typescript
// src/domain/validation/schemas.ts
import { z } from 'zod';

// ── Shared primitive schemas ──

const folioVivSchema = z.string()
  .length(10, 'FOLIOVIV debe contener exactamente 10 dígitos numéricos')
  .regex(/^\d{10}$/, 'FOLIOVIV debe contener solo dígitos numéricos');

const folioHogSchema = z.string()
  .length(1, 'FOLIOHOG debe ser 1 dígito')
  .regex(/^[1-5]$/, 'FOLIOHOG debe ser un dígito del 1 al 5');

// YesNo: 1=Sí, 2=No
const yesNoSchema = z.enum(['1', '2'], { message: 'Seleccione 1=Sí o 2=No' });

// YesNoUnk: 1, 2, or 9=No sabe
const yesNoUnkSchema = z.enum(['1', '2', '9'], { message: 'Seleccione 1=Sí, 2=No o 9=No sabe' });

// Money: number string without $ or commas
const moneySchema = z.string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Ingrese el monto sin signo de pesos ni comas (ej: 18500.00)')
  .transform(Number)
  .pipe(z.number().min(0, 'El monto no puede ser negativo'));

// Date: DD/MM/AAAA
const dateSchema = z.string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato de fecha inválido (DD/MM/AAAA)');
```

### 5.3 Per-Questionnaire Schemas

```typescript
// ── Portada Schema ──

export const portadaSchema = z.object({
  entidad: z.string()
    .length(2, 'ENTIDAD debe ser 2 dígitos')
    .regex(/^(0[1-9]|[12]\d|3[0-2])$/, 'ENTIDAD debe ser un código de 2 dígitos (01–32)'),
  folioViv: folioVivSchema,
  folioHog: folioHogSchema,
  decena: z.string()
    .length(1, 'DECENA debe ser 1 dígito')
    .regex(/^[0-9]$/, 'DECENA debe ser un dígito del 1 al 9, o 0 para decena 10'),
  nombreEntrevistador: z.string().min(1, 'El nombre del entrevistador es obligatorio'),
  nombreSupervisor: z.string().min(1, 'El nombre del supervisor es obligatorio'),
  resultadoEntrevista: z.enum(['A1','A2','A3','A4','A5','A6','A7'], {
    message: 'Seleccione un resultado de entrevista válido (A1–A7)',
  }),
  fechaInicio: dateSchema,
  fechaTermino: dateSchema,
  observaciones: z.string().optional().default(''),
}).refine(
  (data) => {
    // fechaTermino >= fechaInicio
    // Parse dates and compare
    // ...
  },
  { message: 'Fecha de término debe ser igual o posterior a fecha de inicio', path: ['fechaTermino'] }
).refine(
  (data) => {
    // If resultado = A1, fechaTermino must exist
    if (data.resultadoEntrevista === 'A1') {
      return data.fechaTermino.length > 0;
    }
    return true;
  },
  { message: 'Fecha de término es obligatoria para entrevista completa', path: ['fechaTermino'] }
);
```

### 5.4 Conditional Validation Pattern

For fields that are required only when another field has a specific value:

```typescript
// Hogares: duermenEnCocina required only when tieneCuartoCocina = '1'
export const hogaresViviendaSchema = z.object({
  tieneCuartoCocina: yesNoSchema,
  duermenEnCocina: z.string().optional(),
  // ...
  tieneElectricidad: yesNoSchema,
  numeroFocos: z.string().optional(),
  focosAhorradores: z.string().optional(),
  // ...
}).refine(
  (data) => {
    if (data.tieneCuartoCocina === '1') {
      return data.duermenEnCocina === '1' || data.duermenEnCocina === '2';
    }
    return true;
  },
  { message: 'Indique si duermen en la cocina', path: ['duermenEnCocina'] }
).refine(
  (data) => {
    if (data.tieneElectricidad === '1') {
      return data.numeroFocos !== undefined && data.numeroFocos !== '';
    }
    return true;
  },
  { message: 'Capture el número de focos', path: ['numeroFocos'] }
);
```

### 5.5 Dynamic Array Validation (Integrantes)

```typescript
export const integranteSchema = z.object({
  numPer: z.string().regex(/^\d{2}$/),
  nombre: z.string().min(1, 'El nombre del integrante es obligatorio'),
  parentesco: z.enum(['1','2','3','4','5','6','7','8','9']),
  sexo: z.enum(['1','2']),
  edad: z.number().int().min(0).max(120, 'Edad debe ser entre 0 y 120'),
  fechaNacimiento: dateSchema,
  estadoCivil: z.enum(['1','2','3','4','5','6']),
  sabeLeerEscribir: yesNoSchema,
  nivelEscolaridad: z.string(), // Will be refined by catalog
  asisteEscuela: yesNoSchema,
});

export const hogaresViviendaSchema = z.object({
  // ... vivienda fields ...
  integrantes: z.array(integranteSchema)
    .min(1, 'Debe capturar al menos un integrante del hogar (el/la jefe/a)'),
  // ...
}).refine(
  (data) => data.integrantes[0]?.numPer === '01',
  { message: 'El integrante 01 debe ser el/la Jefe(a) del hogar', path: ['integrantes.0.numPer'] }
).refine(
  (data) => data.integrantes[0]?.parentesco === '1',
  { message: 'El primer integrante debe ser el/la Jefe(a) del hogar', path: ['integrantes.0.parentesco'] }
);
```

### 5.6 Cross-Section Validation Orchestrator

```typescript
// src/domain/validation/cross-section.ts

export interface CrossSectionError {
  ruleId: string;        // CS-001, CS-002, etc.
  severity: 'BLOCKER' | 'WARNING';
  message: string;       // Spanish error message
  sections: string[];    // Which questionnaires are involved
}

export function validateCrossSection(store: FolioStore): CrossSectionError[] {
  const errors: CrossSectionError[] = [];
  const { portada, hogares, menores12, personas12plus, negocios, gastosHogar, gastosDiarios } = store;

  // CS-001: FOLIOVIV identical across all
  const folioVivs = [portada.folioViv, hogares.folioViv, ...menores12.menores.map(m => m.folioViv), /* etc. */];
  if (new Set(folioVivs.filter(Boolean)).size > 1) {
    errors.push({
      ruleId: 'CS-001',
      severity: 'BLOCKER',
      message: 'FOLIOVIV no coincide en todos los cuestionarios',
      sections: ['Portada', 'Hogares', 'Menores 12', '12+', 'Negocios', 'Gastos Hogar', 'Gastos Diarios'],
    });
  }

  // CS-005: All numPer in Menores12 / 12+ / Negocios exist in Hogares
  const hogaresNumPers = new Set(hogares.integrantes.map(i => i.numPer));

  for (const menor of menores12.menores) {
    if (!hogaresNumPers.has(menor.numPer)) {
      errors.push({
        ruleId: 'CS-005',
        severity: 'BLOCKER',
        message: `NUMPER ${menor.numPer} en Menores de 12 no existe en la lista de integrantes de Hogares`,
        sections: ['Menores 12', 'Hogares'],
      });
    }
  }
  // Similar for personas12plus, negocios...

  // CS-011: Sum of Menores12 + 12+ = total integrantes
  const totalMenores = menores12.menores.length;
  const totalMayores12 = personas12plus.personas.length;
  const totalIntegrantes = hogares.integrantes.length;
  if (totalMenores + totalMayores12 !== totalIntegrantes) {
    errors.push({
      ruleId: 'CS-011',
      severity: 'BLOCKER',
      message: `El total de cuestionarios de persona (${totalMenores + totalMayores12}) no coincide con la cantidad de integrantes (${totalIntegrantes})`,
      sections: ['Menores 12', '12+', 'Hogares'],
    });
  }

  // ... all other rules ...

  return errors;
}
```

---

## 6. Timer Architecture

### 6.1 Timer Data Model

```typescript
// src/domain/models/timer.ts

export interface TimerEntry {
  step: number;
  stepLabel: string;
  elapsedSeconds: number;    // Accumulated time in seconds
  status: 'running' | 'stopped';
  startedAt?: number;        // Date.now() when current segment started (not persisted, recalculated on rehydrate)
}

export interface TimerData {
  entries: Record<number, TimerEntry>;
  currentStep: number;
}
```

### 6.2 Timer Slice

```typescript
// src/application/store/slices/timer.slice.ts

interface TimerActions {
  startTimer: (step: number) => void;
  stopTimer: () => void;
  resumeTimer: (step: number) => void;
  resetAllTimers: () => void;
}

// Usage in store:
startTimer: (step) => set((state) => {
  const entry = state.timer.entries[step];
  return {
    timer: {
      ...state.timer,
      currentStep: step,
      entries: {
        ...state.timer.entries,
        [step]: {
          ...entry,
          status: 'running',
          startedAt: Date.now(),
        },
      },
    },
  };
}),

stopTimer: () => set((state) => {
  const entry = state.timer.entries[state.timer.currentStep];
  if (!entry || entry.status !== 'running') return state;

  const segmentElapsed = Math.floor((Date.now() - (entry.startedAt ?? Date.now())) / 1000);
  return {
    timer: {
      ...state.timer,
      entries: {
        ...state.timer.entries,
        [state.timer.currentStep]: {
          ...entry,
          status: 'stopped',
          elapsedSeconds: entry.elapsedSeconds + segmentElapsed,
          startedAt: undefined,
        },
      },
    },
  };
}),
```

### 6.3 Timer Display Component

```typescript
// src/ui/components/layout/TimerDisplay.tsx

interface TimerDisplayProps {
  stepLabel: string;
  elapsedSeconds: number;
}

function TimerDisplay({ stepLabel, elapsedSeconds }: TimerDisplayProps) {
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  // Format: HH:MM:SS if ≥ 1 hour, else MM:SS
  const display = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="timer-display">
      <span>⏱ Tiempo en {stepLabel}: {display}</span>
    </div>
  );
}
```

### 6.4 Timer Lifecycle Events

| Event | Timer Action |
|-------|-------------|
| Step is first displayed | `startTimer(step)` — starts from 0 or resumed elapsed |
| User clicks "Siguiente" | `stopTimer()` — freezes current step, records segment |
| User clicks "Anterior" | `stopTimer()` on current, `startTimer(prevStep)` — resumes accumulated |
| Page reload (rehydrate) | Calculate elapsed = stored.elapsedSeconds + (now - stored.startedAt if status=running) |
| User clicks "Reiniciar" | `resetAllTimers()` — all entries back to 0 |

---

## 7. Catalog System

### 7.1 Catalog Data Store

```typescript
// src/domain/constants/catalogs.ts

export type CatalogName =
  | 'entidades'
  | 'resultadosEntrevista'
  | 'parentescos'
  | 'clasesVivienda'
  | 'materialesParedes'
  | 'materialesTechos'
  | 'materialesPisos'
  | 'origenesAgua'
  | 'drenajes'
  | 'combustibles'
  | 'basura'
  | 'bienes'
  | 'escolaridad'
  | 'estadosCiviles'
  | 'tiposTrabajo'
  | 'institucionesSalud'
  | 'tiposEscuela'
  | 'quienCuida';

export interface CatalogEntry {
  code: string;      // The numeric code the user types
  label: string;     // Spanish description
}

export type Catalog = Record<string, CatalogEntry>;

// Example:
export const CATALOGS: Record<CatalogName, Catalog> = {
  entidades: {
    '01': { code: '01', label: 'Aguascalientes' },
    '02': { code: '02', label: 'Baja California' },
    // ...
    '32': { code: '32', label: 'Zacatecas' },
  },

  parentescos: {
    '1': { code: '1', label: 'Jefe(a) del hogar' },
    '2': { code: '2', label: 'Esposa(o) o compañera(o)' },
    '3': { code: '3', label: 'Hijo(a)' },
    '4': { code: '4', label: 'Nieto(a)' },
    '5': { code: '5', label: 'Yerno/Nuera' },
    '6': { code: '6', label: 'Padre/Madre/Suegro(a)' },
    '7': { code: '7', label: 'Hermano(a)/Cuñado(a)' },
    '8': { code: '8', label: 'Otro parentesco' },
    '9': { code: '9', label: 'Sin parentesco' },
  },

  // ... all catalogs from proposal Apéndice A ...
};
```

### 7.2 Catalog Helpers

```typescript
// src/domain/constants/catalog-helpers.ts

export function getLabel(catalog: Catalog, code: string): string {
  return catalog[code]?.label ?? `Código desconocido: ${code}`;
}

export function getEntries(catalog: Catalog): CatalogEntry[] {
  return Object.values(catalog);
}

export function isValidCode(catalog: Catalog, code: string): boolean {
  return code in catalog;
}

export function getValidRange(catalog: Catalog): string {
  const codes = Object.keys(catalog).sort();
  if (codes.length <= 8) {
    return codes.join(', ');
  }
  return `${codes[0]}-${codes[codes.length - 1]}`;
}
```

### 7.3 "📖 Códigos" Help Button

The `CatalogHelp` component is triggered by a button in `CodeInput`:

```typescript
// src/ui/components/help/CatalogHelp.tsx

interface CatalogHelpProps {
  catalog: Catalog;
  isOpen: boolean;
  onClose: () => void;
  fieldLabel: string;
}

function CatalogHelp({ catalog, isOpen, onClose, fieldLabel }: CatalogHelpProps) {
  if (!isOpen) return null;

  const entries = getEntries(catalog);

  return (
    <div className="catalog-help" role="dialog" aria-label={`Catálogo: ${fieldLabel}`}>
      <div className="catalog-help-header">
        <h4>Códigos: {fieldLabel}</h4>
        <button onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <table className="catalog-help-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.code}>
              <td className="code-cell">{entry.code}</td>
              <td>{entry.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 7.4 CodeInput Integration

```typescript
// src/ui/components/fields/CodeInput.tsx

interface CodeInputProps {
  field: string;              // Field name in the store
  catalog?: CatalogName;      // Optional catalog for validation and help
  label: string;              // Spanish label
  required?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  value: string;
  error?: string;
}

function CodeInput({ field, catalog: catalogName, label, required, maxLength, onChange, onBlur, value, error }: CodeInputProps) {
  const [showHelp, setShowHelp] = useState(false);
  const catalog = catalogName ? CATALOGS[catalogName] : undefined;

  return (
    <div className="field-group">
      <FieldLabel label={label} required={required} />
      <div className="field-input-row">
        <input
          type="text"
          inputMode="numeric"
          maxLength={maxLength ?? 2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className={`code-input ${error ? 'has-error' : ''}`}
          aria-describedby={error ? `${field}-error` : undefined}
        />
        {catalog && (
          <button
            type="button"
            className="catalog-help-btn"
            onClick={() => setShowHelp(!showHelp)}
            aria-label={`Ver códigos para ${label}`}
          >
            📖 Códigos
          </button>
        )}
      </div>
      {error && <ValidationMessage id={`${field}-error`} message={error} />}
      {catalog && (
        <CatalogHelp
          catalog={catalog}
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          fieldLabel={label}
        />
      )}
    </div>
  );
}
```

---

## 8. Component Specifications

### 8.1 CodeInput

| Aspect | Detail |
|--------|--------|
| **Props** | `field: string`, `catalog?: CatalogName`, `label: string`, `required?: boolean`, `maxLength?: number`, `value: string`, `onChange: (v: string) => void`, `onBlur: (v: string) => void`, `error?: string` |
| **State** | `showHelp: boolean` (local) |
| **Behavior** | Text input with `inputMode="numeric"`. Shows "📖 Códigos" button if catalog provided. On blur, fires validation. |
| **Rendering** | Label above, input + help button inline, error below, CatalogHelp below that when open |
| **Validation** | Validate on blur: non-empty if required, valid code if catalog provided |
| **Visual** | Input width ~4rem for 2-digit codes, ~8rem for longer codes |

### 8.2 TextInput

| Aspect | Detail |
|--------|--------|
| **Props** | `field: string`, `label: string`, `required?: boolean`, `maxLength?: number`, `placeholder?: string`, `value: string`, `onChange: (v: string) => void`, `onBlur: (v: string) => void`, `error?: string` |
| **State** | None (fully controlled) |
| **Behavior** | Standard text input. On blur validates required and maxLength. |
| **Rendering** | Full-width input with label above |

### 8.3 DateInput

| Aspect | Detail |
|--------|--------|
| **Props** | `field: string`, `label: string`, `required?: boolean`, `value: string` (DD/MM/AAAA), `onChange: (v: string) => void`, `onBlur?: () => void`, `error?: string` |
| **State** | `day: string`, `month: string`, `year: string` (local, derived from/merged to value) |
| **Behavior** | Three separate small inputs (DD, MM, AAAA). On each change, merge into DD/MM/AAAA string. |
| **Rendering** | `[DD] / [MM] / [AAAA]` with slashes as separators |

### 8.4 MoneyInput

| Aspect | Detail |
|--------|--------|
| **Props** | `field: string`, `label: string`, `required?: boolean`, `value: string`, `onChange: (v: string) => void`, `onBlur: (v: string) => void`, `error?: string` |
| **State** | None (controlled) |
| **Behavior** | Text input. Accepts digits and one decimal point. No `$`, no commas. On blur validates numeric format. |
| **Rendering** | Input with `inputMode="decimal"`. Label above with "($)" indicator. |

### 8.5 ReadOnlyField

| Aspect | Detail |
|--------|--------|
| **Props** | `label: string`, `value: string` |
| **State** | None |
| **Behavior** | Display-only. No interaction. |
| **Rendering** | Label above, value in grayed-out box. Used for folio viv/hog, integrante names/ages in sub-forms. |

### 8.6 TextAreaInput

| Aspect | Detail |
|--------|--------|
| **Props** | `field: string`, `label: string`, `required?: boolean`, `value: string`, `onChange: (v: string) => void`, `error?: string` |
| **Behavior** | Multi-line textarea for observaciones. |
| **Rendering** | Full-width textarea, ~4 rows |

### 8.7 CatalogHelp

| Aspect | Detail |
|--------|--------|
| **Props** | `catalog: Catalog`, `isOpen: boolean`, `onClose: () => void`, `fieldLabel: string` |
| **State** | None (controlled by parent's isOpen) |
| **Behavior** | Renders a scrollable table of code+label pairs. Click outside or press Escape to close. |
| **Rendering** | Modal/dropdown positioned below the CodeInput. Max height ~300px with scroll. |

### 8.8 ValidationMessage

| Aspect | Detail |
|--------|--------|
| **Props** | `message: string`, `id?: string` |
| **Behavior** | Static display of a single error message. |
| **Rendering** | Red text (`text-red-600`), small font, positioned below the input. |

### 8.9 ValidationSummary

| Aspect | Detail |
|--------|--------|
| **Props** | `errors: FieldError[]`, `onFocusField?: (field: string) => void` |
| **Behavior** | Lists all errors for the current step. Clicking an error scrolls to and focuses that field. |
| **Rendering** | Red-bordered panel with yellow background. "Corrija los siguientes errores:" heading, then bullet list. Each bullet is clickable (calls onFocusField). |

### 8.10 ConfirmModal

| Aspect | Detail |
|--------|--------|
| **Props** | `isOpen: boolean`, `title: string`, `message: string`, `confirmLabel: string`, `cancelLabel: string`, `onConfirm: () => void`, `onCancel: () => void`, `variant: 'danger' | 'warning'` |
| **Behavior** | Modal overlay. Blocks interaction. Trap focus inside. |
| **Rendering** | Centered card with backdrop blur. Danger variant = red confirm button. |

### 8.11 ProgressBar

| Aspect | Detail |
|--------|--------|
| **Props** | `steps: ProgressStep[]`, `currentStep: number` |
| **State** | None (derived) |
| **Behavior** | Purely visual — shows 7 labeled nodes connected by lines. |
| **Rendering** | Horizontal bar. Each node: circle with step number + label below. Current = filled blue. Completed = green checkmark. Pending = gray outline. |

### 8.12 WizardLayout

| Aspect | Detail |
|--------|--------|
| **Props** | `children: ReactNode` (the step content) |
| **State** | Reads `currentStep`, `currentSubStep`, `timer`, `stepErrors` from store |
| **Behavior** | Grid layout: header row (title + ProgressBar + TimerDisplay), main (scrollable step content), footer (ValidationSummary + NavigationButtons). |
| **Rendering** | CSS Grid: `grid-rows-[auto_1fr_auto] h-screen` |

### 8.13 NavigationButtons

| Aspect | Detail |
|--------|--------|
| **Props** | `onPrev: () => void`, `onNext: () => void`, `onReset: () => void`, `isFirstStep: boolean`, `isLastStep: boolean`, `canAdvance: boolean` |
| **Behavior** | "Anterior" disabled on first step. "Siguiente" fires validation before advancing. On last step (8), shows only "Reiniciar". |
| **Rendering** | Flex row: Anterior (left), Reiniciar (center), Siguiente (right). |

---

## 9. Error Handling

### 9.1 Validation Error Display

All error messages are in Spanish. Each error has:
- `field`: The Zod path (e.g., `folioViv`, `integrantes.0.edad`)
- `message`: Spanish error message

```typescript
interface FieldError {
  field: string;       // zod path
  message: string;     // Spanish error message
}

// Example errors:
// { field: 'folioViv', message: 'FOLIOVIV debe contener exactamente 10 dígitos numéricos' }
// { field: 'integrantes.0.edad', message: 'Edad debe ser entre 0 y 120' }
// { field: 'duermenEnCocina', message: 'Indique si duermen en la cocina' }
```

### 9.2 Cross-Section Error Aggregation

```typescript
interface CrossSectionError {
  ruleId: string;        // CS-001, CS-002, etc.
  severity: 'BLOCKER' | 'WARNING';
  message: string;
  sections: string[];    // Which questionnaires are affected
}

// Example:
// { ruleId: 'CS-001', severity: 'BLOCKER',
//   message: 'FOLIOVIV no coincide en todos los cuestionarios',
//   sections: ['Portada', 'Hogares'] }
```

### 9.3 Error Display Rules

| Error Type | Where | When | Blocks Navigation? |
|------------|-------|------|--------------------|
| Single-field (on blur) | Inline below field | After field loses focus | No |
| Step-level (on "Siguiente") | ValidationSummary panel | After "Siguiente" is clicked | Yes (until all resolved) |
| Cross-section BLOCKER | ValidationSummary + report | After Step 7 "Siguiente" | Yes (prevents report) |
| Cross-section WARNING | Report alerts section | Final report | No (informational only) |

### 9.4 localStorage Availability

```typescript
// src/infrastructure/persistence/storage-adapter.ts

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__iktan_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// In App.tsx:
if (!isLocalStorageAvailable()) {
  // Show banner: "⚠️ El almacenamiento local no está disponible. Los datos se perderán al cerrar el navegador."
  // Store still works in-memory; persist middleware degrades gracefully.
}
```

---

## 10. Tailwind Design Tokens

### 10.1 Color Palette (INEGI-inspired)

```
Primary (INEGI Blue):       #1B3A5C (dark navy, headers, active step)
Primary Light:              #2D5F8A (hover, focus rings)
Primary Pale:               #E8F0F8 (active step background)

Success:                    #2E7D32 (completed checkmark, CONCLUIDO badge)
Warning:                    #F57C00 (warnings, INCOMPLETO badge)
Danger:                     #C62828 (errors, delete buttons)

Neutral 900:                #212121 (text)
Neutral 700:                #616161 (secondary text)
Neutral 500:                #9E9E9E (disabled, placeholders)
Neutral 200:                #EEEEEE (borders, dividers)
Neutral 100:                #F5F5F5 (background)
Neutral 50:                 #FAFAFA (card backgrounds)

White:                      #FFFFFF
```

### 10.2 Typography

```
Font Family: system-ui, -apple-system, sans-serif
Font Sizes:
  text-xs:    0.75rem   (catalog codes, small labels)
  text-sm:    0.875rem  (field labels, error messages)
  text-base:  1rem      (body text, input values)
  text-lg:    1.125rem  (section headers)
  text-xl:    1.25rem   (step title)
  text-2xl:   1.5rem    (app title)

Font Weights:
  font-normal:  400
  font-medium:  500  (labels, buttons)
  font-semibold: 600  (section headers)
  font-bold:    700  (app title, step numbers)

Line Heights:
  leading-tight:   1.25
  leading-normal:  1.5
```

### 10.3 Spacing Scale

```
space-1:  0.25rem   (tight gaps)
space-2:  0.5rem    (field-label gap)
space-3:  0.75rem   (field-field gap)
space-4:  1rem      (card padding, section gaps)
space-6:  1.5rem    (section-section gap)
space-8:  2rem      (major section spacing)

Container max-width: 48rem (768px) — centered on large screens
```

### 10.4 Component Variants

```
// Inputs
input-base: "w-full px-3 py-2 border border-neutral-300 rounded-md
             text-base font-normal focus:outline-none focus:ring-2
             focus:ring-primary-light focus:border-primary"
input-error: "border-danger focus:ring-danger/50 focus:border-danger"
input-readonly: "bg-neutral-100 text-neutral-700 cursor-default"

// Code input (narrow)
code-input: "w-16 px-2 py-2 border border-neutral-300 rounded-md
             text-center font-mono text-base"

// Buttons
btn-primary: "px-4 py-2 bg-primary text-white rounded-md font-medium
              hover:bg-primary-light focus:ring-2 focus:ring-primary-light
              disabled:opacity-50 disabled:cursor-not-allowed"
btn-secondary: "px-4 py-2 border border-neutral-300 text-neutral-700
                rounded-md font-medium hover:bg-neutral-100"
btn-danger: "px-4 py-2 bg-danger text-white rounded-md font-medium
             hover:bg-red-700"
btn-ghost: "px-2 py-1 text-primary font-medium hover:bg-primary-pale rounded"

// Cards
card: "bg-white border border-neutral-200 rounded-lg p-4 shadow-sm"

// Progress Bar
progress-node: "w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-semibold"
progress-active: "bg-primary text-white"
progress-completed: "bg-success text-white"
progress-pending: "bg-neutral-200 text-neutral-500"

// Validation
error-text: "text-danger text-sm mt-1"
error-panel: "bg-red-50 border border-danger/30 rounded-md p-4"
warning-panel: "bg-orange-50 border border-warning/30 rounded-md p-4"

// Timer
timer-display: "font-mono text-sm text-neutral-700 bg-neutral-100
                px-3 py-1 rounded-full"
```

---

## 11. Edge Cases & Error Boundaries

### 11.1 Empty State Handling

| Scenario | Behavior |
|----------|----------|
| No integrantes in Hogares | Show "Agregue al menos un integrante" message |
| 0 menores (Step 3) | Show "No hay menores de 12 años — pase al siguiente" |
| 0 personas 12+ (Step 4) | Show "No hay personas de 12+ años — pase al siguiente" |
| tieneNegocio = '2' | Show "No aplica — este hogar no tiene negocios" |

### 11.2 Edge Cases

| Scenario | Handling |
|----------|----------|
| User navigates back from Step 3/4 to Step 2 and changes ages | Recompute sub-step lists. Data for removed sub-steps is lost. Warn user. |
| User changes folioViv in Portada after filling other questionnaires | Cross-section validation catches mismatch at Step 7→8 transition |
| localStorage quota exceeded | Zustand persist fails silently; in-memory store continues. Show warning. |
| Browser tab hidden during timer | Timer uses `Date.now()` diffs, not intervals, so it's accurate when tab regains focus |
| Very long nombreEntrevistador/Supervisor | Text input allows full text; wrap in display |
| Zero amounts in Gastos Hogar | Treat as 0 for calculations. Empty = 0. |
| Negative numbers in money inputs | Blocked by Zod validation (min: 0) |
| Duplicate numPer (manual entry) | Zod refinement checks uniqueness |

### 11.3 Error Boundary

```typescript
// At App level:
<ErrorBoundary fallback={
  <div className="error-boundary">
    <h2>Ha ocurrido un error inesperado</h2>
    <p>Por favor, recargue la página. Sus datos se han guardado.</p>
    <button onClick={() => window.location.reload()}>Recargar</button>
  </div>
}>
  <App />
</ErrorBoundary>
```

---

## 12. Testing Strategy

### 12.1 Test Layers

```
tests/
├── domain/
│   ├── validation/
│   │   ├── schemas.test.ts          # Each Zod schema parses valid/invalid data correctly
│   │   ├── refinements.test.ts      # Conditional required fields work
│   │   └── cross-section.test.ts    # Cross-section rules fire correctly
│   └── constants/
│       └── catalogs.test.ts         # All catalogs have valid structure
│
├── application/
│   ├── store/
│   │   ├── wizard.test.ts           # Step navigation, sub-step derivation
│   │   ├── timer.test.ts            # Start/stop/resume, elapsed calculation
│   │   └── slices/*.test.ts         # Per-questionnaire actions
│   └── use-cases/
│       └── validate.test.ts         # Orchestration of step + cross-section validation
│
└── ui/
    ├── components/
    │   ├── fields/
    │   │   ├── CodeInput.test.tsx    # Renders, shows help, validates
    │   │   ├── DateInput.test.tsx    # 3 fields merge correctly
    │   │   └── MoneyInput.test.tsx   # Rejects $ and commas
    │   ├── help/
    │   │   └── CatalogHelp.test.tsx  # Opens/closes, renders catalog table
    │   └── layout/
    │       ├── ProgressBar.test.tsx  # Renders 7 steps with correct status
    │       └── TimerDisplay.test.tsx # Formats MM:SS and HH:MM:SS
    └── steps/
        ├── PortadaStep.test.tsx      # Full step: renders, validates, updates store
        └── HogaresStep.test.tsx      # Integrante add/remove, conditional fields
```

### 12.2 Coverage Targets

| Layer | Statements | Branches | Functions | Lines |
|-------|-----------|----------|-----------|-------|
| **domain/** | 95% | 95% | 100% | 95% |
| **application/** | 90% | 85% | 90% | 90% |
| **ui/** | 80% | 75% | 80% | 80% |
| **Overall** | **80%** | **75%** | **80%** | **80%** |

### 12.3 TDD Workflow (Strict Mode — Vitest)

```
1. Write failing test for a component/schema/action
2. Run vitest --run → RED
3. Implement minimal code → GREEN
4. Refactor → GREEN
5. Commit
```

---

## 13. Implementation Sequence (Build Order)

| Phase | What | Dependencies |
|-------|------|-------------|
| **P0: Foundation** | Project scaffold (Vite, React, TS, Tailwind, Zustand, Zod, Vitest). Directory structure. Base types (`shared.ts`, catalog types). | None |
| **P1: Catalogs + Validation** | All catalog constants. All Zod schemas (per questionnaire). Cross-section rules. Unit tests for all. | P0 |
| **P2: Store** | Zustand store with all slices. Persist middleware. Selectors. Timer logic. Unit tests. | P0 |
| **P3: Shared UI** | All field components (CodeInput, TextInput, DateInput, MoneyInput, TextAreaInput, ReadOnlyField, FieldLabel). CatalogHelp. ValidationMessage. ValidationSummary. ConfirmModal. SectionHeader. Unit + integration tests. | P1, P2 |
| **P4: Layout** | WizardLayout. ProgressBar. TimerDisplay. NavigationButtons. Integration tests. | P3 |
| **P5: Steps (simple)** | PortadaStep. NegociosStep. GastosHogarStep. Integration tests. | P3, P4 |
| **P6: Steps (complex)** | HogaresStep (IntegranteList, IntegranteForm, IngresoIntegranteForm, BienesInput). Menores12Step. Personas12PlusStep. GastosDiariosStep (DiaGastosForm, GastoItemRow). Integration tests. | P5 |
| **P7: Report + Cross-Section** | ReporteStep. Cross-section validation in navigation. Integration tests. | P6 |
| **P8: Polish** | Error boundaries. localStorage fallback. Empty states. Final integration test sweep. | P7 |

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Complex conditional field logic** in HogaresStep and Personas12PlusStep | High | Exhaustive test cases for every conditional path. Extract show/hide logic into pure functions. |
| **Dynamic sub-step re-computation** when integrantes change | Medium | Derive lists via selectors. Warn user before destructive changes. Test edge cases. |
| **Timer accuracy across tab visibility** | Low | Use `Date.now()` diffs instead of `setInterval` counters. |
| **Zod refinement complexity** for cross-field rules | Medium | Keep refinements focused on single-field conditional logic. Delegate multi-questionnaire rules to cross-section validator. |
| **Tailwind v4 breaking changes** | Low | Pin version. Tailwind v4 adds CSS-first config, but utility classes remain compatible. |
| **localStorage 5-10MB limit** | Low | Estimated store size ~50KB for a full folio. Far below limit. |

---

## Appendix: Component-to-Store Mapping

| Component | Reads from Store | Writes to Store |
|-----------|-----------------|-----------------|
| `PortadaStep` | `portada`, `stepErrors[1]` | `updatePortada`, `setStepErrors` |
| `HogaresStep` | `hogares`, `stepErrors[2]` | `updateHogares`, `addIntegrante`, `removeIntegrante`, `updateIntegrante` |
| `Menores12Step` | `menores12`, `hogares.integrantes`, `stepErrors[3]` | `updateMenor12` |
| `Personas12PlusStep` | `personas12plus`, `hogares.integrantes`, `stepErrors[4]` | `updatePersona12` |
| `NegociosStep` | `negocios`, `stepErrors[5]` | `updateNegocios`, `addNegocio`, `removeNegocio` |
| `GastosHogarStep` | `gastosHogar`, `stepErrors[6]` | `updateGastosHogar` |
| `GastosDiariosStep` | `gastosDiarios`, `hogares.integrantes`, `stepErrors[7]` | `updateGastosDiarios`, `addGastoDiario`, `removeGastoDiario` |
| `ReporteStep` | All questionnaire data, `timer`, `crossSectionErrors` | None (read-only) |
| `WizardLayout` | `currentStep`, `currentSubStep`, `timer` | None |
| `ProgressBar` | `currentStep`, derived step status | None |
| `TimerDisplay` | `timer.entries[currentStep]` | None |
| `NavigationButtons` | `currentStep`, `hasStepErrors` | `nextStep`, `prevStep`, `resetAll` |
| `ValidationSummary` | `stepErrors[currentStep]` | None |

---

> **Next Phase:** `sdd/tasks` — Break down this design into concrete implementation tasks with TDD order, estimated effort, and acceptance criteria per task.
