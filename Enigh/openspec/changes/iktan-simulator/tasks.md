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

```text
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High
```

---

## Phase P0: Project Setup

### P0-001 · Initialize Vite + React + TypeScript Project

- **Phase:** P0
- **Dependencies:** None
- **Description:** Bootstrap the project with Vite 5+, React 18+, and strict TypeScript. Configure `tsconfig.json` with strict mode, `moduleResolution: bundler`, `jsx: react-jsx`. Set up `package.json` with all dependencies and scripts.
- **Files to create/modify:**
  - `package.json`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `vite.config.ts`
  - `index.html`
  - `src/main.tsx`
- **Acceptance criteria:**
  - [x] `npm install` succeeds with no peer-dep warnings
  - [x] `npm run dev` starts the dev server without errors
  - [x] `npm run build` produces a valid production bundle
  - [x] `npm run test` runs Vitest in watch mode
- **Estimated complexity:** S
- **Testing requirements:** None (config only)

### P0-002 · Configure Tailwind CSS v4

- **Phase:** P0
- **Dependencies:** P0-001
- **Description:** Install and configure Tailwind CSS v4 with `@tailwindcss/vite` plugin. Set up `src/index.css` with `@import "tailwindcss"`. Configure content paths for `src/**/*.{ts,tsx}`. Add custom CSS variables for the ENIGH color palette (INEGI blue `#1D3557`, alert red `#E63946`, warning amber `#F4A261`, success green `#2A9D8F`).
- **Files to create/modify:**
  - `tailwind.config.js` or CSS-based config
  - `src/index.css`
  - `vite.config.ts` (add Tailwind plugin)
- **Acceptance criteria:**
  - [x] Tailwind utilities are available in `.tsx` files
  - [x] Custom color variables work in `bg-[#1D3557]` syntax
  - [x] No Tailwind plugin errors on build
- **Estimated complexity:** S
- **Testing requirements:** None

### P0-003 · Install Core Dependencies

- **Phase:** P0
- **Dependencies:** P0-001
- **Description:** Install and verify all core dependencies: `zustand`, `zod`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `happy-dom`. Install TypeScript types as needed.
- **Files to create/modify:**
  - `package.json`
- **Acceptance criteria:**
  - [x] All packages listed in `package.json` install cleanly
  - [x] `import { create } from 'zustand'` compiles without errors
  - [x] `import { z } from 'zod'` compiles without errors
  - [x] `@testing-library/react` renders a component without errors
- **Estimated complexity:** S
- **Testing requirements:** None

### P0-004 · Set Up Vitest and Testing Infrastructure

- **Phase:** P0
- **Dependencies:** P0-001, P0-003
- **Description:** Configure Vitest with React testing support. Set up `vitest.config.ts` with `globals: true`, `@testing-library/jest-dom` matcher extension, `environment: 'jsdom'`. Create `src/test/setup.ts` for common test setup (cleanup, render wrapper). Create `src/test/mocks.ts` for common mocks.
- **Files to create/modify:**
  - `vitest.config.ts`
  - `src/test/setup.ts`
  - `src/test/mocks.ts`
  - `src/vite-env.d.ts`
- **Acceptance criteria:**
  - [x] `npm run test` runs Vitest
  - [x] `expect(element).toBeInTheDocument()` works in tests
  - [x] Each `*.test.ts` or `*.spec.ts` file runs successfully
  - [x] Coverage report generates with `npm run test -- --coverage`
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] Write a smoke test: `src/test/smoke.test.ts` that renders `<div>Hello</div>` and verifies it exists. Must pass.

---

## Phase P1: Domain Layer

### P1-001 · Create TypeScript Interfaces — Shared Models

- **Phase:** P1
- **Dependencies:** P0-001
- **Description:** Create `src/domain/models/shared.ts` with all shared types: `SharedFolioFields`, `YesNo`, `YesNoUnk`, and all catalog code union types (`EntidadCode`, `ParentescoCode`, `SexoCode`, `EstadoCivilCode`, `EscolaridadCode`, `TipoTrabajoCode`, `DerechohabienciaCode`, `TipoEscuelaCode`, `QuienCuidaCode`, `ClaseViviendaCode`, `MaterialCode`, `MaterialPisoCode`, `OrigenAguaCode`, `DrenajeCode`, `CombustibleCode`, `BasuraCode`, `ResultadoEntrevista`). Export all as named exports.
- **Files to create/modify:**
  - `src/domain/models/shared.ts`
  - `src/domain/models/index.ts`
- **Acceptance criteria:**
  - [x] All union types use exact string literals matching spec ranges
  - [x] `SharedFolioFields` has `folioViv: string` and `folioHog: string`
  - [x] No `any` types anywhere
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/models/shared.test.ts`: test that union types accept valid values and reject invalid ones

### P1-002 · Create TypeScript Interfaces — Portada

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/portada.ts` with `PortadaData` interface extending `SharedFolioFields`. All fields as per spec section 2.3. Create `src/domain/models/folio.ts` with `CompleteFolioData` combining all questionnaires.
- **Files to create/modify:**
  - `src/domain/models/portada.ts`
  - `src/domain/models/folio.ts`
- **Acceptance criteria:**
  - [x] `PortadaData` extends `SharedFolioFields`
  - [x] All fields from spec section 2.3 are present with correct types
  - [x] `CompleteFolioData` includes all questionnaire data types
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/domain/models/portada.test.ts`: type-level smoke test

### P1-003 · Create TypeScript Interfaces — Hogares y Vivienda

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/hogares.ts` with `Integrante`, `IngresoIntegrante`, and `HogaresViviendaData` interfaces. All sections I, II, III, IV, VII per spec section 3.5.
- **Files to create/modify:**
  - `src/domain/models/hogares.ts`
- **Acceptance criteria:**
  - [x] `Integrante` has all fields from spec section 3.1 Section II
  - [x] `IngresoIntegrante` has all conditional fields
  - [x] `HogaresViviendaData` includes Sections I, II, III, IV, VII
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/models/hogares.test.ts`: type-level smoke test

### P1-004 · Create TypeScript Interfaces — Menores 12 y Personas 12+

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/menores12.ts` with `Menor12Data` and `Menores12Section`. Create `src/domain/models/personas12plus.ts` with `Persona12PlusData` and `Personas12PlusSection`. All fields per spec sections 4.5 and 5.5.
- **Files to create/modify:**
  - `src/domain/models/menores12.ts`
  - `src/domain/models/personas12plus.ts`
- **Acceptance criteria:**
  - [x] All read-only pre-filled fields are present
  - [x] All conditional fields are optional
  - [x] `Menores12Section.menores` and `Personas12PlusSection.personas` are arrays
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/models/menores12.test.ts`: type-level smoke test
  - [x] `src/domain/models/personas12plus.test.ts`: type-level smoke test

### P1-005 · Create TypeScript Interfaces — Negocios

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/negocios.ts` with `Negocio` and `NegociosData`. Include `id` field on `Negocio` for React key stability.
- **Files to create/modify:**
  - `src/domain/models/negocios.ts`
- **Acceptance criteria:**
  - [x] `Negocio` has `id: string` as UUID
  - [x] `NegociosData` has `tieneNegocio: YesNo` and `negocios: Negocio[]`
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/domain/models/negocios.test.ts`: type-level smoke test

### P1-006 · Create TypeScript Interfaces — Gastos del Hogar y Gastos Diarios

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/gastos-hogar.ts` with `GastosHogarData` (all 8 sections, ~43 fields). Create `src/domain/models/gastos-diarios.ts` with `GastoDiario`, `DiaGastos`, `EstimacionMensual`, and `GastosDiariosData`. All fields per spec sections 7.5 and 8.5.
- **Files to create/modify:**
  - `src/domain/models/gastos-hogar.ts`
  - `src/domain/models/gastos-diarios.ts`
- **Acceptance criteria:**
  - [x] All 8 sections from spec section 7.1 are present
  - [x] `DiaGastos` has `gastos: GastoDiario[]` array
  - [x] `GastoDiario` has `id: string`, `concepto: string`, `monto: number`
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/models/gastos-hogar.test.ts`: type-level smoke test
  - [x] `src/domain/models/gastos-diarios.test.ts`: type-level smoke test

### P1-007 · Create TypeScript Interfaces — Timer

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/models/timer.ts` with `TimerEntry` and `TimerData` interfaces per spec section 10.2.
- **Files to create/modify:**
  - `src/domain/models/timer.ts`
