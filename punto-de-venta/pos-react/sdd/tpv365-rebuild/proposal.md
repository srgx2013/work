# TPV-365 Rebuild — Proposal

> Phase: `sdd-propose` · Change: `tpv365-rebuild` · Status: PROPOSED
> Inputs: `sdd/tpv365-rebuild/explore` (exploration blueprint) · Reference patterns: `pos-react/pos-react-seguridad/`

## 1. Intent

Rebuild the **TPV-365 POS frontend** (tpv-365.com.mx) from scratch because the original source code was lost. The backend — a **cloud Supabase project (`kdyflbexrensqzbquxyu`) with 26 tables and 112 functions** — is intact and will NOT be touched; this change rebuilds only the frontend that consumes those RPCs.

The rebuild must be **UI-faithful to the original** (same screens, texts, flows, and Spanish UI copy) while **improving internal architecture**: untyped JSX becomes full TypeScript, 25 Zustand stores consolidate to ~15, `Swal.fire()` error handling becomes a toast notification layer, and the single-barrel module coupling is removed.

The MVP delivers 6 screens: **Login → Shell/Layout → Dashboard → Config Productos → Config Categorías → POS**, in a new workspace folder (`tpv365-rebuild/`, created during apply, not now).

## 2. Problem / Objective

### Problem
- Original frontend source lost; only the production bundle and the live Supabase backend survive.
- The original was untyped JSX with architectural debt: ~25 Zustand stores, `SweetAlert2` for every error, and heavy barrel-file coupling that makes changes risky.
- The backend contract (RPC names, table shapes, trigger behavior) is stable and well documented (see exploration §2), so the frontend can be rebuilt against it with high confidence.

### Objective
Deliver a production-viable MVP frontend that:
1. Authenticates against Supabase Auth (email/password) and loads the authenticated user's empresa.
2. Provides the Shell layout and the Dashboard with the original KPI cards/charts.
3. Provides Product and Category configuration CRUD screens.
4. Provides a working POS sale flow: build cart → pay → confirm sale (RPC `confirmar_venta`) → cash-movement records → optional PDF ticket.
5. Achieves the internal-quality targets: TypeScript everywhere, consolidated stores, toast notifications, domain-scoped modules, typed RPC wrappers, and react-query for server state.

## 3. Scope

### 3.1 In scope (MVP — 6 screens)

| # | Screen | Route | Key elements |
|---|--------|-------|--------------|
| A | Login | `/login` | `signInWithPassword`, `mostrarempresaxidauth`, `contarproductosporauth`, redirect to `/dashboard` |
| B | Shell / Layout | (wrapper) | Sidebar, header (usuario/empresa), theme toggle (light/dark), clock, 404 catch-all, protected routes |
| C | Dashboard | `/dashboard` | Date-range picker (día/semana/mes/custom), ChartVentas (Recharts), CardVentas (+% vs previous period), CardCantidadVentas, CardGanancias, CardProductosTopMonto, CardMovimientosCajaLive*, 8 dashboard RPCs |
| D | Config Productos | `/configuracion/productos` | Paginated table, search, create/edit modal (`insertarproductos`, `editarproductos`, `mostrarproductos`, `buscarproductos`), delete via `.from('productos')` |
| E | Config Categorías | `/configuracion/categorias` | Table + create/edit modal with color/icono, image selector (storage `imagenes`) (`insertarcategorias`, `editarcategorias`) |
| F | POS | `/pos` | HeaderPos, AreaDetalleventaPos, AreaTecladoPos, TotalPos, FooterPos, BuscadorList, PantallaCobro + IngresoCobro, ticket PDF (pdfmake) |

\* `CardMovimientosCajaLive` depends on RPC `mostrarmovimientoscajalive`, which the exploration flags as postponed in the CAJA domain but lists among dashboard MVP components. **Decision point**: include the card if the RPC is verified reachable with the current auth scope; otherwise defer the card to post-MVP (see §7 question 1).

**MVP backend surface (read-only contract, no backend changes):**
- RPCs (22): `mostrarempresaxidauth`, `contarproductosporauth`, `mostrarproductos`, `buscarproductos`, `insertarproductos`, `editarproductos`, `insertarcategorias`, `editarcategorias`, `insertardetalleventa`, `editarcantidaddv`, `mostrardetalleventa`, `confirmar_venta`, `setdefaultserializacion`, plus 8 dashboard RPCs (`dashboartotalventasconfechas`, `dashboardsumarventasporempresa`, `dashboardsumarventasporempresaperiodoanterior`, `dashboardsumarcantidaddetalleventa`, `dashboardsumargananciadetalleventa`, `dashboardcajasporsucursalyventas`, `dashboartotalventasxmetodopago`, `dashboardtop5productosmasvendidos`).
- Tables written: `ventas` (insert), `movimientos_caja` (insert). All other reads via RPC or select.

