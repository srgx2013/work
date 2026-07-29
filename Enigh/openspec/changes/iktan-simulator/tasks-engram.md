# IKTAN Simulator — Implementation Tasks

> **Change:** `iktan-simulator`
> **Phase:** tasks
> **Status:** pending
> **Date:** 2025-07-10
> **Project:** ENIGH IKTAN Simulator
> **Artifact Store:** engram + openspec

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~5,200 (code) + ~3,500 (tests) ≈ 8,700 total |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | P0–P3 (infra + domain + store + UI shell) → P4–P6 (steps 1–6) → P7–P8 (steps 7–8 + integration) |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

---

## Phase P0: Project Setup

### P0-001 · Initialize Vite + React + TypeScript Project
- Phase: P0 | Dependencies: None | Complexity: S
- Bootstrap project: package.json, tsconfig, vite.config.ts, index.html, src/main.tsx
- Acceptance: `npm install`, `npm run dev`, `npm run build`, `npm run test` all succeed
- Testing: None (config only)

### P0-002 · Configure Tailwind CSS v4
- Phase: P0 | Dependencies: P0-001 | Complexity: S
- Install @tailwindcss/vite, configure src/index.css with @import "tailwindcss", custom ENIGH color palette (#1D3557 blue, #E63946 red, #F4A261 amber, #2A9D8F green)
- Acceptance: Tailwind utilities work, custom colors work
- Testing: None

### P0-003 · Install Core Dependencies
- Phase: P0 | Dependencies: P0-001 | Complexity: S
- Install: zustand, zod, vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, happy-dom
- Acceptance: All packages install, imports compile without errors
- Testing: None

### P0-004 · Set Up Vitest and Testing Infrastructure
- Phase: P0 | Dependencies: P0-001, P0-003 | Complexity: M
- Configure vitest.config.ts with jsdom, globals: true, @testing-library/jest-dom; create src/test/setup.ts and src/test/mocks.ts
- Acceptance: `npm run test` runs Vitest, coverage report generates
- Testing: smoke.test.ts renders `<div>Hello</div>` and verifies it exists

---

## Phase P1: Domain Layer

### P1-001 · Create TypeScript Interfaces — Shared Models
- Phase: P1 | Dependencies: P0-001 | Complexity: M
- Create src/domain/models/shared.ts with SharedFolioFields, YesNo, YesNoUnk, and all catalog code union types (17+ union types)
- Acceptance: All union types use exact string literals, no `any` types
- Testing: src/domain/models/shared.test.ts

### P1-002 · Create TypeScript Interfaces — Portada + Folio
- Phase: P1 | Dependencies: P1-001 | Complexity: S
- Create portada.ts (PortadaData) and folio.ts (CompleteFolioData)
- Acceptance: PortadaData extends SharedFolioFields, all spec fields present
- Testing: portada.test.ts (type-level smoke)

### P1-003 · Create TypeScript Interfaces — Hogares y Vivienda
- Phase: P1 | Dependencies: P1-001 | Complexity: M
- Create hogares.ts with Integrante, IngresoIntegrante, HogaresViviendaData (Sections I, II, III, IV, VII)
- Acceptance: All spec fields present, sections match spec 3.5
- Testing: hogares.test.ts (type-level smoke)

### P1-004 · Create TypeScript Interfaces — Menores 12 y Personas 12+
- Phase: P1 | Dependencies: P1-001 | Complexity: M
- Create menores12.ts and personas12plus.ts with all spec fields
- Acceptance: All read-only pre-filled fields present, conditional fields optional
- Testing: menores12.test.ts, personas12plus.test.ts

### P1-005 · Create TypeScript Interfaces — Negocios
- Phase: P1 | Dependencies: P1-001 | Complexity: S
- Create negocios.ts with Negocio (id: string for React key) and NegociosData
- Acceptance: Negocio has id: string, NegociosData has tieneNegocio and negocios array
- Testing: negocios.test.ts

### P1-006 · Create TypeScript Interfaces — Gastos del Hogar y Gastos Diarios
- Phase: P1 | Dependencies: P1-001 | Complexity: M
- Create gastos-hogar.ts (~43 fields, 8 sections) and gastos-diarios.ts (GastoDiario, DiaGastos, EstimacionMensual, GastosDiariosData)
- Acceptance: All spec fields present, GastoDiario has id: string
- Testing: gastos-hogar.test.ts, gastos-diarios.test.ts

### P1-007 · Create TypeScript Interfaces — Timer
- Phase: P1 | Dependencies: P1-001 | Complexity: S
- Create timer.ts with TimerEntry and TimerData per spec section 10.2
- Acceptance: TimerEntry has step, stepLabel, elapsedSeconds, status, startedAt?
- Testing: timer.test.ts

### P1-008 · Create All 17 Catalogs
- Phase: P1 | Dependencies: P1-001 | Complexity: L
- Create src/domain/constants/catalogs.ts with all 17 catalogs from Apéndice A: entidades, resultadosEntrevista, parentescos, clasesVivienda, materialesParedes, materialesTechos, materialesPisos, origenesAgua, drenajes, combustibles, bienes, escolaridad, estadosCiviles, tiposTrabajo, institucionesSalud, tiposEscuela, quienCuida
- Acceptance: All 17 catalogs exported, CatalogEntry has code + label, all spec codes present
- Testing: catalogs.test.ts — verify entity 14 = Jalisco, parentesco 1 = Jefe(a)

### P1-009 · Create Catalog Helper Functions
- Phase: P1 | Dependencies: P1-008 | Complexity: S
- Create catalog-helpers.ts with getLabel, getEntries, isValidCode, getValidRange, getCatalogByName
- Acceptance: All 4 helpers work correctly, getCatalogByName returns typed catalog
- Testing: catalog-helpers.test.ts

### P1-010 · Create Zod Schemas — Shared Primitives and Portada
- Phase: P1 | Dependencies: P1-001, P1-002, P1-008 | Complexity: M
- Create schemas.ts with shared primitives (folioVivSchema, folioHogSchema, yesNoSchema, yesNoUnkSchema, moneySchema, dateSchema) and portadaSchema with P-001 through P-013 rules
- Acceptance: All P-001 through P-013 rules implemented, valid data passes, invalid data throws
- Testing: schemas/portada.test.ts

### P1-011 · Create Zod Schemas — Hogares y Vivienda
- Phase: P1 | Dependencies: P1-003, P1-010 | Complexity: L
- Create hogaresSchema with HV-001 through HV-011 rules, integranteSchema, conditional field validations
- Acceptance: HV-001 (numeroCuartos >= numeroDormitorios), HV-003 (focosAhorradores <= numeroFocos), HV-005 (numPer 01), HV-007 (fechaNacimiento ±1 year tolerance), HV-011 (min 1 integrante)
- Testing: schemas/hogares.test.ts

### P1-012 · Create Zod Schemas — Menores 12
- Phase: P1 | Dependencies: P1-004, P1-010 | Complexity: M
- Create menor12Schema with M12-001 through M12-007 rules
- Acceptance: M12-005 (institucionSalud required when tieneDerechohabiencia='1'), M12-006 (gradoEscolar), M12-007 (tipoEscuela), YesNoUnk for vaccinacionCompleta
- Testing: schemas/menores12.test.ts

### P1-013 · Create Zod Schemas — Personas 12+
- Phase: P1 | Dependencies: P1-004, P1-010 | Complexity: L
- Create persona12PlusSchema with all Sections I–VI fields and P12-001 through P12-015 rules
- Acceptance: P12-008 (ocupacionPrincipal), P12-011 (ingresoMensualNeto), P12-015 (motivoNoTrabaja), all conditional groups
- Testing: schemas/personas12plus.test.ts

### P1-014 · Create Zod Schemas — Negocios
- Phase: P1 | Dependencies: P1-005, P1-010 | Complexity: S
- Create negocioSchema and negociosDataSchema with NEG-001 through NEG-007
- Acceptance: NEG-006 (at least 1 negocio when tieneNegocio='1'), NEG-007 (tipoNegocio required), tieneNegocio='2' passes without negocios
- Testing: schemas/negocios.test.ts

### P1-015 · Create Zod Schemas — Gastos del Hogar
- Phase: P1 | Dependencies: P1-006, P1-010 | Complexity: M
- Create gastosHogarSchema with all 8 sections (~43 fields), GH-001 through GH-004
- Acceptance: GH-003 (no $ or commas), GH-004 (>= 0), all 8 sections, empty data passes
- Testing: schemas/gastos-hogar.test.ts

### P1-016 · Create Zod Schemas — Gastos Diarios
- Phase: P1 | Dependencies: P1-006, P1-010 | Complexity: M
- Create gastoDiarioSchema, diaGastosSchema, estimacionMensualSchema, gastosDiariosSchema with GD-001 through GD-008
- Acceptance: GD-003 (informanteNumPer), GD-007 (concepto required), GD-008 (at least 1 gasto per day), all 7 days
- Testing: schemas/gastos-diarios.test.ts

### P1-017 · Create Cross-Section Validator
- Phase: P1 | Dependencies: P1-008, P1-010 through P1-016 | Complexity: L
- Create cross-section.ts implementing CS-001 through CS-017 rules, CrossSectionError interface
- Acceptance: CS-001 (folioViv BLOCKER), CS-011 (sum mismatch BLOCKER), CS-015 (daily > 4x trimestral WARNING), CS-017 (gastos > income WARNING)
- Testing: cross-section.test.ts

### P1-018 · Create Validation Error Types
- Phase: P1 | Dependencies: P1-010 | Complexity: XS
- Create validation/types.ts with FieldError interface (field, message, ruleId?)
- Acceptance: FieldError interface exported
- Testing: None (type-only)

---

## Phase P2: Store Layer

### P2-001 · Create Initial State Factories
- Phase: P2 | Dependencies: P1-002 through P1-007 | Complexity: S
- Create initial-state.ts with factory functions for all questionnaires and timer
- Acceptance: createInitialHogares() returns empty integrantes[], createInitialGastosDiarios() returns 7 empty days, createInitialNegocios() returns tieneNegocio='2'
- Testing: initial-state.test.ts

### P2-002 · Create Wizard Slice
- Phase: P2 | Dependencies: P2-001 | Complexity: M
- Create wizard.slice.ts with currentStep, currentSubStep, setCurrentStep, setCurrentSubStep, nextStep, prevStep, resetAll
- Acceptance: nextStep() on step 7 stays at 7, prevStep() on step 1 stays at 1, resetAll() goes to step 1
- Testing: slices/wizard.slice.test.ts

### P2-003 · Create Timer Slice
- Phase: P2 | Dependencies: P2-001 | Complexity: M
- Create timer.slice.ts with startTimer, stopTimer, resumeTimer, resetAllTimers. Uses startedAt timestamp for active segment.
- Acceptance: startTimer sets status='running' with startedAt, stopTimer accumulates elapsed, resumeTimer restarts from accumulated
- Testing: slices/timer.slice.test.ts (mock Date)

### P2-004 · Create Portada Slice
- Phase: P2 | Dependencies: P2-001, P1-002 | Complexity: S
- Create portada.slice.ts with updatePortada(data: Partial<PortadaData>)
- Acceptance: Partial update preserves other fields
- Testing: slices/portada.slice.test.ts

### P2-005 · Create Hogares Slice
- Phase: P2 | Dependencies: P2-001, P1-003 | Complexity: M
- Create hogares.slice.ts with updateHogares, updateIntegrante, addIntegrante (auto numPer 01, 02...), removeIntegrante (re-numbers), updateIngresoIntegrante
- Acceptance: addIntegrante() creates next numPer, removeIntegrante('01') fails (jefe), re-numbering after remove
- Testing: slices/hogares.slice.test.ts

### P2-006 · Create Menores12 and Personas12Plus Slices
- Phase: P2 | Dependencies: P2-001, P1-004, P2-005 | Complexity: S
- Create menores12.slice.ts (updateMenor12) and personas12plus.slice.ts (updatePersona12)
- Acceptance: updateMenor12('04', data) updates correct menor, updatePersona12('01', data) updates correct persona
- Testing: slices/menores12.slice.test.ts, slices/personas12plus.slice.test.ts

### P2-007 · Create Negocios Slice
- Phase: P2 | Dependencies: P2-001, P1-005 | Complexity: S
- Create negocios.slice.ts with updateNegociosData, updateNegocio(id, data), addNegocio (UUID), removeNegocio(id)
- Acceptance: addNegocio() creates UUID, removeNegocio removes by id not index
- Testing: slices/negocios.slice.test.ts

### P2-008 · Create Gastos Hogar and Gastos Diarios Slices
- Phase: P2 | Dependencies: P2-001, P1-006 | Complexity: M
- Create gastos-hogar.slice.ts and gastos-diarios.slice.ts (includes addGastoDiario, removeGastoDiario, updateGastoDiario)
- Acceptance: addGastoDiario(0) adds to day 1, removeGastoDiario by id, updateGastoDiario by id
- Testing: slices/gastos-hogar.slice.test.ts, slices/gastos-diarios.slice.test.ts

### P2-009 · Create Validation Slice
- Phase: P2 | Dependencies: P2-001 | Complexity: S
- Create validation.slice.ts with stepErrors, crossSectionErrors, setStepErrors, clearStepErrors, setCrossSectionErrors, clearAllErrors
- Acceptance: setStepErrors(2, errors) stores for step 2, clearStepErrors(2) only clears step 2, clearAllErrors clears both
- Testing: slices/validation.slice.test.ts

### P2-010 · Create Combined Zustand Store with Persist
- Phase: P2 | Dependencies: P2-001 through P2-009, P1-017 | Complexity: L
- Create store/index.ts combining all slices, persist middleware, partialize (exclude stepErrors, crossSectionErrors, _hasHydrated), localStorage key 'iktan-folio-storage'
- Acceptance: Store compiles, persists to localStorage, rehydrates on reload, resetAll clears localStorage
- Testing: store/index.test.ts

### P2-011 · Create Selectors
- Phase: P2 | Dependencies: P2-010 | Complexity: M
- Create selectors.ts: selectMenores (edad < 12), selectPersonas12Plus (edad >= 12), selectInformanteNombre (lookup by numPer), selectHasStepErrors(step), selectIsStepValid(step, schema), selectTotalIntegrantes, selectTimerEntry(step), selectTotalElapsedSeconds
- Acceptance: All selectors return correct derived data
- Testing: selectors.test.ts

### P2-012 · Create Navigate Step Use Case
- Phase: P2 | Dependencies: P2-002, P2-010, P1-010 | Complexity: M
- Create navigate-step.ts with computeNextStep(currentStep, store): Step 2→3 skips to 4 if 0 menores, Step 5→6 skips to 6 if tieneNegocio='2', Step 7→8 returns 8
- Acceptance: All skip conditions implemented correctly
- Testing: use-cases/navigate-step.test.ts

### P2-013 · Create Validate Step Use Case
- Phase: P2 | Dependencies: P2-010, P1-010 through P1-016 | Complexity: M
- Create validate-step.ts with validateStep(stepNumber, data, schema): FieldError[], exports STEP_SCHEMAS map
- Acceptance: Returns empty array for valid data, FieldError[] for invalid, handles nested Zod errors
- Testing: use-cases/validate-step.test.ts

### P2-014 · Create Validate Cross-Section Use Case
- Phase: P2 | Dependencies: P2-010, P1-017 | Complexity: S
- Create validate-cross-section.ts wrapping validateCrossSection(store)
- Acceptance: Returns all BLOCKER and WARNING errors, empty array when no errors
- Testing: use-cases/validate-cross-section.test.ts

### P2-015 · Create Compute Report Use Case
- Phase: P2 | Dependencies: P2-010 | Complexity: M
- Create compute-report.ts with computeReportData(store): ReportData (totals, integration counts, timer summary, folio status, warnings)
- Acceptance: totalIntegrantes, totalGastosTrimestral, totalGastosDiarios, tiempoTotal, folioStatus all computed correctly
- Testing: use-cases/compute-report.test.ts

---

## Phase P3: Shared UI Components

### P3-001 · Set Up Directory Structure and Base Styles
- Phase: P3 | Dependencies: P0-002 | Complexity: S
- Create src/ui/ directory structure per design, create tokens.css with CSS custom properties for colors, spacing, typography
- Acceptance: CSS variables for primary/danger/warning/success colors, spacing scale, typography scale
- Testing: None (CSS only)

### P3-002 · Create WizardLayout Component
- Phase: P3 | Dependencies: P2-010, P3-001 | Complexity: M
- Create layout/WizardLayout.tsx: grid layout with sticky header (title, ProgressBar, TimerDisplay), scrollable main (active step), sticky footer (ValidationSummary, NavigationButtons). Renders active step by currentStep.
- Acceptance: Renders header/main/footer, shows correct step, ValidationSummary in footer when errors exist, responsive
- Testing: WizardLayout.test.tsx

### P3-003 · Create ProgressBar Component
- Phase: P3 | Dependencies: P3-001 | Complexity: S
- Create layout/ProgressBar.tsx: horizontal step indicator for 7 questionnaire steps, current/completed/pending states, dynamic labels for steps 3/4
- Acceptance: 7 nodes, current highlighted, completed shows ✓, pending dimmed, step 3 shows "Menores 12 (N)", step 4 shows "12+ (N)"
- Testing: ProgressBar.test.tsx

### P3-004 · Create TimerDisplay Component
- Phase: P3 | Dependencies: P2-003, P3-001 | Complexity: M
- Create layout/TimerDisplay.tsx: ⏱ MM:SS format, updates every second via setInterval, HH:MM:SS when ≥ 60 min, Page Visibility API pause
- Acceptance: Formats correctly, updates every second, pauses on tab hidden, resumes on visible
- Testing: TimerDisplay.test.tsx, TimerDisplay.visibility.test.tsx

### P3-005 · Create NavigationButtons Component
- Phase: P3 | Dependencies: P3-001 | Complexity: S
- Create layout/NavigationButtons.tsx: Anterior/Siguiente/Reiniciar buttons with correct disabled states
- Acceptance: Anterior disabled on step 1, Siguiente disabled when canAdvance=false, Reiniciar triggers onReset
- Testing: NavigationButtons.test.tsx

### P3-006 · Create FieldLabel Component
- Phase: P3 | Dependencies: P3-001 | Complexity: XS
- Create fields/FieldLabel.tsx: Spanish label text with red asterisk for required fields, accessible htmlFor/id association
- Acceptance: Shows label, shows * in red when required=true, accessible
- Testing: FieldLabel.test.tsx

### P3-007 · Create CodeInput Component
- Phase: P3 | Dependencies: P1-008, P1-009, P3-001, P3-006 | Complexity: M
- Create fields/CodeInput.tsx: inputMode="numeric", optional "📖 Códigos" button, CatalogHelp integration, ValidationMessage, onBlur validation
- Acceptance: Numeric input, "📖 Códigos" toggles CatalogHelp, shows error when provided, onBlur fires
- Testing: CodeInput.test.tsx

### P3-008 · Create TextInput, DateInput, MoneyInput, TextAreaInput, ReadOnlyField
- Phase: P3 | Dependencies: P3-001, P3-006, P3-007 | Complexity: M
- Create all remaining field components: TextInput (standard), DateInput (DD/MM/AAAA merge), MoneyInput (decimal, no $ or commas), TextAreaInput, ReadOnlyField (gray, no border)
- Acceptance: All render with label, DateInput merges 3 inputs, MoneyInput accepts only digits and decimal, ReadOnlyField grayed out
- Testing: TextInput.test.tsx, DateInput.test.tsx, MoneyInput.test.tsx, TextAreaInput.test.tsx, ReadOnlyField.test.tsx

### P3-009 · Create CatalogHelp Component
- Phase: P3 | Dependencies: P1-008, P3-001 | Complexity: S
- Create help/CatalogHelp.tsx: expandable catalog table, scrollable max-height ~300px, closes on Escape, accessible role="dialog"
- Acceptance: Renders table, scrollable, closes on Escape, accessible, hidden when isOpen=false
- Testing: CatalogHelp.test.tsx

### P3-010 · Create ValidationMessage and ValidationSummary Components
- Phase: P3 | Dependencies: P1-018, P3-001 | Complexity: S
- Create feedback/ValidationMessage (single inline error) and feedback/ValidationSummary (red-bordered panel, clickable bullets calling onFocusField)
- Acceptance: ValidationMessage shows red text, ValidationSummary lists all errors, heading says "Corrija los siguientes errores:", click calls onFocusField, hidden when empty
- Testing: ValidationMessage.test.tsx, ValidationSummary.test.tsx

### P3-011 · Create ConfirmModal Component
- Phase: P3 | Dependencies: P3-001 | Complexity: M
- Create feedback/ConfirmModal.tsx: overlay with backdrop blur, focus trap, danger/warning variants, Escape key closes
- Acceptance: Hidden when isOpen=false, centered card with backdrop, danger variant red button, focus trapped, Escape calls onCancel
- Testing: ConfirmModal.test.tsx

### P3-012 · Create SectionHeader and SubtotalRow Components
- Phase: P3 | Dependencies: P3-001 | Complexity: S
- Create sections/SectionHeader.tsx (collapsible with chevron) and sections/SubtotalRow.tsx (read-only formatted amount with commas)
- Acceptance: SectionHeader shows bold title, collapsible with chevron, SubtotalRow shows "Subtotal" label and $X,XXX.XX format
- Testing: SectionHeader.test.tsx, SubtotalRow.test.tsx

### P3-013 · Create Dynamic Components (IntegranteList, IntegranteForm, IngresoIntegranteForm)
- Phase: P3 | Dependencies: P1-003, P2-005, P3-001, P3-007, P3-008 | Complexity: L
- Create dynamic/IntegranteList.tsx (renders list with add/remove), dynamic/IntegranteForm.tsx (numPer readonly, all fields, delete when canRemove), dynamic/IngresoIntegranteForm.tsx (conditional income fields)
- Acceptance: IntegranteList renders one IntegranteForm per integrante, "+ Agregar integrante" button, IntegranteForm disables numPer, IngresoIntegranteForm shows conditional fields
- Testing: IntegranteList.test.tsx, IntegranteForm.test.tsx, IngresoIntegranteForm.test.tsx

### P3-014 · Create BienesInput Component
- Phase: P3 | Dependencies: P1-008, P3-001, P3-007 | Complexity: S
- Create dynamic/BienesInput.tsx: comma-separated codes, parses and validates each code against bienes catalog, shows error for invalid codes
- Acceptance: "1,2,4,7" parses correctly, invalid "99" shows error, "📖 Códigos" button, empty is valid
- Testing: BienesInput.test.tsx

### P3-015 · Create DiaGastosForm, GastoItemRow, NegocioForm Components
- Phase: P3 | Dependencies: P1-005, P1-006, P3-001, P3-008, P3-012 | Complexity: M
- Create dynamic/DiaGastosForm.tsx (expandable day, list of GastoItemRow, add button), dynamic/GastoItemRow.tsx (concepto, monto, delete), dynamic/NegocioForm.tsx (all negocio fields, delete)
- Acceptance: DiaGastosForm shows day title and subtotal, GastoItemRow has concepto/monto/delete, NegocioForm renders all fields, delete calls onRemove
- Testing: DiaGastosForm.test.tsx, GastoItemRow.test.tsx, NegocioForm.test.tsx

---

## Phase P4: Steps 1 and 2

### P4-001 · Create App Entry Point and Basic Routing
- Phase: P4 | Dependencies: P0-001, P2-010, P3-002 | Complexity: S
- Create app/App.tsx (WizardLayout root) and app/main.tsx (ReactDOM.createRoot)
- Acceptance: App renders without errors, npm run dev shows wizard layout, step 1 (Portada) renders by default
- Testing: App.test.tsx

### P4-002 · Create PortadaStep Component
- Phase: P4 | Dependencies: P2-004, P3-002, P3-007, P3-008, P3-010 | Complexity: M
- Create steps/PortadaStep.tsx: all 10 fields per spec section 2.1, CatalogoHelp for entidad and resultadoEntrevista, conditional fechaTermino for A3/A6, stores data and errors to Zustand
- Acceptance: All 10 fields render, CatalogoHelp for entidad and resultadoEntrevista, A3/A6 hides fechaTermino, inline errors on blur, data persists to store
- Testing: steps/PortadaStep.test.tsx

### P4-003 · Create HogaresStep Component
- Phase: P4 | Dependencies: P2-005, P3-002, P3-007, P3-008, P3-012, P3-013, P3-014 | Complexity: XL
- Create steps/HogaresStep.tsx: 7 sections (I vivienda, II IntegranteList, III IngresoIntegranteForm per integrante, IV alimentación, VII cambio climático), conditional fields throughout
- Acceptance: All 7 sections render, IntegranteList with add/remove, conditional vivienda fields (aguaOrigen, numeroFocos, focosAhorradores), conditional income fields, conditional alimentos and clima fields, inline validation, data persists
- Testing: steps/HogaresStep.test.tsx

### P4-004 · Integrate Navigation and Validation into Steps
- Phase: P4 | Dependencies: P4-002, P4-003, P2-012, P2-013 | Complexity: M
- Wire NavigationButtons in WizardLayout to call navigateStep, validate on "Siguiente", stop/start timer on step transitions
- Acceptance: "Siguiente" with invalid step shows ValidationSummary and blocks, "Siguiente" with valid step advances, "Anterior" goes back without validation, timer stops/leaves step, timer starts/enters step
- Testing: steps/PortadaStep.integration.test.tsx, steps/HogaresStep.integration.test.tsx

---

## Phase P5: Steps 3 and 4

### P5-001 · Create Menores12Step Component
- Phase: P5 | Dependencies: P2-006, P3-002, P3-007, P3-008, P3-012, P4-004 | Complexity: L
- Create steps/Menores12Step.tsx: dynamic sub-step wizard, reads menores from store, "No hay menores" empty state, sub-step tabs, Menor12SubForm with pre-filled read-only fields, conditional fields (institucionSalud, gradoEscolar, tipoEscuela), timer does NOT restart on sub-step change
- Acceptance: Empty state message, sub-step tabs for each menor, pre-filled read-only fields from Hogares, institucionSalud when tieneDerechohabiencia='1', gradoEscolar and tipoEscuela when asisteEscuela='1', timer persists across sub-steps
- Testing: steps/Menores12Step.test.tsx

### P5-002 · Create Personas12PlusStep Component
- Phase: P5 | Dependencies: P2-006, P3-002, P3-007, P3-008, P3-012, P4-004 | Complexity: XL
- Create steps/Personas12PlusStep.tsx: 6 sub-sections (Education, Health, Economic Activity, Non-Labor Income, Personal Spending), dynamic sub-step wizard, all conditional fields per spec section 5.4
- Acceptance: Empty state message, sub-step tabs, all 6 sections render, trabajoSemanaPasada='1' reveals actividad fields, trabajoSemanaPasada='2' reveals buscaTrabajo/motivoNoTrabaja, recibeProgGobierno='1' reveals programa fields, recibeAyudaOtros='1' reveals ayuda fields, timer persists across sub-steps
- Testing: steps/Personas12PlusStep.test.tsx

### P5-003 · Integrate Cross-Section Validation on Step Transitions
- Phase: P5 | Dependencies: P2-014, P5-001, P5-002 | Complexity: M
- Wire cross-section validation: Step 3/4→2 warns about integrantes changes, Step 7→8 runs all CS rules. BLOCKER blocks advancement, WARNING advances with visible warnings.
- Acceptance: Step 3→2 warning if Steps 3/4 have data, Step 7→8 runs all CS rules, BLOCKER prevents step 8, WARNING advances with warnings in footer and ReporteStep
- Testing: steps/cross-section.integration.test.tsx

---

## Phase P6: Steps 5 and 6

### P6-001 · Create NegociosStep Component
- Phase: P6 | Dependencies: P2-007, P3-002, P3-007, P3-008, P3-012, P3-015, P4-004 | Complexity: M
- Create steps/NegociosStep.tsx: tieneNegocio CodeInput, when '1' shows list of NegocioForm cards with "Agregar negocio", when '2' shows "No aplica" message, read-only folioViv/folioHog
- Acceptance: tieneNegocio='1' shows negocio forms, tieneNegocio='2' shows "No aplica", "+ Agregar negocio" adds new negocio, delete button (only when count > 1), numPerOperador validates against Hogares
- Testing: steps/NegociosStep.test.tsx

### P6-002 · Create GastosHogarStep Component
- Phase: P6 | Dependencies: P2-008, P3-002, P3-008, P3-012, P4-004 | Complexity: M
- Create steps/GastosHogarStep.tsx: all 8 sections always visible, each with SectionHeader + SubtotalRow, all 43 MoneyInput fields, read-only folioViv/folioHog
- Acceptance: All 8 sections in order, each section shows subtotal updating in real-time, Section I (13 fields), II (5), III (6), IV (4), V (3), VI (2), VII (3), VIII (3), data persists
- Testing: steps/GastosHogarStep.test.tsx

---

## Phase P7: Steps 7 and 8

### P7-001 · Create GastosDiariosStep Component
- Phase: P7 | Dependencies: P2-008, P3-002, P3-007, P3-008, P3-012, P3-015, P4-004 | Complexity: L
- Create steps/GastosDiariosStep.tsx: Section I (informanteNumPer + auto-fill nombre), Section II (7 days with DiaGastosForm), Section III (estimación 6 fields), read-only folioViv/folioHog
- Acceptance: informanteNumPer auto-fills informanteNombre from Hogares, 7 day sections (Lunes–Domingo), each day expandable with add/remove gastos, day subtotals, estimación section, data persists
- Testing: steps/GastosDiariosStep.test.tsx

### P7-002 · Create ReporteStep Component
- Phase: P7 | Dependencies: P2-015, P3-002, P3-005, P3-011, P3-012 | Complexity: L
- Create steps/ReporteStep.tsx: read-only summary with FolioStatusBadge (CONCLUIDO/INCOMPLETO), Datos Generales table, Residentes table, Ingresos table, Gastos table with section totals, Tiempos table, Alertas list, "Reiniciar" with ConfirmModal (danger). No Anterior/Siguiente.
- Acceptance: Status badge green/red, all tables render, Alertas shows WARNINGs, "Reiniciar" opens danger ConfirmModal, only Reiniciar button, no navigation
- Testing: steps/ReporteStep.test.tsx

---

## Phase P8: Integration and Polish

### P8-001 · Integrate localStorage Persistence
- Phase: P8 | Dependencies: P2-010, P4-004 | Complexity: M
- Verify persistence end-to-end, test reload (data/step/timer restore), test localStorage unavailable fallback
- Acceptance: After fill + reload, data + step + timer restored, localStorage unavailable: app works + warning banner, "Reiniciar" clears localStorage
- Testing: persistence/storage-adapter.test.ts

### P8-002 · Integrate Reset Functionality
- Phase: P8 | Dependencies: P4-004, P7-002 | Complexity: S
- Complete reset flow: ConfirmModal "¿Está seguro? Se perderán todos los datos." On confirm: clear store, clear localStorage, navigate to step 1
- Acceptance: ConfirmModal with correct text, confirm clears store + localStorage + navigates to step 1, cancel closes modal
- Testing: app/reset.integration.test.tsx

### S8-003 · Integrate Page Visibility API for Timer
- Phase: P8 | Dependencies: P2-003, P3-004 | Complexity: S
- Implement Page Visibility API in TimerDisplay: pause on hidden, resume on visible, elapsed time while hidden NOT counted
- Acceptance: Timer pauses on tab hidden, resumes on visible, elapsed while hidden NOT counted, works with multiple switches
- Testing: TimerDisplay.visibility.test.tsx

### S8-004 · Edge Cases and Error Handling
- Phase: P8 | Dependencies: All P3–P7 components | Complexity: M
- Handle: empty Hogares with 0 integrantes (user can add at least 1 jefe), folioViv leading zeros preserved, Feb 30/31 validation, empty money → 0, removing last gasto keeps ≥1 row, browser back button warning on incomplete step
- Acceptance: All edge cases handled gracefully, no crashes, no data loss without confirmation
- Testing: steps/edge-cases.test.tsx

### S8-005 · Accessibility (A11y) Audit and Fixes
- Phase: P8 | Dependencies: All P3–P7 components | Complexity: M
- Ensure all inputs have labels, all buttons have accessible names, error messages use aria-live, modals trap focus, ProgressBar keyboard navigable, color contrast WCAG AA, run axe-core
- Acceptance: All inputs labeled, aria-describedby on errors, ConfirmModal focus trapped, ProgressBar keyboard nav, zero Critical/Serious axe-core violations
- Testing: a11y/audit.test.tsx (axe-core)

### S8-006 · Performance: Optimize Re-renders
- Phase: P8 | Dependencies: All step components | Complexity: M
- Wrap all presentational components in React.memo, use stable selectors with useSelector, memoize subtotals and report data, check with React DevTools Profiler
- Acceptance: MoneyInput, CodeInput, TextInput memoized, SectionHeader, SubtotalRow memoized, subtotals re-calculate only on input change, no unnecessary re-renders on sub-step navigation
- Testing: None (performance only)

---

## Decision needed before apply: Yes

Before applying Phase P4+, confirm:
1. **PR chain strategy**: `feature-branch-chain` is proposed — each phase group (P0–P3, P4–P6, P7–P8) becomes one PR targeting the previous PR branch. Confirm this fits your workflow.
2. **PR boundary for Phase P0–P3**: The first PR (P0–P3: infra + domain + store + UI shell) is ~65 tasks, ~2,200 code lines + ~1,500 test lines. Is this within your preferred PR size?
3. **Step 3–4 separation**: Given XL complexity of Menores12 and Personas12Plus, consider splitting into two separate PRs for easier review.

## Chained PRs recommended: Yes

**Chain strategy:** feature-branch-chain

**Proposed chain:**
- **PR 1** (base ← main): P0–P3 — Project setup, domain types, Zod schemas, Zustand store, UI component library
- **PR 2** (base ← PR 1): P4–P6 — PortadaStep, HogaresStep, Menores12Step, Personas12PlusStep, NegociosStep, GastosHogarStep
- **PR 3** (base ← PR 2): P7–P8 — GastosDiariosStep, ReporteStep, integration, polish, a11y, performance

**Alternative (size-exception):** Single PR with all phases, using `exception-ok` delivery strategy, only if the team can absorb the 8,700-line review.