- **Acceptance criteria:**
  - [x] `TimerEntry` has `step`, `stepLabel`, `elapsedSeconds`, `status`, `startedAt?`
  - [x] `TimerData` has `entries: Record<number, TimerEntry>`
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/domain/models/timer.test.ts`: type-level smoke test

### P1-008 · Create All 17 Catalogs

- **Phase:** P1
- **Dependencies:** P1-001
- **Description:** Create `src/domain/constants/catalogs.ts` with all 17 catalogs from proposal Apéndice A: entidades, resultadosEntrevista, parentescos, clasesVivienda, materialesParedes, materialesTechos, materialesPisos, origenesAgua, drenajes, combustibles, bienes, escolaridad, estadosCiviles, tiposTrabajo, institucionesSalud, tiposEscuela, quienCuida. Each catalog is a `Record<string, CatalogEntry>`.
- **Files to create/modify:**
  - `src/domain/constants/catalogs.ts`
  - `src/domain/constants/catalog-helpers.ts`
- **Acceptance criteria:**
  - [x] All 17 catalogs are exported from `catalogs.ts`
  - [x] `CatalogEntry` has `code: string` and `label: string`
  - [x] All codes from the spec tables are present
  - [x] `CATALOGS` has type `Record<CatalogName, Catalog>`
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/domain/constants/catalogs.test.ts`: verify all catalog codes are present, verify entity 14 = Jalisco, verify parentesco 1 = Jefe(a) del hogar

### P1-009 · Create Catalog Helper Functions

- **Phase:** P1
- **Dependencies:** P1-008
- **Description:** Create `src/domain/constants/catalog-helpers.ts` with `getLabel`, `getEntries`, `isValidCode`, `getValidRange`, `getCatalogByName`. Export a typed `CATALOGS` constant.
- **Files to create/modify:**
  - `src/domain/constants/catalog-helpers.ts`
  - `src/domain/constants/index.ts`
- **Acceptance criteria:**
  - [x] `getLabel(catalog, '01')` returns 'Aguascalientes' for entidades
  - [x] `isValidCode(catalog, '99')` returns false for entidades
  - [x] `getEntries` returns an array sorted by code
  - [x] `getCatalogByName('parentescos')` returns the parentescos catalog
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/domain/constants/catalog-helpers.test.ts`: test all 4 helper functions with real catalog data

### P1-010 · Create Zod Schemas — Shared Primitives and Portada

- **Phase:** P1
- **Dependencies:** P1-001, P1-002, P1-008
- **Description:** Create `src/domain/validation/schemas.ts`. Add shared primitive schemas: `folioVivSchema`, `folioHogSchema`, `yesNoSchema`, `yesNoUnkSchema`, `moneySchema`, `dateSchema`. Create `portadaSchema` with all fields and all validation rules from spec section 2.2 (P-001 through P-013).
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
  - `src/domain/validation/index.ts`
- **Acceptance criteria:**
  - [x] `portadaSchema.parse(data)` throws on invalid folioViv (not 10 digits)
  - [x] `portadaSchema.parse(data)` throws on invalid fechaTermino < fechaInicio
  - [x] `portadaSchema.parse(data)` throws on resultado=A1 without fechaTermino
  - [x] Valid portada data passes without errors
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/portada.test.ts`: test all P-001 through P-013 rules with valid/invalid pairs

### P1-011 · Create Zod Schemas — Hogares y Vivienda

- **Phase:** P1
- **Dependencies:** P1-003, P1-010
- **Description:** Create `hogaresSchema` with all fields from spec section 3.1. Implement all HV-001 through HV-011 rules using Zod refinements. Implement `integranteSchema` as a nested schema. Validate number ranges (numeroCuartos >= numeroDormitorios, focosAhorradores <= numeroFocos).
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] HV-001: numeroCuartos < numeroDormitorios throws error
  - [x] HV-003: focosAhorradores > numeroFocos throws error
  - [x] HV-005: first integrante numPer must be '01'
  - [x] HV-007: fechaNacimiento age ±1 tolerance from edad
  - [x] HV-011: empty integrantes array throws error
  - [x] Conditional fields validate correctly when parent condition is met
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/hogares.test.ts`: test HV-001 through HV-011, test conditional field validations, test with valid sample data

### P1-012 · Create Zod Schemas — Menores 12

- **Phase:** P1
- **Dependencies:** P1-004, P1-010
- **Description:** Create `menor12Schema` with all fields from spec section 4.1. Implement M12-001 through M12-007 rules. Validate pre-filled fields are read-only (but still validate format if provided).
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] M12-005: institucionSalud required when tieneDerechohabiencia = '1'
  - [x] M12-006: gradoEscolar required when asisteEscuela = '1'
  - [x] M12-007: tipoEscuela required when asisteEscuela = '1'
  - [x] VaccunacionCompleta accepts '1', '2', '9'
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/menores12.test.ts`: test M12-001 through M12-007

### P1-013 · Create Zod Schemas — Personas 12+

- **Phase:** P1
- **Dependencies:** P1-004, P1-010
- **Description:** Create `persona12PlusSchema` with all fields from spec section 5.1 (Sections I–VI). Implement P12-001 through P12-015 rules. All conditional fields for actividad económica, ingresos no laborales, and gastos personales.
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] P12-008: ocupacionPrincipal required when trabajoSemanaPasada = '1'
  - [x] P12-011: ingresoMensualNeto required when trabajoSemanaPasada = '1'
  - [x] P12-015: motivoNoTrabaja required when trabajoSemanaPasada = '2' and age >= 14
  - [x] All conditional groups validate correctly
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/personas12plus.test.ts`: test P12-001 through P12-015

### P1-014 · Create Zod Schemas — Negocios

- **Phase:** P1
- **Dependencies:** P1-005, P1-010
- **Description:** Create `negocioSchema` and `negociosDataSchema` with NEG-001 through NEG-007 rules. Validate that at least one negocio exists when tieneNegocio = '1'.
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] NEG-006: empty negocios array when tieneNegocio = '1' throws error
  - [x] NEG-007: empty tipoNegocio throws error
  - [x] tieneNegocio = '2' passes even with empty negocios array
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/negocios.test.ts`: test NEG-001 through NEG-007

### P1-015 · Create Zod Schemas — Gastos del Hogar

- **Phase:** P1
- **Dependencies:** P1-006, P1-010
- **Description:** Create `gastosHogarSchema` with all 8 sections and ~43 fields. All fields are optional (not required) but must be valid numbers when provided. Implement GH-001 through GH-004.
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] GH-003: amounts with `$` or commas throw error
  - [x] GH-004: negative amounts throw error
  - [x] All 8 sections are represented
  - [x] Empty data (all undefined) passes validation
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/gastos-hogar.test.ts`: test GH-001 through GH-004, test each section

### P1-016 · Create Zod Schemas — Gastos Diarios

- **Phase:** P1
- **Dependencies:** P1-006, P1-010
- **Description:** Create `gastoDiarioSchema`, `diaGastosSchema`, `estimacionMensualSchema`, and `gastosDiariosSchema` with GD-001 through GD-008 rules. Each day must have at least one gasto.
- **Files to create/modify:**
  - `src/domain/validation/schemas.ts`
- **Acceptance criteria:**
  - [x] GD-003: informanteNumPer must be valid format
  - [x] GD-007: empty concepto throws error
  - [x] GD-008: empty gastos array for a day throws error
  - [x] All 7 days are represented
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/domain/validation/schemas/gastos-diarios.test.ts`: test GD-001 through GD-008

### P1-017 · Create Cross-Section Validator

- **Phase:** P1
- **Dependencies:** P1-008, P1-010 through P1-016
- **Description:** Create `src/domain/validation/cross-section.ts` implementing all CS-001 through CS-017 rules. Export `validateCrossSection(store): CrossSectionError[]`. Each rule maps to a check function. Include `CrossSectionError` interface with `ruleId`, `severity`, `message`, `sections`.
- **Files to create/modify:**
  - `src/domain/validation/cross-section.ts`
  - `src/domain/validation/types.ts`
