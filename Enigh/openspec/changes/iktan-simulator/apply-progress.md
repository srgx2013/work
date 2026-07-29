# IKTAN Simulator — Apply Progress

> **Change:** `iktan-simulator`
> **Phase:** apply (P7)
> **Date:** 2025-07-10
> **Mode:** Strict TDD

---

## P7: Steps 7 and 8

### P7-001: GastosDiariosStep Component ✅

**Files changed:**
- `src/ui/steps/GastosDiariosStep.tsx` — Created
- `src/ui/steps/GastosDiariosStep.test.tsx` — Created (20 tests)
- `src/application/use-cases/validate-step.ts` — Added step 7 schema mapping (gastosDiariosSchema)

**Implementation details:**
- **Informante section**: NUMPER input (numeric, maxLength 2) + auto-filled ReadOnlyField for informante name from Hogares integrantes
- **7 days**: Lunes through Domingo rendered from `gastosDiarios.dias` array (initialized by `createInitialGastosDiarios`)
- **Per-day gasto items**: Dynamic list with "+ Agregar gasto" button per day, "Eliminar" button per item (visible only when count > 1)
- **Per-day subtotal**: Each day section shows a subtotal row updating as gasto montos change
- **Estimación Mensual**: 6 MoneyInput fields (tortillería, carnicería, verdulería, abarrotes, transporte, gasolina)
- **Read-only folioViv/folioHog**: Propagated from Portada
- **Validation**: Step 7 wired into `validate-step.ts` with `gastosDiariosSchema` (validates informanteNumPer, per-day gastos, conceptos)
- **Total**: Shows sum of all daily gastos at bottom

### P7-002: ReporteStep Component ✅

**Files changed:**
- `src/ui/steps/ReporteStep.tsx` — Created
- `src/ui/steps/ReporteStep.test.tsx` — Created (23 tests)

**Implementation details:**
- **Estado del folio**: Green "CONCLUIDO" or red "INCOMPLETO" badge based on cross-section BLOCKER errors
- **Datos Generales**: Table with FOLIOVIV, FOLIOHOG, Entidad (code + name from catalog), Decena, Entrevistador, Supervisor, Fecha inicio, Fecha término, Resultado de entrevista
- **Resumen de Residentes**: Table with NUMPER, Nombre, Parentesco (catalog label), Sexo, Edad, Escolaridad (catalog label)
- **Totales**: Ingreso total del hogar, Gasto trimestral total (all 8 GastosHogar sections), Gasto diario total estimado, Gasto mensual estimado (diarios)
- **Tiempos por Cuestionario**: Table with all 7 questionnaire names + their elapsed time in MM:SS format + Tiempo total in HH:MM:SS
- **Alertas de Consistencia**: Shows cross-section WARNING messages; shows "Sin incidencias" when none
- **Reiniciar button**: Opens ConfirmModal with danger variant; on confirm calls resetAll + navigates to step 1
- **No Anterior/Siguiente buttons**: Only Reiniciar

### P7.3: Timer Integration in WizardLayout ✅

**Files changed:**
- `src/ui/layouts/WizardLayout.tsx` — Added useEffect for timer lifecycle
- `src/ui/timer-integration.test.tsx` — Created (7 tests)

**Implementation details:**
- `useEffect` on `currentStep` watches step changes
- When entering a step (1–7): calls `startTimer(currentStep)` — sets entry to running with `startedAt = Date.now()`
- When leaving a step (cleanup): calls `stopTimer()` — calculates segment elapsed, sets entry to stopped
- When returning to a previously visited step: `startTimer` resumes from accumulated `elapsedSeconds` (same as resume behavior — uses `startedAt` to track new segment)
- TimerBar already has `setInterval` ticking every 1 second via local `useState` for display updates
- TimerBar already has Page Visibility API integration (pause on hidden, resume on visible)

### P7.4: App.tsx Update ✅

**Files changed:**
- `src/App.tsx` — Replaced placeholder components with real GastosDiariosStep (step 7) and ReporteStep (step 8); removed PlaceholderStep helper

---

## TDD Cycle Evidence

| Task | RED Phase | GREEN Phase | Tests |
|------|-----------|-------------|-------|
| P7-001 GastosDiariosStep | Tests first → import failure | Component implemented → 20/20 pass | 20 |
| P7-002 ReporteStep | Tests first → import failure | Component implemented → 23/23 pass | 23 |
| P7.3 Timer Integration | Tests first → timer status "stopped" | useEffect wired → 7/7 pass | 7 |
| P7.4 App.tsx | Existing App.test.tsx covers routing | PlaceholderStep removed | 6 (existing) |

**Total new tests**: 50 (20 + 23 + 7)
**Full suite**: 60 files, 552 tests — all passing

---

## Test Commands Run

```bash
# Per-component during RED→GREEN
npx vitest run src/ui/steps/GastosDiariosStep.test.tsx
npx vitest run src/ui/steps/ReporteStep.test.tsx
npx vitest run src/ui/timer-integration.test.tsx

# Full suite verification
npm test -- --run
# → 60 files, 552 tests passed
```

---

## Deviations from Design

- **GastosDiariosStep informante input**: Used a raw `<input>` with `FieldWrapper` instead of `CodeInput` because `CodeInput` requires `catalogCodes` prop for the catalog help button; the informante NUMPER is validated against Hogares integrantes, not a fixed catalog.
- **ReporteStep timer table**: Timer data is read directly from `timer.entries` in the store rather than through a dedicated `compute-report` use case (P2-015 not yet implemented). The report computes totals inline using `useMemo`.
- **ReporteStep folio status**: Computed inline using `validateCrossSection` directly rather than through a wrapper use case. This is a pragmatic choice since P2-014/P2-015 are not yet implemented.

---

## Remaining Tasks (P7 → unchecked `- [ ]`)

All P7 acceptance criteria and testing requirements are now marked `[x]` in `tasks.md`.

Remaining unchecked items belong to:
- **P4-004**: HogaresStep integration test (deferred)
- **P5-003**: Cross-section validation on step transitions (deferred to P8)
- **P8-001 through P8-006**: Integration, persistence, page visibility, edge cases, a11y, performance

---

## Workload / PR Boundary

This P7 batch adds:
- ~240 lines of production code (GastosDiariosStep + ReporteStep + WizardLayout timer + App.tsx + validate-step)
- ~350 lines of test code (3 new test files)

Within the "PR 3" boundary: P7–P8. P8 tasks remain for a future apply batch.

---

## Structured Status Consumed

- `actionContext`: workspace-planning mode with established `allowedEditRoots` under repo root
- `applyState`: ready (P0–P6 complete, P7 assigned)
- Delivery strategy: `ask-on-risk` with `feature-branch-chain` — P7 falls into PR 3 (P7–P8)