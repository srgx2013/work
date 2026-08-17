# TPV-365 Rebuild — SDD Tasks

> Phase: `sdd-tasks` · Change: `tpv365-rebuild` · Status: READY TO APPLY
> Inputs: `sdd/tpv365-rebuild/spec` · `sdd/tpv365-rebuild/design`

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~4 500 – 5 500 (new project, 6 screens + full infra) |
| 400-line budget risk | **High** |
| Chained PRs recommended | **Yes** |
| Suggested split | **PR 1 → PR 2 → PR 3 → PR 4 → PR 5 → PR 6** |
| Delivery strategy | stacked-to-main |
| Chain strategy | stacked-to-main |

### Batch breakdown

| Batch | Contents | Est. lines | PR |
|--------|----------|------------|-----|
| 1 | Project scaffold (Vite, deps, env, supabase client, errors, notify, format, queryKeys) | ~450 | PR #1 |
| 2 | TypeScript types (rpc.ts, store.ts) + 22 typed RPC wrappers | ~800 | PR #2 |
| 3 | 12 zustand stores + react-query hooks | ~900 | PR #3 |
| 4 | Auth (LoginPage, LoginForm, LogoEmpresa, useLogin, ProtectedRoute, App routing) | ~450 | PR #4 |
| 5 | Shell/Layout (Sidebar, Header, Reloj, ToggleTema, theme toggle, NotFoundPage) | ~500 | PR #5 |
| 6 | Dashboard + Productos + Categorías + POS (8 screens) | ~2 200 | PR #6 |
| 7 | Verify (smoke test against live Supabase) | ~200 | — |

**Rationale:** The total exceeds 400 lines dramatically. POS alone (batch 6) is ~2 200 lines. Splitting into stacked PRs keeps each diff reviewable (< 700 lines) and allows rollback at batch boundaries. Chain strategy `stacked-to-main` ensures clean git history and independent rollback per batch.

```
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High
```

---

## Task Inventory

### Batch 1 — Project Scaffold

**Dir:** `tpd365-rebuild/` (created as sibling of `pos-react/`)

- [x] T-1.1 — Create project directory + `index.html` + `package.json` (Vite + React 18 + all deps listed in design §7.2). Run `npm install`. <!-- sdd-owner: implementation -->
- [x] T-1.2 — Create `vite.config.ts` with `@/` alias pointing to `src/`. Create `tsconfig.json` with `strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`, paths alias. Create `.gitignore`. <!-- sdd-owner: implementation -->
- [x] T-1.3 — Create `.env.example` with `VITE_APP_SUPABASE_URL` + `VITE_APP_SUPABASE_ANON_KEY`. **Note:** anon key obtained from Supabase dashboard at apply time; placeholder left empty. Create `.env` (git-ignored) with placeholder. <!-- sdd-owner: implementation -->
- [x] T-1.4 — Create `src/vite-env.d.ts` declaring the two `VITE_APP_*` env vars as `string | undefined`. <!-- sdd-owner: implementation -->
- [x] T-1.5 — Create `src/lib/supabase.ts` (supabase-js client, throw if env vars missing). Create `src/lib/errors.ts` (RpcError class, throwRpcError, userMessage with 23503/23505 mapping). Create `src/lib/notify.ts` (AntD message/notification wrapper, notifyRpcError). Create `src/lib/format.ts` (formatCurrency with Intl.NumberFormat, formatDate). Create `src/lib/queryKeys.ts` (qk factory as per design §2.3). <!-- sdd-owner: implementation --> **Batch 1 partial:** only `supabase.ts` created. `errors.ts` / `notify.ts` / `format.ts` / `queryKeys.ts` deferred to next batch.
- [x] T-1.6 — Create `src/main.tsx` (ReactDOM root, QueryClientProvider, AntD `<App>` ConfigProvider, RouterProvider with createBrowserRouter). Create `src/App.tsx` (routes skeleton: Login, ProtectedRoute, ShellLayout, 5 pages, NotFound — all loading empty shells for now). <!-- sdd-owner: implementation --> **Batch 1 partial:** minimal `main.tsx` (createRoot + StrictMode only) + minimal `App.tsx` placeholder. Full router/query/AntD wiring deferred to next batch.

**Done for batch:** `npm run dev` starts without errors; `tsc --noEmit` passes; no `any` in lib files.

---

### Batch 2 — Types + Typed RPC Wrappers

- [x] T-2.1 — Create `src/types/rpc.ts` with ALL interfaces from spec §2: Empresa, Usuario, Producto, Categoria, Venta, DetalleVenta, MetodoPago, SerializacionComprobante, TipoComprobante, DashboardVentasFecha, DashboardTopProducto, DashboardMetodoPago, DashboardCajaSucursal, MovimientoCaja, CartItem, InsertProductoParams, EditProductoParams, InsertCategoriaParams, EditCategoriaParams, InsertDetalleVentaParams, InsertVentaParams, ConfirmarVentaParams, InsertMovimientoCajaParams, LoginCredentials, LoginResult. <!-- sdd-owner: implementation -->
- [x] T-2.2 — Create `src/types/store.ts` with all 12 store state interfaces from design §4. <!-- sdd-owner: implementation -->
- [x] T-2.3 — Create `src/lib/rpc/auth.ts`: wrappers for `mostrarempresaxidauth` + `contarproductosporauth`. Each calls supabase.rpc, throws RpcError, returns typed array/scalar. <!-- sdd-owner: implementation -->
- [x] T-2.4 — Create `src/lib/rpc/productos.ts`: wrappers for `mostrarproductos`, `buscarproductos`, `insertarproductos` (returns id), `editarproductos`. <!-- sdd-owner: implementation -->
- [x] T-2.5 — Create `src/lib/rpc/categorias.ts`: wrappers for `insertarcategorias`, `editarcategorias`. <!-- sdd-owner: implementation -->
- [x] T-2.6 — Create `src/lib/rpc/ventas.ts`: wrappers for `insertardetalleventa`, `editarcantidaddv`, `mostrardetalleventa`, `confirmar_venta`. <!-- sdd-owner: implementation -->
- [x] T-2.7 — Create `src/lib/rpc/dashboard.ts`: wrappers for all 8 dashboard RPCs listed in spec §3.5. <!-- sdd-owner: implementation -->
- [x] T-2.8 — Create `src/lib/rpc/caja.ts`: wrapper for `mostrarmovimientoscajalive`. <!-- sdd-owner: implementation -->

**Done for batch:** All 22 RPC wrappers exist; `tsc --noEmit` passes; zero `any` on wrapper returns; each file is a direct import path (no barrel).

---

### Batch 3 — 12 Zustand Stores + React-Query Base Hooks