- **Acceptance criteria:**
  - [x] CS-001: folioViv mismatch across questionnaires returns BLOCKER
  - [x] CS-011: sum of menores + 12plus != total integrantes returns BLOCKER
  - [x] CS-015: daily gastos > 4x trimestral returns WARNING (not BLOCKER)
  - [x] CS-017: warn when gastos exceed income (WARNING)
  - [x] Returns array of `CrossSectionError` with correct severity levels
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/domain/validation/cross-section.test.ts`: test CS-001 through CS-017 with mock store data

### P1-018 · Create Validation Error Types

- **Phase:** P1
- **Dependencies:** P1-010
- **Description:** Create `src/domain/validation/types.ts` with `FieldError` interface and any shared validation types. `FieldError` has: `field: string`, `message: string`, `ruleId?: string`.
- **Files to create/modify:**
  - `src/domain/validation/types.ts`
- **Acceptance criteria:**
  - [x] `FieldError` interface is exported
  - [x] Can be used to type `stepErrors` in the store
- **Estimated complexity:** XS
- **Testing requirements:** None (type-only file)

---

## Phase P2: Store Layer

### P2-001 · Create Initial State Factories

- **Phase:** P2
- **Dependencies:** P1-002, P1-003, P1-004, P1-005, P1-006, P1-007
- **Description:** Create `src/application/store/initial-state.ts` with factory functions: `createInitialPortada()`, `createInitialHogares()`, `createInitialMenores12()`, `createInitialPersonas12Plus()`, `createInitialNegocios()`, `createInitialGastosHogar()`, `createInitialGastosDiarios()`, `createInitialTimer()`. Each returns fully empty/default data matching the TypeScript interfaces.
- **Files to create/modify:**
  - `src/application/store/initial-state.ts`
- **Acceptance criteria:**
  - [ ] All factory functions return data that matches the TypeScript interfaces
  - [ ] `createInitialHogares()` returns `integrantes: []` (empty array)
  - [ ] `createInitialNegocios()` returns `negocios: []`, `tieneNegocio: '2'`
  - [ ] `createInitialGastosDiarios()` returns 7 empty days with correct day names
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/store/initial-state.test.ts`: test all factory functions

### P2-002 · Create Wizard Slice

- **Phase:** P2
- **Dependencies:** P2-001
- **Description:** Create `src/application/store/slices/wizard.slice.ts` with wizard state and actions: `currentStep: number`, `currentSubStep: number`, `setCurrentStep`, `setCurrentSubStep`, `nextStep`, `prevStep`, `resetAll`. `nextStep` and `prevStep` handle boundary conditions (steps 1–8).
- **Files to create/modify:**
  - `src/application/store/slices/wizard.slice.ts`
- **Acceptance criteria:**
  - [ ] `nextStep()` on step 7 stays at 7 (last questionnaire step)
  - [ ] `prevStep()` on step 1 stays at 1
  - [ ] `resetAll()` resets to step 1, subStep 0
  - [ ] `setCurrentStep(8)` is valid (reporte step)
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/store/slices/wizard.slice.test.ts`: test boundary conditions, test resetAll

### P2-003 · Create Timer Slice

- **Phase:** P2
- **Dependencies:** P2-001
- **Description:** Create `src/application/store/slices/timer.slice.ts` with timer state and actions: `startTimer(step)`, `stopTimer()`, `resumeTimer(step)`, `resetAllTimers()`. Timer uses `startedAt` timestamp for active segment tracking. `stopTimer` accumulates elapsed time.
- **Files to create/modify:**
  - `src/application/store/slices/timer.slice.ts`
- **Acceptance criteria:**
  - [ ] `startTimer(2)` sets step 2 entry status to 'running' with `startedAt`
  - [ ] `stopTimer()` calculates elapsed correctly and sets status to 'stopped'
  - [ ] `resumeTimer(2)` restarts step 2 timer from accumulated time
  - [ ] `resetAllTimers()` zeroes all entries
  - [ ] Timer continues counting while page is open (Date.now() diff)
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/store/slices/timer.slice.test.ts`: test start/stop/resume/reset with mocked Date

### P2-004 · Create Portada Slice

- **Phase:** P2
- **Dependencies:** P2-001, P1-002
- **Description:** Create `src/application/store/slices/portada.slice.ts` with `updatePortada(data: Partial<PortadaData>)` action. State is `portada: PortadaData` initialized via factory.
- **Files to create/modify:**
  - `src/application/store/slices/portada.slice.ts`
- **Acceptance criteria:**
  - [ ] `updatePortada({ entidad: '14' })` only updates the entidad field
  - [ ] Partial update preserves other fields
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/store/slices/portada.slice.test.ts`: test partial updates

### P2-005 · Create Hogares Slice

- **Phase:** P2
- **Dependencies:** P2-001, P1-003
- **Description:** Create `src/application/store/slices/hogares.slice.ts` with all hogar actions: `updateHogares`, `updateIntegrante`, `addIntegrante`, `removeIntegrante`, `updateIngresoIntegrante`. `addIntegrante` auto-assigns next `numPer` (01, 02...). `removeIntegrante` re-numbers remaining integrantes.
- **Files to create/modify:**
  - `src/application/store/slices/hogares.slice.ts`
- **Acceptance criteria:**
  - [ ] `addIntegrante()` creates new integrante with correct next numPer
  - [ ] `addIntegrante()` first call creates numPer='01'
  - [ ] `addIntegrante()` second call creates numPer='02'
  - [ ] `removeIntegrante('02')` re-numbers remaining: 01, 03 → 01, 02
  - [ ] `removeIntegrante('01')` fails (or returns error) because jefe cannot be removed
  - [ ] `updateIntegrante('01', { nombre: 'Juan' })` only updates nombre
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/store/slices/hogares.slice.test.ts`: test add, remove, update, re-numbering logic

### P2-006 · Create Menores12 and Personas12Plus Slices

- **Phase:** P2
- **Dependencies:** P2-001, P1-004, P2-005
- **Description:** Create `src/application/store/slices/menores12.slice.ts` with `updateMenor12(numPer, data)`. Create `src/application/store/slices/personas12plus.slice.ts` with `updatePersona12(numPer, data)`. These slices are driven by the Hogares slice — they receive numPer references.
- **Files to create/modify:**
  - `src/application/store/slices/menores12.slice.ts`
  - `src/application/store/slices/personas12plus.slice.ts`
- **Acceptance criteria:**
  - [ ] `updateMenor12('04', { tieneDerechohabiencia: '1' })` updates the correct menor
  - [ ] `updatePersona12('01', { nivelAprobado: '09' })` updates the correct persona
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/store/slices/menores12.slice.test.ts`
  - [ ] `src/application/store/slices/personas12plus.slice.test.ts`

### P2-007 · Create Negocios Slice

- **Phase:** P2
- **Dependencies:** P2-001, P1-005
- **Description:** Create `src/application/store/slices/negocios.slice.ts` with `updateNegociosData`, `updateNegocio(id, data)`, `addNegocio`, `removeNegocio(id)`. `addNegocio` creates a new negocio with a generated UUID.
- **Files to create/modify:**
  - `src/application/store/slices/negocios.slice.ts`
- **Acceptance criteria:**
  - [ ] `addNegocio()` creates a new negocio with unique id
  - [ ] `removeNegocio(id)` removes by id, not by index
  - [ ] `updateNegocio(id, { ingresoMensual: 5000 })` only updates that field
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/store/slices/negocios.slice.test.ts`

### P2-008 · Create Gastos Hogar and Gastos Diarios Slices

- **Phase:** P2
- **Dependencies:** P2-001, P1-006
- **Description:** Create `src/application/store/slices/gastos-hogar.slice.ts` and `src/application/store/slices/gastos-diarios.slice.ts`. Gastos Diarios slice includes `addGastoDiario(diaIndex)`, `removeGastoDiario(diaIndex, gastoId)`, `updateGastoDiario(diaIndex, gastoId, data)`.
- **Files to create/modify:**
  - `src/application/store/slices/gastos-hogar.slice.ts`
  - `src/application/store/slices/gastos-diarios.slice.ts`