**MVP stores (12):** `useGlobalStore`, `useEmpresaStore`, `useUsuariosStore`, `useThemeStore`, `useProductosStore`, `useCategoriasStore`, `useVentasStore` (persist, `partialize` → cart only), `useDetalleVentasStore`, `useMetodosPagoStore`, `useSerializacionStore`, `useReportesStore`, `useDashboardStore`.

### 3.2 Out of scope (post-MVP)

- **Inventario** (movimientos stock, kardex, `incrementarstock`/`reducirstock`, stock bajo mínimo).
- **Reportes** screen (`/reportes`).
- **Caja completa**: abrir/cerrar turno, `cierrecaja` flow, `sumarefectivos...`/`sumarventasmetodopago...`; POS MVP assumes an open cash drawer / minimal caja handling.
- **Clientes / Proveedores** CRUD (`insertarclientesproveedores`, `editarclientesproveedores`).
- **Impresoras** configuration.
- **Usuarios / permisos / RBAC** (`mostrarusuariosasignados`, roles, permisos). MVP grants all authenticated users the full MVP surface; no permission checks.
- **Almacenes** CRUD.
- **Serialización** configuration screen (the full `/configuracion/serializacion` UI); MVP only *reads* serialization defaults (`setdefaultserializacion`/`serializacion_comprobantes`) to satisfy `confirmar_venta` args.
- Other original config screens (`/configuracion/ticket`, `/empresa`, `/sucursalcaja`, `/metodospago`, `/miperfil`).
- **Dark theme** beyond the shell toggle: theme switch persists via `useThemeStore` (light/dark CSS-variable set); no full re-theming of every screen beyond the original behavior.

## 4. Key Business Rules

### 4.1 Login
1. `supabase.auth.signInWithPassword({ email, password })` is the only auth entry.
2. On success, fetch empresa via `mostrarempresaxidauth(auth.uid())` (one empresa per auth user, matched by `empresa.id_auth`); `contarproductosporauth(auth.uid())` verifies the tenant has products.
3. Session is persisted by supabase-js; route guards redirect unauthenticated users to `/login` and authenticated users away from `/login`.
4. Failed credentials → toast error, stay on `/login`.

### 4.2 POS sale flow (reconstructed, must match original)
1. Create the sale: insert `ventas` row (`.from('ventas').insert`) with `estado = 'pendiente'`, `id_usuario`, `id_sucursal`, `id_empresa`, `fecha`.
2. Add items: `insertardetalleventa(_id_venta, _id_producto, _precio_venta, _descripcion, _cantidad, _precio_compra, _id_sucursal, _id_almacen)` → `detalle_venta` rows (`estado = 'nueva'`).
3. Search products via `mostrarproductos(_id_empresa, buscador)`; adjust quantities via `editarcantidaddv(_id, _cantidad)`; refresh detail via `mostrardetalleventa(_id_venta)`.
4. Charge: `PantallaCobro` → per payment method (`metodos_pago`: efectivo, tarjeta, crédito) enter amounts in `IngresoCobro`; compute total and `vuelto`.
5. Confirm: `confirmar_venta(_id_venta, _id_usuario, _vuelto, _id_tipo_comprobante, _serie, _id_sucursal, _id_cliente, _fecha, _monto_total)` → server generates `nro_comprobante`, updates sale state. `_serie`/`_id_tipo_comprobante` come from the tenant's default serialization (`serializacion_comprobantes` + `setdefaultserializacion`).
6. Record `movimientos_caja` rows per payment method (monto, `id_metodo_pago`, `id_ventas`, `vuelto`, `id_usuario`).
7. Optional PDF ticket via pdfmake (empresa data: `nombre`, `pie_pagina_ticket`, `simbolo_moneda`).
8. On success: clear cart (persist store) and toast confirmation.
9. Server-side triggers (`validarstock`, `devolverstockaleliminardv`) remain authoritative; MVP surfaces their errors as toasts instead of pre-validating stock client-side.