- [ ] T-3.1 — Create `src/stores/useGlobalStore.ts` (sidebarCollapsed, modalOpen Record, toggleSidebar, setModalOpen). <!-- sdd-owner: implementation -->
- [ ] T-3.2 — Create `src/stores/useEmpresaStore.ts` (empresa: Empresa | null, setEmpresa, clearEmpresa — non-persisted). <!-- sdd-owner: implementation -->
- [ ] T-3.3 — Create `src/stores/useUsuariosStore.ts` (usuario: Usuario | null, setUsuario, clearUsuario — non-persisted). <!-- sdd-owner: implementation -->
- [ ] T-3.4 — Create `src/stores/useThemeStore.ts` (**persisted** to `tpv365-theme`, light/dark, toggleTheme, setTheme). <!-- sdd-owner: implementation -->
- [ ] T-3.5 — Create `src/stores/useProductosStore.ts` (buscador, selectedProducto, pagination — UI state only, NOT canonical list). <!-- sdd-owner: implementation -->
- [ ] T-3.6 — Create `src/stores/useCategoriasStore.ts` (selectedCategoria — UI state only). <!-- sdd-owner: implementation -->
- [ ] T-3.7 — Create `src/stores/useVentasStore.ts` (**persisted** to `tpv365-ventas-store`, partialize → cart + currentVentaId only, version: 1, addItem/removeItem/updateQty/clearCart/setCurrentVentaId). <!-- sdd-owner: implementation -->
- [ ] T-3.8 — Create remaining 5 stores: `useDetalleVentasStore`, `useMetodosPagoStore`, `useSerializacionStore` (non-persisted), `useReportesStore` (reserved empty), `useDashboardStore` (rango + fechaInicio/fechaFin + setRango). <!-- sdd-owner: implementation -->
- [x] T-3.9 — Create `src/hooks/useLogin.ts` (useLoginMutation: auth.signInWithPassword → rpc.mostrarEmpresaXIdAuth → rpc.contarProductosPorAuth → returns LoginResult, sets stores, handles errors → notify). <!-- sdd-owner: implementation -->
- [x] T-3.10 — Create `src/hooks/useSession.ts` (supabase.auth.getSession + onAuthStateChange subscription). Create `src/hooks/useAuthGuard.ts` (ProtectedRoute component using useSession, redirect logic per design §6). <!-- sdd-owner: implementation -->
- [ ] T-3.11 — Create `src/hooks/useProductos.ts` (useProductosQuery with pagination, useBuscarProductosQuery with debounce, useInsertarProductoMutation, useEditarProductoMutation, useEliminarProductoMutation via .from().delete(), all with qk invalidation). <!-- sdd-owner: implementation -->
- [ ] T-3.12 — Create `src/hooks/useCategorias.ts` (useCategoriasQuery, useInsertarCategoriaMutation, useEditarCategoriaMutation). <!-- sdd-owner: implementation -->
- [ ] T-3.13 — Create `src/hooks/useVentas.ts` (useInsertarVentaMutation via .from().insert(), useInsertarDetalleVentaMutation, useEditarCantidadDvMutation, useMostrarDetalleVentaQuery, useConfirmarVentaMutation, useInsertarMovimientoCajaMutation). <!-- sdd-owner: implementation -->
- [ ] T-3.14 — Create `src/hooks/useDashboard.ts` (9 independent useQuery hooks: 8 dashboard metrics + caja live; each uses qk factory; caja live uses refetchInterval: 15_000, retry: 1; defensive wrapper returns undefined on error). <!-- sdd-owner: implementation -->

**Done for batch:** All 12 stores compile; useVentasStore persists only cart + currentVentaId; all hooks export isLoading/isError/data/error; `tsc --noEmit` passes.

---

### Batch 4 — Auth Screen

- [x] T-4.1 — Create `src/componentes/atomos/LogoEmpresa.tsx` (renders empresa.logo or AntD Avatar placeholder). <!-- sdd-owner: implementation -->
- [x] T-4.2 — Create `src/componentes/moleculas/LoginForm.tsx` (AntD Form with email + password, react-hook-form, Spanish validation messages, loading state, wires useLoginMutation). <!-- sdd-owner: implementation -->
- [x] T-4.3 — Create `src/componentes/paginas/LoginPage.tsx` (full-screen centered layout, wires LoginForm, redirect to /dashboard on success via useNavigate). <!-- sdd-owner: implementation -->
- [x] T-4.4 — Update `src/App.tsx` to wire ProtectedRoute → useAuthGuard logic; authenticated /login access redirects to /dashboard. <!-- sdd-owner: implementation -->

**Done for batch:** Login with valid credentials → /dashboard; invalid → toast; unauthenticated /dashboard → redirect /login; `tsc --noEmit` passes.

---

### Batch 5 — Shell / Layout

- [x] T-5.1 — Create `src/componentes/atomos/Reloj.tsx` (dayjs clock, setInterval 1s, locale format). <!-- sdd-owner: implementation -->
- [x] T-5.2 — Create `src/componentes/moleculas/ToggleTema.tsx` (AntD Switch, reads/writes useThemeStore). <!-- sdd-owner: implementation -->
- [x] T-5.3 — Create `src/componentes/organismos/sidebar/Sidebar.tsx` (AntD Menu, 4 items: Dashboard, Productos, Categorías, POS; uses useGlobalStore toggleSidebar, useThemeStore; AntD Sider, collapsible). <!-- sdd-owner: implementation -->
- [x] T-5.4 — Create `src/componentes/organismos/header/Header.tsx` (empresa.nombre + usuario.nombres from stores, ToggleTema, Reloj). <!-- sdd-owner: implementation -->
- [x] T-5.5 — Create `src/componentes/templates/ShellLayout.tsx` (AntD Layout: Sider + Header + Content; renders <Outlet />; wires sidebar collapse to useGlobalStore). <!-- sdd-owner: implementation -->
- [x] T-5.6 — Create `src/componentes/paginas/NotFoundPage.tsx` (standalone 404 page). <!-- sdd-owner: implementation -->
- [x] T-5.7 — Wire theme toggle: useThemeStore subscribe → set CSS variable `document.documentElement.dataset.theme`; AntD ConfigProvider reads theme token. <!-- sdd-owner: implementation -->
- [x] T-5.8 — Update `src/App.tsx`: ShellLayout wraps protected routes; `/` redirects `/dashboard`; all routes wired. <!-- sdd-owner: implementation -->

**Done for batch:** Sidebar 4 items, header shows empresa + usuario, theme persists, clock ticks, unknown route → NotFoundPage; `tsc --noEmit` passes.

---

### Batch 6 — Dashboard

- [x] T-6.1 — Create `src/componentes/atomos/CustomTooltip.tsx` (Recharts custom tooltip for AreaChart). <!-- sdd-owner: implementation -->
- [x] T-6.2 — Create `src/componentes/moleculas/DateRangePicker.tsx` (AntD RangePicker with custom presets: Día, Semana, Mes, Custom; wires useDashboardStore.setRango). <!-- sdd-owner: implementation -->
- [x] T-6.3 — Create `src/componentes/moleculas/CardVentas.tsx` (total numeric + % cambio badge, green ↑ red ↓, handles div-by-zero). <!-- sdd-owner: implementation -->
- [x] T-6.4 — Create `src/componentes/moleculas/CardCantidadVentas.tsx`, `CardGanancias.tsx`, `CardProductosTopMonto.tsx` (list), `CardMetodosPago.tsx` (Recharts PieChart), `CardCajasSucursales.tsx`. <!-- sdd-owner: implementation -->
- [x] T-6.5 — Create `src/componentes/moleculas/CardMovimientosCajaLive.tsx` (**defensive**: returns null on isError or empty data; no toast; refetchInterval upstream in hook). <!-- sdd-owner: implementation -->
- [x] T-6.6 — Create `src/componentes/organismos/dashboard/ChartVentas.tsx` (Recharts AreaChart with fecha x-axis, total_ventas y-axis, gradient fill, CustomTooltip). <!-- sdd-owner: implementation -->
- [x] T-6.7 — Create `src/componentes/templates/DashboardTemplate.tsx` (grid layout wrapping DateRangePicker + all cards/chart). <!-- sdd-owner: implementation -->
- [x] T-6.8 — Create `src/componentes/paginas/DashboardPage.tsx` (calls all 9 useDashboard hooks, wires data to DashboardTemplate; handles loading skeleton states). <!-- sdd-owner: implementation -->