- **Acceptance criteria:**
  - [ ] `addGastoDiario(0)` adds a new gasto to day 1's gastos array
  - [ ] `removeGastoDiario(0, id)` removes the specific gasto by id
  - [ ] `updateGastoDiario(0, id, { monto: 150 })` updates only monto
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/store/slices/gastos-hogar.slice.test.ts`
  - [ ] `src/application/store/slices/gastos-diarios.slice.test.ts`

### P2-009 · Create Validation Slice

- **Phase:** P2
- **Dependencies:** P2-001
- **Description:** Create `src/application/store/slices/validation.slice.ts` with `stepErrors: Record<number, FieldError[]>`, `crossSectionErrors: CrossSectionError[]`, `setStepErrors(step, errors)`, `clearStepErrors(step)`, `setCrossSectionErrors(errors)`, `clearAllErrors()`.
- **Files to create/modify:**
  - `src/application/store/slices/validation.slice.ts`
- **Acceptance criteria:**
  - [ ] `setStepErrors(2, [{ field: 'folioViv', message: 'Required' }])` stores errors for step 2
  - [ ] `clearStepErrors(2)` removes errors for step 2 only
  - [ ] `clearAllErrors()` clears both stepErrors and crossSectionErrors
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/store/slices/validation.slice.test.ts`

### P2-010 · Create Combined Zustand Store with Persist

- **Phase:** P2
- **Dependencies:** P2-001 through P2-009, P1-017
- **Description:** Create `src/application/store/index.ts` combining all slices into a single Zustand store with `persist` middleware. Configure `partialize` to persist only data fields (not stepErrors, crossSectionErrors, _hasHydrated). Set localStorage key to `'iktan-folio-storage'`, version 1.
- **Files to create/modify:**
  - `src/application/store/index.ts`
- **Acceptance criteria:**
  - [ ] Store compiles without circular dependency errors
  - [ ] `persist` middleware serializes to localStorage under key 'iktan-folio-storage'
  - [ ] `partialize` excludes `stepErrors`, `crossSectionErrors`, `_hasHydrated`
  - [ ] On page reload, store rehydrates with persisted data
  - [ ] `resetAll` action clears persisted data
- **Estimated complexity:** L
- **Testing requirements:**
  - [ ] `src/application/store/index.test.ts`: test store creation, test persist partialize, test hydration

### P2-011 · Create Selectors

- **Phase:** P2
- **Dependencies:** P2-010
- **Description:** Create `src/application/store/selectors.ts` with derived state selectors: `selectMenores(state)`, `selectPersonas12Plus(state)`, `selectInformanteNombre(state)`, `selectHasStepErrors(step)(state)`, `selectIsStepValid(step, schema)(state)`, `selectTotalIntegrantes(state)`, `selectTimerEntry(step)(state)`, `selectTotalElapsedSeconds(state)`.
- **Files to create/modify:**
  - `src/application/store/selectors.ts`
- **Acceptance criteria:**
  - [ ] `selectMenores` filters Hogares.integrantes where edad < 12
  - [ ] `selectPersonas12Plus` filters where edad >= 12
  - [ ] `selectInformanteNombre` looks up by informanteNumPer
  - [ ] `selectHasStepErrors(2)` returns boolean for step 2 errors
  - [ ] `selectTimerEntry(1)` returns the TimerEntry for step 1
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/store/selectors.test.ts`: test all selectors with mock state

### P2-012 · Create Navigate Step Use Case

- **Phase:** P2
- **Dependencies:** P2-002, P2-010, P1-010
- **Description:** Create `src/application/use-cases/navigate-step.ts` with `computeNextStep(currentStep, store)`. Implements the navigation logic from spec section 4.4: Step 2→3 skips to 4 if 0 menores; Step 5→6 skips to 6 if tieneNegocio=2; Step 7→8 triggers cross-section validation.
- **Files to create/modify:**
  - `src/application/use-cases/navigate-step.ts`
  - `src/application/use-cases/index.ts`
- **Acceptance criteria:**
  - [ ] Step 2→3 with 0 menores returns step 4
  - [ ] Step 5→6 with tieneNegocio='2' returns step 6
  - [ ] Step 7→8 returns step 8
  - [ ] Normal forward navigation advances by 1
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/use-cases/navigate-step.test.ts`: test all skip conditions

### P2-013 · Create Validate Step Use Case

- **Phase:** P2
- **Dependencies:** P2-010, P1-010 through P1-016
- **Description:** Create `src/application/use-cases/validate-step.ts` with `validateStep(stepNumber, data, schema): FieldError[]`. Converts Zod errors to `FieldError[]` format. Exports `STEP_SCHEMAS` map from step number to schema.
- **Files to create/modify:**
  - `src/application/use-cases/validate-step.ts`
- **Acceptance criteria:**
  - [ ] Returns empty array for valid data
  - [ ] Returns array of FieldError for invalid data
  - [ ] Each FieldError has correct `field` and `message`
  - [ ] Handles Zod errors from nested schemas (integrantes array)
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/use-cases/validate-step.test.ts`: test with valid/invalid data for each step

### P2-014 · Create Validate Cross-Section Use Case

- **Phase:** P2
- **Dependencies:** P2-010, P1-017
- **Description:** Create `src/application/use-cases/validate-cross-section.ts` that wraps `validateCrossSection(store)` from domain. Returns `CrossSectionError[]`.
- **Files to create/modify:**
  - `src/application/use-cases/validate-cross-section.ts`
- **Acceptance criteria:**
  - [ ] Returns all BLOCKER errors
  - [ ] Returns all WARNING errors
  - [ ] Returns empty array when no errors
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/application/use-cases/validate-cross-section.test.ts`

### P2-015 · Create Compute Report Use Case

- **Phase:** P2
- **Dependencies:** P2-010
- **Description:** Create `src/application/use-cases/compute-report.ts` with `computeReportData(store): ReportData`. Aggregates all data for the ReporteStep: totals by section, integration counts, timer summary, folio status, consistency warnings.
- **Files to create/modify:**
  - `src/application/use-cases/compute-report.ts`
- **Acceptance criteria:**
  - [ ] `ReportData.totalIntegrantes` = Hogares.integrantes.length
  - [ ] `ReportData.totalGastosTrimestral` = sum of all GastosHogar fields
  - [ ] `ReportData.totalGastosDiarios` = sum of all day gastos
  - [ ] `ReportData.tiempoTotal` = sum of all timer entries
  - [ ] `ReportData.folioStatus` = 'CONCLUIDO' or 'INCOMPLETO'
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/application/use-cases/compute-report.test.ts`: test aggregation with sample data

---

## Phase P3: Shared UI Components

### P3-001 · Set Up Directory Structure and Base Styles

- **Phase:** P3
- **Dependencies:** P0-002
- **Description:** Create `src/ui/` directory structure per design. Create `src/ui/styles/tokens.css` with CSS custom properties for colors, spacing, typography, border-radius, shadows. These tokens drive the entire design system.
- **Files to create/modify:**
  - `src/ui/styles/tokens.css`
- **Acceptance criteria:**
  - [x] CSS variables for all colors (primary, danger, warning, success)
  - [x] Spacing scale (4px base)
  - [x] Typography scale
  - [x] Border radius and shadow tokens
- **Estimated complexity:** S
- **Testing requirements:** None (CSS only)

### P3-002 · Create WizardLayout Component

- **Phase:** P3
- **Dependencies:** P2-010, P3-001
- **Description:** Create `src/ui/components/layout/WizardLayout.tsx`. Full-screen grid layout with sticky header (title, ProgressBar, TimerDisplay), scrollable main (active step), and sticky footer (ValidationSummary, NavigationButtons). Reads `currentStep` from store. Renders active step component based on step number.
- **Files to create/modify:**
  - `src/ui/components/layout/WizardLayout.tsx`
- **Acceptance criteria:**
  - [x] Renders `<header>`, `<main>`, `<footer>` with correct sticky behavior
  - [ ] Shows active step based on `currentStep` from store
  - [x] Passes `isFirstStep`, `isLastStep` to NavigationButtons
  - [x] Displays ValidationSummary in footer when errors exist
  - [x] Responsive layout (mobile-friendly with Tailwind)
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/layouts/WizardLayout.test.tsx`: test renders correct step, test navigation buttons appear