### 4.3 Dashboard KPIs
- **Total ventas** of the period (`dashboardsumarventasporempresa`) with **% change vs previous period** (`...periodoanterior`).
- **Cantidad de items vendidos** (`dashboardsumarcantidaddetalleventa`).
- **Ganancias** (`dashboardsumargananciadetalleventa`).
- **Serie temporal** de ventas por fecha (`dashboartotalventasconfechas`, Recharts AreaChart).
- **Top 5 productos** más vendidos (`dashboardtop5productosmasvendidos`).
- **Ventas por método de pago** (`dashboartotalventasxmetodopago`).
- **Cajas por sucursal y ventas** (`dashboardcajasporsucursalyventas`).
- Date range: día / semana / mes / custom, held in `useDashboardStore`; every refetch re-runs the 8 RPCs.

### 4.4 Product / Category rules
- Products belong to one empresa (`id_empresa`); search filters by name/code within the tenant.
- Categories carry `color` + `icono` (storage `imagenes`); category deletion is not part of the original MVP flow (products reference categories; deletion errors surface as toasts).

## 5. Technical Decisions

1. **Backend untouched.** All data access goes through the existing RPCs/selects via a typed Supabase client. No migrations, no schema changes, no new functions. RPC payload/response types are defined once per RPC in a `types/` module derived from the exploration catalog (§2).
2. **MVP scope of 6 screens** (Login → Shell → Dashboard → Productos → Categorías → POS); inventory, reports, full caja, clients/suppliers, printers, RBAC, warehouses, and serialization UI are explicitly deferred (§3.2).
3. **Full TypeScript.** The original was untyped JSX; the rebuild is TS end-to-end (Vite + React 18 + TS). RPC wrappers and stores are typed; no `any` on API boundaries.
4. **UI fidelity with internal improvement.** Same screens, same Spanish UI copy, same flows, same component names where useful (HeaderPos, AreaDetalleventaPos, AreaTecladoPos, FooterPos, TotalPos, PantallaCobro, IngresoCobro, ChartVentas, CardVentas...) — with:
   - **Store consolidation 25 → ~15**; MVP ships exactly 12 (§3.1). `useVentasStore` persists via `partialize` so only cart items hit localStorage.
   - **Toast notifications** (Ant Design message/notification) replace `Swal.fire()` everywhere in MVP screens; a single `notify` layer.
   - **No barrel coupling**: imports are colocated per feature module; no giant `index.js` re-export hub.
5. **Server state → @tanstack/react-query** (typed `useQuery`/`useMutation` hooks per domain: `useProductosHooks`, `useCategoriasHooks`, `useVentasHooks`, `useDashboardHooks`); **Zustand** holds UI/client state only. Follows the reference CRUD pattern from `pos-react-seguridad`: store → hook → template → tabla + modal.
6. **Stack (fixed):** Ant Design + styled-components + Recharts + pdfmake + @tanstack/react-query + react-hook-form + zustand (persist) + react-router-dom v6 + supabase-js (+ dayjs, react-icons, TanStack Table).
7. **Routing:** react-router-dom v6 with a `ProtectedRoute` wrapper; Shell layout renders sidebar/header around protected routes; `/` redirects to `/dashboard`.
8. **Forms:** react-hook-form + Ant Design (`RegistrarProductos`, `RegistrarCategorias`); validation messages in Spanish.
9. **Workspace:** new folder `/Volumes/m2/Usuarios/Documents/work/punto-de-venta/tpv365-rebuild/` (created in apply), configured via `.env` with Supabase URL + anon key (`kdyflbexrensqzbquxyu`). `pos-react/pos-react-seguridad/` remains the pattern reference, not a dependency.
10. **No RBAC in MVP**: all authenticated users see the 6 screens; permission checks are a post-MVP concern.

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| `confirmar_venta` internals opaque (comprobante generation, estado update) — reconstructed only from signature | HIGH | Reconstruct contract from SQL signature; validate against live data in a sandbox/test tenant before production rollout; keep wrapper response types narrow and observable. |
| Server triggers (`validarstock`, `devolverstockaleliminardv`) can reject detail inserts/deletes | HIGH | Surface RPC errors as toasts; treat stock validation as server-authoritative; no client-side stock guessing. |
| Full caja flow postponed; POS needs an open drawer context for `movimientos_caja` inserts | MEDIUM | MVP assumes an open caja / minimal caja handling; verify `movimientos_caja.id_cierre_caja` is nullable for `insert` in MVP path. |
| RBAC omitted → all authenticated users get full MVP access | MEDIUM | Documented as a conscious post-MVP boundary; backend RLS/security definer behavior unchanged. |
| `CardMovimientosCajaLive` RPC (`mostrarmovimientoscajalive`) flagged postponed in exploration while listed in dashboard MVP | MEDIUM | Decision point: verify RPC reachability early; defer the card if not available. |
| Exact business logic beyond the bundle (BAJA fidelity) may be unknown | MEDIUM | Fidelity on texts/flows/screens first; where logic is unknowable, implement a clean equivalent and flag it in review. |
| No serialization row → `confirmar_venta` cannot run (missing `_serie`/`_id_tipo_comprobante`) | MEDIUM | Read default serialization; if missing, show clear toast telling the user to configure serialization (post-MVP screen), never a silent failure. |
| Payload-shape drift between bundle-era RPCs and live backend | MEDIUM | Single typed RPC wrapper layer + smoke tests against the live Supabase project in apply/verify. |
| `useVentasStore` persist (localStorage) leaking stale carts | LOW | `partialize` to cart items only; clear on confirmed sale; version the persisted key. |
| Product delete may violate FK/trigger constraints | LOW | Keep delete in scope (as original) but surface DB errors via toast; document constraint behavior. |