**Done for batch:** Dashboard loads on mount; date range change refetches all 8 RPCs; % cambio badge correct; CardMovimientosCajaLive hidden on error; `tsc --noEmit` passes.

---

### Batch 7 — Config Productos

- [x] T-7.1 — Create `src/componentes/moleculas/BuscadorProductos.tsx` (AntD Input.Search, debounce 300ms, wires useBuscarProductosQuery). <!-- sdd-owner: implementation -->
- [x] T-7.2 — Create `src/componentes/moleculas/EliminarProductoBtn.tsx` (AntD Button with trash icon, triggers Modal.confirm, calls useEliminarProductoMutation). <!-- sdd-owner: implementation -->
- [x] T-7.3 — Create `src/componentes/organismos/tablas/TablaProductos.tsx` (AntD Table, columns: nombre/código/precio_venta/precio_compra/categoría/stock/acciones, pagination, wires useProductosQuery, Edit action → modal). <!-- sdd-owner: implementation -->
- [x] T-7.4 — Create `src/componentes/organismos/formularios/RegistrarProductos.tsx` (AntD Modal + Form via react-hook-form, all fields per spec §4.D.5, Spanish validation, wires insertar/editar mutations, pre-fill on edit). <!-- sdd-owner: implementation -->
- [x] T-7.5 — Create `src/componentes/templates/ProductosTemplate.tsx` (toolbar "Nuevo producto" + BuscadorProductos + TablaProductos). <!-- sdd-owner: implementation -->
- [x] T-7.6 — Create `src/componentes/paginas/ProductosPage.tsx` (wires ProductosTemplate, opens RegistrarProductos modal on "Nuevo" or edit action; wires useCategoriasQuery for Select options). <!-- sdd-owner: implementation -->

**Done for batch:** Products table loads; search debounce triggers buscarproductos; create/edit modals work; delete shows Modal.confirm → toast; `tsc --noEmit` passes.

---

### Batch 8 — Config Categorías