### P3-003 · Create ProgressBar Component

- **Phase:** P3
- **Dependencies:** P3-001
- **Description:** Create `src/ui/components/layout/ProgressBar.tsx`. Horizontal step indicator showing all 7 questionnaire steps. Each node shows: label, status (current/completed/pending), and for steps 3/4 shows dynamic count. Completed steps show checkmark (✓).
- **Files to create/modify:**
  - `src/ui/components/layout/ProgressBar.tsx`
- **Acceptance criteria:**
  - [x] Renders 7 labeled nodes
  - [x] Current step is visually highlighted
  - [x] Completed steps show ✓
  - [x] Pending steps are dimmed
  - [x] Step 3 label shows count: "Menores 12 (2)" when 2 menores exist
  - [x] Step 4 label shows count: "12+ (3)" when 3 personas exist
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/components/ProgressBar.test.tsx`: test current step highlight, test completed checkmark, test dynamic labels

### P3-004 · Create TimerDisplay Component

- **Phase:** P3
- **Dependencies:** P2-003, P3-001
- **Description:** Create `src/ui/components/layout/TimerDisplay.tsx`. Shows `⏱ MM:SS` format for current step. Updates every second using `setInterval`. Shows `HH:MM:SS` when ≥ 60 minutes. Reads from store timer entry for current step.
- **Files to create/modify:**
  - `src/ui/components/layout/TimerDisplay.tsx`
- **Acceptance criteria:**
  - [x] Displays "⏱ 00:00" when timer is at 0
  - [x] Displays "⏱ 01:30:45" when ≥ 1 hour
  - [x] Updates every second while running
  - [x] Shows step label ("Tiempo en Portada")
  - [x] Pauses when tab is not visible (Page Visibility API)
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/components/TimerBar.test.tsx`: test format display, test updates, test pause on visibility change

### P3-005 · Create NavigationButtons Component

- **Phase:** P3
- **Dependencies:** P3-001
- **Description:** Create `src/ui/components/layout/NavigationButtons.tsx`. Three buttons: "Anterior", "Siguiente", "Reiniciar". Anterior is disabled on step 1. Siguiente triggers validation. Reiniciar opens ConfirmModal. Shows spinner while validating.
- **Files to create/modify:**
  - `src/ui/components/layout/NavigationButtons.tsx`
- **Acceptance criteria:**
  - [x] "Anterior" is disabled when `isFirstStep=true`
  - [x] "Siguiente" is disabled when `canAdvance=false`
  - [x] "Reiniciar" triggers `onReset` callback
  - [x] "Anterior" triggers `onPrev` callback
  - [x] "Siguiente" triggers `onNext` callback
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/components/WizardNavigation.test.tsx`: test button states, test callbacks fired

### P3-006 · Create FieldLabel Component

- **Phase:** P3
- **Dependencies:** P3-001
- **Description:** Create `src/ui/components/fields/FieldLabel.tsx`. Simple label component that shows the Spanish label text with an optional red asterisk for required fields.
- **Files to create/modify:**
  - `src/ui/components/fields/FieldLabel.tsx`
- **Acceptance criteria:**
  - [x] Shows label text
  - [x] Shows `*` in red when `required=true`
  - [x] Accessible (associated with input via `htmlFor`/`id`)
- **Estimated complexity:** XS
- **Testing requirements:**
  - [x] `src/ui/components/FieldLabel.test.tsx`

### P3-007 · Create CodeInput Component

- **Phase:** P3
- **Dependencies:** P1-008, P1-009, P3-001, P3-006
- **Description:** Create `src/ui/components/fields/CodeInput.tsx`. Numeric code input with `inputMode="numeric"`, optional "📖 Códigos" help button, inline ValidationMessage. Integrates with CatalogHelp for showing code table. Props: `field`, `catalog?`, `label`, `required?`, `maxLength?`, `value`, `onChange`, `onBlur`, `error?`.
- **Files to create/modify:**
  - `src/ui/components/fields/CodeInput.tsx`
- **Acceptance criteria:**
  - [x] Renders text input with `inputMode="numeric"`
  - [x] Shows "📖 Códigos" button when `catalog` prop is provided
  - [x] Toggling "📖 Códigos" opens/closes CatalogHelp
  - [x] Shows ValidationMessage when `error` prop is provided
  - [x] Calls `onBlur` on blur event
  - [x] Width is appropriate for 2-digit codes (~4rem) vs. longer codes
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/components/CodeInput.test.tsx`: test rendering, test catalog button toggle, test error display

### P3-008 · Create TextInput, DateInput, MoneyInput, TextAreaInput, ReadOnlyField

- **Phase:** P3
- **Dependencies:** P3-001, P3-006, P3-007
- **Description:** Create all remaining field components. **TextInput**: standard text input. **DateInput**: three sub-inputs (DD / MM / AAAA) that merge to DD/MM/AAAA string. **MoneyInput**: decimal input with `inputMode="decimal"`, no `$` or commas. **TextAreaInput**: multi-line textarea. **ReadOnlyField**: grayed-out display-only field.
- **Files to create/modify:**
  - `src/ui/components/fields/TextInput.tsx`
  - `src/ui/components/fields/DateInput.tsx`
  - `src/ui/components/fields/MoneyInput.tsx`
  - `src/ui/components/fields/TextAreaInput.tsx`
  - `src/ui/components/fields/ReadOnlyField.tsx`
- **Acceptance criteria:**
  - [x] All components render with correct label
  - [x] DateInput merges three inputs to DD/MM/AAAA on change
  - [x] MoneyInput accepts only digits and one decimal point
  - [x] ReadOnlyField shows grayed-out background and no border
  - [x] All show ValidationMessage when error prop is provided
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/components/TextInput.test.tsx`
  - [x] `src/ui/components/DateInput.test.tsx`
  - [x] `src/ui/components/MoneyInput.test.tsx`
  - [x] `src/ui/components/TextAreaInput.test.tsx`
  - [x] `src/ui/components/ReadOnlyField.test.tsx`

### P3-009 · Create CatalogHelp Component

- **Phase:** P3
- **Dependencies:** P1-008, P3-001
- **Description:** Create `src/ui/components/help/CatalogHelp.tsx`. Expandable/collapsible catalog table showing code + label pairs. Closes on Escape key or clicking outside. Props: `catalog`, `isOpen`, `onClose`, `fieldLabel`. Renders as a positioned dropdown/panel below the CodeInput.
- **Files to create/modify:**
  - `src/ui/components/help/CatalogHelp.tsx`
- **Acceptance criteria:**
  - [x] Renders table with code and label columns
  - [x] Scrollable with max-height ~300px
  - [x] Closes on Escape key press
  - [x] Accessible: `role="dialog"`, `aria-label` set
  - [x] Renders nothing when `isOpen=false`
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/components/CatalogHelp.test.tsx`: test open/close, test escape key

### P3-010 · Create ValidationMessage and ValidationSummary Components

- **Phase:** P3
- **Dependencies:** P1-018, P3-001
- **Description:** Create `ValidationMessage` (single inline error) and `ValidationSummary` (step-level panel). ValidationSummary is a red-bordered panel with yellow background listing all errors as clickable bullets. Clicking an error calls `onFocusField(field)`.
- **Files to create/modify:**
  - `src/ui/components/feedback/ValidationMessage.tsx`
  - `src/ui/components/feedback/ValidationSummary.tsx`
- **Acceptance criteria:**
  - [x] ValidationMessage renders red text
  - [x] ValidationSummary renders all errors as bullet list
  - [x] ValidationSummary heading says "Corrija los siguientes errores:"
  - [x] Clicking error item calls `onFocusField` with correct field name
  - [x] ValidationSummary is hidden when errors array is empty
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/components/ValidationMessage.test.tsx`
  - [x] `src/ui/components/ValidationSummary.test.tsx`: test empty state, test list rendering, test click handler

### P3-011 · Create ConfirmModal Component

- **Phase:** P3
- **Dependencies:** P3-001
- **Description:** Create `src/ui/components/feedback/ConfirmModal.tsx`. Overlay modal with backdrop blur for destructive action confirmation (reset). Props: `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `variant: 'danger' | 'warning'`. Focus trap inside modal.
- **Files to create/modify:**
  - `src/ui/components/feedback/ConfirmModal.tsx`