## 7. Proposal Question Round (assumptions needing user review)

The delegated context fixed most decisions. These remain genuine product/business unknowns that the orchestrator should confirm with the user before specs:

1. **`CardMovimientosCajaLive` en el MVP del Dashboard** — el RPC `mostrarmovimientoscajalive` figura como "POSPUESTO" en el dominio CAJA de la exploración, pero el card aparece en los componentes MVP. ¿Se incluye el card (verificando el RPC) o se difiere?
2. **Eliminación de productos en MVP** — el CRUD original incluía delete vía `.from('productos').delete()`. ¿Se mantiene en MVP (con toasts de error por constraints) o se difiere el delete?
3. **Entorno de validación de `confirmar_venta`** — ¿existe un tenant de prueba/sandbox en el proyecto Supabase `kdyflbexrensqzbquxyu` para validar el flujo de venta con datos reales sin ensuciar producción?
4. **Caja abierta asumida en el POS MVP** — sin el flujo de abrir/cerrar turno, el POS asume caja abierta y `movimientos_caja.id_cierre_caja` null. ¿Es aceptable como corte de MVP?
5. **Serie/serialización por defecto** — si el tenant no tiene serialización configurada, `confirmar_venta` no puede ejecutarse. ¿Se acepta un toast de bloqueo (sin UI de configuración en MVP)?

## 8. Affected Areas

- **New code (only):** `tpv365-rebuild/` — entire new frontend app. No existing repo files modified.
- **Backend:** NOT touched (Supabase cloud project `kdyflbexrensqzbquxyu`).
- **References (read-only):** `pos-react/pos-react-seguridad/` patterns; exploration catalog for RPC/table contracts.
- **Data:** writes go through the same RPCs/selects the original used — same semantics, no migration.

## 9. Rollback

- Frontend-only change in a brand-new folder: rollback = stop serving the new app and restore the previous deployment/routing; zero backend or data changes to revert.
- Because the original source is lost, there is no "revert commit" for the old app — the safety net is (a) no backend mutation, (b) additive new folder, (c) smoke-tested RPC contracts before any production traffic.

## 10. MVP Acceptance Criteria

1. **Login:** valid credentials → empresa loaded → `/dashboard`; invalid → toast error, no crash; unauthenticated deep-links redirect to `/login`.
2. **Shell:** sidebar/header render empresa + user, theme toggle persists, unknown routes → 404.
3. **Dashboard:** 8 KPI cards/charts render from live RPC data; date range (día/semana/mes/custom) refetches all metrics; empty ranges show empty states (no crash).
4. **Productos:** paginated list, search, create, edit, delete — all via typed RPC wrappers; errors as toasts.
5. **Categorías:** list, create, edit with color/icono (storage `imagenes`).
6. **POS:** search+add products, quantity adjust, correct totals/vuelto, payment split across `metodos_pago`, `confirmar_venta` success → `nro_comprobante` returned, `movimientos_caja` rows created, cart cleared, PDF ticket generated.
7. **Quality:** no `Swal.fire` in MVP screens (toast layer only); MVP uses exactly 12 stores; no barrel import hub; `tsc` build passes with no `any` on RPC/store boundaries.
8. **Fidelity spot-check:** each of the 6 screens matches the original's Spanish texts and flows (screenshots/bundle references reviewed in apply/verify).