- [x] T-8.1 — Create `src/componentes/organismos/formularios/ImageSelector.tsx` (MVP: simple Input for storage path/URL; full upload deferred post-MVP). <!-- sdd-owner: implementation -->
- [x] T-8.2 — Create `src/componentes/organismos/formularios/RegistrarCategorias.tsx` (AntD Modal + Form: nombre, color ColorPicker/default #1890ff, icono via ImageSelector, Spanish validation, wires insertar/editar mutations). <!-- sdd-owner: implementation -->
- [x] T-8.3 — Create `src/componentes/organismos/tablas/TablaCategorias.tsx` (AntD Table, columns: nombre/color Tag/color swatch/icono image preview/acciones Edit only; **NO delete button**). <!-- sdd-owner: implementation -->
- [x] T-8.4 — Create `src/componentes/templates/CategoriasTemplate.tsx` (toolbar "Nueva categoría" + TablaCategorias). <!-- sdd-owner: implementation -->
- [x] T-8.5 — Create `src/componentes/paginas/CategoriasPage.tsx` (wires CategoriasTemplate, opens RegistrarCategorias modal). <!-- sdd-owner: implementation -->

**Done for batch:** Categories table loads; create/edit works; color swatch renders; icono displays; no delete button present; `tsc --noEmit` passes.

---

### Batch 9 — POS (largest batch, ~1 600 lines)

- [x] T-9.1 — Create `src/servicios/pdfTicket.ts` (`generateTicket(TicketInput): TDocumentDefinitions` + `downloadTicket(input)` via pdfMake). Target 80mm thermal width, 80mm thermal layout with empresa header, detail rows, subtotal/tax/total, pie_pagina_ticket footer. <!-- sdd-owner: implementation -->
- [x] T-9.2 — Create `src/componentes/atomos/QtyControl.tsx` (minus/plus buttons + qty display). Create `src/componentes/atomos/CurrencyDisplay.tsx` (formatCurrency wrapper). <!-- sdd-owner: implementation -->
- [x] T-9.3 — Create `src/componentes/moleculas/TotalPos.tsx` (subtotal + impuesto + total display; reads cart from useVentasStore + empresa.valor_impuesto). <!-- sdd-owner: implementation -->
- [x] T-9.4 — Create `src/componentes/moleculas/IngresoCobro.tsx` (per metodos_pago: monto recibido InputNumber, shows vuelto calculation; emits totalRecibido up). <!-- sdd-owner: implementation -->
- [x] T-9.5 — Create `src/componentes/moleculas/ProductGrid.tsx` (grid/list of products from search; onAdd → useVentasStore.addItem + insertarVenta if needed + insertarDetalleVenta). <!-- sdd-owner: implementation -->
- [x] T-9.6 — Create `src/componentes/moleculas/CartRow.tsx` (name, unit price, QtyControl, line total, remove button). <!-- sdd-owner: implementation -->
- [x] T-9.7 — Create `src/componentes/organismos/pos/HeaderPos.tsx` (empresa.nombre, sucursal, caja label, Reloj). <!-- sdd-owner: implementation -->
- [x] T-9.8 — Create `src/componentes/organismos/pos/BuscadorList.tsx` (Input.Search → useBuscarProductosPosQuery, renders ProductGrid). <!-- sdd-owner: implementation -->
- [x] T-9.9 — Create `src/componentes/organismos/pos/AreaDetalleventaPos.tsx` (cart table: CartRow per item; wires useVentasStore.cart + useDetalleVentasStore; on qty change → editarcantidaddv RPC; on remove → removeItem). <!-- sdd-owner: implementation -->
- [x] T-9.10 — Create `src/componentes/organismos/pos/AreaTecladoPos.tsx` (numeric keypad, writes qty to selected cart row). <!-- sdd-owner: implementation -->
- [x] T-9.11 — Create `src/componentes/organismos/pos/FooterPos.tsx` ("Cobrar" → serialization check → open PantallaCobro; "Cancelar" → clearCart); wiring serialization blocking toast per design §8.4. <!-- sdd-owner: implementation -->
- [x] T-9.12 — Create `src/componentes/organismos/pos/PantallaCobro.tsx` (full overlay, lists metodos_pago, renders IngresoCobro per method, totalRecibido/vuelto display, "Confirmar pago" disabled if totalRecibido < total). <!-- sdd-owner: implementation -->
- [x] T-9.13 — Create `src/componentes/templates/PosLayout.tsx` (3-column responsive grid: BuscadorList | AreaDetalleventaPos+TotalPos | AreaTecladoPos; HeaderPos top; FooterPos bottom; wires PantallaCobro overlay). <!-- sdd-owner: implementation -->
- [x] T-9.14 — Create `src/componentes/paginas/PosPage.tsx` (orchestrates: calls useBuscarProductosPosQuery, useMetodosPagoQuery, useDefaultSerializacionQuery, useVentasStore reconciliation on mount; sale flow state machine per spec §4.F.5: IDLE → CART_BUILDING → COBRO → CONFIRMING → success/error; on confirmar_venta success: insert movimientos_caja per method, downloadTicket, clearCart, notify.success). <!-- sdd-owner: implementation -->

**Done for batch:** POS full sale flow works end-to-end; serialization block shows blocking toast; PDF downloads; cart persists across refresh; `tsc --noEmit` passes; zero Swal calls.

---

### Batch 10 — Verify (smoke test against live Supabase)

- [ ] T-10.1 — Create test empresa via Supabase dashboard (or SQL). Obtain test credentials. Fill `.env` with real anon key. <!-- sdd-owner: parent -->
- [ ] T-10.2 — Login flow: valid credentials → redirect to /dashboard. Invalid → toast. Unauthenticated /dashboard → redirect /login. <!-- sdd-owner: parent -->
- [ ] T-10.3 — Dashboard: verify 8 RPCs fire; date range presets refetch; % cambio badge correct; CardMovimientosCajaLive hidden when RPC fails. <!-- sdd-owner: parent -->
- [ ] T-10.4 — Productos: CRUD create → insertarproductos → table refreshes. Edit → editarproductos → table updates. Delete → constraint toast appears for FK-protected product. <!-- sdd-owner: parent -->
- [ ] T-10.5 — Categorías: CRUD create/edit → correct table update. <!-- sdd-owner: parent -->
- [ ] T-10.6 — POS: add product → venta row created + detalle inserted; quantity adjust → editarcantidaddv; Cobrar → serialization block toast when missing; payment → movements_caja inserted; confirmar_venta returns nro_comprobante; PDF downloads. <!-- sdd-owner: parent -->
- [ ] T-10.7 — Final: `tsc --noEmit` clean; grep -r "Swal" returns nothing; grep -r "index.ts" barrel returns nothing; all stores exactly 12 files. <!-- sdd-owner: parent -->

### Batch 11 — Verify-fix (CRITICAL RPC mismatches + WARNINGs)

This batch addresses the 5 CRITICAL and 5 WARNING RPC mismatches flagged by
`sdd-verify` against `~/supabase-backup-20260812.sql`. All ownership belongs
to `implementation` (Batch 6 of the `stacked-to-main` chain).

- [x] **T-11.1** (RPC-001) — Rewrite `setDefaultSerializacion` as a void mutation in `src/lib/rpc/ventas.ts` (matches SQL signature `_id` / `_id_sucursal`). Rewrite `useDefaultSerializacionQuery` in `src/hooks/useVentas.ts` to read directly via `supabase.from('serializacion_comprobantes').select().eq('id_empresa', id).eq('por_default', true).maybeSingle()`. <!-- sdd-owner: implementation -->
- [x] **T-11.2** (RPC-002) — Reshape `MovimientoCaja` in `src/types/rpc.ts` to `{ usuario_nombre, tipo_movimiento, monto, descripcion, fecha_movimiento, caja_nombre, sucursal_nombre, id }`. Update `CardMovimientosCajaLive.tsx` to render the new fields (parse `DD-MM-YYYY HH24:MI:SS` format, drop `metodo_pago_nombre` / `vuelto` / `id_usuario` references). <!-- sdd-owner: implementation -->
- [x] **T-11.3** (RPC-003) — Reshape `DashboardTopProducto` in `src/types/rpc.ts` to `{ id_producto, nombre_producto, total_vendido, porcentaje }`. Update `CardProductosTopMonto.tsx` to display `nombre_producto` + `porcentaje`. <!-- sdd-owner: implementation -->
- [x] **T-11.4** (RPC-004) — Reshape `DashboardCajaSucursal` in `src/types/rpc.ts` to `{ sucursal_nombre, caja_descripcion, fecha_creacion, total_ventas, estadocaja, direccionfiscal, idcaja, idsucursal, delete }`. Update `CardCajasSucursales.tsx` to display the joined names + `total_ventas` + `estadocaja` (mapped to a Tag). <!-- sdd-owner: implementation -->
- [x] **T-11.5** (RPC-005) — Reshape `DashboardMetodoPago` in `src/types/rpc.ts` to `{ fecha, metodo_pago, total_ventas }`. Update `CardMetodosPago.tsx` to roll up by `metodo_pago` (the RPC returns one row per (fecha, metodo_pago); the pie visualises aggregate sales per method). <!-- sdd-owner: implementation -->
- [x] **T-11.6** (RPC-007, D10) — Switch `BuscadorList` in the POS to use `useProductosQuery(idEmpresa, trimmed)` (which calls `mostrarproductos(_id_empresa, _buscador)` — 2-parameter overload, returns SETOF productos with native columns) instead of `useBuscarProductosQuery` (`buscarproductos`, which returns the joined table with `p_venta`/`p_compra` as formatted text). <!-- sdd-owner: implementation -->
- [x] **T-11.7** (RPC-010) — Change `Empresa.impuesto` from `number` to `string` in `src/types/rpc.ts` (backend column is `text`; the numeric rate is in `valor_impuesto`). <!-- sdd-owner: implementation -->
- [x] **T-11.8** — Verify `npm run build` (tsc -b && vite build) passes with zero errors; re-run forbidden-pattern guards (no Swal, no barrel index.ts, no `any` at boundaries, no `as unknown as` in code, no `@ts-ignore`). <!-- sdd-owner: implementation -->

**Done for batch:** All acceptance criteria from spec §7 pass against live Supabase. Phase status → ARCHIVED.

---


### Batch 12 — Configuración (índice + métodos de pago + clientes / proveedores)

This batch ships the third quadrant of the Configuración menu: the index
page (`/configuracion`), the Métodos de pago CRUD, and the Clientes /
Proveedores CRUD. All ownership belongs to `implementation` (Batch 8 of
the `stacked-to-main` chain — `Tanda 7`).

- [x] **T-12.1** — Add `ClienteProveedor` interface + `Insert/EditClienteProveedorParams` to `src/types/rpc.ts`. Add `ClientesProveedoresStore` interface to `src/types/store.ts`. Extend `qk` factory with `clientesProveedores.list/all` keys. <!-- sdd-owner: implementation -->
- [x] **T-12.2** — Create `src/lib/rpc/clientes.ts` with `insertarClientesProveedores` + `editarClientesProveedores` wrappers (signatures verified against `~/supabase-backup-20260812.sql` lines 1382-1397 + 1649-1666; both return `void`). <!-- sdd-owner: implementation -->
- [x] **T-12.3** — Create `src/stores/useClientesProveedoresStore.ts` (UI state only: `selected` + `setSelected`, follows the `useCategoriasStore` convention). <!-- sdd-owner: implementation -->
- [x] **T-12.4** — Extend `src/hooks/useMetodosPago.ts` with `useInsertarMetodoPagoMutation`, `useEditarMetodoPagoMutation`, `useEliminarMetodoPagoMutation` (direct `.from('metodos_pago').insert/update/delete()` per spec; FK from `movimientos_caja` surfaces Postgres 23503 as a Spanish toast). <!-- sdd-owner: implementation -->
- [x] **T-12.5** — Create `src/hooks/useClientesProveedores.ts` with `useClientesProveedoresQuery(idEmpresa, tipo)` (reads via `.from('clientes_proveedores').select('*').eq('id_empresa').eq('tipo')`), `useInsertarClienteProveedorMutation`, `useEditarClienteProveedorMutation` (via the new RPC wrappers), `useEliminarClienteProveedorMutation` (via `.from().delete()`; FK from `ventas.id_cliente` surfaces 23503 as Spanish toast). <!-- sdd-owner: implementation -->
- [x] **T-12.6** — Create `src/componentes/moleculas/EliminarRegistroBtn.tsx` (generic Popconfirm wrapper; takes `nombreEntidad` + `registroNombre` + `isLoading` + `onConfirm`; replaces the need for entity-specific delete molecules). <!-- sdd-owner: implementation -->
- [x] **T-12.7** — Create `src/componentes/organismos/tablas/TablaMetodosPago.tsx` (paginated AntD Table; columns: Nombre / Icono (Tag) / Ver nombre (Switch indicator) / Acciones (edit + delete); uses `EliminarRegistroBtn` with `nombreEntidad="método de pago"`). <!-- sdd-owner: implementation -->
- [x] **T-12.8** — Create `src/componentes/organismos/formularios/RegistrarMetodoPago.tsx` (AntD Modal + react-hook-form; fields: nombre max 100, icono max 200, ver_nombre Switch; insert/update mutations wired; Spanish validation). <!-- sdd-owner: implementation -->
- [x] **T-12.9** — Create `src/componentes/templates/MetodosPagoTemplate.tsx` + `src/componentes/paginas/MetodosPagoPage.tsx` (mirrors Categorías pattern: toolbar with "Nuevo método de pago" + TablaMetodosPago + centered Spin flicker guard + soft Alert + RegistrarMetodoPago modal). <!-- sdd-owner: implementation -->
- [x] **T-12.10** — Create `src/componentes/organismos/tablas/TablaClientesProveedores.tsx` (paginated AntD Table; columns: Nombre / Identificador nacional / Identificador fiscal / Teléfono / Email / Estado (Tag green='activo') / Acciones (edit + delete); uses `EliminarRegistroBtn` with `nombreEntidad={tipo}`). <!-- sdd-owner: implementation -->
- [x] **T-12.11** — Create `src/componentes/organismos/formularios/RegistrarClientesProveedores.tsx` (AntD Modal + react-hook-form; `tipo` prop drives icon + title; fields: nombres max 200 + identificador nacional/fiscal max 50 + dirección max 200 + teléfono max 50 + email max 100 with regex validation; empty string coerces to '-' to match SQL defaults). <!-- sdd-owner: implementation -->
- [x] **T-12.12** — Create `src/componentes/templates/ClientesProveedoresTemplate.tsx` (shared layout for both Clientes and Proveedores screens; `tipo` prop drives button label + table copy). <!-- sdd-owner: implementation -->
- [x] **T-12.13** — Create `src/componentes/paginas/ClientesProveedoresPage.tsx` (orchestrator; owns query + modal + delete mutation + flicker guard + soft Alert). Create `ClientesPage.tsx` and `ProveedoresPage.tsx` as thin wrappers with `tipo='cliente'` / `tipo='proveedor'`. <!-- sdd-owner: implementation -->
- [x] **T-12.14** — Create `src/componentes/atomos/ConfiguracionCard.tsx` (AntD Card + optional React Router `<Link>` wrapper; renders icon + title + description + optional "Próximamente" badge; disabled state for post-MVP modules). <!-- sdd-owner: implementation -->
- [x] **T-12.15** — Create `src/componentes/templates/ConfigTemplate.tsx` (responsive AntD `<Row>/<Col>` grid `xs={24} sm={12} md={8} lg={6}`) + `src/componentes/paginas/ConfigPage.tsx` (12 modules: Categorías, Productos, Métodos de pago, Clientes, Proveedores — wired; Sucursales y cajas, Usuarios, Almacenes, Empresa, Ticket, Serialización, Impresoras — disabled "Próximamente"). <!-- sdd-owner: implementation -->
- [x] **T-12.16** — Update `src/App.tsx` to add routes for `/configuracion`, `/configuracion/metodospago`, `/configuracion/clientes`, `/configuracion/proveedores` under the protected ShellLayout subtree. Update `src/componentes/organismos/sidebar/Sidebar.tsx` to replace the per-page entries (Productos / Categorías) with a single "Configuración" entry that links to `/configuracion` (FiSettings icon). <!-- sdd-owner: implementation -->
- [x] **T-12.17** — Verify `npm run build` (`tsc -b && vite build`) passes with zero errors. Verify dev server returns HTTP 200 on `/configuracion`, `/configuracion/metodospago`, `/configuracion/clientes`, `/configuracion/proveedores`. Re-run forbidden-pattern guards (no Swal, no barrel index.ts, no `any` at boundaries, no `as unknown as` in code, no `@ts-ignore`, no `console.log` in new files). <!-- sdd-owner: implementation -->

**Done for batch:** The `/configuracion` grid renders all 12 module tiles (5 wired, 7 disabled with "Próximamente" badge). Métodos de pago CRUD creates / edits / deletes with Spanish toasts; FK violations from `movimientos_caja` surface as a Spanish toast. Clientes / Proveedores CRUD filters by `tipo` and shares one template; FK violations from `ventas.id_cliente` surface as a Spanish toast. `tsc --noEmit`: 0 errors; `npm run build`: 4 337 kB / 1 722 kB gz; all routes 200 OK in dev server.

---

### Batch 13 — Configuración (sucursales/cajas + almacenes + empresa)

This batch ships the next quadrant of the Configuración menu: Sucursales y
Cajas, Almacenes, and Empresa. All ownership belongs to `implementation`
(Batch 9 of the `stacked-to-main` chain — `Tanda 8`).

SQL contracts verified line-by-line against `~/supabase-backup-20260812.sql`:

- `sucursales` (lines 5727-5741): `id bigint, nombre text, direccion_fiscal
  text, id_empresa bigint, delete boolean DEFAULT true`. **No RPC wrappers
  in the spec catalog**; reads + writes go through direct
  `.from('sucursales').select/insert/update/delete()`.

- `caja` (lines 5209-5226): `id bigint, descripcion text NOT NULL,
  id_sucursal bigint, fecha_creacion timestamp DEFAULT now(), delete boolean
  DEFAULT true, print boolean DEFAULT false`. Same — direct table access.

- `almacen` (lines 5155-5177): `id bigint, id_sucursal bigint NOT NULL,
  fecha_creacion timestamp DEFAULT now(), delete boolean DEFAULT true,
  nombre text, "default" boolean DEFAULT true`. The SQL column is the
  reserved word `default`; we expose it as `Almacen.default` and never
  destructure (always read via `row.default` / `row['default']`).

- `empresa` (lines 2046-2060): full row confirmed. The Empresa page uses
  the RPC `mostrarempresaxiduser(_id_usuario integer) RETURNS TABLE(result
  public.empresa)` (line 2070) to fetch the canonical row, and writes via
  `.from('empresa').update().eq('id', id)`. No `insertar/editar/eliminar`
  RPC exists for `empresa`.

- `mostrarempresaxiduser` parameter: `_id_usuario integer` (no `p_` prefix).
  Returns `[{ result: Empresa }]`.

- `asignacion_sucursal` (lines 5183-5195): not read/written directly — it's
  the user→sucursal→caja join used by `mostrarsucursalesasignadas` /
  `mostrarcajasasignadas` (out of scope for this batch).

- [x] **T-13.1** — Extend `src/types/rpc.ts` with `Sucursal`, `Caja`,
      `Almacen` interfaces matching the SQL columns above.
      `Almacen.default` is exposed under that exact name (reserved word
      caveat documented inline). <!-- sdd-owner: implementation -->

- [x] **T-13.2** — Create `src/stores/useSucursalesStore.ts`
      (`selected: Sucursal | null`, `tabActiva: 'sucursales' | 'cajas'`,
      `setSelected`, `setTabActiva`). Create
      `src/stores/useCajasStore.ts` (UI state only). Create
      `src/stores/useAlmacenesStore.ts` (UI state only). All three follow
      the CategoríasStore convention (canonical list lives in react-query;
      stores hold only UI state). <!-- sdd-owner: implementation -->

- [x] **T-13.3** — Extend `src/lib/queryKeys.ts` with `qk.sucursales`
      (`list(idEmpresa)` + `all(idEmpresa)`), `qk.cajas` (`list(idEmpresa)`
      + `all(idEmpresa)`), `qk.almacenes` (`list(idEmpresa)` +
      `all(idEmpresa)`), and `qk.empresa.porUsuario(idUsuario)`. <!-- sdd-owner: implementation -->

- [x] **T-13.4** — Extend `src/lib/rpc/auth.ts` with
      `mostrarEmpresaXIdUser(idUsuario: number): Promise<Empresa>`. The
      wrapper calls `supabase.rpc('mostrarempresaxiduser', { _id_usuario:
      idUsuario })`, coerces the `[{ result: Empresa }]` row, and throws
      `RpcError('No se encontró la empresa', 'mostrarempresaxiduser')` on
      an empty result set. <!-- sdd-owner: implementation -->

- [x] **T-13.5** — Create `src/hooks/useSucursales.ts`
      (`useSucursalesQuery(idEmpresa)` reads via
      `.from('sucursales').select('*')`; three mutations: insert/update/
      delete via direct `.from('sucursales')`). 23503 → Spanish toast
      ("la sucursal tiene cajas, almacenes o ventas vinculadas"). Create
      `src/hooks/useCajas.ts` (`useCajasQuery(idEmpresa, idSucursales)`
      reads `.from('caja').select('*').in('id_sucursal', ...)`; three
      mutations; 23503 → "la caja tiene movimientos o asignaciones
      vinculadas"). Create `src/hooks/useAlmacenes.ts` (`useAlmacenesQuery`
      mirrors `useCajasQuery` shape; three mutations; 23503 → "el almacén
      tiene productos o ventas vinculadas"). All mutations invalidate
      `qk.<domain>.all(idEmpresa)` on success. <!-- sdd-owner: implementation -->

- [x] **T-13.6** — Create `src/hooks/useEmpresa.ts`
      (`useEmpresaPorUsuarioQuery(idUsuario)` calls the new RPC and
      commits to `useEmpresaStore`; `useEditarEmpresaMutation(idUsuario)`
      writes via `.from('empresa').update()`; `useSubirLogoEmpresaMutation`
      uploads to bucket `imagenes` at path `empresa/{id}/{ts}-{file}` and
      returns `{ path, publicUrl }`). <!-- sdd-owner: implementation -->

- [x] **T-13.7** — Create `TablaSucursales.tsx` (columns Nombre /
      Dirección fiscal (em-dash on '-') / Acciones (edit + delete via
      `EliminarRegistroBtn`)). Create `RegistrarSucursal.tsx` (AntD Modal
      + react-hook-form; nombre max 200, direccion_fiscal max 200, empty
      → '-'). Spanish validation. <!-- sdd-owner: implementation -->

- [x] **T-13.8** — Create `TablaCajas.tsx` (columns Descripción / Sucursal
      (Tag with joined sucursal label) / Imprime (Tag) / Acciones (edit +
      delete via `EliminarRegistroBtn`)). Create `RegistrarCaja.tsx`
      (AntD Modal + react-hook-form; descripcion max 200, id_sucursal
      required `<Select>` populated from the page's cached sucursales). <!-- sdd-owner: implementation -->

- [x] **T-13.9** — Create `SucursalesCajasTemplate.tsx` (AntD `<Tabs>`
      with two panels: Sucursales + Cajas) +
      `src/componentes/paginas/SucursalesCajasPage.tsx` (full rewrite:
      owns `useSucursalesQuery` + `useCajasQuery(idEmpresa, idSucursales)`
      + the active-tab key via `useSucursalesStore.tabActiva` + the two
      modal stacks + the centered Spin flicker guard while `idEmpresa <=
      0`). <!-- sdd-owner: implementation -->

- [x] **T-13.10** — Create `TablaAlmacenes.tsx` (columns Nombre / Sucursal
      (Tag) / Predeterminado (Tag green/default) / Acciones (edit + delete
      via `EliminarRegistroBtn`)). Create `RegistrarAlmacen.tsx` (AntD
      Modal + react-hook-form; nombre max 200, id_sucursal required
      `<Select>`, esDefault `<Switch>`; SQL `default` ↔ TS `esDefault`
      mapping at the boundary). <!-- sdd-owner: implementation -->

- [x] **T-13.11** — Create `AlmacenesTemplate.tsx` (toolbar "Nuevo
      almacén" + table) + `src/componentes/paginas/AlmacenesPage.tsx`
      (full rewrite: owns `useSucursalesQuery` for the options,
      `useAlmacenesQuery(idEmpresa, idSucursales)`, modal state via
      `useAlmacenesStore.selected`, centered Spin flicker guard). <!-- sdd-owner: implementation -->

- [x] **T-13.12** — Create `RegistrarEmpresa.tsx` (AntD Modal +
      react-hook-form; sections: Datos básicos + Moneda/impuesto + Logo
      upload to bucket `imagenes` at `empresa/{id}/{ts}-{file}` with
      `useSubirLogoEmpresaMutation`; the form commits to
      `useEditarEmpresaMutation` which writes via
      `.from('empresa').update()`). Spanish validation. Permissive email
      regex. `valor_impuesto` is an `<InputNumber min=0 max=100>` and is
      coerced to `Number(...)` at submit. <!-- sdd-owner: implementation -->

- [x] **T-13.13** — Create `EmpresaTemplate.tsx` (AntD Descriptions card:
      logo header + Datos básicos + Moneda e impuesto; `Editar` button
      forwards to the page's modal). Create
      `src/componentes/paginas/EmpresaPage.tsx` (full rewrite: owns
      `useEmpresaPorUsuarioQuery(idUsuario)`, modal state, soft Alert
      while `idUsuario <= 0`, centered Spin flicker guard while
      `idEmpresa <= 0`). <!-- sdd-owner: implementation -->

- [x] **T-13.14** — Update `src/App.tsx`: 3 new routes
      `/configuracion/sucursalcaja`, `/configuracion/almacenes`,
      `/configuracion/empresa` under the `ProtectedRoute → ShellLayout`
      subtree. Update `src/componentes/paginas/ConfigPage.tsx`: remove
      "Próximamente" from the 3 corresponding tiles and wire their `to`
      props. <!-- sdd-owner: implementation -->

- [x] **T-13.15** — Verify `npm run build` (`tsc -b && vite build`) passes
      with zero errors. Verify dev server returns HTTP 200 on the 3 new
      routes + the existing `/configuracion` index (regression sanity).
      Re-run forbidden-pattern guards (no Swal, no barrel `index.ts`, no
      `any` at boundaries, no `as unknown as` in code, no `@ts-ignore`,
      no `console.log` in new files). <!-- sdd-owner: implementation -->

**Done for batch:** `/configuracion/sucursalcaja` shows the two-tab layout
with sucursales CRUD + cajas CRUD (cajas require an existing sucursal).
`/configuracion/almacenes` shows the almacenes CRUD (almacenes require an
existing sucursal; the SQL `"default"` column maps to `esDefault` in the
form). `/configuracion/empresa` shows a read-only summary + an edit modal
that pulls the canonical row via `mostrarempresaxiduser` and writes via
`.from('empresa').update()`; logo uploads to bucket `imagenes` at
`empresa/{id}/{ts}-{file}`. `tsc --noEmit`: 0 errors; `npm run build`:
4 381 kB / 1 728 kB gz; all routes 200 OK in dev server.

---

### Batch 14 — Configuración (usuarios/empleados + ticket + serialización + impresoras)

This batch ships the last quadrant of the Configuración menu: Usuarios
(empleados), Ticket, Serialización e Impresoras. All ownership belongs to
`implementation` (Batch 10 of the `stacked-to-main` chain — `Tanda 9`).

SQL contracts verified line-by-line against `~/supabase-backup-20260812.sql`:

- `usuarios` (line 5804): `id bigint, nombres text, id_tipodocumento bigint,
  nro_doc text, telefono text, id_rol bigint, correo text, fecharegistro
  date, estado text, id_auth text, tema text`. Contains the `id_auth` column
  that links the application row to the `auth.users` row created by
  `crearcredencialesuser`.

- `roles` (line 5646): `id bigint, nombre text`. Direct table read for the
  `id_rol` `<Select>` in `RegistrarUsuario`.

- `tipodocumento` (line 5779): `id bigint, nombre text, id_empresa bigint`.
  Direct table read for the `id_tipodocumento` `<Select>` (filtered by
  `id_empresa IS NULL OR id_empresa = X` so global types are visible).

- `asignacion_sucursal` (line 5183): `id bigint, id_sucursal bigint,
  id_usuario bigint, id_caja bigint`. Read indirectly via the join in
  `mostrarusuariosasignados` / `buscarusuariosasignados`. **Direct
  write is OUT of scope for MVP** per the user instruction.

- `mostrarusuariosasignados(_id_empresa integer)` (line 2318) — RETURNS
  TABLE(id_asignacion, id_usuario, usuario, sucursal, caja, rol, email,
  estadouser, id_rol, nro_doc, telefono). No `p_` prefix.

- `buscarusuariosasignados(_id_empresa integer, buscador text)` (line
  892) — same columns, filtered by `LIKE '%nombre%'`. No `p_` prefix.

- `crearcredencialesuser(email text, pass text)` (line 991) — RETURNS
  uuid. **No leading underscore on the param names** (matches the SQL
  declaration exactly). The wrapper returns the new `auth.users.id`; the
  caller is responsible for the follow-up `.from('usuarios').insert()`
  with `id_auth = <uuid>`.

- `serializacion_comprobantes` (line 5670): `id bigint,
  id_tipo_comprobante bigint, serie text, cantidad_numeros bigint,
  correlativo bigint, sucursal_id bigint, por_default boolean`. The
  `id_empresa` column is **not** in the SQL contract — the table is
  filtered by `por_default = true` for the POS default lookup
  (`useDefaultSerializacionQuery` in `useVentas.ts`).

- `tipo_comprobantes` (line 5754): `id bigint, nombre text, destino text`.
  Direct table read for the `id_tipo_comprobante` `<Select>`.

- `setdefaultserializacion(_id integer, _id_sucursal integer)` (line
  2513) — RETURNS `void`. The wrapper in `src/lib/rpc/ventas.ts` already
  matches; this batch adds the `useSetDefaultSerializacionMutation` hook
  that calls it.

- `impresoras` (line 5375): `id bigint, id_caja bigint NOT NULL, pc_name
  text DEFAULT '-', ip_local text DEFAULT '-', state boolean DEFAULT
  false, name text DEFAULT '-'`. CRUD is direct table access.

- `empresa` (line 2046): the Ticket screen only edits `nombre`,
  `direccion_fiscal`, `simbolo_moneda`, `pie_pagina_ticket` via the new
  `useEditarTicketMutation` (subset of `useEmpresa.ts`).

- [x] **T-14.1** — Extend `src/types/rpc.ts` with `Rol`, `TipoDocumento`,
      `AsignacionUsuario`, `CrearEmpleadoArgs`, `Impresora`,
      `InsertImpresoraArgs`, `EditImpresoraArgs`. Verify line-by-line
      against `~/supabase-backup-20260812.sql`. <!-- sdd-owner: implementation -->

- [x] **T-14.2** — Extend `src/stores/useUsuariosStore.ts` with
      `selectedAsignacion: AsignacionUsuario | null` + `setSelectedAsignacion`
      (UI state only per design Dg3). Extend `src/types/store.ts` accordingly.
      <!-- sdd-owner: implementation -->

- [x] **T-14.3** — Extend `src/lib/queryKeys.ts` with
      `qk.serializacion.list/all`, `qk.tipoComprobante.list`,
      `qk.tipoDocumento.list`, `qk.roles.list`, `qk.usuarios.list/buscar/all`,
      `qk.impresoras.list/all`. <!-- sdd-owner: implementation -->

- [x] **T-14.4** — Create `src/lib/rpc/usuarios.ts` with
      `mostrarUsuariosAsignados`, `buscarUsuariosAsignados`,
      `crearCredencialesUser`. All wrappers route errors through
      `throwRpcError` + `RpcError`. Param names: `_id_empresa`, `buscador`,
      `email`, `pass` — verified line-by-line.
      <!-- sdd-owner: implementation -->

- [x] **T-14.5** — Create `src/hooks/useUsuarios.ts` with
      `useUsuariosQuery(idEmpresa)` (via `mostrarusuariosasignados`),
      `useBuscarUsuariosQuery(idEmpresa, buscador)` (via
      `buscarusuariosasignados`, empty-buscador short-circuits to `[]`),
      `useRolesQuery()`, `useTipoDocumentoQuery(idEmpresa)`, and
      `useCrearEmpleadoMutation(idEmpresa)` (two-step: `crearcredencialesuser`
      + `.from('usuarios').insert()`). Errors surface via `notifyRpcError`.
      <!-- sdd-owner: implementation -->

- [x] **T-14.6** — Create `src/hooks/useSerializacion.ts` with
      `useSerializacionQuery(idEmpresa)`, `useTipoComprobanteQuery(idEmpresa)`,
      `useInsertarSerializacionMutation(idEmpresa)`,
      `useEditarSerializacionMutation(idEmpresa)`,
      `useEliminarSerializacionMutation(idEmpresa)` (23503 → "vinculada a
      ventas"), and `useSetDefaultSerializacionMutation(idEmpresa)` (calls
      the existing `setDefaultSerializacion` wrapper in `src/lib/rpc/ventas.ts`).
      <!-- sdd-owner: implementation -->

- [x] **T-14.7** — Create `src/hooks/useImpresoras.ts` with
      `useImpresorasQuery(idEmpresa)` (direct `.from('impresoras').select()`),
      `useInsertarImpresoraMutation`, `useEditarImpresoraMutation`,
      `useEliminarImpresoraMutation` (23503 → "vinculada a ventas").
      <!-- sdd-owner: implementation -->

- [x] **T-14.8** — Extend `src/hooks/useEmpresa.ts` with
      `useEditarTicketMutation(idUsuario)` (writes only the four
      ticket-relevant fields: `nombre`, `direccion_fiscal`,
      `simbolo_moneda`, `pie_pagina_ticket` via `.from('empresa').update()`
      and patches the session store optimistically).
      <!-- sdd-owner: implementation -->

- [x] **T-14.9** — Create `src/componentes/moleculas/BuscadorUsuarios.tsx`
      (presentational AntD `<Input>` with `prefix={<FiSearch />}` + `allowClear`).
      Create `src/componentes/organismos/tablas/TablaUsuarios.tsx` (AntD
      Table — columns Empleado / Email / Sucursal / Caja / Rol / Estado /
      Documento / Teléfono; pagination 10/20/50).
      <!-- sdd-owner: implementation -->

- [x] **T-14.10** — Create `src/componentes/organismos/formularios/
      RegistrarUsuario.tsx` (AntD Modal + react-hook-form). Fields: nombres
      (max 200), email (regex), password + confirm (min 6 chars),
      id_tipodocumento (Select from `useTipoDocumentoQuery`),
      id_rol (Select from `useRolesQuery`, required), nro_doc (max 50),
      telefono (max 50). Empty optional strings coerce to `'-'`. The
      assistant-style Alert surfaces the "asignación a sucursal/caja es
      post-MVP" caveat. Spanish validation messages.
      <!-- sdd-owner: implementation -->

- [x] **T-14.11** — Create `src/componentes/templates/UsuariosTemplate.tsx`
      (toolbar with `BuscadorUsuarios` + "Nuevo empleado" button + the table).
      Create `src/componentes/paginas/UsuariosPage.tsx` (full rewrite; owns
      `useUsuariosQuery` / `useBuscarUsuariosQuery` with a 300 ms debounce
      mirror; centered Spin flicker guard while `idEmpresa <= 0`; soft
      Alert describing the screen and the post-MVP assignation caveat).
      <!-- sdd-owner: implementation -->

- [x] **T-14.12** — Create `src/componentes/organismos/formularios/
      RegistrarTicket.tsx` (AntD Modal + react-hook-form). Fields: nombre
      (max 200, required), direccion_fiscal (max 200, optional, empty →
      `'-'`), simbolo_moneda (max 10, required), pie_pagina_ticket (max
      200, optional, empty → `'-'`; handles the `null` SQL case).
      Create `src/componentes/templates/TicketTemplate.tsx` (AntD
      `<Descriptions>` card with "Editar" button).
      Create `src/componentes/paginas/TicketPage.tsx` (full rewrite; owns
      `useEmpresaPorUsuarioQuery(idUsuario)` + modal state + soft Alert
      when `idUsuario <= 0` + centered Spin guard when `idEmpresa <= 0`).
      <!-- sdd-owner: implementation -->

- [x] **T-14.13** — Create `src/componentes/organismos/tablas/
      TablaSerializacion.tsx` (AntD Table — columns Tipo de comprobante /
      Serie / Cantidad de números / Correlativo / Sucursal / Predeterminado
      (Tag green if `por_default`) / Acciones (Edit + "Set default" +
      `EliminarRegistroBtn`). The "Set default" button is hidden when the
      row is already default; it shows a `<Spin>` while the mutation is
      pending). Create `src/componentes/organismos/formularios/
      RegistrarSerializacion.tsx` (AntD Modal + react-hook-form). Fields:
      id_tipo_comprobante (Select from `useTipoComprobanteQuery`),
      serie (max 20, optional), cantidad_numeros (InputNumber ≥ 1),
      correlativo (InputNumber ≥ 0), sucursal_id (Select from
      `useSucursalesQuery`, required), por_default (Switch).
      <!-- sdd-owner: implementation -->

- [x] **T-14.14** — Create `src/componentes/templates/SerializacionTemplate.tsx`
      (toolbar "Nueva serialización" + `TablaSerializacion`).
      Create `src/componentes/paginas/SerializacionPage.tsx` (full rewrite;
      owns `useSerializacionQuery` + `useTipoComprobanteQuery` +
      modal open/editing state + delete + set-default handlers + centered
      Spin flicker guard).
      <!-- sdd-owner: implementation -->

- [x] **T-14.15** — Create `src/componentes/organismos/tablas/
      TablaImpresoras.tsx` (AntD Table — columns Caja / Nombre / PC /
      IP local / Estado (read-only `<Switch>` indicator) / Acciones
      (Edit + `EliminarRegistroBtn`)). Create `src/componentes/organismos
      /formularios/RegistrarImpresora.tsx` (AntD Modal + react-hook-form).
      Fields: id_caja (Select from `useCajasQuery`, required), name (max
      100, optional, empty → `'-'`), pc_name (max 100, optional, empty → `'-'`),
      ip_local (max 50, optional, empty → `'-'`), state (Switch).
      <!-- sdd-owner: implementation -->

- [x] **T-14.16** — Create `src/componentes/templates/ImpresorasTemplate.tsx`
      (toolbar "Nueva impresora" + `TablaImpresoras`). Create
      `src/componentes/paginas/ImpresorasPage.tsx` (full rewrite; owns
      `useSucursalesQuery` + `useCajasQuery(idEmpresa, idSucursales)` +
      `useImpresorasQuery` + modal open/editing state + delete handler +
      centered Spin flicker guard).
      <!-- sdd-owner: implementation -->

- [x] **T-14.17** — Update `src/App.tsx`: 4 new routes
      `/configuracion/usuarios`, `/configuracion/ticket`,
      `/configuracion/serializacion`, `/configuracion/impresoras` under
      the `ProtectedRoute → ShellLayout` subtree. Update
      `src/componentes/paginas/ConfigPage.tsx`: remove the "Próximamente"
      badge from the 4 corresponding tiles and wire their `to` props.
      <!-- sdd-owner: implementation -->

- [x] **T-14.18** — Verify `npm run build` (`tsc -b && vite build`) passes
      with zero errors. Verify dev server returns HTTP 200 on the 4 new
      routes + the existing `/configuracion` index (regression sanity).
      Re-run forbidden-pattern guards (no Swal, no barrel `index.ts`, no
      `any` at boundaries, no `as unknown as` in code, no `@ts-ignore`,
      no `console.log` in new files).
      <!-- sdd-owner: implementation -->

**Done for batch:** `/configuracion/usuarios` shows the joined
`asignacion_sucursal ⨝ usuarios ⨝ sucursal ⨝ caja ⨝ roles` rows
(loaded via `mostrarusuariosasignados`) with a debounced search toggle
to `buscarusuariosasignados`; the "Nuevo empleado" modal calls
`crearcredencialesuser` (which returns the new `auth.users.id`) and
then inserts a row in `public.usuarios` with `id_auth` linked. Sucursal
& caja assignation is intentionally out of MVP scope. `/configuracion/ticket`
edits the four ticket-relevant fields of the `empresa` row. `/configuracion/
serializacion` lists + creates + edits + deletes `serializacion_comprobantes`
rows with a "Set default" verb that calls the `setdefaultserializacion` RPC.
`/configuracion/impresoras` lists the `impresoras` table with create/edit/
delete via direct `.from(...)` operations. `tsc --noEmit`: 0 errors;
`npm run build`: 4 416 kB / 1 735 kB gz; all routes 200 OK in dev server.

---

## Dependency Graph (DAG)

```
[T-1.* Batch 1: Scaffold]
           │
           ▼
[T-2.* Batch 2: Types + RPCs]
           │
           ▼
[T-3.* Batch 3: Stores + Hooks]          ←─── parallel: no cross-batch imports until here
           │
     ┌─────┴──────────────────────────┐
     ▼                               ▼
[T-4.* Batch 4: Auth]        [T-5.* Batch 5: Shell]
     │                               │
     └───────────────┬───────────────┘
                     ▼
           [T-6.* Batch 6: Dashboard]
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
  [T-7.* Batch 7: Productos]  [T-8.* Batch 8: Categorías]
           │                   │
           └─────────┬─────────┘
                     ▼
          [T-9.* Batch 9: POS]
                     │
                     ▼
          [T-10.* Batch 10: Verify]
```

---

## Forbidden Patterns (enforced in every PR)

- `Swal.fire()` → BLOCKER
- `index.ts` barrel re-export → BLOCKER
- `any` on RPC wrapper return or store state → BLOCKER
- Server rows mirrored into stores (except session identity) → BLOCKER
- Component below Molecule calling `useQuery` → BLOCKER
- `@ts-ignore` or `as unknown as` chains → BLOCKER