- **Acceptance criteria:**
  - [x] Renders nothing when `isOpen=false`
  - [x] Renders centered card with backdrop
  - [x] Danger variant has red confirm button
  - [x] Focus is trapped inside modal
  - [x] Escape key calls `onCancel`
  - [x] Clicking backdrop calls `onCancel`
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/components/ConfirmModal.test.tsx`: test open/close, test button callbacks, test escape key

### P3-012 · Create SectionHeader and SubtotalRow Components

- **Phase:** P3
- **Dependencies:** P3-001
- **Description:** Create `src/ui/components/sections/SectionHeader.tsx` (collapsible section with title and optional subtotal) and `src/ui/components/sections/SubtotalRow.tsx` (read-only subtotal display for gasto sections).
- **Files to create/modify:**
  - `src/ui/components/sections/SectionHeader.tsx`
  - `src/ui/components/sections/SubtotalRow.tsx`
- **Acceptance criteria:**
  - [ ] SectionHeader renders section title in bold
  - [ ] SectionHeader can collapse/expand (chevron indicator)
  - [ ] SubtotalRow shows label "Subtotal" and formatted amount
  - [ ] SubtotalRow formats amounts with commas (e.g., $1,234.56)
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/ui/components/sections/SectionHeader.test.tsx`
  - [ ] `src/ui/components/sections/SubtotalRow.test.tsx`

### P3-013 · Create Dynamic Components (IntegranteList, IntegranteForm, IngresoIntegranteForm)

- **Phase:** P3
- **Dependencies:** P1-003, P2-005, P3-001, P3-007, P3-008
- **Description:** Create dynamic components for the Hogares step. **IntegranteList**: renders list of integrante cards with add/remove buttons. **IntegranteForm**: renders fields for one integrante (numPer auto-readonly, nombre, parentesco, sexo, edad, fechaNacimiento, estadoCivil, sabeLeerEscribir, nivelEscolaridad, asisteEscuela). **IngresoIntegranteForm**: renders income fields for one integrante with conditional visibility.
- **Files to create/modify:**
  - `src/ui/components/dynamic/IntegranteList.tsx`
  - `src/ui/components/dynamic/IntegranteForm.tsx`
  - `src/ui/components/dynamic/IngresoIntegranteForm.tsx`
- **Acceptance criteria:**
  - [ ] IntegranteList renders one IntegranteForm per integrante
  - [ ] IntegranteList has "+ Agregar integrante" button that calls `onAdd`
  - [ ] IntegranteForm disables numPer editing
  - [ ] IntegranteForm has "Eliminar" button when `canRemove=true`
  - [ ] IngresoIntegranteForm shows conditional fields when trabajoSemanaPasada = '1'
  - [ ] All conditional fields appear/disappear based on parent values
- **Estimated complexity:** L
- **Testing requirements:**
  - [ ] `src/ui/components/dynamic/IntegranteList.test.tsx`: test rendering, test add button
  - [ ] `src/ui/components/dynamic/IntegranteForm.test.tsx`: test field rendering, test conditional fields
  - [ ] `src/ui/components/dynamic/IngresoIntegranteForm.test.tsx`: test conditional field visibility

### P3-014 · Create BienesInput Component

- **Phase:** P3
- **Dependencies:** P1-008, P3-001, P3-007
- **Description:** Create `src/ui/components/dynamic/BienesInput.tsx`. Text input where codes are entered comma-separated. Parses the input string to validate each code against the `bienes` catalog. Shows inline validation error if any code is invalid.
- **Files to create/modify:**
  - `src/ui/components/dynamic/BienesInput.tsx`
- **Acceptance criteria:**
  - [ ] User can type "1,2,4,7" and it parses correctly
  - [ ] Invalid code "99" shows error "Código 99 no existe en el catálogo"
  - [ ] Shows "📖 Códigos" help button
  - [ ] Empty input is valid
- **Estimated complexity:** S
- **Testing requirements:**
  - [ ] `src/ui/components/dynamic/BienesInput.test.tsx`: test valid codes, test invalid code, test empty

### P3-015 · Create DiaGastosForm, GastoItemRow, NegocioForm Components

- **Phase:** P3
- **Dependencies:** P1-005, P1-006, P3-001, P3-008, P3-012
- **Description:** Create dynamic components for Gastos Diarios and Negocios. **DiaGastosForm**: expandable day section with list of GastoItemRow items and add button. **GastoItemRow**: single row with concepto text input, monto money input, and delete button. **NegocioForm**: card with all negocio fields, delete button.
- **Files to create/modify:**
  - `src/ui/components/dynamic/DiaGastosForm.tsx`
  - `src/ui/components/dynamic/GastoItemRow.tsx`
  - `src/ui/components/dynamic/NegocioForm.tsx`
- **Acceptance criteria:**
  - [ ] DiaGastosForm shows day title (e.g., "Lunes — 01/07/2025")
  - [ ] DiaGastosForm shows day subtotal
  - [ ] GastoItemRow has concepto, monto, and delete button
  - [ ] NegocioForm renders all negocio fields
  - [ ] Delete button calls `onRemove` callback
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/ui/components/dynamic/DiaGastosForm.test.tsx`
  - [ ] `src/ui/components/dynamic/GastoItemRow.test.tsx`
  - [ ] `src/ui/components/dynamic/NegocioForm.test.tsx`

---

## Phase P4: Steps 1 and 2

### P4-001 · Create App Entry Point and Basic Routing

- **Phase:** P4
- **Dependencies:** P0-001, P2-010, P3-002
- **Description:** Create `src/ui/app/App.tsx` with `<WizardLayout />` as the root. Create `src/ui/app/main.tsx` mounting the React app. Ensure store provider wraps the app (if needed — Zustand doesn't require Provider but persist middleware handles initialization).
- **Files to create/modify:**
  - `src/ui/app/App.tsx`
  - `src/ui/app/main.tsx`
  - `src/main.tsx`
- **Acceptance criteria:**
  - [x] App renders without errors
  - [x] `npm run dev` shows the wizard layout
  - [x] Step 1 (Portada) renders by default
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/app/App.test.tsx`: smoke test rendering

### P4-002 · Create PortadaStep Component

- **Phase:** P4
- **Dependencies:** P2-004, P3-002, P3-007, P3-008, P3-010
- **Description:** Create `src/ui/steps/PortadaStep.tsx`. Full form for ENIGH-1 per spec section 2.1. All fields: entidad (CodeInput), folioViv (TextInput), folioHog (TextInput), decena (CodeInput), nombreEntrevistador (TextInput), nombreSupervisor (TextInput), resultadoEntrevista (CodeInput), fechaInicio (DateInput), fechaTermino (DateInput), observaciones (TextAreaInput). Uses store for data and errors. Triggers `setStepErrors` on blur.
- **Files to create/modify:**
  - `src/ui/steps/PortadaStep.tsx`
  - `src/ui/steps/index.ts`
- **Acceptance criteria:**
  - [x] Renders all 10 fields in correct order
  - [x] Renders CatalogoHelp for entidad (catalog='entidades')
  - [x] Renders CatalogoHelp for resultadoEntrevista
  - [ ] `resultadoEntrevista=A3` hides fechaTermino (conditional)
  - [x] Inline errors show on blur for invalid fields
  - [x] Data persists to Zustand store on change
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/steps/PortadaStep.test.tsx`: test field rendering, test conditional field visibility, test data persistence to store

### P4-003 · Create HogaresStep Component

- **Phase:** P4
- **Dependencies:** P2-005, P3-002, P3-007, P3-008, P3-012, P3-013, P3-014
- **Description:** Create `src/ui/steps/HogaresStep.tsx`. Most complex step — 7 sections. Uses IntegranteList for Section II (residentes). Uses IngresoIntegranteForm for Section III (one per integrante). Uses BienesInput for Section I bienes field. Section IV (Alimentación) and Section VII (Cambio Climático) have YesNo fields.
- **Files to create/modify:**
  - `src/ui/steps/HogaresStep.tsx`
- **Acceptance criteria:**
  - [x] Section I: all vivienda fields render with correct conditional logic (aguaOrigen, numeroFocos, focosAhorradores)
  - [x] Section II: IntegranteList renders with add/remove functionality
  - [x] Section III: one IngresoIntegranteForm per integrante
  - [x] Section IV: 6 alimentación YesNo fields
  - [x] Section VII: 5 climate YesNo fields
  - [x] Data persists to Zustand store on change
  - [ ] Inline validation on blur for all fields
- **Estimated complexity:** XL
- **Testing requirements:**
  - [x] `src/ui/steps/HogaresStep.test.tsx`: test section rendering, test conditional fields, test IntegranteList add/remove integration

### P4-004 · Integrate Navigation and Validation into Steps

- **Phase:** P4
- **Dependencies:** P4-002, P4-003, P2-012, P2-013
- **Description:** Wire NavigationButtons in WizardLayout to call `navigateStep`. On "Siguiente": call `validateStep`, set errors in store, if valid advance. On "Anterior": go back directly. Integrate timer start/stop into step transitions.
- **Files to create/modify:**
  - `src/ui/components/layout/WizardLayout.tsx`
  - `src/ui/steps/PortadaStep.tsx` (add navigation callbacks)
  - `src/ui/steps/HogaresStep.tsx` (add navigation callbacks)
- **Acceptance criteria:**
  - [x] "Siguiente" on invalid step shows ValidationSummary and blocks navigation
  - [x] "Siguiente" on valid step advances to next step
  - [x] "Anterior" navigates back without validation
  - [x] Timer stops when leaving a step
  - [x] Timer starts when entering a step
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/steps/PortadaStep.integration.test.tsx`: test navigation flow
  - [ ] `src/ui/steps/HogaresStep.integration.test.tsx`: test navigation flow

---

## Phase P5: Steps 3 and 4

### P5-001 · Create Menores12Step Component

- **Phase:** P5
- **Dependencies:** P2-006, P3-002, P3-007, P3-008, P3-012, P4-004
- **Description:** Create `src/ui/steps/Menores12Step.tsx`. Dynamic sub-step wizard. Reads menores from store (derived from Hogares). Shows "No hay menores de 12 años" when list is empty. Sub-step tabs show each menor's name and age. Renders Menor12SubForm for active sub-step. All fields from spec section 4.1. Read-only pre-filled fields (folioViv, folioHog, numPer, nombre, edad, sexo) from Hogares.
- **Files to create/modify:**
  - `src/ui/steps/Menores12Step.tsx`
- **Acceptance criteria:**
  - [x] Shows "No hay menores" message when menores list is empty
  - [x] Shows sub-step tabs for each menor
  - [x] Clicking a tab switches to that menor's sub-form
  - [x] Read-only fields display data from Hogares
  - [x] Conditional fields: institucionSalud shows when tieneDerechohabiencia='1'
  - [x] Conditional fields: gradoEscolar, tipoEscuela show when asisteEscuela='1'
  - [ ] Timer does NOT restart on sub-step change (only on step enter/leave) <!-- deferred to P8 -->
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/ui/steps/Menores12Step.test.tsx`: test empty state, test sub-step tabs, test conditional fields, test data persistence

### P5-002 · Create Personas12PlusStep Component

- **Phase:** P5
- **Dependencies:** P2-006, P3-002, P3-007, P3-008, P3-012, P4-004
- **Description:** Create `src/ui/steps/Personas12PlusStep.tsx`. Similar structure to Menores12Step but for personas 12+. Shows "No hay personas de 12 o más años" when empty. 6 sub-sections: Education, Health, Economic Activity, Non-Labor Income, Personal Spending, plus read-only general info. Multiple conditional field groups per spec section 5.4.
- **Files to create/modify:**
  - `src/ui/steps/Personas12PlusStep.tsx`
- **Acceptance criteria:**
  - [x] Shows empty state message when personas list is empty
  - [x] Shows sub-step tabs for each persona
  - [x] All 6 sub-sections render with correct conditional fields
  - [x] trabajoSemanaPasada='1' reveals actividad económica fields
  - [x] trabajoSemanaPasada='2' reveals buscaTrabajo and motivoNoTrabaja
  - [x] recibeProgGobierno='1' reveals programa fields
  - [x] recibeAyudaOtros='1' reveals ayuda fields
  - [ ] Timer does NOT restart on sub-step change <!-- deferred to P8 -->
- **Estimated complexity:** XL
- **Testing requirements:**
  - [x] `src/ui/steps/Personas12PlusStep.test.tsx`: test empty state, test sub-step tabs, test all conditional field groups, test data persistence

### P5-003 · Integrate Cross-Section Validation on Step Transitions

- **Phase:** P5
- **Dependencies:** P2-014, P5-001, P5-002
- **Description:** Wire cross-section validation into step navigation. When navigating from Step 3 or 4 back to Step 2, show warning about integrantes changes. When navigating from Step 7 to Step 8, run full cross-section validation. BLOCKER errors block advancement; WARNING errors advance with visible warnings.
- **Files to create/modify:**
  - `src/ui/components/layout/WizardLayout.tsx`
- **Acceptance criteria:**
  - [ ] Step 3→2 shows warning if Step 3 or 4 has data
  - [ ] Step 7→8 runs all cross-section rules
  - [ ] BLOCKER errors prevent step advancement to 8
  - [ ] WARNING errors advance to 8 with warnings in footer
  - [ ] Warnings displayed in ReporteStep
- **Estimated complexity:** M
- **Testing requirements:**
  - [ ] `src/ui/steps/cross-section.integration.test.tsx`: test blocker blocks navigation, test warning allows navigation

---

## Phase P6: Steps 5 and 6

### P6-001 · Create NegociosStep Component

- **Phase:** P6
- **Dependencies:** P2-007, P3-002, P3-007, P3-008, P3-012, P3-015, P4-004
- **Description:** Create `src/ui/steps/NegociosStep.tsx`. Single CodeInput for `tieneNegocio`. When '1': renders list of NegocioForm cards with "Agregar negocio" button. When '2': shows "No aplica — este hogar no tiene negocios" message. Includes read-only folioViv/folioHog fields.
- **Files to create/modify:**
  - `src/ui/steps/NegociosStep.tsx`
- **Acceptance criteria:**
  - [x] tieneNegocio='1' shows negocio forms
  - [x] tieneNegocio='2' shows "No aplica" message
  - [x] "Agregar negocio" button adds new negocio
  - [x] Each NegocioForm has delete button (only when count > 1)
  - [x] Read-only folioViv/folioHog from Portada
  - [x] numPerOperador validates against Hogares.integrantes list
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/steps/NegociosStep.test.tsx`: test conditional rendering, test add/remove negocio

### P6-002 · Create GastosHogarStep Component

- **Phase:** P6
- **Dependencies:** P2-008, P3-002, P3-008, P3-012, P4-004
- **Description:** Create `src/ui/steps/GastosHogarStep.tsx`. All 8 sections always visible. Each section has SectionHeader with SubtotalRow. All fields are MoneyInput. Read-only folioViv/folioHog. 43 fields organized into sections per spec section 7.1.
- **Files to create/modify:**
  - `src/ui/steps/GastosHogarStep.tsx`
- **Acceptance criteria:**
  - [x] All 8 sections render in order
  - [x] Each section shows subtotal that updates as fields change
  - [x] Section I: 13 alimentos fields
  - [x] Section II: 5 transporte fields
  - [x] Section III: 6 vivienda fields
  - [x] Section IV: 4 educacion fields
  - [x] Section V: 3 salud fields
  - [x] Section VI: 2 vestido fields
  - [x] Section VII: 3 cuidados fields
  - [x] Section VIII: 3 enseres fields
  - [x] All fields persist to store
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/steps/GastosHogarStep.test.tsx`: test all 8 sections render, test subtotal calculation

---

## Phase P7: Steps 7 and 8

### P7-001 · Create GastosDiariosStep Component

- **Phase:** P7
- **Dependencies:** P2-008, P3-002, P3-007, P3-008, P3-012, P3-015, P4-004
- **Description:** Create `src/ui/steps/GastosDiariosStep.tsx`. Section I (Informante): CodeInput for informanteNumPer with ReadOnlyField for nombre. Section II (7 days): one DiaGastosForm per day. Section III (Estimación): 6 money fields. Read-only folioViv/folioHog. Day dates start from fechaInicio in Portada (auto-increment).
- **Files to create/modify:**
  - `src/ui/steps/GastosDiariosStep.tsx`
- **Acceptance criteria:**
  - [x] Section I: informanteNumPer auto-populates informanteNombre from Hogares
  - [x] 7 day sections render (Lunes–Domingo)
  - [x] Each day has expandable DiaGastosForm with add/remove gasto items
  - [x] Day subtotal updates on each gasto change
  - [x] Estimación section has 6 fields
  - [x] Data persists to store
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/ui/steps/GastosDiariosStep.test.tsx`: test day rendering, test gasto add/remove, test subtotal, test informante auto-fill

### P7-002 · Create ReporteStep Component

- **Phase:** P7
- **Dependencies:** P2-015, P3-002, P3-005, P3-011, P3-012
- **Description:** Create `src/ui/steps/ReporteStep.tsx`. Read-only summary. Sections: Folio Status (CONCLUIDO/INCOMPLETO badge), Datos Generales (table), Residentes (table), Ingresos (table), Gastos (table with section totals), Tiempos (table), Alertas (warning list). "Reiniciar" button calls ConfirmModal then resets all.
- **Files to create/modify:**
  - `src/ui/steps/ReporteStep.tsx`
- **Acceptance criteria:**
  - [x] FolioStatusBadge shows green "CONCLUIDO" or red "INCOMPLETO"
  - [x] Datos Generales table shows folioViv, folioHog, entidad, entrevistador, fechas
  - [x] Residentes table shows all integrantes with key data
  - [x] Ingresos table shows total household income
  - [x] Gastos table shows all 8 section totals and grand total
  - [x] Tiempos table shows each step time and total time
  - [x] Alertas section shows all cross-section WARNING messages
  - [x] "Reiniciar" opens ConfirmModal then calls resetAll
  - [x] "Reiniciar" has variant='danger'
  - [x] No "Siguiente" or "Anterior" buttons (only Reiniciar)
- **Estimated complexity:** L
- **Testing requirements:**
  - [x] `src/ui/steps/ReporteStep.test.tsx`: test status badge, test tables render, test reset flow

---

## Phase P8: Integration and Polish

### P8-001 · Integrate localStorage Persistence

- **Phase:** P8
- **Dependencies:** P2-010, P4-004
- **Description:** Verify localStorage persistence works end-to-end. Test page reload: data persists, step persists, timer resumes. Test that clearing localStorage resets the app. Handle localStorage unavailable gracefully (warn user, app still works without persistence).
- **Files to create/modify:**
  - `src/infrastructure/persistence/storage-adapter.ts`
  - `src/ui/app/App.tsx`
- **Acceptance criteria:**
  - [x] After filling Step 1 and reloading, Step 1 data is restored
  - [x] After filling Step 2 and reloading, step 2 data is restored
  - [x] Timer resumes from accumulated time after reload
  - [x] localStorage unavailable: app works, shows warning banner
  - [x] "Reiniciar" clears localStorage and resets store
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/infrastructure/persistence/storage-adapter.test.ts`: test localStorage mock, test unavailable fallback

### P8-002 · Integrate Reset Functionality

- **Phase:** P8
- **Dependencies:** P4-004, P7-002
- **Description:** Complete reset flow: ConfirmModal asks "¿Está seguro de que desea reiniciar el folio? Se perderán todos los datos." On confirm: clear store, clear localStorage, navigate to step 1. "Reiniciar" button in WizardLayout footer also triggers reset.
- **Files to create/modify:**
  - `src/ui/components/layout/WizardLayout.tsx`
- **Acceptance criteria:**
  - [x] ConfirmModal appears with correct Spanish text
  - [x] On confirm: store is cleared to initial state
  - [x] On confirm: localStorage is cleared
  - [x] On confirm: navigates to step 1
  - [x] On cancel: modal closes, no action taken
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/app/reset.integration.test.tsx`: test reset flow with confirmation

### P8-003 · Integrate Page Visibility API for Timer

- **Phase:** P8
- **Dependencies:** P2-003, P3-004
- **Description:** Implement Page Visibility API in TimerDisplay: when tab becomes hidden, pause timer (stopTimer). When tab becomes visible again, resume timer (startTimer). This prevents time accumulation while user is away.
- **Files to create/modify:**
  - `src/ui/components/layout/TimerDisplay.tsx`
- **Acceptance criteria:**
  - [x] Timer pauses when tab becomes hidden
  - [x] Timer resumes when tab becomes visible again
  - [x] Elapsed time while hidden is NOT counted
  - [x] Works correctly with multiple tab switches
- **Estimated complexity:** S
- **Testing requirements:**
  - [x] `src/ui/components/layout/TimerDisplay.visibility.test.tsx`: test with simulated visibility changes

### P8-004 · Edge Cases and Error Handling

- **Phase:** P8
- **Dependencies:** P4-001 through P7-002
- **Description:** Handle edge cases: empty Hogares step with 0 integrantes, folioViv format edge cases (leading zeros), date validation edge cases (Feb 30, leap years), money input edge cases (leading zeros, empty string → 0), array item deletion (confirm if data exists), browser back button (warn about losing unsaved state if on a step with errors).
- **Files to create/modify:**
  - Multiple step components as needed
- **Acceptance criteria:**
  - [x] Empty Hogares: user can add at least 1 integrante (jefe)
  - [x] folioViv starting with '0' preserves all 10 digits
  - [x] Feb 30, Feb 31 show validation error
  - [x] Empty money input treated as 0
  - [x] Removing last gasto from a day keeps at least 1 row
  - [x] Browser back button: no crash, show warning if on incomplete step
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/steps/edge-cases.test.tsx`: test all edge cases

### P8-005 · Accessibility (A11y) Audit and Fixes

- **Phase:** P8
- **Dependencies:** All P3–P7 components
- **Description:** Ensure all form inputs have associated labels, all buttons have accessible names, error messages use `aria-live`, modals trap focus, step indicators are navigable by keyboard, color contrast meets WCAG AA. Run axe-core audit.
- **Files to create/modify:**
  - All UI components as needed
- **Acceptance criteria:**
  - [x] All inputs have `<label htmlFor={id}>` or `aria-label`
  - [x] Error messages use `aria-describedby`
  - [x] ConfirmModal traps focus
  - [x] ProgressBar step buttons are keyboard navigable
  - [x] No axe-core violations (Critical or Serious)
- **Estimated complexity:** M
- **Testing requirements:**
  - [x] `src/ui/a11y/audit.test.tsx`: run axe-core on main components

### P8-006 · Performance: Optimize Re-renders

- **Phase:** P8
- **Dependencies:** All step components
- **Description:** Use `React.memo` on all presentational components. Use `useSelector` with stable selectors to prevent unnecessary re-renders. Memoize expensive computations (subtotals, report data). Check with React DevTools Profiler.
- **Files to create/modify:**
  - All UI components as needed
- **Acceptance criteria:**
  - [x] MoneyInput, CodeInput, TextInput wrapped in `React.memo`
  - [x] SectionHeader, SubtotalRow wrapped in `React.memo`
  - [x] Subtotals only re-calculate when their inputs change
  - [x] No unnecessary re-renders when navigating between sub-steps
- **Estimated complexity:** M
- **Testing requirements:** None (performance only)

---

## Task Summary by Category

| Category | Count | Total Est. Complexity |
|----------|-------|-----------------------|
| Domain Layer (P1) | 18 tasks | L (3) + M (5) + S (6) + XS (2) |
| Store Layer (P2) | 15 tasks | L (2) + M (6) + S (6) + XS (1) |
| UI Components (P3) | 15 tasks | L (2) + M (6) + S (5) + XS (2) |
| Steps 1–2 (P4) | 4 tasks | XL (1) + L (1) + M (2) |
| Steps 3–4 (P5) | 3 tasks | XL (2) + M (1) |
| Steps 5–6 (P6) | 2 tasks | M (2) |
| Steps 7–8 (P7) | 2 tasks | L (2) |
| Integration (P8) | 6 tasks | M (4) + S (2) |
| **Total** | **65 tasks** | |

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
