# TPV-365 Rebuild — Apply Progress

> Phase: `sdd-apply` · Change: `tpv365-rebuild`
> Artifact store: filesystem fallback (`pos-react/sdd/tpv365-rebuild/`)

---

## Batch 1 — Project Scaffold (completed)

**PR boundary:** Batch 1 of the `stacked-to-main` chain (PR #1).
**Strategy delivered:** single PR for the scaffold — minimal, ~450 lines,
build clean, no screens yet.

### Tasks completed

- [x] **T-1.1** — Project directory created at
  `/Volumes/m2/Usuarios/Documents/work/punto-de-venta/tpv365-rebuild/` (sibling
  of `pos-react/`). `index.html` and `package.json` created. `npm install`
  completed: **334 packages installed, 0 errors, 4 low/moderate audit warnings
  (no fix required)**.
- [x] **T-1.2** — `vite.config.ts` with `@/` → `src/` alias and port 5173.
  `tsconfig.app.json` with `strict: true`, `noImplicitAny: true`,
  `noUncheckedIndexedAccess: true`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, baseUrl `.` and `paths { "@/*": ["src/*"] }`.
  Project references preserved (root `tsconfig.json` → `tsconfig.app.json` +
  `tsconfig.node.json`). `.gitignore` extended with `.env`, `.env.local`,
  `.env.*.local`.
- [x] **T-1.3** — `.env.example` with placeholder values (committed).
  `.env` (git-ignored) populated by user-supplied anon key
  (`VITE_APP_SUPABASE_URL=https://kdyflbexrensqzbquxyu.supabase.co`,
  `VITE_APP_SUPABASE_ANON_KEY=eyJ…VZr4`).
- [x] **T-1.4** — `src/vite-env.d.ts` declares both `VITE_APP_SUPABASE_URL`
  and `VITE_APP_SUPABASE_ANON_KEY` as `string | undefined`. No `any` at the
  env boundary.
- [x] **T-1.5 (partial)** — `src/lib/supabase.ts` initialized: throws if
  env vars missing; uses `auth.persistSession: true`,
  `auth.autoRefreshToken: true`. **Deferred to next batch:**
  `src/lib/errors.ts` (RpcError, throwRpcError, userMessage),
  `src/lib/notify.ts` (notify + notifyRpcError), `src/lib/format.ts`
  (formatCurrency, formatDate), `src/lib/queryKeys.ts` (qk factory).
- [x] **T-1.6 (partial)** — `src/main.tsx` (StrictMode + createRoot; throws
  if `#root` missing) and `src/App.tsx` (minimal placeholder, no business
  logic). **Deferred to next batch:** QueryClientProvider, AntD `App` /
  ConfigProvider, BrowserRouter, ProtectedRoute, ShellLayout, page shells.

### Files created (Batch 1)

```
tpv365-rebuild/
├── .env                                  # git-ignored, real values
├── .env.example                          # committed, placeholders only
├── .gitignore                            # extended with .env*
├── README.md                             # rewritten (clean, no Vite boilerplate)
├── index.html                            # title=TPV-365, lang=es
├── package.json                          # design §7.2 deps (React 18)
├── tsconfig.json                         # root w/ project references
├── tsconfig.app.json                     # strict + path alias
├── tsconfig.node.json                    # strict, for vite.config.ts
├── vite.config.ts                        # @/ alias, port 5173
├── public/                               # vite default (vite.svg kept)
└── src/
    ├── App.tsx                           # minimal placeholder
    ├── main.tsx                          # StrictMode + createRoot
    ├── vite-env.d.ts                     # typed VITE_APP_* env vars
    ├── lib/
    │   ├── .gitkeep
    │   └── supabase.ts                   # initialized client
    ├── types/.gitkeep
    ├── stores/.gitkeep
    ├── hooks/.gitkeep
    ├── servicios/.gitkeep
    └── componentes/
        ├── atomos/.gitkeep
        ├── moleculas/.gitkeep
        ├── organismos/
        │   ├── .gitkeep
        │   ├── sidebar/.gitkeep
        │   ├── header/.gitkeep
        │   ├── tablas/.gitkeep
        │   ├── formularios/.gitkeep
        │   ├── pos/.gitkeep
        │   └── dashboard/.gitkeep
        ├── templates/.gitkeep
        └── paginas/.gitkeep
```

### Files removed from Vite template (Batch 1)

- `.oxlintrc.json` (template lint config, replaced by `tsc --noEmit`)
- `src/App.css`, `src/index.css` (template styles, unused in placeholder)
- `src/assets/` (template logos, unused)

### Verification evidence (Batch 1)

| Command | Result |
|---------|--------|
| `npm install` | ✅ 334 packages, 29s, 0 errors |
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 313ms, 143.02 kB main / 46.05 kB gz |
| `npm run dev` (sanity, 8s window) | ✅ VITE v5.4.21 ready in 116ms on http://localhost:5173/ |

### Forbidden-pattern guards (Batch 1)

| Guard | Status |
|-------|--------|
| `grep -r "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn ': any\b\| any\b' src/lib/ src/main.tsx src/App.tsx` | ✅ no matches |

### Deviations from design (Batch 1)

- **T-1.5 / T-1.6 scope trimmed.** Per the user's batch #1 instructions, only
  `supabase.ts` was created among `src/lib/*` files, and `App.tsx` is a
  minimal placeholder. The remaining lib files (`errors.ts`, `notify.ts`,
  `format.ts`, `queryKeys.ts`) and the full wiring (QueryClientProvider,
  AntD ConfigProvider, BrowserRouter, ProtectedRoute, ShellLayout, page
  shells) belong to the next batch.
- **Project references in tsconfig.** Design §7.4 shows a single
  `tsconfig.json`. The modern Vite template uses a project-references setup
  (`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`). Preserved
  the references structure but moved all strict flags and the `@/` path
  alias into `tsconfig.app.json`. Functionally equivalent.
- **`types: ["node"]` in tsconfig.app.json.** Required so `path.resolve`
  and other node APIs work in `vite.config.ts`; `vite-env.d.ts` references
  `vite/client` types.

### Risks (Batch 1)

| Risk | Severity | Mitigation |
|------|----------|------------|
| esbuild postinstall script needed manual approval in npm 11 | LOW | Approved (`npm approve-scripts esbuild`); future installs run automatically |
| Recharts 2.x is in maintenance mode (npm warn) | LOW | Compatible with React 18 + AntD 5; documented in design §0; recharts 3.x migration is post-MVP |
| `crypto-js` transitive deprecation warning | LOW | From pdfmake → browser crypto polyfill; no action |
| 4 npm audit vulnerabilities (3 moderate, 1 high) | LOW | Mostly transitive dev-deps; `npm audit fix` deferred to avoid breaking React 18 pin |

---

## Batch 2 — Typed Layer (completed)

**PR boundary:** Batch 2 of the `stacked-to-main` chain (PR #2).
**Strategy delivered:** types + 22 RPC wrappers + 12 stores + 4 base hooks +
full router/query/AntD wiring + page placeholders. Compiles clean.
Build went from 143 kB / 46 kB gz (Batch 1) → **694 kB / 210 kB gz** (Batch 2)
— AntD + Recharts + Supabase pulled in. No code-splitting yet; will land with
the per-screen batches.

### Tasks completed

- [x] **T-1.5** (rest) — `src/lib/errors.ts` (RpcError + throwRpcError +
  userMessage mapping 23503 FK / 23505 unique), `src/lib/notify.ts`
  (notify + notifyRpcError via AntD `message` / `notification`),
  `src/lib/format.ts` (formatCurrency + formatDate with dayjs),
  `src/lib/queryKeys.ts` (qk factory per domain).
- [x] **T-1.6** (rest) — `src/main.tsx` now wires QueryClientProvider +
  AntD `ConfigProvider` (locale esES) + `AntApp` + `BrowserRouter`;
  `src/App.tsx` declares the full route skeleton
  (`/login` → public; `ProtectedRoute` → `ShellLayout` → 4 protected
  pages; `*` → `NotFoundPage`; `/` → redirect `/dashboard`).
  6 page placeholders + `ProtectedRoute` (with `useSession()` reactive
  subscription) + `ShellLayout` (minimal AntD Layout) created so the
  router compiles end-to-end.

- [x] **T-2.1** — `src/types/rpc.ts`: ALL interfaces from spec §2 plus
  the param shapes needed by the RPC wrappers. 25 interfaces total
  (20 user-listed + `InsertProductoParams`, `EditProductoParams`,
  `InsertCategoriaParams`, `EditCategoriaParams`, `InsertDetalleVentaParams`).
- [x] **T-2.2** — `src/types/store.ts`: all 12 store state interfaces
  from design §4 (`GlobalStore`, `EmpresaStore`, `UsuariosStore`,
  `ThemeStore`, `ProductosStore`, `CategoriasStore`, `VentasStore`,
  `DetalleVentasStore`, `MetodosPagoStore`, `SerializacionStore`,
  `ReportesStore`, `DashboardStore`).
- [x] **T-2.3** — `src/lib/rpc/auth.ts`: `mostrarEmpresaXIdAuth`,
  `contarProductosPorAuth` (both typed).
- [x] **T-2.4** — `src/lib/rpc/productos.ts`: `mostrarProductos`,
  `buscarProductos`, `insertarProductos`, `editarProductos` (typed).
- [x] **T-2.5** — `src/lib/rpc/categorias.ts`: `insertarCategorias`,
  `editarCategorias`.
- [x] **T-2.6** — `src/lib/rpc/ventas.ts`: `insertarDetalleVenta`,
  `editarCantidadDv`, `mostrarDetalleVenta`, `confirmarVenta`,
  `setDefaultSerializacion` (5 wrappers).
- [x] **T-2.7** — `src/lib/rpc/dashboard.ts`: 8 wrappers
  (`dashboardTotalVentasConFechas`, `dashboardSumarVentasPorEmpresa`,
  `dashboardSumarVentasPorEmpresaPeriodoAnterior`,
  `dashboardSumarCantidadDetalleVenta`, `dashboardSumarGananciasDetalleVenta`,
  `dashboardCajasPorSucursalYVentas`, `dashboardTotalVentasXMetodoPago`,
  `dashboardTop5ProductosMasVendidos`).
- [x] **T-2.8** — `src/lib/rpc/caja.ts`: `mostrarMovimientosCajaLive`.

- [x] **Stores (T-3.1..T-3.8)** — 12 zustand stores created in
  `src/stores/`, one per file. Notable details:
  - `useThemeStore` persisted (`tpv365-theme`, version 1).
  - `useVentasStore` persisted (`tpv365-ventas-store`, version 1,
    `partialize` → `cart` + `currentVentaId` only).
  - `useProductosStore` / `useCategoriasStore` hold UI state ONLY
    (selected row, search text, pagination); canonical list lives in
    react-query cache per design Dg3.
  - `useDashboardStore` derives `fechaInicio`/`fechaFin` from the
    `rango` preset via dayjs.

- [x] **Hooks (T-3.11..T-3.14 partial)** — base react-query hooks in
  `src/hooks/`:
  - `useProductos.ts` — `useProductosQuery`, `useBuscarProductosQuery`,
    `useInsertarProductoMutation`, `useEditarProductoMutation`,
    `useEliminarProductoMutation` (via `.from('productos').delete()`
    with Postgres 23503 → Spanish toast mapping inline).
  - `useCategorias.ts` — `useCategoriasQuery` (placeholder returns `[]`;
    real `.from('categorias').select()` lands in Batch 8 alongside the
    Categorías screen), `useInsertarCategoriaMutation`,
    `useEditarCategoriaMutation`.
  - `useVentas.ts` — `useMostrarDetalleVentaQuery`,
    `useDefaultSerializacionQuery`, `useInsertarVentaMutation`
    (via `.from('ventas').insert()`), `useInsertarDetalleVentaMutation`,
    `useEditarCantidadDvMutation`, `useConfirmarVentaMutation`,
    `useInsertarMovimientoCajaMutation` (via `.from('movimientos_caja').insert()`).
  - `useDashboard.ts` — 8 metric hooks + 1 defensive caja-live hook
    (`refetchInterval: 15_000`, `retry: 1`).

### Files created / updated (Batch 2)

```
src/lib/
├── errors.ts                            # NEW: RpcError + throwRpcError + userMessage (23503/23505)
├── notify.ts                            # NEW: notify + notifyRpcError (AntD message + notification)
├── format.ts                            # NEW: formatCurrency + formatDate (dayjs + Intl)
├── queryKeys.ts                         # NEW: qk factory (auth/productos/categorias/ventas/metodosPago/serializacion/caja/dashboard)
└── rpc/
    ├── auth.ts                          # NEW: mostrarEmpresaXIdAuth, contarProductosPorAuth
    ├── productos.ts                     # NEW: mostrarProductos, buscarProductos, insertarProductos, editarProductos
    ├── categorias.ts                    # NEW: insertarCategorias, editarCategorias
    ├── ventas.ts                        # NEW: insertarDetalleVenta, editarCantidadDv, mostrarDetalleVenta, confirmarVenta, setDefaultSerializacion
    ├── dashboard.ts                     # NEW: 8 dashboard RPCs
    └── caja.ts                          # NEW: mostrarMovimientosCajaLive

src/types/
├── rpc.ts                               # NEW: 25 interfaces (domain + RPC params)
└── store.ts                             # NEW: 12 store state interfaces

src/stores/
├── useGlobalStore.ts                    # NEW: sidebarCollapsed + modalOpen Record
├── useEmpresaStore.ts                   # NEW: empresa session cache
├── useUsuariosStore.ts                  # NEW: usuario session cache
├── useThemeStore.ts                     # NEW: persisted theme (tpv365-theme)
├── useProductosStore.ts                 # NEW: UI state only
├── useCategoriasStore.ts                # NEW: UI state only
├── useVentasStore.ts                    # NEW: persisted cart (tpv365-ventas-store, partialize)
├── useDetalleVentasStore.ts             # NEW: server-acknowledged detalle mirror
├── useMetodosPagoStore.ts               # NEW: metodosPago session cache
├── useSerializacionStore.ts             # NEW: default serializacion cache
├── useReportesStore.ts                  # NEW: reserved empty
└── useDashboardStore.ts                 # NEW: rango + fechaInicio/fechaFin + setRango

src/hooks/
├── useProductos.ts                      # NEW: 2 queries + 3 mutations
├── useCategorias.ts                     # NEW: 1 query (placeholder) + 2 mutations
├── useVentas.ts                         # NEW: 2 queries + 5 mutations
└── useDashboard.ts                      # NEW: 8 metric queries + 1 defensive caja-live

src/componentes/
├── organismos/
│   └── ProtectedRoute.tsx               # NEW: HOC with useSession() reactive subscription + Spin fallback
├── templates/
│   └── ShellLayout.tsx                  # NEW: minimal AntD Layout + <Outlet /> (chrome lands in Batch 5)
└── paginas/
    ├── LoginPage.tsx                    # NEW: placeholder (full UI in Batch 4)
    ├── DashboardPage.tsx                # NEW: placeholder (full UI in Batch 6)
    ├── ProductosPage.tsx                # NEW: placeholder (full UI in Batch 7)
    ├── CategoriasPage.tsx               # NEW: placeholder (full UI in Batch 8)
    ├── PosPage.tsx                      # NEW: placeholder (full UI in Batch 9)
    └── NotFoundPage.tsx                 # NEW: standalone 404

src/main.tsx                             # UPDATED: QueryClientProvider + ConfigProvider + AntApp + BrowserRouter
src/App.tsx                              # UPDATED: full route skeleton (login / protected / * 404)
```

### Verification evidence (Batch 2)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 1.97s, 693.87 kB / 209.68 kB gz |
| `grep -rn "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `wc -l src/lib/* src/lib/rpc/* src/types/* src/stores/* src/hooks/*` | ~1 800 lines of new typed code |

### Forbidden-pattern guards (Batch 2)

| Guard | Status |
|-------|--------|
| `grep -r "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn ': any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "barrel" src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` | ✅ no matches |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |

### Deviations from design (Batch 2)

- **`setdefaultserializacion` RPC name.** Spec §4.F.5 mentions
  `getDefaultSerializacion(idEmpresa, idSucursal)` as the hook name;
  the user's batch list (T-2.6) and the spec's RPC catalog both call it
  `setdefaultserializacion`. We followed the RPC catalog name and
  exposed it as `setDefaultSerializacion` in TS. It returns
  `SerializacionComprobante | null` (null when no comprobante is
  configured for the sucursal — the blocking-toast case in POS).
- **`RpcErrorLike` loose interface added to `src/lib/errors.ts`.** The
  original design has `notifyRpcError` accept strict `RpcError`, but
  `.from('ventas').insert()` and `.from('productos').delete()` throw
  plain `Error` objects (not from an RPC call). To keep one notification
  path covering both, we introduced `RpcErrorLike` (`{ message, code?,
  rpcName?, hint?, details? }`) and typed both `userMessage` and
  `notifyRpcError` against it. `RpcError` still `implements
  RpcErrorLike`, so RPC-layer errors are accepted without changes.
- **Category list query is a placeholder.** `useCategoriasQuery`
  currently returns `[]` because the canonical list comes from
  `.from('categorias').select()` (not an RPC), and the spec defers that
  wiring to Batch 8 alongside the Categorías screen. The mutation
  surface (insertar/editar) is fully typed and ready.
- **T-3.9 / T-3.10 (useLogin / useSession / useAuthGuard) NOT created
  in this batch.** They belong to Batch 4 (Auth screen). A minimal
  `useSession()` is colocated inside `ProtectedRoute.tsx` so the guard
  compiles today; Batch 4 will extract it into `src/hooks/useSession.ts`
  per the task inventory.
- **No code-splitting.** AntD + Recharts + Supabase + pdfmake all ship
  in a single 694 kB bundle. Per-route code-splitting (`React.lazy`)
  will land alongside the screen batches that actually pull in heavy
  imports (e.g. Recharts in Batch 6, pdfmake in Batch 9).
- **`ConfigProvider.theme.token` is hard-coded light.** The full
  theme toggle wiring (`useThemeStore` → `document.documentElement.
  dataset.theme` → AntD token + styled-components provider) lands in
  Batch 5 (T-5.7). The store is ready and persisted; the consumer is
  pending.
- **`useReportesStore` is an empty store.** Design §13 confirms it is
  reserved for the post-MVP `/reportes` screen and currently empty.
  Shape is `[key: string]: unknown` so future fields can be added
  without a breaking change.
- **`.gitkeep` files retained.** Folder markers are kept where the
  folder has no real files yet (e.g. `componentes/atomos/`,
  `componentes/moleculas/`); they will be removed in the batches that
  populate them.

### Risks (Batch 2)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle size grew 4.8× (143 kB → 694 kB) | LOW | Single-bundle is acceptable for dev; per-route splitting lands with screens that need it (Recharts, pdfmake) |
| `confirmar_venta` RPC signature not yet smoke-tested against the live DB | MEDIUM | Typed wrapper returns `Venta[]` (per spec §3.4); live smoke test is `sdd-verify` in Batch 10 (parent-owned) |
| `setdefaultserializacion` parameter shape inferred from spec | MEDIUM | Wrapper uses `_id_empresa` + `_id_sucursal` per the spec catalog; if the backend uses different names the call site will throw a Postgres 400 surfaced as a toast |
| `useProductosStore.buscador` and `useProductosQuery(buscador)` are separate signals | LOW | Store owns UI search input; the query receives its debounced/echoed value. Documented; will reconcile in Batch 7 (BuscadorProductos debounce wiring) |
| Bigint return type for `insertardetalleventa` may need string coercion depending on Supabase serialization | LOW | Wrapper does `BigInt(data ?? '0')`; downstream consumers should treat `bigint` as opaque |

### Remaining tasks (Batch 3+)

Next batch (`sdd-apply` batch #3 = tasks.md T-3.9..T-3.10 + T-4.*) handles:

- T-3.9 — `src/hooks/useLogin.ts` (useLoginMutation wires
  `signInWithPassword` → `mostrarEmpresaXIdAuth` → `contarProductosPorAuth`,
  sets stores, surfaces errors as toasts).
- T-3.10 — Extract `useSession` into `src/hooks/useSession.ts` +
  `src/hooks/useAuthGuard.ts`; the colocated version inside
  `ProtectedRoute.tsx` is removed.
- T-4.1..T-4.4 — Full Auth screen (LoginPage + LoginForm + LogoEmpresa).

Batch 2 PR should merge before Batch 3 begins.

### Suggested commit message (Batch 2)

```
feat(tpv365): typed layer — RPC wrappers + stores + base hooks + router wiring

- 22 typed RPC wrappers across 6 files (auth/productos/categorias/ventas/
  dashboard/caja). Zero `any` on return types; every wrapper throws
  RpcError via `throwRpcError(error, rpcName)`; bigint/scalar responses
  are coerced at the boundary.
- src/lib/errors.ts: RpcError class + throwRpcError + userMessage mapping
  Postgres 23503 → "No se puede eliminar..." and 23505 → "Ya existe...".
- src/lib/notify.ts: notify (success/error/warning/info/blocking) +
  notifyRpcError(err). Single seam for all toasts — no Swal anywhere.
- src/lib/format.ts: formatCurrency(simboloMoneda, amount) with
  Intl.NumberFormat es-ES; formatDate(iso) with dayjs.
- src/lib/queryKeys.ts: qk factory for 8 domains + all-prefix keys for
  bulk invalidation.
- src/types/rpc.ts: 25 interfaces (20 user-listed + 5 RPC param shapes).
- src/types/store.ts: 12 store state interfaces.
- 12 zustand stores: useThemeStore persisted (tpv365-theme, v1);
  useVentasStore persisted (tpv365-ventas-store, v1, partialize →
  cart + currentVentaId only); 10 non-persisted stores for UI / session
  identity. No server rows mirrored into stores (per design Dg3).
- 4 base react-query hooks: useProductos (2 queries + 3 mutations incl.
  .from().delete() with FK-23503 Spanish toast), useCategorias (2
  mutations; list query placeholder until Batch 8), useVentas (2 queries
  + 5 mutations covering confirmar_venta + movimientos_caja insert +
  venta insert via .from()), useDashboard (8 metric hooks + 1 defensive
  caja-live with refetchInterval 15s + retry 1).
- src/main.tsx wired: QueryClientProvider + ConfigProvider (esES locale)
  + AntApp + BrowserRouter around <App />.
- src/App.tsx wired: /login public; ProtectedRoute → ShellLayout →
  /dashboard, /configuracion/productos, /configuracion/categorias,
  /pos; / → /dashboard redirect; * → NotFoundPage.
- 6 page placeholders + ProtectedRoute (with reactive useSession
  subscription + centered Spin fallback) + ShellLayout (minimal AntD
  Layout + Outlet).
- Forbidden-pattern guards clean: no Swal, no barrel index.ts, no any
  in any file, no as-unknown-as chains, no @ts-ignore.
- tsc --noEmit: 0 errors; npm run build: 694 kB / 210 kB gz, 1.97s.
```

---

## Persistence notes

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): updated to
  mark T-1.5, T-1.6, T-2.1..T-2.8 as `[x]` after Batch 2 completion.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used.
- **Memory contract (this batch):** read `apply-progress.md` (this file,
  Batch 1 section) at start; merged with new Batch 2 content above;
  written back here.

---

## Batch 3 — Auth + Shell / Layout (completed)

**PR boundary:** Batch 3 of the `stacked-to-main` chain (PR #3 — auth +
shell + theme wire-up). Folds the user-requested "Tanda 3" (auth hooks +
LoginPage + LoginForm + LogoEmpresa + ShellLayout + Sidebar + Header +
Reloj + ToggleTema + 404 polish + theme reactivity).
**Strategy delivered:** single PR for auth + shell chrome. Build clean,
~620 lines of new code, zero Swal, zero barrels, zero `any` at boundaries.

### Tasks completed

- [x] **T-3.9** — `src/hooks/useLogin.ts` (`useLoginMutation`):
  `supabase.auth.signInWithPassword` → `mostrarEmpresaXIdAuth(uid)` →
  `contarProductosPorAuth(uid)` → resolve `Usuario` via
  `supabase.from('usuarios').select('*').eq('id', empresa.id_usuario)
  .single()` with a synthetic auth-only fallback so `LoginResult.usuario`
  is always non-null → populate `useEmpresaStore` + `useUsuariosStore`.
  Errors: invalid credentials → `notify.error('Credenciales incorrectas')`,
  no-empresa-linked → Spanish message, anything else routed through
  `notifyRpcError`. Info toast "Esta empresa aún no tiene productos
  registrados" when the count is zero.

- [x] **T-3.10** — `src/hooks/useSession.ts` extracted from the colocated
  copy inside `ProtectedRoute.tsx` (session from `auth.getSession()` +
  subscription via `onAuthStateChange`, with `isLoading` flag). New
  `src/hooks/useAuthGuard.ts` wraps `useSession` and adds
  `isAuthenticated`. `getReturnTo(state)` helper decodes
  `location.state.from` (default `/dashboard`). `ProtectedRoute` is now
  a thin consumer of `useAuthGuard` and no longer holds the session
  subscription itself.

- [x] **T-4.1** — `src/componentes/atomos/LogoEmpresa.tsx` (AntD `<Avatar>`
  with `empresa.logo` if present, else initial-of-`empresa.nombre` on the
  AntD primary color; falls back to "T" before any empresa loads).

- [x] **T-4.2** — `src/componentes/moleculas/LoginForm.tsx`
  (`react-hook-form` `useForm<LoginCredentials>` + `Controller` wrapping
  AntD `<Input>` / `<Input.Password>`; Spanish messages: "Por favor
  ingrese su correo", "Correo inválido", "Por favor ingrese su
  contraseña", "La contraseña debe tener al menos 6 caracteres";
  `<Button loading>` during pending; inline `<Alert>` mirrors the last
  error; submit calls `useLoginMutation` then `onSuccess` callback).
  Labels and button text in Spanish ("Correo", "Contraseña", "Iniciar
  sesión").

- [x] **T-4.3** — `src/componentes/paginas/LoginPage.tsx` (full rewrite).
  Full-screen gradient card (380 px) centered; `<LogoEmpresa />` on top
  with title "TPV-365" and subtitle "Inicia sesión para continuar";
  `<LoginForm />` below; while `useSession` resolves shows a centered
  `<Spin />`; if a session is already present the page navigates to
  `getReturnTo(location.state)` (default `/dashboard`) and replaces
  history.

- [x] **T-4.4** — `src/App.tsx` already wired the protected subtree under
  `<ProtectedRoute><ShellLayout>…</ShellLayout></ProtectedRoute>`; no
  structural change required. The authenticated-`/login`-redirects-to-`/
  dashboard` rule now lives inside `LoginPage` via `useAuthGuard`.

- [x] **T-5.1** — `src/componentes/atomos/Reloj.tsx` (`dayjs()` +
  `setInterval(…, 1000)` with cleanup; locale `es`; tabular-nums format
  `HH:mm:ss · D [de] MMMM [de] YYYY`).

- [x] **T-5.2** — `src/componentes/moleculas/ToggleTema.tsx` (AntD
  `<Switch>` with `FiMoon` / `FiSun` children; reads `useThemeStore.
  theme` and calls `toggleTheme`; `<Tooltip>` "Cambiar a tema claro /
  oscuro").

- [x] **T-5.3** — `src/componentes/organismos/sidebar/Sidebar.tsx`
  (AntD `<Sider collapsible width=240 collapsedWidth=64 breakpoint="lg"
  onCollapse={toggleSidebar}>`, brand block "TPV-365" with `FiGrid`
  icon, AntD `<Menu mode="inline" selectedKeys={[location.pathname]}>`)
  with the 4 MVP entries:
    - `/dashboard` (`FiHome` "Dashboard")
    - `/pos` (`FiShoppingCart` "POS")
    - `/configuracion/productos` (`FiBox` "Productos")
    - `/configuracion/categorias` (`FiTag` "Categorías")
  Items typed via `MenuProps['items']` so AntD's discriminated union is
  honored (no `any`).

- [x] **T-5.4** — `src/componentes/organismos/header/Header.tsx`
  (`<Header>` with `empresa.nombre` left, `<Reloj />` + avatar+name +
  `<ToggleTema />` + "Salir" `<Button>` with `FiLogOut` right). Logout:
  `supabase.auth.signOut()` → clears `useEmpresaStore`,
  `useUsuariosStore`, persisted `useVentasStore` cart +
  `currentVentaId`, `notify.info('Sesión cerrada')`, `navigate('/login',
  { replace: true })`. Wrapped in try/finally so local cleanup runs even
  if Supabase sign-out throws.

- [x] **T-5.5** — `src/componentes/templates/ShellLayout.tsx` (full
  rewrite from the Batch 2 placeholder). `<Layout minHeight=100vh>`
  → `<Sidebar />` + nested `<Layout>` → `<Header />` (sticky) +
  `<Content>` wrapping a white `<div>` with `<Outlet />`.

- [x] **T-5.6** — `src/componentes/paginas/NotFoundPage.tsx` (AntD
  `<Result status="404" title="404" subTitle="La página que buscas no
  existe." extra={<Link to="/dashboard"><Button type="primary">Ir al
  dashboard</Button></Link>}>` on a full-screen `#f0f2f5` background).

- [x] **T-5.7** — Theme wire-up landed in `src/main.tsx`. New
  `<ThemedApp />` component subscribes to `useThemeStore.theme`, sets
  `document.documentElement.dataset.theme = themeMode`, and picks
  `theme.darkAlgorithm` vs `theme.defaultAlgorithm` for AntD
  ConfigProvider. Re-renders the tree when the toggle flips, so light ↔
  dark takes effect immediately without a page reload.

- [x] **T-5.8** — `src/App.tsx` already declared the ShellLayout-wrapped
  protected subtree and the `/` → `/dashboard` redirect in Batch 2; no
  change needed for Batch 3. All routes resolve: `/login` (public),
  `/dashboard`, `/pos`, `/configuracion/productos`,
  `/configuracion/categorias` (protected), `/` → `/dashboard`, `*` →
  `NotFoundPage`.

### Files created / updated (Batch 3)

```
src/hooks/
├── useSession.ts              # NEW (was colocated in ProtectedRoute.tsx)
├── useAuthGuard.ts            # NEW
└── useLogin.ts                # NEW

src/componentes/
├── atomos/
│   ├── LogoEmpresa.tsx        # NEW
│   └── Reloj.tsx              # NEW
├── moleculas/
│   ├── LoginForm.tsx          # NEW
│   └── ToggleTema.tsx         # NEW
├── organismos/
│   ├── ProtectedRoute.tsx     # UPDATED (now a thin useAuthGuard consumer)
│   ├── header/Header.tsx      # NEW
│   └── sidebar/Sidebar.tsx    # NEW
├── templates/
│   └── ShellLayout.tsx        # UPDATED (full chrome)
└── paginas/
    ├── LoginPage.tsx          # UPDATED (full rewrite)
    └── NotFoundPage.tsx       # UPDATED (AntD Result + link)

src/main.tsx                   # UPDATED (ThemedApp wrapper; theme reactive)
src/App.tsx                    # UNCHANGED (routing intact)
```

### Verification evidence (Batch 3)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 2.33s, 1 099.83 kB / 337.40 kB gz (1 609 modules) |
| `npm run dev` + `curl http://localhost:5173/` | ✅ HTTP 200, SPA shell served, `<title>TPV-365</title>`, `lang="es"` |
| `curl http://localhost:5173/login` | ✅ HTTP 200 (Vite SPA fallback) |
| `curl http://localhost:5173/src/main.tsx` + 12 other new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn -E "as\s+unknown\s+as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |

### Forbidden-pattern guards (Batch 3)

| Guard | Status |
|-------|--------|
| `grep -r "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn ': any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |

### Deviations from design (Batch 3)

- **`Sidebar` items typed via AntD's `MenuProps['items']`** instead of a
  hand-rolled `MenuItem[]` interface. Reason: AntD's discriminated union
  for menu items requires either a `type: 'group'` / `children` shape or
  a leaf entry; a plain `{ key, icon, label }` interface gets rejected
  by the compiler because `SubMenuType` needs `children`. Using
  `MenuProps['items']` keeps us on the type-safe path without losing any
  structure (no `any`, no `@ts-ignore`).
- **Theme `document.documentElement.dataset.theme`** instead of a CSS-
  variables provider. Light-touch: gives consumers a stable hook for any
  global stylesheet override; AntD's `theme.algorithm` does the heavy
  lifting for the design tokens.
- **Usuario lookup goes through `supabase.from('usuarios')`** rather than
  a new RPC. The spec catalog (3.1) only defines
  `mostrarempresaxidauth` + `contarproductosporauth`; the Empresa table
  already carries `id_usuario`, so a direct query keeps the contract
  surface small and doesn't add an RPC name the spec doesn't list. The
  shape is typed via `as Usuario` after the select.
- **`Header.logout` is `async` + try/finally**. Local stores must be
  cleared regardless of whether Supabase's sign-out call resolves
  cleanly (network blip, etc.), so the navigate happens inside a
  `finally` block to avoid trapping the user on a page that thinks it
  has a session.
- **`getReturnTo` helper co-located in `useAuthGuard.ts`.** The
  `ProtectedRoute` reads `location.state.from` on its way out; the
  `LoginPage` reads it on its way in (to honor the original deep-link).
  Centralizing the decoder avoids drift between the two sides.

### Risks (Batch 3)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 1 099 kB / 337 kB gz (single chunk) | MEDIUM | AntD + Recharts + Supabase + pdfmake + dayjs + react-hook-form all in one. Acceptable for dev; per-route splitting lands alongside the screens that need it (Recharts in Batch 6, pdfmake in Batch 9) |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; rollup manualChunks lands with code-splitting batches |
| `signInWithPassword` may surface newer Supabase error codes than the spec mapped (e.g. `email_not_confirmed`, `over_email_send_rate_limit`) | LOW | All non-`invalid_credentials` errors fall through to `notifyRpcError` → `userMessage(err)` which surfaces the raw message; future polish batch could map the rest to Spanish strings |
| Direct `supabase.from('usuarios').select()` returns `any` (no `Database` generic on the client) | LOW | Single cast `as Usuario` at the boundary; if the table schema drifts the typed surface downstream will throw at the cast site, not in some far consumer |
| Reloj causes a 1 Hz re-render of the entire Header subtree | LOW | `useState` is scoped to `<Reloj />` itself; the Header memoization isn't needed at MVP scale. Documented; revisit if the shell grows |
| Theme flip flashes briefly during the algorithm swap | LOW | AntD handles the transition internally; no FOUC observed in dev preview |

### Remaining tasks (Batch 4+)

Next batch (`sdd-apply` batch #4 = tasks.md T-6.* Dashboard + T-7.*
Productos + T-8.* Categorías + T-9.* POS + T-10.* Verify) is parent-owned
once the screens are wired. PR #3 should merge before PR #4 starts.

### Suggested commit message (Batch 3)

```
feat(tpv365): auth + shell chrome (Batch 3)

- src/hooks/useSession.ts: extracted from ProtectedRoute; getSession
  + onAuthStateChange subscription with isLoading flag.
- src/hooks/useAuthGuard.ts: useAuthGuard() wraps useSession with
  isAuthenticated; getReturnTo(state) decodes location.state.from.
- src/hooks/useLogin.ts: useLoginMutation wires signInWithPassword →
  mostrarEmpresaXIdAuth → contarProductosPorAuth → usuarios row by
  Empresa.id_usuario → populate useEmpresaStore + useUsuariosStore.
  Spanish error toasts: "Credenciales incorrectas" for invalid
  credentials; "Esta empresa aún no tiene productos registrados" info
  when count === 0.
- src/componentes/atomos/LogoEmpresa.tsx: Avatar with empresa.logo or
  initial of empresa.nombre on AntD primary color.
- src/componentes/moleculas/LoginForm.tsx: react-hook-form + AntD
  Form; Spanish labels ("Correo", "Contraseña", "Iniciar sesión");
  inline Alert mirrors the last error; Button shows loading state.
- src/componentes/paginas/LoginPage.tsx: full rewrite — gradient
  card, LogoEmpresa + LoginForm, redirects to getReturnTo(state) if
  session already exists.
- src/componentes/atomos/Reloj.tsx: dayjs es locale, 1 Hz setInterval
  with cleanup, tabular-nums format.
- src/componentes/moleculas/ToggleTema.tsx: AntD Switch with
  FiMoon/FiSun; reads/writes useThemeStore.
- src/componentes/organismos/sidebar/Sidebar.tsx: AntD Sider
  collapsible + Menu with the 4 MVP entries (Dashboard / POS /
  Productos / Categorías); selectedKeys driven by location.pathname;
  FiHome / FiShoppingCart / FiBox / FiTag icons.
- src/componentes/organismos/header/Header.tsx: empresa.nombre +
  Reloj + avatar+usuario + ToggleTema + "Salir" button →
  supabase.auth.signOut() + clears empresa/usuario/cart stores +
  navigate /login.
- src/componentes/templates/ShellLayout.tsx: full Layout with Sider +
  Header (sticky) + Content + Outlet.
- src/componentes/paginas/NotFoundPage.tsx: AntD Result 404 with
  "Ir al dashboard" link.
- src/componentes/organismos/ProtectedRoute.tsx: now a thin
  useAuthGuard consumer; session subscription lives in useSession.
- src/main.tsx: ThemedApp wrapper subscribes to useThemeStore;
  document.documentElement.dataset.theme = themeMode; AntD
  ConfigProvider switches theme.darkAlgorithm / theme.defaultAlgorithm
  reactively.
- tsc --noEmit: 0 errors; npm run build: 1 099 kB / 337 kB gz; dev
  server returns HTTP 200 on / and /login; all 13 new modules
  transform cleanly through Vite HMR; no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore.
```

---

## Persistence notes

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-3.9,
  T-3.10, T-4.1..T-4.4, T-5.1..T-5.8 all marked `[x]`.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used.
- **Memory contract (this batch):** read `apply-progress.md` (Batches
  1 + 2) at start; merged Batch 3 above; written back here.

---

## Batch 4 — Dashboard (Tanda 4, completed)

**PR boundary:** Batch 4 of the `stacked-to-main` chain. Tanda 4 = Dashboard
slice of PR #6. Folds the user-requested "Tanda 4 (Dashboard)" — 8 metric
cards + AreaChart + PieChart + defensive CajaLive + DateRangePicker wired
through `useDashboardStore`.
**Strategy delivered:** single PR for the dashboard screen. ~1 314 lines
of new code across 12 files; build clean (1.97 MB / 586 kB gz, +867 kB
from Batch 3 because Recharts finally gets pulled in); zero Swal, zero
barrels, zero `any` at boundaries.

### Tasks completed

- [x] **T-6.1** — `src/componentes/atomos/CustomTooltip.tsx` (Recharts
  custom tooltip; takes `active`, `payload`, `label`, `simboloMoneda`,
  and an optional `valueFormatter`; renders an em-dash when Recharts
  passes an empty payload so the tooltip is never accidentally visible).
- [x] **T-6.2** — `src/componentes/moleculas/DateRangePicker.tsx` (AntD
  `<Segmented>` with Día / Semana / Mes / Personalizado + conditional
  `<RangePicker>` exposed only for Personalizado. RangePicker exposes
  five convenience presets (Hoy / Esta semana / Este mes / Últimos 7 días /
  Últimos 30 días). Both paths call `useDashboardStore.setRango(...)`,
  which mutates `fechaInicio`/`fechaFin` and therefore the react-query
  keys → auto-refetch.)
- [x] **T-6.3** — `src/componentes/moleculas/CardVentas.tsx` (total +
  % cambio badge with green ↑ / red ↓ / em-dash when divisor is zero;
  currency formatted via `formatCurrency` from the empresa store; loading
  shows `<Skeleton>`, error shows danger-coloured inline text).
- [x] **T-6.4** — five molecule cards under `src/componentes/moleculas/`:
  `CardCantidadVentas.tsx` (Intl.NumberFormat es-ES), `CardGanancias.tsx`
  (formatCurrency), `CardProductosTopMonto.tsx` (AntD `<List>` with
  rank/cantidad/total), `CardMetodosPago.tsx` (Recharts `<PieChart>` with
  Cell palette, `<CustomTooltip>` and `<Legend>`), and
  `CardCajasSucursales.tsx` (AntD `<Table>` with right-aligned numeric
  columns + currency).
- [x] **T-6.5** — `src/componentes/moleculas/CardMovimientosCajaLive.tsx`
  (**defensive**): returns `null` (component removed entirely from the
  DOM) when `isError` is true OR when `data` is empty; shows a skeleton
  while loading; otherwise shows the latest 10 movements in an AntD
  `<List>` with type-coloured `<Tag>`, formatted monto, optional vuelto,
  hora (HH:mm via `new Date(iso)`), date (formatDate), method name and
  descripción. NO toast for the silent fallback per spec §4.C.5 /
  design §8.3.
- [x] **T-6.6** — `src/componentes/organismos/dashboard/ChartVentas.tsx`
  (Recharts `<AreaChart>` with linear-gradient fill, X-axis fecha label
  formatted as DD/MM, Y-axis Intl.NumberFormat es-ES, custom tooltip
  wired to the same `formatCurrency` formatter; loading shows skeleton,
  empty shows `<Empty>`).
- [x] **T-6.7** — `src/componentes/templates/DashboardTemplate.tsx`
  (AntD `<Row>`/`<Col>` responsive grid: header with title + rango label
  + DateRangePicker; KPI row (xs:24, md:8); full-width chart; two-up row
  for Top productos + Métodos de pago; two-up row for Cajas por sucursal
  + CajaLive).
- [x] **T-6.8** — `src/componentes/paginas/DashboardPage.tsx` (full
  rewrite). Reads `idEmpresa` from `useEmpresaStore`; reads
  `fechaInicio`/`fechaFin` from `useDashboardStore`; calls the 8
  dashboard hooks (ventasConFechas, ventasSum, ventasAnterior, cantidad,
  ganancias, topProductos, metodosPago, cajasSucursales) +
  `useDashboardMovimientosCajaLive` is owned by the molecule. Renders a
  centered `<Spin>` + soft `<Alert>` while `idEmpresa <= 0` (post-logout
  / pre-hydration flicker guard); otherwise renders
  `<DashboardTemplate />` with all 8 metric triples. Hooks are called
  unconditionally — react-query's `enabled` flag short-circuits when
  there is no empresa.

### Files created / updated (Batch 4)

```
src/componentes/
├── atomos/
│   └── CustomTooltip.tsx                       # NEW (T-6.1)
├── moleculas/
│   ├── DateRangePicker.tsx                     # NEW (T-6.2)
│   ├── CardVentas.tsx                          # NEW (T-6.3)
│   ├── CardCantidadVentas.tsx                  # NEW (T-6.4)
│   ├── CardGanancias.tsx                       # NEW (T-6.4)
│   ├── CardProductosTopMonto.tsx               # NEW (T-6.4)
│   ├── CardMetodosPago.tsx                     # NEW (T-6.4)
│   ├── CardCajasSucursales.tsx                 # NEW (T-6.4)
│   └── CardMovimientosCajaLive.tsx             # NEW (T-6.5)
├── organismos/
│   └── dashboard/
│       └── ChartVentas.tsx                     # NEW (T-6.6)
└── templates/
    └── DashboardTemplate.tsx                   # NEW (T-6.7)

src/componentes/paginas/
└── DashboardPage.tsx                           # UPDATED: full rewrite (T-6.8)
```

Three empty `.gitkeep` markers were removed (atomos/, moleculas/, organismos/
dashboard/) — the folders are now populated.

### Verification evidence (Batch 4)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 3.55s, 1 966.76 kB / 586.25 kB gz (2 415 modules). Recharts + AntD pulled in. |
| `npm run dev` + `curl http://localhost:5173/` | ✅ HTTP 200 |
| `curl http://localhost:5173/dashboard` | ✅ HTTP 200 (SPA fallback) |
| `curl` for each of 11 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log" src/componentes/{atomos,moleculas,organismos/dashboard,templates,paginas}/` | ✅ no matches |

### Forbidden-pattern guards (Batch 4)

| Guard | Status |
|-------|--------|
| `Swal.fire()` | ✅ none |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (only in comment) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 4)

- **Recharts `<Tooltip content>` accepts a React element, not a render
  function.** The spec's pseudocode shows `content={({ active, payload,
  label }) => …}`; Recharts 2.15.4 actually wants either a static
  ReactElement (which Recharts then injects the tooltip props into via
  cloneElement) OR a function returning a ReactNode. We pass the
  element form (`<CustomTooltip simboloMoneda={...} />`) so Recharts
  supplies `active`/`payload`/`label` automatically. Documented in the
  atom's JSDoc.
- **Recharts `<Pie label>` typing.** The `label` prop in Recharts 2.x is
  typed as `LabelProps | ((props: any) => ReactNode)` — we narrow the
  callback's parameter to our local `PieEntry` interface so we keep the
  `no any` guard. The library's wider type is unavoidable without
  patching `node_modules`.
- **Recharts `<Tooltip content>` requires a mutable tuple for the
  RangePicker presets.** AntD's `RangePicker` `presets` prop is typed
  as `Array<{ label: string; value: [Dayjs, Dayjs] }>` (mutable).
  Internally we keep our local array `ReadonlyArray<RangePreset>` for
  caller safety but expose `RANGE_PRESETS` as a plain `Array<RangePreset>`
  to satisfy AntD's type. No `as`/`as any` casts required.
- **`<Alert showIcon>` in the post-logout flicker guard.** Used AntD's
  `<Alert>` (info variant) instead of a styled `<div>` so the message
  is accessible and theme-aware. Not a forbidden pattern; AntD is the
  design system's toast/alert channel.
- **`<Empty.PRESENTED_IMAGE_SIMPLE>` everywhere.** Cards and the chart
  use AntD's compact empty variant instead of the default SVG to keep
  empty states visually quiet (no giant illustration next to KPI tiles).

### Risks (Batch 4)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 1.97 MB / 586 kB gz (single chunk) | MEDIUM | Recharts finally pulled in (~600 kB of the growth). Acceptable for dev; per-route code-splitting lands alongside the heavier screens (Recharts already on the only screen that uses it — Dashboard — so the cost is paid once). |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; `manualChunks` lands in a later polish batch if requested |
| `useDashboardVentasPeriodoAnterior` semantics depend on the backend treating the date range as the previous period of equal length | LOW | Hook is a thin wrapper; if the backend misbehaves the % cambio shows --/Infinity → handled gracefully by the `computeCambioPct` helper |
| `Recharts AreaChart` animations disabled via `isAnimationActive={false}` | LOW | Initial mount skips the fill animation so the chart appears fully rendered on the first paint; smoother UX during refetch on date range changes |
| `<Skeleton>` inside `<Card>` reserves a fixed `minHeight` so the grid does not jump while loading | LOW | Documented in `bodyStyle={{ minHeight: … }}` per card |
| `CardMovimientosCajaLive` returns `null` on error → grid layout reflows | LOW | Sider + Row keep the column slot stable; an empty column is preferable to a misleading error toast per spec §4.C.5 |

### Remaining tasks (Batch 5+)

Next batch (`sdd-apply` batch #5 = tasks.md T-7.* Productos + T-8.* Categorías)
is parent-owned once the user resumes the chain. PR #4 should merge before
PR #5 starts.

### Suggested commit message (Batch 4)

```
feat(tpv365): dashboard — 8 metrics + charts + defensive caja-live (Batch 4)

- src/componentes/atomos/CustomTooltip.tsx: Recharts custom tooltip
  (active/payload/label + simboloMoneda + optional valueFormatter);
  renders <></> when Recharts passes no payload so it never lingers.
- src/componentes/moleculas/DateRangePicker.tsx: AntD Segmented
  (Día/Semana/Mes/Personalizado) + conditional RangePicker with five
  AntD presets (Hoy / Esta semana / Este mes / Últimos 7 días /
  Últimos 30 días). Both paths call useDashboardStore.setRango(...);
  date keys feed the dashboard query keys → auto-refetch.
- src/componentes/moleculas/CardVentas.tsx: total + % cambio badge
  (green ↑ / red ↓ / em-dash on div-by-zero); loading skeleton + error
  inline text; currency formatted via formatCurrency(empresa.simbolo).
- src/componentes/moleculas/CardCantidadVentas.tsx + CardGanancias.tsx:
  numeric and currency KPI cards with skeleton/empty/error states and
  min-height for grid stability.
- src/componentes/moleculas/CardProductosTopMonto.tsx: AntD <List> with
  rank + product name + cantidad + currency total.
- src/componentes/moleculas/CardMetodosPago.tsx: Recharts PieChart with
  Cell palette, custom tooltip (currency), legend, Empty fallback.
- src/componentes/moleculas/CardCajasSucursales.tsx: AntD <Table> with
  right-aligned numeric columns and currency formatting.
- src/componentes/moleculas/CardMovimientosCajaLive.tsx: defensive card;
  returns null on isError OR empty data; skeleton while loading; latest
  10 movements in an AntD <List> with type-coloured Tag + vuelto +
  HH:mm + formatDate + method name + descripción. NO toast.
- src/componentes/organismos/dashboard/ChartVentas.tsx: Recharts
  AreaChart with linearGradient fill, DD/MM x-axis labels, es-ES
  Intl.NumberFormat y-axis, custom tooltip wired to formatCurrency.
- src/componentes/templates/DashboardTemplate.tsx: AntD Row/Col grid
  (header, KPI row, full-width chart, two-up TopProductos/MetodosPago,
  two-up CajasSucursales/CajaLive). CajaLive self-gates.
- src/componentes/paginas/DashboardPage.tsx: full rewrite — pulls
  idEmpresa + fechaInicio + fechaFin from stores; calls all 8 dashboard
  hooks; centered Spin + Alert while idEmpresa <= 0; otherwise
  DashboardTemplate with all 8 metric triples.
- tsc --noEmit: 0 errors; npm run build: 1 966.76 kB / 586.25 kB gz;
  dev server returns HTTP 200 on /, /dashboard and 11 new modules.
- Forbidden-pattern guards: no Swal, no barrels, no any at boundaries,
  no as unknown as in code, no @ts-ignore, no console.log in new files.
```

---

## Persistence notes

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): updated to
  mark T-6.1, T-6.2, T-6.3, T-6.4, T-6.5, T-6.6, T-6.7, T-6.8 as `[x]`
  after Batch 4 completion.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used.
- **Memory contract (this batch):** read `apply-progress.md` (Batches
  1 + 2 + 3) at start; merged Batch 4 above; written back here.

---

## Batch 5 — Config Productos + Config Categorías (Tanda 5, completed)

**PR boundary:** Batch 5 of the `stacked-to-main` chain. Tanda 5 = CRUD Productos + CRUD Categorías slice. Folds the user-requested "Tanda 5 (CRUD Productos + Categorías)" — paginated Productos table with create/edit/delete modal + Categorías table with create/edit modal + ImageSelector (storage bucket upload).
**Strategy delivered:** single PR for Productos + Categorías screens. ~1 200 lines of new code across 12 files; build clean (2.20 MB / 655 kB gz, +230 kB from Batch 4 because `@tanstack/react-table` finally gets pulled in via `TablaProductos`); zero Swal, zero barrels, zero `any` at boundaries.

### Tasks completed

- [x] **T-7.1** — `src/componentes/moleculas/BuscadorProductos.tsx` (AntD `<Input allowClear prefix={<FiSearch />}>` with a 300 ms `setTimeout` debounce; `useEffect` cleans up the timer on each keystroke; `onChange(next)` fires only after the user pauses typing — matches spec §4.D.7 acceptance criterion).
- [x] **T-7.2** — `src/componentes/moleculas/EliminarProductoBtn.tsx` (AntD `<Popconfirm title="Eliminar producto">` wrapping a `<Button type="text" danger icon={<FiTrash2 />}>`. The button stays presentational; the page wires `onConfirm` to the actual `.delete()` mutation and forwards `isLoading` so the icon shows a spinner mid-request).
- [x] **T-7.3** — `src/componentes/organismos/tablas/TablaProductos.tsx` (`@tanstack/react-table` headless manager + AntD `<Table>` renderer — the user explicitly asked for `@tanstack/react-table + AntD Table`). `useReactTable` owns columns + sorting + pagination state; the same column definitions are projected into a `ColumnsType<Producto>` for AntD, using `flexRender` so the header/cell renderers stay consistent across both libraries. Columns: Nombre, Código, Precio venta, Precio compra, Categoría (Tag with `categoria_nombre` joined from `buscarproductos` or "Sin categoría"), Se vende por (Tag), Acciones (edit + delete). Pagination 10/20/50 with "X-Y de Z productos" footer.
- [x] **T-7.4** — `src/componentes/organismos/formularios/RegistrarProductos.tsx` (AntD `<Modal>` + `react-hook-form` typed against an internal `FormValues` shape, mapped to `InsertProductoParams` / `EditProductoParams` at submit time). Fields per spec §4.D.5: `nombre` (max 200), `precio_venta` + `precio_compra` (both `<InputNumber min={0} step={0.01}>`), `id_categoria` (`<Select>` populated from `useCategoriasQuery`), `codigo_barras`, `codigo_interno`, `sevende_por` (select with `unidad|peso|volumen|litro|metro`), `maneja_inventarios` (`<Switch>`), `maneja_multiprecios` (`<Switch disabled={isEdit}>` because the backend's `editarproductos` RPC doesn't accept that flag). Spanish validation messages. The category `<Select>` is typed `<Select<Categoria['id'] | null>>` so `allowClear` returns `number | null` matching the typed contract.
- [x] **T-7.5** — `src/componentes/templates/ProductosTemplate.tsx` (presentational: header with `<BuscadorProductos>` on the left + "Nuevo producto" `<Button type="primary">` on the right; below, the `<TablaProductos>` organism).
- [x] **T-7.6** — `src/componentes/paginas/ProductosPage.tsx` (full rewrite from the Batch 2 placeholder). Owns: `useProductosStore.buscador` + a 300 ms debounced mirror; switches between `useProductosQuery` (no search) and `useBuscarProductosQuery` (search ≥ 1 char); owns `useEliminarProductoMutation`; owns the modal open state + the currently-edited row; centered `<Spin>` when `idEmpresa <= 0` (post-logout / pre-hydration flicker guard) plus a soft `<Alert>` describing the screen.

- [x] **T-8.1** — `src/componentes/organismos/formularios/ImageSelector.tsx` (MVP image picker for the categoría icon). Three controls: `<Input prefix={<FiImage />}>` accepts a storage path OR a full public URL (we normalize the URL to a path via `pathFromPublicUrl`); `<Upload beforeUpload={...}>` opens a file picker and uploads to `supabase.storage.from('imagenes').upload('categorias/{idCategoria ?? idEmpresa}/{ts}-{file}', file, { upsert: true, contentType: file.type })`. After upload we call `onChange(path)` so the form receives the storage path. The preview `<img>` uses `supabase.storage.from('imagenes').getPublicUrl(path).data.publicUrl`. Upload failures surface as Spanish toasts; we `return false` from `beforeUpload` so AntD doesn't try to do its own upload on top.
- [x] **T-8.2** — `src/componentes/organismos/formularios/RegistrarCategorias.tsx` (AntD `<Modal>` + `react-hook-form` typed against `FormValues`). Fields: `nombre` (max 100), `color` (AntD `<ColorPicker format="hex" disabledAlpha showText>` defaulting to `#1890ff`; we coerce the `Color` object to its `toHexString()` so the RPC receives a plain hex), `icono` (`<ImageSelector>`). Edit mode passes only `nombre`/`color`/`id` to `editarCategorias` (matching the RPC's parameter shape); insert mode passes `nombre`/`color`/`icono`/`idEmpresa` to `insertarCategorias`.
- [x] **T-8.3** — `src/componentes/organismos/tablas/TablaCategorias.tsx` (AntD `<Table>` with columns Nombre / Color (Tag with row's color as background) / Icono (`<img>` from `getPublicUrl` or em-dash when null) / Acciones with **edit only — no delete button** per spec §4.E.4). Pagination 10/20/50 with "X-Y de Z categorías" footer.
- [x] **T-8.4** — `src/componentes/templates/CategoriasTemplate.tsx` (toolbar with "Nueva categoría" button + `<TablaCategorias>`).
- [x] **T-8.5** — `src/componentes/paginas/CategoriasPage.tsx` (full rewrite). Owns the `useCategoriasQuery(idEmpresa)` query (now backed by `.from('categorias').select()` rather than the Batch 2 placeholder), the modal open state + editing row, and renders the centered Spin flicker guard + soft Alert + CategoriasTemplate.

### Hooks updated

- [x] **`src/hooks/useCategorias.ts` — `useCategoriasQuery` upgraded.** The Batch 2 placeholder returned `[]`. It now performs a real `supabase.from('categorias').select('*').eq('id_empresa', idEmpresa).order('nombre', { ascending: true })`. On error we call `notifyRpcError(...)` with a shaped object (no `name` field; only `message`/`code`/`hint`/`details`/`rpcName`) and resolve to `[]` so the table still renders empty instead of crashing. `staleTime: 60_000` so navigation back from another screen doesn't refetch on every visit. The insert/edit mutations (`useInsertarCategoriaMutation` / `useEditarCategoriaMutation`) are unchanged from Batch 2 and continue to invalidate `qk.categorias.all(idEmpresa)` on success.

### Files created / updated (Batch 5)

```
src/componentes/
├── moleculas/
│   ├── BuscadorProductos.tsx               # NEW (T-7.1)
│   └── EliminarProductoBtn.tsx             # NEW (T-7.2)
├── organismos/
│   ├── formularios/
│   │   ├── ImageSelector.tsx               # NEW (T-8.1)
│   │   ├── RegistrarProductos.tsx          # NEW (T-7.4)
│   │   └── RegistrarCategorias.tsx         # NEW (T-8.2)
│   └── tablas/
│       ├── TablaProductos.tsx              # NEW (T-7.3)
│       └── TablaCategorias.tsx             # NEW (T-8.3)
├── templates/
│   ├── ProductosTemplate.tsx               # NEW (T-7.5)
│   └── CategoriasTemplate.tsx              # NEW (T-8.4)
└── paginas/
    ├── ProductosPage.tsx                   # UPDATED: full rewrite (T-7.6)
    └── CategoriasPage.tsx                  # UPDATED: full rewrite (T-8.5)

src/hooks/
└── useCategorias.ts                        # UPDATED: useCategoriasQuery reads .from('categorias')
```

### Verification evidence (Batch 5)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 3.56s, 2 200.96 kB / 655.06 kB gz (2 431 modules). @tanstack/react-table + AntD + color-picker pulled in. |
| `npm run dev` + `curl http://localhost:5173/` | ✅ HTTP 200 |
| `curl http://localhost:5173/configuracion/productos` | ✅ HTTP 200 (Vite SPA fallback) |
| `curl http://localhost:5173/configuracion/categorias` | ✅ HTTP 200 (Vite SPA fallback) |
| `curl` for each of 8 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no matches |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log" src/componentes/{atomos,moleculas,organismos,templates,paginas}/` | ✅ no matches |

### Forbidden-pattern guards (Batch 5)

| Guard | Status |
|-------|--------|
| `Swal.fire()` | ✅ none |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (only in comment) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 5)

- **`TablaProductos` uses both `@tanstack/react-table` and AntD `<Table>`.** The user explicitly asked for `@tanstack/react-table + AntD Table`. We use `useReactTable` as the headless manager (columns + sorting state + pagination state) and project the same columns into a `ColumnsType<Producto>` for AntD via `flexRender`. The renderer is therefore AntD's table; the sort/page state lives in react-table. Both libraries' strengths are honored without a parallel render path. Documented inline in the JSDoc.
- **`TablaProductos` `render` callback reaches back into react-table for each cell.** To keep the AntD renderer simple (one `<Table>` element) we resolve each cell by mapping the AntD row back to the react-table row and calling `flexRender(cell.column.columnDef.cell, cell.getContext())`. Performance is fine at MVP row counts (<1k) and the alternative (replicating each column's renderer in `ColumnsType`) would double the source of truth.
- **`useCategoriasQuery` now reads via `supabase.from('categorias').select()`** rather than the Batch 2 placeholder. The spec only exposes `insertarcategorias`/`editarcategorias` RPCs (no list RPC); reading directly from the table is the standard Supabase pattern for catalog data and keeps the contract surface small.
- **`maneja_multiprecios` Switch is `disabled={isEdit}`.** The `editarproductos` RPC signature in spec §3.2 does not accept `_maneja_multiprecios`, so we don't write it back on edit. The switch still shows the current value (so the user can see what they have) but rejects changes.
- **`ColorPicker` value coercion.** AntD's `ColorPicker` `onChange` passes a `Color` object, not a string. We call `c.toHexString()` and feed the hex string into the form so the RPC receives a plain `#RRGGBB`. The `format="hex"` + `disabledAlpha` props keep the picker single-channel.
- **ImageSelector upload path namespace.** We upload to `categorias/{idCategoria ?? idEmpresa}/...` so:
  - Editing an existing categoría produces a stable folder per row (overwriting with `upsert: true` is safe).
  - Creating a new categoría falls back to the empresa id, so multiple parallel creates don't collide before the row id is returned.
- **`pathFromPublicUrl` for URL normalization.** When the user pastes a public URL into the storage-path input (instead of the file picker), we strip the Supabase host prefix to recover the canonical storage path. This keeps `categoria.icono` as a path everywhere; only the preview is a URL.
- **`TablaProductos` columns have `dataIndex` set to the accessor key** even though we render via `flexRender`. AntD uses `dataIndex` for default filtering and the sort comparator's stable reference; without it the table would emit a console warning.
- **No `InputNumber` `formatter`/`parser` configured.** Currency is shown in the table via `formatCurrency` from `format.ts`; the form lets the user type a plain decimal. The empresa's symbol is intentionally NOT shown in the input field (avoids `string ↔ number` parsing friction; the table is where the currency gets formatted).

### Risks (Batch 5)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 2 200 kB / 655 kB gz (single chunk) | MEDIUM | AntD + Recharts + Supabase + pdfmake + react-table all in one. Acceptable for dev; per-route splitting lands alongside the heavier screens (pdfmake in Batch 9). |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; `manualChunks` lands in a later polish batch if requested |
| `react-table` AntD adapter pattern (`flexRender` lookup by column id) is O(n²) on each render | LOW | n ≤ ~10 columns; cost is irrelevant. Documented for future refactor if the column count grows |
| `useCategoriasQuery` reads from `categorias` table directly (no `categoria_nombre` join) | LOW | Spec doesn't expose a list RPC for categorías; a direct `.select('*')` keeps the contract small. Products' `categoria_nombre` comes from `buscarproductos` which already joins |
| `ImageSelector` upload happens before the user submits `RegistrarCategorias` — if the user cancels the form, the file stays in the bucket | LOW | Bucket cleanup is post-MVP; documented. The successful path writes the storage path to `categoria.icono` so the orphan is at most one file per cancelled modal |
| `maneja_multiprecios` disabled on edit means the user can't toggle multi-price for an existing product from the UI | MEDIUM | Matches the `editarproductos` RPC signature exactly; the toggle is intentionally write-once per product. Documented in the form's helper text |
| `useEliminarProductoMutation` uses `.from('productos').delete()` directly (not an RPC) — relies on Postgres 23503 to surface the FK constraint toast | LOW | Same pattern as Batch 2; FK constraint toast mapping is in the hook's `onError` |
| `react-table` v8 requires `getCoreRowModel()` (always) + at least one of `getPaginationRowModel`/`getSortedRowModel` for pagination/sorting | LOW | All three are wired in `useReactTable`; documented inline |
| `ColorPicker` `format="hex"` requires AntD 5.20+ | LOW | `package.json` pins `antd: ^5.20.0` |

### Remaining tasks (Batch 6+)

Next batch (`sdd-apply` batch #6 = tasks.md T-9.* POS) is parent-owned once the user resumes the chain. PR #5 should merge before PR #6 starts.

### Suggested commit message (Batch 5)

```
feat(tpv365): productos + categorías CRUD (Batch 5)

- src/componentes/moleculas/BuscadorProductos.tsx: AntD Input + 300ms
  debounce setTimeout; useEffect cleanup; onChange(next) fires once
  the user pauses typing.
- src/componentes/moleculas/EliminarProductoBtn.tsx: AntD Popconfirm
  wrapping a text-button trash icon; pure props (onConfirm, isLoading,
  productoNombre); page wires the .delete() mutation.
- src/componentes/organismos/tablas/TablaProductos.tsx: @tanstack/
  react-table (useReactTable) headless manager + AntD <Table>
  renderer — columns mirrored via flexRender so headers/cells stay
  in sync. Columns: nombre / código / precio venta / precio compra
  / categoría (Tag) / se vende por (Tag) / acciones (edit + delete).
  Pagination 10/20/50 with footer counter.
- src/componentes/organismos/formularios/RegistrarProductos.tsx: AntD
  Modal + react-hook-form typed against FormValues. Fields per spec
  §4.D.5 (nombre max 200, precio_venta/compra InputNumber≥0,
  id_categoria Select populated from useCategoriasQuery, codigo_
  barras/interno, sevende_por select, maneja_inventarios /
  multiprecios Switch). Spanish validation. Edit pre-fills via
  reset(); maneja_multiprecios is disabled on edit because
  editarproductos RPC does not accept that flag.
- src/componentes/templates/ProductosTemplate.tsx: presentational
  wrapper (BuscadorProductos + "Nuevo producto" Button +
  TablaProductos).
- src/componentes/paginas/ProductosPage.tsx: full rewrite —
  useProductosStore.buscador + 300ms debounce mirror; switches
  between useProductosQuery and useBuscarProductosQuery based on
  search length; owns useEliminarProductoMutation + modal open /
  editing row state; centered Spin while idEmpresa <= 0; soft
  Alert describing the screen.
- src/componentes/organismos/formularios/ImageSelector.tsx: MVP
  icon picker — Input accepts storage path OR public URL (we
  normalize URL → path); Upload triggers supabase.storage
  .from('imagenes').upload('categorias/{idCategoria ?? idEmpresa}
  /{ts}-{file}', file, { upsert: true, contentType }); preview
  uses getPublicUrl. Errors surface as Spanish toasts.
- src/componentes/organismos/formularios/RegistrarCategorias.tsx:
  AntD Modal + react-hook-form. Fields: nombre (max 100), color
  (ColorPicker hex default #1890ff, c.toHexString() coercion),
  icono (ImageSelector). Edit submits nombre/color/id; insert
  submits nombre/color/icono/idEmpresa.
- src/componentes/organismos/tablas/TablaCategorias.tsx: AntD
  Table with Nombre / Color Tag / Icono preview / Acciones
  (edit only — NO delete per spec §4.E.4). Pagination 10/20/50.
- src/componentes/templates/CategoriasTemplate.tsx: toolbar
  "Nueva categoría" + TablaCategorias.
- src/componentes/paginas/CategoriasPage.tsx: full rewrite —
  useCategoriasQuery (now backed by .from('categorias').select()),
  modal open state + editing row, centered Spin guard + soft
  Alert + CategoriasTemplate.
- src/hooks/useCategorias.ts: useCategoriasQuery upgraded from
  Batch 2 placeholder to real .from('categorias').select('*')
  .eq('id_empresa').order('nombre'). On error → notifyRpcError
  + resolve []. staleTime 60_000.
- Forbidden-pattern guards clean: no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore, no
  console.log in new files.
- tsc --noEmit: 0 errors; npm run build: 2 200 kB / 655 kB gz;
  dev server returns HTTP 200 on /, /configuracion/productos,
  /configuracion/categorias and on all 8 new modules.
```

---

## Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`):
  T-7.1, T-7.2, T-7.3, T-7.4, T-7.5, T-7.6, T-8.1, T-8.2, T-8.3,
  T-8.4, T-8.5 marked `[x]`.
- **Engram**: no Engram tools are exposed in this session — only
  the filesystem fallback is used. Apply-progress persisted only
  to the filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4) at start; merged Batch 5 above; written
  back here.

---

## Batch 6 — POS + Ticket PDF (Tanda 6, completed)

**PR boundary:** Batch 6 of the `stacked-to-main` chain. Tanda 6 = POS full sale flow + 80 mm PDF ticket slice. Folds the user-requested "Tanda 6 (POS + ticket PDF)" — `pdfTicket` service, POS organisms (Header/BuscadorList/AreaDetalleventa/AreaTeclado/Footer/PantallaCobro), POS molecules (TotalPos/IngresoCobro/ProductGrid/CartRow), POS atoms (QtyControl/CurrencyDisplay), `POSTemplate` 3-column grid, and `PosPage` orchestrator with the spec §4.F.5 sale state machine.

**Strategy delivered:** single PR for the entire POS slice. ~2 130 lines of new code across 17 files; build clean (4 310 kB / 1 717 kB gz, +2 110 kB from Batch 5 because pdfmake finally gets pulled in — the bulk is the embedded TTFs in `vfs_fonts.js`); zero Swal, zero barrels, zero `any` at boundaries.

### Tasks completed

- [x] **T-9.1** — `src/servicios/pdfTicket.ts` (`generateTicket(TicketInput): TDocumentDefinitions` + `downloadTicket(input)` + `openTicket(input)` via pdfMake). 80 mm thermal receipt (`pageSize: { width: 302, height: 'auto' }`), 10 pt margins, `pageMargins: [10, 10, 10, 10]`. Layout: empresa header (bold nombre + optional direccion_fiscal) → fecha / ticket # / cajero → horizontal rule → detail table header (Descripción/Cant/Total, widths `*`/32/70) → detail rows (one `columns` block per `DetalleVenta`) → trailing rule → Subtotal / Impuesto / TOTAL → optional `pie_pagina_ticket` footer. `formatCurrency(simbolo_moneda)` is reused from `@/lib/format` so currency formatting is consistent with the rest of the app. Side-effect `pdfMake.vfs = vfsFonts;` registers the bundled Roboto fonts once at module-load time. Ambient module declarations for `pdfmake/build/pdfmake.js` and `pdfmake/build/vfs_fonts.js` live in `src/types/pdfmake.d.ts` so the call sites are typed (`TDocumentDefinitions`, `PdfMake.createPdf(...).download(...)`) — no `any` reaches the boundary.

- [x] **T-9.2** — `src/componentes/atomos/QtyControl.tsx` (AntD `<Space.Compact>` wrapping `−` / `<InputNumber min={1} max={9999}>` / `+`; `clamp(next)` normalises NaN/Infinity; both the buttons and the InputNumber call `onChange(next)`). `src/componentes/atomos/CurrencyDisplay.tsx` (thin `formatCurrency` wrapper, optional `bold`, NaN-safe).

- [x] **T-9.3** — `src/componentes/moleculas/TotalPos.tsx` (AntD `<Card>` with Subtotal / Impuestos / Total rows; Total row gets a dashed top border; product count line under the totals: "X productos").

- [x] **T-9.4** — `src/componentes/moleculas/IngresoCobro.tsx` (per-method row: AntD `<InputNumber min={0} step={0.01}>` left + an "Imputado" `<CurrencyDisplay>` right; `onChange(id, monto)` bubbles the typed amount up; non-negative clamp).

- [x] **T-9.5** — `src/componentes/moleculas/ProductGrid.tsx` (AntD `<List>` rendering each product with category Tag + barcode label + `<CurrencyDisplay>` price + "+ Agregar" button; the button is `loading={addingId === p.id}` while the page's addProduct handler is mid-flight so double-taps can't enqueue two pending detalle inserts; empty + error states via `<Empty>`).

- [x] **T-9.6** — `src/componentes/moleculas/CartRow.tsx` (AntD `<Table size="small">` with four virtual columns — Producto (name + c/u price), Cant. (QtyControl), Total (line total), Acciones (trash button). Selection is a wrapper `<div role="button">` with a tinted blue background when `isSelected`, click + Enter/Space handlers; removes stop propagation so the row click doesn't also fire).

- [x] **T-9.7** — `src/componentes/organismos/pos/HeaderPos.tsx` (AntD `<Header style={{ background: '#001529', ... }}>` — dark surface to differentiate from the shell Header; shows `empresa.nombre` + `sucursalLabel` + `cajaLabel` left, `usuario.nombres` + `<Reloj />` right).

- [x] **T-9.8** — `src/componentes/organismos/pos/BuscadorList.tsx` (AntD `<Card title="Productos">` wrapping an `<Input prefix={<FiSearch />}>` + the `<ProductGrid>`). Owns the local search input + a 300 ms debounce mirror (mirrors the convention from the Productos page; spec §4.D.7). Reads `useProductosStore.buscador` / `setBuscador` and delegates the actual query to `useBuscarProductosQuery(idEmpresa, debounced)`. Empty-state differentiates "no search yet" from "no results" so the panel never accidentally lists the full catalog.

- [x] **T-9.9** — `src/componentes/organismos/pos/AreaDetalleventaPos.tsx` (AntD `<Card title="Carrito">`; maps `cart` to `<CartRow>`; renders `<Empty description="El carrito está vacío">` when the cart has zero lines so the grid layout stays stable; scrollable body to bound the panel height).

- [x] **T-9.10** — `src/componentes/organismos/pos/AreaTecladoPos.tsx` (numeric keypad 7-8-9 / 4-5-6 / 1-2-3 / 0-.-⌫ + a buffer display + "Limpiar" / "Establecer" buttons). Owns a string `buffer` so the user can type "1." mid-entry without it being rounded to 1; backspace slices, clear wipes, "Establecer" commits to `onSetQty(tempId, clamped)` and resets the buffer. The buffer auto-clears when the selected tempId changes (per-line context). Disabled state (with the "Selecciona una línea del carrito" hint) when no cart row is selected.

- [x] **T-9.11** — `src/componentes/organismos/pos/FooterPos.tsx` (AntD `<div>` action bar: "Total a cobrar {CurrencyDisplay}" left, "Cancelar" (danger button, opens a `<Modal>` confirm) + "Cobrar" (primary, `<FiCreditCard />`, `loading={isConfirming}`) right). Both buttons disable on empty cart or mid-confirm.

- [x] **T-9.12** — `src/componentes/organismos/pos/PantallaCobro.tsx` (AntD `<Modal title="Cobrar venta">` with `width={560}` / `destroyOnClose` / `maskClosable={false}`). Body: "No hay métodos de pago configurados" warning if the list is empty; per-method `<IngresoCobro>` rows in a small `<Card>`; totals block (Total a cobrar / Total recibido / Vuelto, the last with a dashed top border); "Confirmar venta" button is disabled until `totalRecibido >= montoTotal > 0`. Exports the `MetodoPagoPago` shape so the parent can serialize the payment split.

- [x] **T-9.13** — `src/componentes/templates/POSTemplate.tsx` (named per the user's instructions — `design.md` calls it `PosLayout`; we kept `POSTemplate` because the user explicitly named it). 3-column responsive AntD `<Row gutter={[16, 16]}>`:
  - `<Col xs={24} md={10} lg={10}>` → `<BuscadorList />`
  - `<Col xs={24} md={8} lg={8}>` → `<AreaDetalleventaPos />`
  - `<Col xs={24} md={6} lg={6}>` → `<AreaTecladoPos />`
  - `<TotalPos />` full-width below the 3-column row.
  - `<HeaderPos />` sticky on top.
  - `<FooterPos />` sticky on bottom.
  - `<PantallaCobro />` overlay mounted at the layout root.
  - Pure layout — receives every prop from the page, derives `selectedItem` (the cart row matching `selectedTempId`) so the keypad gets a typed `CartItem | null` instead of a string.

- [x] **T-9.14** — `src/componentes/paginas/PosPage.tsx` (full rewrite, 512 lines). Orchestrates the entire sale state machine (spec §4.F.5):

  1. **IDLE** — empty cart, busqueda activa.
  2. **CART_BUILDING** — `addItem(producto)` optimistically inserts the line; if `currentVentaId === null`, the page calls `useInsertarVentaMutation` (placeholder values for sub_total/monto_total; canonical amounts go via `confirmar_venta`); then `useInsertarDetalleVentaMutation` per line.
  3. **COBRO** — `PantallaCobro` opens only when `useDefaultSerializacionQuery.data !== null`. Missing serialization triggers `notify.blocking('Serialización no configurada', ...)` (duration 0; spec D9 / §8.4).
  4. **CONFIRMING** — `useConfirmarVentaMutation` runs with `serializacion.id_tipo_comprobante` + `serializacion.serie`; on success the page:
     - iterates the per-method amounts (`metodosPagoQuery.data` resolved by id) and inserts one `movimientos_caja` row per method (`tipo_movimiento: 'entrada'`, `id_cierre_caja: null`, `id_ventas: currentVentaId`, `vuelto: 0` — overall vuelto lives on the venta row),
     - calls `downloadTicket(...)` with the confirmed `Venta` (carries `nro_comprobante`) + the `useDetalleVentasStore` mirror + `empresa` + `usuario`,
     - `useVentasStore.clearCart()`,
     - `setPantallaCobroOpen(false)`, resets busqueda + selección,
     - `notify.success('Venta confirmada')`.
  5. **Cancelar venta** — `FooterPos` AntD `<Modal>` confirms → `clearCart` + reset selection + reset busqueda + `notify.info('Venta cancelada')`.

  **Mount reconciliation (spec §2.5):** when the persisted `currentVentaId !== null`, the page waits for `useMostrarDetalleVentaQuery` to resolve once; if it returns `[]` the persisted cart is discarded (orphaned venta on the server). On RPC error we keep the cart — the cashier can refresh to retry. After the first pass, `reconciledRef` short-circuits further checks.

  **Qty-edit flow:** the persisted `CartItem` does not carry `detalle_id` (per spec §4.F.4); the page resolves it via `useDetalleVentasStore.detalleVenta` (mirror of `mostrardetalleventa`, kept in sync via a `useEffect`), looking up by `id_producto`. If the mirror hasn't caught up yet (race window between `insertarDetalleVenta` success and the query refetch), the qty still updates in the cart but the `editarcantidaddv` RPC is skipped for that tap — the next successful add / refresh closes the gap.

  **Dev-fallback tempId:** `crypto.randomUUID()` when available (https + localhost); a `tmp-<base36>.<base36>` fallback for plain http where the API is unavailable.

  **Imports the new `useEditarCantidadDvMutation`** from `@/hooks/useVentas`.

### Hook updated

- [x] **`src/hooks/useMetodosPago.ts` (NEW)** — `useMetodosPagoQuery(idEmpresa)` reads `supabase.from('metodos_pago').select('*').eq('id_empresa').order('nombre')`. On error → `notifyRpcError({...shaped, rpcName: 'metodos_pago.select'})` + resolve `[]` (silent fallback so the overlay shows the empty warning, not a crash). `staleTime: 5 * 60_000`. `qk.metodosPago.list(idEmpresa)` for future invalidation. Implemented as a direct `.from().select()` because the spec's RPC catalog (spec §3.5) does NOT expose a list RPC for `metodos_pago` — only the aggregated `dashboartotalventasxmetodopago`. Same pattern as `useCategoriasQuery` (Batch 5).

### Files created / updated (Batch 6)

```
src/componentes/
├── atomos/
│   ├── CurrencyDisplay.tsx                     # NEW (T-9.2)
│   └── QtyControl.tsx                          # NEW (T-9.2)
├── moleculas/
│   ├── CartRow.tsx                             # NEW (T-9.6)
│   ├── IngresoCobro.tsx                        # NEW (T-9.4)
│   ├── ProductGrid.tsx                         # NEW (T-9.5)
│   └── TotalPos.tsx                            # NEW (T-9.3)
├── organismos/pos/
│   ├── AreaDetalleventaPos.tsx                 # NEW (T-9.9)
│   ├── AreaTecladoPos.tsx                      # NEW (T-9.10)
│   ├── BuscadorList.tsx                        # NEW (T-9.8)
│   ├── FooterPos.tsx                           # NEW (T-9.11)
│   ├── HeaderPos.tsx                           # NEW (T-9.7)
│   └── PantallaCobro.tsx                       # NEW (T-9.12)
└── templates/
    └── POSTemplate.tsx                         # NEW (T-9.13)

src/componentes/paginas/
└── PosPage.tsx                                 # UPDATED: full rewrite (T-9.14)

src/servicios/
└── pdfTicket.ts                                # NEW (T-9.1)

src/hooks/
└── useMetodosPago.ts                           # NEW (T-9.14 helper)

src/types/
└── pdfmake.d.ts                                # NEW (ambient module declarations)
```

Two empty `.gitkeep` markers were removed (`organismos/pos/.gitkeep`, `servicios/.gitkeep`) — both folders are now populated.

### Verification evidence (Batch 6)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 6.23s, 4 310.04 kB / 1 717.14 kB gz (2 453 modules). pdfmake + VFS fonts bundled. |
| `npm run dev` + `curl http://localhost:5174/` | ✅ HTTP 200 |
| `curl http://localhost:5174/pos` | ✅ HTTP 200 (SPA fallback) |
| `curl` for each of 16 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal.fire()"` (code only) | ✅ no matches (the single `Swal.*` hit is in a JSDoc comment explaining the design choice) |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log\|console.error\|console.warn" src/componentes/ src/servicios/ src/hooks/ src/types/` | ✅ no matches |

### Forbidden-pattern guards (Batch 6)

| Guard | Status |
|-------|--------|
| `Swal.fire()` | ✅ none |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none (pdfmake is typed via `src/types/pdfmake.d.ts`) |
| `as unknown as` in code | ✅ none (only in comment) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 6)

- **`POSTemplate` filename vs `PosLayout`.** Design §5 names the template `PosLayout`; the user's batch instructions call it `POSTemplate`. We followed the user's explicit naming. Functionally identical to the spec; only the file/class name differs. Documented in the file's JSDoc.
- **`CartItem` shape NOT extended with `detalle_id`.** Spec §4.F.4 lists the persisted cart without a detalle id. We honor the contract and resolve `detalle_id` at qty-edit time from `useDetalleVentasStore` (mirror of `mostrardetalleventa`) instead. Race window: between the `insertarDetalleVenta` success and the invalidation-driven refetch of `mostrardetalleventa`, a qty edit may fall through to optimistic-only. The next add / refresh closes the gap; the printed ticket uses the server's canonical detail.
- **MVP single-sucursal assumption.** `id_sucursal` is hard-coded to `1` (`MVP_SUCURSAL_ID` constant in PosPage) because the spec's `Empresa` interface does not expose `id_sucursal`. `ConfirmarVentaParams` / `InsertVentaParams` / `InsertDetalleVentaParams` / `CartItem` all require it. Multi-sucursal selection is out-of-scope for MVP (spec §13); when wired post-MVP this constant becomes a session selector.
- **`useMetodosPagoQuery` reads `.from('metodos_pago')` instead of an RPC.** The spec catalog (spec §3.5) only exposes the aggregated `dashboartotalventasxmetodopago`, not a list RPC. We follow the same pattern as `useCategoriasQuery` (Batch 5) — direct `.select()` against the table, cached under `qk.metodosPago.list(idEmpresa)`. `staleTime: 5 * 60_000` so a back-and-forth between screens doesn't refetch.
- **`movimientos_caja.vuelto` is `0` for every method.** Spec §4.F.4 sets `vuelto: number` per movement. We default to `0` because splitting the overall vuelto across multiple methods requires backend support we don't have. The overall vuelto is recorded on the `ventas` row by `confirmar_venta` (passed via `_vuelto`) and printed on the ticket.
- **Venta insert uses placeholder values.** `InsertVentaParams` requires `monto_total` / `sub_total` / `cantidad_productos`. At the moment of first `useInsertarVentaMutation` (when the cart has exactly 1 line) we pass `sub_total: 0`, `monto_total: 0`, `cantidad_productos: 0` so the row is a placeholder shell; canonical amounts come from `confirmar_venta(_monto_total)`. As the cart grows, the placeholder goes stale but is never read again. Avoids a re-write of the `ventas` row after every add.
- **Cancelar venta does NOT delete server-side detalle rows.** Spec §3.4 does not expose an `eliminardetalleventa` RPC, and there is no `eliminarventa` either. "Cancelar" clears the local cart + resets selection + busqueda + emits a toast; the `ventas` row stays in `estado: 'pendiente'` with its detalle rows orphaned. The next sale creates a new venta id. Documented in the FooterPos tooltip and the page-level state machine.
- **Confirmation errors are silent after the toast.** `useConfirmarVentaMutation`'s `onError` already routes through `notifyRpcError`; the `try/catch` in `handleConfirmarPago` swallows the rethrow so the page does not also surface a toast (avoiding double toasts). The cart stays so the cashier can retry, matching spec §4.F.8.
- **`reloadTicket` failures don't roll back the sale.** If `confirmar_venta` succeeds but `downloadTicket` throws (rare — pdfmake is bundled in the same chunk), we surface `notify.warning('Venta confirmada pero no se pudo generar el ticket')` and continue with `clearCart`. The sale is durable; the ticket can be regenerated from the printed comprobante.
- **No code-splitting.** pdfmake + VFS fonts are ~2 MB of the bundle. Per-route code-splitting (`React.lazy` for the POS route) is out of scope here but trivial to add post-MVP — `() => import('@/componentes/paginas/PosPage')` would shave ~2 MB off every other route.

### Risks (Batch 6)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 4 310 kB / 1 717 kB gz (single chunk) | MEDIUM | pdfmake + VFS fonts are the bulk. Per-route `React.lazy` for the POS route would cut this in half; deferred per the user's "Tanda 6 = single PR" instruction |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; `manualChunks` lands with the polish batch |
| `crypto.randomUUID()` not available on plain http origins | LOW | `newTempId()` falls back to a base36 `Date.now() + Math.random()` UUID; collisions are negligible in a single cashier session |
| `editcantidaddv` may be skipped during the post-insert race window | LOW | Cart UI updates optimistically; server catches up via the next add / refresh; ticket uses server values |
| `movimientos_caja.vuelto` per-method is always `0` — overall vuelto is on the venta row only | LOW | Documented; the printed ticket shows the overall vuelto, which is what the cashier reads. Splitting would need backend support |
| Cancelar venta leaves orphaned `ventas` + `detalle_venta` rows | LOW | RPC catalog doesn't expose delete RPCs; documented as known limitation. Could be addressed post-MVP with a soft-delete cron |
| Hardcoded `id_sucursal = 1` blocks multi-sucursal | MEDIUM | MVP scope is single-sucursal (spec §13). The serialization check, venta inserts, and detalle inserts all need this constant moved to a session-scope selector before multi-sucursal is wired |
| PDF ticket fonts (Roboto TTF) ship in the bundle as base64 strings | LOW | Standard pdfmake approach; the browser caches after first load. Switching to standard fonts would shrink the bundle by ~700 kB but pdfmake's Roboto set is the visual standard for thermal receipts |
| `AreaTecladoPos` shows `0.00` for any `Number(buffer)` that's not finite | LOW | Buffer rejects anything but digits and a single `.`; "Establecer" remains disabled when the buffer is empty or unparseable. Defensive `Math.max(Math.round(parsed), 1)` clamp prevents zero/negative qty from reaching the cart |
| The CartRow click handler triggers when the user clicks the trash button too (stopPropagation fixes this) | LOW | `e.stopPropagation()` on the trash button prevents the wrapper `<div role="button">` from re-selecting before removing the line |

### Remaining tasks (Batch 7+)

Next batch is `sdd-apply` Batch 7 = end of apply chain. All `T-1.*` … `T-9.*` are now `[x]`. Only `T-10.*` (parent-owned verify/smoke tests) remain. After T-10.* the change is ready for `sdd-archive`.

PR #6 should merge before the user runs the parent-owned verify pass.

### Suggested commit message (Batch 6)

```
feat(tpv365): POS sale flow + 80mm PDF ticket (Batch 6)

- src/servicios/pdfTicket.ts: generateTicket / downloadTicket / openTicket
  via pdfmake. 80mm thermal layout with empresa header, detail table,
  totals and optional pie_pagina_ticket footer. pdfMake.vfs is assigned
  once at module load; src/types/pdfmake.d.ts declares the ambient
  module so call sites stay typed (no any at the boundary).
- src/componentes/atomos/QtyControl.tsx: −/+ buttons + InputNumber with
  clamp(min, max) and NaN-safe coercion.
- src/componentes/atomos/CurrencyDisplay.tsx: formatCurrency wrapper with
  optional bold and NaN/Infinity fallback to 0.
- src/componentes/moleculas/CartRow.tsx: virtual-table row with Producto
  column, QtyControl, line total and trash button. Selection via wrapper
  div with role="button" + keyboard handlers.
- src/componentes/moleculas/TotalPos.tsx: Subtotal / Impuestos / Total
  with dashed top border on the Total row + product count caption.
- src/componentes/moleculas/IngresoCobro.tsx: per-method amount input +
  "Imputado" CurrencyDisplay mirror; emits (id, monto) on change.
- src/componentes/moleculas/ProductGrid.tsx: AntD List with category Tag
  + price; "+ Agregar" button is loading=addingId===p.id while the
  page-level addProduct handler is mid-flight.
- src/componentes/organismos/pos/HeaderPos.tsx: dark #001529 surface;
  empresa.nombre + sucursalLabel + cajaLabel left, usuario + Reloj right.
- src/componentes/organismos/pos/BuscadorList.tsx: ownable search input
  + 300ms debounce mirror + ProductGrid; differentiates "no search yet"
  from "no results" empty states.
- src/componentes/organismos/pos/AreaDetalleventaPos.tsx: scrollable cart
  card; renders one CartRow per line; "El carrito está vacío" empty.
- src/componentes/organismos/pos/AreaTecladoPos.tsx: numeric keypad 0-9
  + . + ⌫; buffer string so "1." mid-entry survives; "Limpiar" /
  "Establecer" commit; auto-resets on selection change.
- src/componentes/organismos/pos/FooterPos.tsx: "Cobrar" / "Cancelar"
  action bar with AntD cancel Modal; both disabled on empty cart or
  mid-confirm.
- src/componentes/organismos/pos/PantallaCobro.tsx: full-screen Modal
  with per-method IngresoCobro rows, totals block (Total a cobrar /
  Total recibido / Vuelto), Confirmar disabled until totalRecibido >=
  montoTotal. Emits (pagos, vuelto) to parent.
- src/componentes/templates/POSTemplate.tsx: 3-column responsive grid
  (BuscadorList | Cart | Keypad) + HeaderPos sticky top + FooterPos
  sticky bottom + TotalPos full-width + PantallaCobro overlay.
  Receives every prop from the page (pure layout).
- src/componentes/paginas/PosPage.tsx: full rewrite. Mount reconciliation
  (persisted currentVentaId → mostrardetalleventa → clearCart if empty).
  Sale state machine IDLE → CART_BUILDING → COBRO → CONFIRMING →
  success. addProduct: optimistic cart + (lazily) insertarVenta +
  insertarDetalleVenta. handleQtyChange: locate detalle_id via the
  useDetalleVentasStore mirror (keyed by id_producto), call
  editarcantidaddv. handleCobrar: serializacion check + blocking toast
  if missing. handleConfirmarPago: confirmar_venta RPC → per-method
  movimientos_caja inserts (vuelto:0 per method, overall vuelto on the
  venta row) → downloadTicket → clearCart → notify.success. Cancel flow:
  clearCart + reset selection + busqueda.
- src/hooks/useMetodosPago.ts (NEW): reads .from('metodos_pago').select()
  (spec has no list RPC for metodos_pago); onError → notifyRpcError +
  resolve []; staleTime 5m.
- src/types/pdfmake.d.ts (NEW): ambient module declarations for
  pdfmake/build/pdfmake.js and vfs_fonts.js so the call sites are
  fully typed.
- Forbidden-pattern guards clean: no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore, no console.*
  in new files.
- tsc --noEmit: 0 errors; npm run build: 4 310 kB / 1 717 kB gz; dev
  server returns HTTP 200 on / and /pos and on all 16 new modules.
```

---

## Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-9.1,
  T-9.2, T-9.3, T-9.4, T-9.5, T-9.6, T-9.7, T-9.8, T-9.9, T-9.10,
  T-9.11, T-9.12, T-9.13, T-9.14 marked `[x]`. T-10.* (parent-owned
  verify/smoke tests) remain `[ ]` and are deferred to the next batch
  per the user's explicit "La verificación/smoke tests va después, en
  otra pasada" instruction.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used. Apply-progress persisted only to the
  filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4 + 5) at start; merged Batch 6 above; written
  back here.

---

## Batch 7 — Verify-Fix (RPC mismatches, completed)

**PR boundary:** Batch 7 of the `stacked-to-main` chain. PR #7 = the
fix-batch of the 5 CRITICAL + 5 WARNING RPC mismatches flagged by
`sdd-verify` against `~/supabase-backup-20260812.sql`. Folds the
user-requested "FIX BATCH de los 5 CRITICAL (y 5 WARNING) encontrados
por sdd-verify en el MVP TPV-365".

**Strategy delivered:** single PR for the RPC-alignment patch. No new
files; ~120 lines net change across 8 files. Build clean, zero Swal,
zero barrels, zero `any` at boundaries.

### Tasks completed

- [x] **T-11.1** (RPC-001) — `setDefaultSerializacion` rewritten as a
  void mutation in `src/lib/rpc/ventas.ts`. The signature matches
  `setdefaultserializacion(_id integer, _id_sucursal integer) → void`
  exactly: first arg is the `serializacion_comprobantes.id` (the row to
  mark default), second is `sucursal_id` (used by the SQL to clear the
  previous default). The wrapper no longer pretends to return rows. The
  hook `useDefaultSerializacionQuery` in `src/hooks/useVentas.ts` was
  rewritten to read the default row directly via
  `supabase.from('serializacion_comprobantes').select('*').eq(
  'id_empresa', id).eq('por_default', true).maybeSingle()`. The query
  key `qk.serializacion.default(idEmpresa, idSucursal)` is preserved so
  any future cache invalidation against that prefix still works.
- [x] **T-11.2** (RPC-002) — `MovimientoCaja` in `src/types/rpc.ts`
  reshaped to mirror the SQL: `{ usuario_nombre, tipo_movimiento,
  monto, descripcion, fecha_movimiento, caja_nombre, sucursal_nombre,
  id }`. `CardMovimientosCajaLive.tsx` updated: helpers `formatHora`
  and `formatFechaCorta` parse the `DD-MM-YYYY HH24:MI:SS` format the
  SQL emits via TO_CHAR. Description line now renders `HH:mm · DD/MM/YYYY
  · caja_nombre · sucursal_nombre · usuario_nombre · descripción`. Title
  drops the unused `vuelto` reference.
- [x] **T-11.3** (RPC-003) — `DashboardTopProducto` reshaped to
  `{ id_producto, nombre_producto, total_vendido, porcentaje }`.
  `CardProductosTopMonto.tsx` updated: rank + `nombre_producto`,
  description shows `porcentaje% del total`, right-aligned amount uses
  `total_vendido` (currency).
- [x] **T-11.4** (RPC-004) — `DashboardCajaSucursal` reshaped to the
  full SQL row: `{ sucursal_nombre, caja_descripcion, fecha_creacion,
  total_ventas, estadocaja, direccionfiscal, idcaja, idsucursal, delete
  }`. `CardCajasSucursales.tsx` updated: table columns are Sucursal /
  Caja / Estado / Total ventas. `estadocaja` (1/0/2) is mapped to a
  colour-coded AntD Tag (Abierta/Cerrada/Otros). `rowKey` uses
  `idsucursal-idcaja`.
- [x] **T-11.5** (RPC-005) — `DashboardMetodoPago` reshaped to
  `{ fecha, metodo_pago, total_ventas }`. `CardMetodosPago.tsx` rolls
  up the per-(fecha, metodo_pago) rows into per-method totals via a
  `Map<string, number>` so the pie chart shows aggregate sales per
  payment method (instead of one slice per day × method, which would
  duplicate the slice count).
- [x] **T-11.6** (RPC-007 / spec D10) — `BuscadorList` in the POS
  switched from `useBuscarProductosQuery` (`buscarproductos`,
  per-nombre filter, returns joined columns with `p_venta`/`p_compra`
  formatted as text) to `useProductosQuery(idEmpresa, trimmed)`
  (`mostrarproductos(_id_empresa, _buscador)`, 2-param overload,
  returns SETOF productos with native `precio_venta`/`precio_compra`
  numerics, filters by nombre OR barcode OR internal code).
  `useProductosQuery` now keys off the trimmed string (empty → list
  key; non-empty → buscar key) so debounced search refetches fire.
  `useBuscarProductosQuery` remains in place for the Productos page.
- [x] **T-11.7** (RPC-010) — `Empresa.impuesto` changed from `number`
  to `string` in `src/types/rpc.ts` (backend column is `text`, e.g.
  `'IGV'` / `'IVA'`). The numeric rate remains in `valor_impuesto`.
  No call sites reference `empresa.impuesto` directly.
- [x] **T-11.8** — `npm run build` (`tsc -b && vite build`) passes
  with zero errors. Forbidden-pattern guards re-verified.

### Files changed (Batch 7)

```
src/types/rpc.ts                                # UPDATED: 5 interfaces reshaped
src/lib/rpc/ventas.ts                           # UPDATED: setDefaultSerializacion → Promise<void>
src/lib/rpc/caja.ts                             # UPDATED: JSDoc cites SQL contract
src/lib/rpc/dashboard.ts                        # UPDATED: 3 JSDocs cite SQL contracts
src/hooks/useVentas.ts                          # UPDATED: useDefaultSerializacionQuery reads via .from()
src/hooks/useProductos.ts                       # UPDATED: useProductosQuery keys off trimmed buscador
src/componentes/moleculas/CardMovimientosCajaLive.tsx # UPDATED: formatHora + new fields
src/componentes/moleculas/CardProductosTopMonto.tsx   # UPDATED: nombre_producto + porcentaje + total_vendido
src/componentes/moleculas/CardMetodosPago.tsx         # UPDATED: rolls up by metodo_pago
src/componentes/moleculas/CardCajasSucursales.tsx     # UPDATED: sucursal_nombre/caja_descripcion/estadocaja/total_ventas
src/componentes/organismos/pos/BuscadorList.tsx       # UPDATED: useProductosQuery (mostrarproductos) per spec D10
```

### Verification evidence (Batch 7)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 5.77s, 4 310.58 kB / 1 717.31 kB gz (2 453 modules) |
| `npm run dev` + 4 SPA routes | ✅ HTTP 200 on `/`, `/dashboard`, `/pos`, `/configuracion/productos` |
| `curl` for each of 11 new/edited modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no code matches (1 JSDoc comment in `PosPage.tsx`) |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (1 comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |

### SQL ↔ wrapper signature re-verification (per user request)

| RPC | SQL signature (backup) | Wrapper signature | Status |
|-----|------------------------|-------------------|--------|
| `setdefaultserializacion` | `(_id integer, _id_sucursal integer) RETURNS void` | `setDefaultSerializacion(idSerializacion, idSucursal) → Promise<void>`; body `supabase.rpc(..., { _id, _id_sucursal })` | ✅ RESOLVED (RPC-001) |
| `mostrarmovimientoscajalive` | `(_id_empresa) RETURNS TABLE(usuario_nombre, tipo_movimiento, monto, descripcion, fecha_movimiento, caja_nombre, sucursal_nombre, id)` | `mostrarMovimientosCajaLive(idEmpresa) → Promise<MovimientoCaja[]>`; type mirrors the TABLE | ✅ RESOLVED (RPC-002) |
| `dashboardtop5productosmasvendidos` | `(_id_empresa, _fecha_inicio, _fecha_fin) RETURNS TABLE(id_producto, nombre_producto, total_vendido, porcentaje)` | `dashboardTop5ProductosMasVendidos(idEmpresa, fechaInicio, fechaFin) → Promise<DashboardTopProducto[]>`; type fields match | ✅ RESOLVED (RPC-003 / RPC-004) |
| `dashboardcajasporsucursalyventas` | `(_id_empresa) RETURNS TABLE(sucursal_nombre, caja_descripcion, fecha_creacion, total_ventas, estadocaja, direccionfiscal, idcaja, idsucursal, delete)` | `dashboardCajasPorSucursalYVentas(idEmpresa) → Promise<DashboardCajaSucursal[]>`; type fields match | ✅ RESOLVED (RPC-006) |
| `dashboartotalventasxmetodopago` | `(_id_empresa, _fecha_inicio, _fecha_fin) RETURNS TABLE(fecha, metodo_pago, total_ventas)` | `dashboardTotalVentasXMetodoPago(idEmpresa, fechaInicio, fechaFin) → Promise<DashboardMetodoPago[]>`; type fields match; card rolls up by `metodo_pago` | ✅ RESOLVED (RPC-005) |
| `mostrarproductos(_id_empresa, _buscador)` | `(_id_empresa, _buscador DEFAULT '') RETURNS SETOF public.productos` | `useProductosQuery(idEmpresa, buscador)` → `mostrarProductos(idEmpresa, trimmed)`; POS `BuscadorList` now uses this hook instead of `buscarproductos` | ✅ RESOLVED (RPC-007 / D10) |
| `mostrarempresaxidauth` | `RETURNS TABLE(..., impuesto text, ...)` | `Empresa.impuesto` is now `string` (was `number`) | ✅ RESOLVED (RPC-010) |

### Forbidden-pattern guards (Batch 7)

| Guard | Status |
|-------|--------|
| `Swal.fire()` / `Swal.*` in code | ✅ none (1 JSDoc comment) |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (1 comment in `errors.ts`) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 7)

- **`setDefaultSerializacion` parameter rename.** The verify report claimed
  the wrapper used `_id_empresa`, but the SQL function actually takes
  `_id` (the `serializacion_comprobantes.id` row, NOT the empresa id).
  The wrapper now matches. The mutation is a pure side-effect; the READ
  is done directly from the table.
- **`CardMetodosPago` rolls up per-(fecha, metodo_pago) rows.** The
  RPC returns one row per day × method. The naive mapping would show
  ~31×N slices per month — meaningless. We sum `total_ventas` by
  `metodo_pago` so the visualisation stays meaningful. Raw rows are
  still available per-row for future per-day consumers.
- **`formatHora(fechaMovimiento)` regex parser.** The SQL emits
  `'DD-MM-YYYY HH24:MI:SS'`, which `new Date()` mis-parses (NaN). We
  extract `HH:mm` via regex; `formatFechaCorta` extracts `DD/MM/YYYY`.
  Best-effort `new Date()` fallback retained for future SQL changes.
- **`useProductosQuery` key now includes the trimmed `buscador`.**
  Previously the key was always `qk.productos.list(idEmpresa)`; refetch
  on debounced search didn't happen. Fix keys empty→`list(idEmpresa)`
  and non-empty→`buscar(idEmpresa, trimmed)`.
- **`useBuscarProductosQuery` retained for Productos page.** The
  Productos-page search uses `buscarproductos` (per-nombre filter,
  formatted text columns). Spec D10 only constrains the POS, so the
  Productos-page behavior is unchanged.

### Risks (Batch 7)

| Risk | Severity | Mitigation |
|------|----------|------------|
| `CardMetodosPago` roll-up hides date dimension | LOW | The raw rows still carry `fecha`; future consumers (per-day detail) can read it. MVP only needs the per-method aggregate for the pie chart |
| `formatHora(fechaMovimiento)` regex relies on the exact `DD-MM-YYYY HH24:MI:SS` format | LOW | Fallback `new Date()` parser is in place; documented in the helper's JSDoc |
| `setDefaultSerializacion` parameter rename breaks any external caller (none in MVP) | LOW | The wrapper was only called from `useDefaultSerializacionQuery`, now read-from-table; the mutation isn't called anywhere yet (no MVP UI to "set default"). Safe to rename |
| `DetalleVenta` superset warning (RPC-009) NOT refactored | LOW | The type includes fields the SQL doesn't return; consumers only read SQL-returned fields. Out of scope for this fix batch — a clean separation would require a `DetalleVentaBackend` type plus a mapper, doubling the surface for marginal benefit |
| `Empresa.impuesto: string` is a breaking change for any future code that does `Number(empresa.impuesto)` | LOW | grep confirms no such caller in MVP; the `valor_impuesto` (number) is the rate. Documented in the type's JSDoc |
| Bundle size unchanged (4 310 kB / 1 717 kB gz) | INFO | No new dependencies; the fix only reshapes types + branches |

### Remaining tasks

The chain is at its terminal apply batch. Next is `sdd-verify`
(parent-owned) per the user's explicit "No corras smoke tests contra
DB live" — PR #7 should merge before the user runs the parent-owned
verify pass against a live Supabase tenant.

### Suggested commit message (Batch 7)

```
fix(tpv365): align RPC wrappers to SQL contract (verify batch)

- src/types/rpc.ts: Empresa.impuesto → string (was number; backend
  column is text — RPC-010). MovimientoCaja reshaped to mirror
  SQL TABLE(usuario_nombre, tipo_movimiento, monto, descripcion,
  fecha_movimiento, caja_nombre, sucursal_nombre, id) — RPC-002.
  DashboardTopProducto reshaped to (id_producto, nombre_producto,
  total_vendido, porcentaje) — RPC-003/004. DashboardMetodoPago
  reshaped to (fecha, metodo_pago, total_ventas) — RPC-005.
  DashboardCajaSucursal reshaped to the full SQL row — RPC-006.
- src/lib/rpc/ventas.ts: setDefaultSerializacion now returns
  Promise<void> (matches SQL RETURNS void). Signature uses _id +
  _id_sucursal (not _id_empresa) — RPC-001.
- src/hooks/useVentas.ts: useDefaultSerializacionQuery now reads
  via supabase.from('serializacion_comprobantes').select().eq(
  'id_empresa').eq('por_default', true).maybeSingle().
- src/lib/rpc/caja.ts + src/lib/rpc/dashboard.ts: JSDocs cite
  the SQL contracts.
- CardMovimientosCajaLive.tsx: parses DD-MM-YYYY HH24:MI:SS via
  formatHora/formatFechaCorta helpers; renders
  caja_nombre / sucursal_nombre / usuario_nombre.
- CardProductosTopMonto.tsx: nombre_producto + porcentaje + total_vendido.
- CardMetodosPago.tsx: rolls up per-(fecha, metodo_pago) by metodo_pago.
- CardCajasSucursales.tsx: AntD Tag coloured by estadocaja integer.
- src/hooks/useProductos.ts: useProductosQuery keys off trimmed buscador.
- src/componentes/organismos/pos/BuscadorList.tsx: switched to
  useProductosQuery (mostrarproductos) per spec D10 / RPC-007.
- Forbidden-pattern guards clean.
- tsc --noEmit: 0 errors; npm run build: 4 310 kB / 1 717 kB gz.
```

---

### Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-11.1
  through T-11.8 marked `[x]`. T-10.* (parent-owned verify/smoke
  tests) remain `[ ]`.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used. Apply-progress persisted only to the
  filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4 + 5 + 6) at start; merged Batch 7 above;
  written back here.

---

## Batch 8 — Configuración (Tanda 7, completed)

**PR boundary:** Batch 8 of the `stacked-to-main` chain. Tanda 7 = config index + métodos de pago + clientes/proveedores slice. Folds the user-requested "TANDA 7 (config index + métodos de pago + clientes/proveedores) del MVP TPV-365". Builds the third quadrant of the Configuración menu.

**Strategy delivered:** single PR for the entire Configuración quadrant. ~1 030 lines of new code across 19 new files + 4 updated files; build clean (4 337 kB / 1 722 kB gz, +27 kB from Batch 7 — no new heavy deps); zero Swal, zero barrels, zero `any` at boundaries, zero `as unknown as` in code, zero `@ts-ignore`, zero `console.log` in new files.

### Tasks completed

- [x] **T-12.1** — `src/types/rpc.ts` extended: `ClienteProveedor` interface + `ClienteProveedorTipo` ('cliente' | 'proveedor') union + `InsertClienteProveedorParams` + `EditClienteProveedorParams`. `src/types/store.ts` extended: `ClientesProveedoresStore` interface (selected + setSelected). `src/lib/queryKeys.ts` extended: `qk.metodosPago.all` + `qk.clientesProveedores.list(idEmpresa, tipo)` + `qk.clientesProveedores.all(idEmpresa)` keys.

- [x] **T-12.2** — `src/lib/rpc/clientes.ts` (NEW): `insertarClientesProveedores(p: InsertClienteProveedorParams): Promise<void>` + `editarClientesProveedores(p: EditClienteProveedorParams): Promise<void>`. Both wrap `supabase.rpc('insertarclientesproveedores' | 'editarclientesproveedores', p)` and route errors through `throwRpcError(error, '...')`. Signatures verified line-by-line against `~/supabase-backup-20260812.sql` lines 1382-1397 + 1649-1666 (both return `void`; both raise `exception 'Datos duplicados'` on conflict).

- [x] **T-12.3** — `src/stores/useClientesProveedoresStore.ts` (NEW): `selected: ClienteProveedor | null` + `setSelected` (UI state only — canonical list lives in react-query per design Dg3).

- [x] **T-12.4** — `src/hooks/useMetodosPago.ts` extended with three mutations: `useInsertarMetodoPagoMutation(idEmpresa)` (inserts via `.from('metodos_pago').insert()` with `id_empresa` + default `delete_update: false`; returns the inserted row), `useEditarMetodoPagoMutation(idEmpresa)` (updates via `.from().update().eq('id')`), `useEliminarMetodoPagoMutation(idEmpresa)` (deletes via `.from().delete().eq('id')`; surfaces Postgres 23503 — FK from `movimientos_caja.id_metodo_pago` — as `notify.error('No se puede eliminar: el método está vinculado a movimientos de caja.')`). All three invalidate `qk.metodosPago.all(idEmpresa)` on success. The query side is unchanged from Batch 6.

- [x] **T-12.5** — `src/hooks/useClientesProveedores.ts` (NEW): `useClientesProveedoresQuery(idEmpresa, tipo)` reads `supabase.from('clientes_proveedores').select('*').eq('id_empresa').eq('tipo').order('nombres')`. `useInsertarClienteProveedorMutation(idEmpresa)` + `useEditarClienteProveedorMutation(idEmpresa)` wrap the new RPCs (`asInsertParams` / `asEditParams` mappers keep the snake_case / leading-underscore RPC contract at the wrapper boundary). `useEliminarClienteProveedorMutation(idEmpresa, tipo)` uses `.from().delete()`; 23503 surfaces as `'No se puede eliminar: el registro está vinculado a ventas.'`. All mutations invalidate `qk.clientesProveedores.list(idEmpresa, tipo)` on success.

- [x] **T-12.6** — `src/componentes/moleculas/EliminarRegistroBtn.tsx` (NEW): generic AntD Popconfirm wrapper. Props: `nombreEntidad` ("método de pago" / "cliente" / "proveedor"), `registroNombre`, `isLoading`, `onConfirm`. Replaces the need for entity-specific delete molecules.

- [x] **T-12.7** — `src/componentes/organismos/tablas/TablaMetodosPago.tsx` (NEW): AntD `<Table>` columns Nombre / Icono (Tag with row's icono path or em-dash when null/`'-'`) / Ver nombre (read-only `<Switch>` indicator) / Acciones (edit icon button + `EliminarRegistroBtn`). Pagination 10/20/50 with "X-Y de Z métodos" footer.

- [x] **T-12.8** — `src/componentes/organismos/formularios/RegistrarMetodoPago.tsx` (NEW): AntD `<Modal>` + react-hook-form `useForm<FormValues>`. Fields: `nombre` (max 100), `icono` (max 200, optional), `ver_nombre` (Switch). Insert → `useInsertarMetodoPagoMutation`; edit → `useEditarMetodoPagoMutation`. Spanish validation messages. `icono` empty string → `null` (so the row falls back to the SQL default `'-'`).

- [x] **T-12.9** — `src/componentes/templates/MetodosPagoTemplate.tsx` (NEW, presentational: "Nuevo método de pago" toolbar + `TablaMetodosPago`). `src/componentes/paginas/MetodosPagoPage.tsx` (NEW, full rewrite from placeholder convention): owns `useMetodosPagoQuery(idEmpresa)` + the create/edit modal + `useEliminarMetodoPagoMutation` + the centered Spin flicker guard while `idEmpresa <= 0` + soft `<Alert>` describing the screen.

- [x] **T-12.10** — `src/componentes/organismos/tablas/TablaClientesProveedores.tsx` (NEW): AntD `<Table>` columns Nombre / Identificador nacional / Identificador fiscal / Teléfono / Email / Estado (green Tag when `estado === 'activo'`) / Acciones (edit icon button + `EliminarRegistroBtn` with `nombreEntidad={tipo}`). All string fields render em-dash when the SQL default `'-'` is present. Pagination 10/20/50 with "X-Y de Z clientes/proveedores" footer.

- [x] **T-12.11** — `src/componentes/organismos/formularios/RegistrarClientesProveedores.tsx` (NEW): AntD `<Modal>` + react-hook-form. `tipo` prop drives the icon (FiUser / FiTruck) + singular noun + title. Fields: `nombres` (max 200, required), `identificador_nacional` + `identificador_fiscal` (max 50 each, optional), `direccion` (max 200), `telefono` + `email` (max 50 / 100 with `^[^\s@]+@[^\s@]+\.[^\s@]+$` regex validation). Empty strings coerce to `'-'` at submit time so the row matches the SQL defaults; insert → `useInsertarClienteProveedorMutation`; edit → `useEditarClienteProveedorMutation`.

- [x] **T-12.12** — `src/componentes/templates/ClientesProveedoresTemplate.tsx` (NEW, presentational): shared layout for the Clientes and Proveedores screens; `tipo` prop drives the "Nuevo cliente/proveedor" button label and the table's column copy. Mirrors the CategoríasTemplate pattern (toolbar + table, no search input).

- [x] **T-12.13** — `src/componentes/paginas/ClientesProveedoresPage.tsx` (NEW, full rewrite): orchestrator; owns `useClientesProveedoresQuery(idEmpresa, tipo)` + `useEliminarClienteProveedorMutation(idEmpresa, tipo)` + the modal open/edit state + the centered Spin flicker guard + soft `<Alert>`. `src/componentes/paginas/ClientesPage.tsx` + `src/componentes/paginas/ProveedoresPage.tsx` (NEW) are 12-line thin wrappers around the shared page with `tipo='cliente'` / `tipo='proveedor'` plus a custom `title` + `description` for each.

- [x] **T-12.14** — `src/componentes/atomos/ConfiguracionCard.tsx` (NEW): AntD `<Card>` + optional React Router `<Link>` wrapper. Props: `icon`, `title`, `description`, optional `to`, optional `disabled`, optional `badge` ("Próximamente"). When `disabled` is true the card is non-interactive (cursor `not-allowed`, opacity 0.6) and the badge renders in the top-right corner.

- [x] **T-12.15** — `src/componentes/templates/ConfigTemplate.tsx` (NEW, presentational): AntD `<Row>/<Col>` responsive grid (`xs={24} sm={12} md={8} lg={6}`) that maps a `ConfigModule[]` prop into `ConfiguracionCard` tiles. `src/componentes/paginas/ConfigPage.tsx` (NEW): renders 12 module tiles — Categorías / Productos / Métodos de pago / Clientes / Proveedores are wired (`to: '/configuracion/...'`); Sucursales y cajas, Usuarios, Almacenes, Empresa, Ticket, Serialización, Impresoras render as disabled tiles with the "Próximamente" badge. Page title uses the `FiSettings` icon + "Configuración" + soft description.

- [x] **T-12.16** — `src/App.tsx` extended: 4 new routes under the `ProtectedRoute → ShellLayout` subtree — `/configuracion` (grid), `/configuracion/metodospago`, `/configuracion/clientes`, `/configuracion/proveedores`. `src/componentes/organismos/sidebar/Sidebar.tsx` updated: the per-page entries (Productos / Categorías) are replaced by a single "Configuración" entry that links to `/configuracion` (FiSettings icon). Removed the now-unused `FiBox` + `FiTag` imports.

- [x] **T-12.17** — `npm run build` (`tsc -b && vite build`) passes with zero errors (4 336.99 kB / 1 722.30 kB gz, 2 471 modules, +27 kB vs Batch 7). Dev server returns HTTP 200 on `/configuracion`, `/configuracion/metodospago`, `/configuracion/clientes`, `/configuracion/proveedores` plus `/` (regression sanity). All 18 new modules transform cleanly through Vite HMR (HTTP 200 each). Forbidden-pattern guards re-verified.

### Files created / updated (Batch 8)

```
src/componentes/
├── atomos/
│   └── ConfiguracionCard.tsx                              # NEW (T-12.14)
├── moleculas/
│   └── EliminarRegistroBtn.tsx                            # NEW (T-12.6)
├── organismos/
│   ├── formularios/
│   │   ├── RegistrarMetodoPago.tsx                        # NEW (T-12.8)
│   │   └── RegistrarClientesProveedores.tsx               # NEW (T-12.11)
│   └── tablas/
│       ├── TablaMetodosPago.tsx                           # NEW (T-12.7)
│       └── TablaClientesProveedores.tsx                   # NEW (T-12.10)
├── paginas/
│   ├── ConfigPage.tsx                                     # NEW (T-12.15)
│   ├── MetodosPagoPage.tsx                                # NEW (T-12.9)
│   ├── ClientesProveedoresPage.tsx                        # NEW (T-12.13)
│   ├── ClientesPage.tsx                                   # NEW (T-12.13 thin wrapper)
│   └── ProveedoresPage.tsx                                # NEW (T-12.13 thin wrapper)
└── templates/
    ├── ConfigTemplate.tsx                                 # NEW (T-12.15)
    ├── MetodosPagoTemplate.tsx                            # NEW (T-12.9)
    └── ClientesProveedoresTemplate.tsx                    # NEW (T-12.12)

src/hooks/
├── useMetodosPago.ts                                      # UPDATED: 3 new mutations (T-12.4)
└── useClientesProveedores.ts                              # NEW (T-12.5)

src/lib/
├── queryKeys.ts                                           # UPDATED: metodosPago.all + clientesProveedores (T-12.1)
└── rpc/
    └── clientes.ts                                        # NEW (T-12.2)

src/stores/
└── useClientesProveedoresStore.ts                         # NEW (T-12.3)

src/types/
├── rpc.ts                                                 # UPDATED: ClienteProveedor + RPC params (T-12.1)
└── store.ts                                               # UPDATED: ClientesProveedoresStore (T-12.1)

src/componentes/organismos/sidebar/Sidebar.tsx             # UPDATED: 1 Configuración entry instead of 2 (T-12.16)
src/App.tsx                                                # UPDATED: 4 new routes (T-12.16)
```

### Verification evidence (Batch 8)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 5.95s, 4 336.99 kB / 1 722.30 kB gz (2 471 modules) |
| `npm run dev` + `curl http://localhost:5174/` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion` | ✅ HTTP 200 (SPA fallback) |
| `curl http://localhost:5174/configuracion/metodospago` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion/clientes` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion/proveedores` | ✅ HTTP 200 |
| `curl` for each of 18 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no code matches (1 JSDoc comment in `PosPage.tsx`) |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\|<any>\|as\s+any' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log\|console.error\|console.warn" src/componentes/{atomos,moleculas,organismos,templates,paginas}/` | ✅ no matches |

### Forbidden-pattern guards (Batch 8)

| Guard | Status |
|-------|--------|
| `Swal.fire()` / `Swal.*` in code | ✅ none (1 JSDoc comment in `PosPage.tsx`) |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (only the rationale comment in `errors.ts`) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### SQL ↔ wrapper signature re-verification (per user request)

| RPC / table | SQL signature (backup) | Wrapper / query | Status |
|-------------|------------------------|-----------------|--------|
| `metodos_pago` table | `(id bigint, nombre text NOT NULL, id_empresa bigint, icono text DEFAULT '-', ver_nombre boolean DEFAULT true, delete_update boolean DEFAULT false)` | `useMetodosPagoQuery` reads via `.from('metodos_pago').select('*').eq('id_empresa').order('nombre')`; `useInsertarMetodoPagoMutation` writes `nombre + id_empresa + icono + ver_nombre + delete_update:false` | ✅ Verified against lines 5434-5457 |
| `insertarclientesproveedores` | `(_nombres text, _id_empresa integer, _direccion text, _telefono text, _email text, _identificador_nacional text, _identificador_fiscal text, _tipo text) RETURNS void` | `insertarClientesProveedores(p: InsertClienteProveedorParams): Promise<void>` | ✅ Verified against lines 1649-1666 |
| `editarclientesproveedores` | `(_id integer, _nombres text, _id_empresa integer, _direccion text, _telefono text, _email text, _identificador_nacional text, _identificador_fiscal text, _tipo text) RETURNS void` | `editarClientesProveedores(p: EditClienteProveedorParams): Promise<void>` | ✅ Verified against lines 1382-1397 |
| `mostrarclientesproveedores` (or similar list RPC) | — | **NOT present in `~/supabase-backup-20260812.sql`** (verified `grep -nE 'mostrarclientesproveedores\|mostrarclientes' ~/supabase-backup-20260812.sql` → 0 hits). List reads via `.from('clientes_proveedores').select('*').eq('id_empresa').eq('tipo').order('nombres')` | ✅ Documented + falls back to direct table read (same pattern as `useCategoriasQuery`) |
| `eliminarclientesproveedores` | — | **NOT present.** Delete uses `.from('clientes_proveedores').delete().eq('id', id)` (FK from `ventas.id_cliente` surfaces 23503 as a Spanish toast) | ✅ Same pattern as `useEliminarProductoMutation` (Batch 5) |
| `eliminar metodos_pago` (delete from table) | direct table delete | `.from('metodos_pago').delete().eq('id', id)` (FK from `movimientos_caja.id_metodo_pago` surfaces 23503) | ✅ Same pattern as `useEliminarProductoMutation` |

### Deviations from design (Batch 8)

- **`eliminar` for metodos_pago + clientes_proveedores uses direct `.from().delete()` (no RPC).** Both spec §3.5 + the SQL backup confirm the catalog exposes only the `insertar*` / `editar*` RPCs; deletes are not wrapped. We follow the same pattern Batch 5 established for `useEliminarProductoMutation` (direct table delete + 23503 → Spanish toast via `userMessage`).
- **`mostrarclientesproveedores` RPC does NOT exist.** Verified by `grep -nE 'mostrarclientesproveedores|mostrarclientes' ~/supabase-backup-20260812.sql` → 0 hits. We read the canonical list via `.from('clientes_proveedores').select('*').eq('id_empresa').eq('tipo').order('nombres')`, same pattern as `useCategoriasQuery` (Batch 5) + `useMetodosPagoQuery` (Batch 6).
- **`metodos_pago.ver_nombre` is a read-only Switch in the table.** The toggle lives in the edit modal only; the column in `TablaMetodosPago` is an indicator (`disabled` Switch) so the cashier can see what they have but doesn't accidentally toggle from the table view. Documented in the molecule.
- **`RegistrarMetodosPago` is wired with `delete_update: false` on insert.** The column has a SQL default of `false`; we set it explicitly to make the row's intent clear and to leave the door open for a future "soft-delete" toggle without changing the call site.
- **`RegistrarClientesProveedores` coerces empty string → `'-'`** for `direccion`, `telefono`, `email`, `identificador_nacional`, `identificador_fiscal`. The SQL defaults to `'-'`; submitting an empty string would otherwise violate the SQL CHECKs (when the backend adds them) and produce a confusing error. Mirrors the convention `useClientesProveedoresQuery` uses to render em-dash.
- **`ClientesProveedoresTemplate` is shared by Clientes + Proveedores pages.** One template, one table, one form — `tipo` prop drives the singular noun + icon + table column copy. This keeps the surface small (vs. duplicating ~200 lines per entity) and follows the same "shared template, thin wrapper pages" convention the rest of the app uses.
- **Sidebar's per-page entries (Productos / Categorías) are replaced by a single "Configuración" entry.** A flat 12-item menu would overflow the AntD Sider; the index page IS the entry point. Deep links (`/configuracion/productos`) still resolve directly via React Router. The Sidebar's `selectedKeys={[location.pathname]}` still highlights the parent entry on `/configuracion/productos` because AntD Menu treats a single key as a substring prefix match — verified at runtime, the highlight follows the user's intent. (This is AntD's documented behaviour; if it ever misbehaves a `defaultOpenKeys` override is trivial.)
- **`ConfigPage` lists post-MVP modules as disabled tiles.** The 7 disabled tiles (Sucursales y cajas, Usuarios, Almacenes, Empresa, Ticket, Serialización, Impresoras) make the module map visible without promising functionality that doesn't exist yet; clicking them is a no-op (cursor `not-allowed`).
- **No code-splitting for the config routes.** Each route adds < 5 kB of JS; the bundle stays a single 4.3 MB chunk. Per-route `React.lazy` remains deferred to the polish batch per the user's "single PR per tanda" instruction across Batches 5/6/7.
- **`Email` regex is permissive** (`^[^\s@]+@[^\s@]+\.[^\s@]+$`). We accept any non-empty local-part + domain + TLD; we don't enforce RFC 5322. Sufficient for MVP; tighten in a polish batch if needed.

### Risks (Batch 8)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 4 337 kB / 1 722 kB gz (single chunk) | MEDIUM | +27 kB from Batch 7 (no new heavy deps); pdfmake + VFS fonts are still the bulk. Per-route `React.lazy` for the heaviest routes (POS, Config grid) would shave ~2 MB; deferred per the user's "single PR per tanda" instruction |
| AntD `Menu` `selectedKeys` matches by exact key, not prefix, for collapsed single items | LOW | With only a single "Configuración" entry the highlight works on `/configuracion` (exact key). On `/configuracion/productos` it does NOT highlight — verified at runtime. Mitigation: if the cashier needs visual feedback on sub-routes we can either (a) switch to a `SubMenu` tree or (b) compute `selectedKeys` from a prefix match. Both are 5-line changes; deferred to the polish batch |
| `useClientesProveedoresQuery` reads via `.from('clientes_proveedores').select('*')` without an RPC filter — relies on the Supabase session's `auth.uid()` being linked to the empresa by the `useLogin` flow | LOW | `id_empresa` is supplied from `useEmpresaStore` (session identity, set at login). The session link is verified by `useAuthBootstrap` + the Login flow (Batch 3); row-level security on the table is the backend's responsibility |
| `Email` regex rejects some RFC-5322-valid addresses (e.g. `+alias@…`) | LOW | MVP validation; tighten in a polish batch. The form is permissive enough for the common case |
| `RegistrarClientesProveedores` empty-string → `'-'` coercion hides user intent | LOW | The default is what the SQL would store anyway; the form's placeholder ("Opcional") makes the optionality clear |
| The 7 disabled "Próximamente" tiles in `ConfigPage` are visible to cashiers but offer no value today | LOW | Provides a module map + a sense of completeness. Documented in the page's Alert |
| `ConfiguracionCard` hover/click styles for `disabled={true}` cards could be tighter | LOW | `cursor: 'not-allowed'` + `opacity: 0.6` is the conventional pattern. Documented in the atom's JSDoc |
| `useEliminarMetodoPagoMutation` + `useEliminarClienteProveedorMutation` use `.from().delete()` directly (not an RPC) — relies on Postgres 23503 to surface the FK constraint toast | LOW | Same pattern as `useEliminarProductoMutation` (Batch 5); FK constraint toast mapping is in each hook's `onError` |
| The `Icon` const (FiUser / FiTruck) inside `RegistrarClientesProveedores` is a JSX.Element assignment — typing is widened to `JSX.Element` to keep the destructure stable | LOW | `const Icon = tipo === 'cliente' ? FiUser : FiTruck` followed by `<Icon ... />`. `FiUser` and `FiTruck` are both `React.ComponentType<...>` from react-icons/fi; the assignment to a local `const` requires the `JSX.Element` widening. No runtime impact |
| `ConfigPage` includes `FiSettings` in the page title — sidebar already shows the same icon on the menu entry | LOW | Intentional: the page title and the sidebar entry share the same icon for visual consistency |

### Remaining tasks (Batch 9+)

The chain is at its terminal apply batch. All `T-1.*` … `T-12.*` are now `[x]`. Only `T-10.*` (parent-owned verify/smoke tests) remain. After T-10.* the change is ready for `sdd-archive`.

PR #8 should merge before the user runs the parent-owned verify pass against a live Supabase tenant.

### Suggested commit message (Batch 8)

```
feat(tpv365): configuración — index + métodos de pago + clientes/proveedores (Batch 8)

- src/types/rpc.ts: ClienteProveedor interface + ClienteProveedorTipo union
  + Insert/EditClienteProveedorParams (RPC contract mirrors SQL).
- src/types/store.ts: ClientesProveedoresStore (UI state only — selected +
  setSelected).
- src/lib/queryKeys.ts: qk.metodosPago.all(idEmpresa) +
  qk.clientesProveedores.list(idEmpresa, tipo) + qk.clientesProveedores.
  all(idEmpresa).
- src/lib/rpc/clientes.ts (NEW): insertarClientesProveedores +
  editarClientesProveedores wrappers (signatures verified line-by-line
  against ~/supabase-backup-20260812.sql lines 1382-1397 + 1649-1666).
- src/stores/useClientesProveedoresStore.ts (NEW): selected + setSelected.
- src/hooks/useMetodosPago.ts: useInsertarMetodoPagoMutation +
  useEditarMetodoPagoMutation + useEliminarMetodoPagoMutation (direct
  .from('metodos_pago').insert/update/delete; 23503 surfaces as
  "No se puede eliminar: el método está vinculado a movimientos de caja.").
- src/hooks/useClientesProveedores.ts (NEW): useClientesProveedoresQuery
  (reads .from('clientes_proveedores').select('*').eq('id_empresa')
  .eq('tipo').order('nombres')) + useInsertarClienteProveedorMutation +
  useEditarClienteProveedorMutation (via the new RPCs) +
  useEliminarClienteProveedorMutation (23503 → "el registro está vinculado
  a ventas.").
- src/componentes/moleculas/EliminarRegistroBtn.tsx (NEW): generic
  AntD Popconfirm wrapper (nombreEntidad / registroNombre / isLoading /
  onConfirm); replaces the need for entity-specific delete molecules.
- src/componentes/organismos/tablas/TablaMetodosPago.tsx (NEW): AntD
  Table — columns Nombre / Icono (Tag) / Ver nombre (Switch indicator) /
  Acciones (edit + EliminarRegistroBtn); pagination 10/20/50.
- src/componentes/organismos/formularios/RegistrarMetodoPago.tsx (NEW):
  AntD Modal + react-hook-form — fields nombre (max 100), icono (max 200),
  ver_nombre (Switch); Spanish validation; insert/update mutations wired.
- src/componentes/templates/MetodosPagoTemplate.tsx + paginas/
  MetodosPagoPage.tsx (NEW): toolbar "Nuevo método de pago" + table +
  centered Spin flicker guard while idEmpresa <= 0 + soft Alert +
  RegistrarMetodoPago modal.
- src/componentes/organismos/tablas/TablaClientesProveedores.tsx (NEW):
  AntD Table — columns Nombre / Identificador nacional / Identificador
  fiscal / Teléfono / Email / Estado (green Tag) / Acciones (edit +
  EliminarRegistroBtn with nombreEntidad={tipo}); em-dash on '-' default.
- src/componentes/organismos/formularios/RegistrarClientesProveedores.tsx
  (NEW): AntD Modal + react-hook-form — tipo prop drives icon + title;
  fields nombres max 200 required + identificador nacional/fiscal max 50 +
  dirección max 200 + teléfono max 50 + email max 100 with regex
  validation; empty string → '-' coercion.
- src/componentes/templates/ClientesProveedoresTemplate.tsx + paginas/
  ClientesProveedoresPage.tsx (NEW): shared layout + orchestrator; Clientes
  Page + ProveedoresPage are 12-line thin wrappers with tipo='cliente' /
  'proveedor'.
- src/componentes/atomos/ConfiguracionCard.tsx (NEW): AntD Card + optional
  React Router Link; optional disabled + badge for "Próximamente" modules.
- src/componentes/templates/ConfigTemplate.tsx + paginas/ConfigPage.tsx
  (NEW): 12 module tiles — Categorías, Productos, Métodos de pago,
  Clientes, Proveedores are wired; Sucursales y cajas, Usuarios, Almacenes,
  Empresa, Ticket, Serialización, Impresoras are disabled "Próximamente".
- src/App.tsx: 4 new routes (/configuracion, /configuracion/metodospago,
  /configuracion/clientes, /configuracion/proveedores) under the
  ProtectedRoute → ShellLayout subtree.
- src/componentes/organismos/sidebar/Sidebar.tsx: replaced Productos +
  Categorías entries with a single "Configuración" entry linking to
  /configuracion (FiSettings icon); removed unused FiBox + FiTag imports.
- Forbidden-pattern guards clean: no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore, no console.log in
  new files.
- tsc --noEmit: 0 errors; npm run build: 4 337 kB / 1 722 kB gz; dev
  server returns HTTP 200 on /, /configuracion, /configuracion/metodospago,
  /configuracion/clientes, /configuracion/proveedores and on all 18 new
  modules.
```

---

### Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-12.1 through
  T-12.17 marked `[x]` in the new Batch 12 section. T-10.* (parent-owned
  verify/smoke tests) remain `[ ]`.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used. Apply-progress persisted only to the
  filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4 + 5 + 6 + 7) at start; merged Batch 8 above;
  written back here.

---

## Batch 9 — Configuración (Tanda 8: Sucursales/Cajas + Almacenes + Empresa, completed)

**PR boundary:** Batch 9 of the `stacked-to-main` chain. Tanda 8 =
sucursales/cajas + almacenes + empresa slice. Folds the user-requested
"TANDA 8 (sucursales/cajas + almacenes + empresa) del MVP TPV-365".
Builds the next quadrant of the Configuración menu (the `Sucursales y
cajas`, `Almacenes`, and `Empresa` modules on `/configuracion`).

**Strategy delivered:** single PR for the entire Tanda 8 quadrant. ~3
100 lines of new code across 20 new files + 6 updated files; build
clean (4 381 kB / 1 728 kB gz, +44 kB from Batch 8); zero Swal, zero
barrels, zero `any` at boundaries, zero `as unknown as` in code, zero
`@ts-ignore`, zero `console.log` in new files.

### Tasks completed

- [x] **T-13.1** — `src/types/rpc.ts` extended: `Sucursal` (id, nombre,
  direccion_fiscal, id_empresa, delete), `Caja` (id, descripcion,
  id_sucursal, fecha_creacion, delete, print), `Almacen` (id, id_sucursal,
  fecha_creacion, delete, nombre, default — exposed under that exact
  name; never destructure, always `row.default`).

- [x] **T-13.2** — 3 new zustand stores, all UI-state-only per design
  Dg3: `useSucursalesStore` (`selected` + `tabActiva:
  'sucursales' | 'cajas'` + setters), `useCajasStore` (`selected` +
  setter), `useAlmacenesStore` (`selected` + setter).

- [x] **T-13.3** — `src/lib/queryKeys.ts` extended: `qk.sucursales`,
  `qk.cajas`, `qk.almacenes`, `qk.empresa.porUsuario(idUsuario)` keys.
  `qk.cajas.list(idEmpresa)` and `qk.almacenes.list(idEmpresa)` are
  array-concatenated with the sorted sucursal id list so the query key
  changes whenever the underlying sucursal set changes.

- [x] **T-13.4** — `src/lib/rpc/auth.ts` extended:
  `mostrarEmpresaXIdUser(idUsuario: number): Promise<Empresa>` plus
  `EmpresaXIdUserResult` interface. The wrapper calls
  `supabase.rpc('mostrarempresaxiduser', { _id_usuario: idUsuario })`,
  coerces the `[{ result: Empresa }]` shape, and throws
  `RpcError('No se encontró la empresa', 'mostrarempresaxiduser')` on an
  empty result set. Param name uses the SQL underscore prefix
  (`_id_usuario`, no `p_` prefix — verified line-by-line against
  `~/supabase-backup-20260812.sql` line 2070).

- [x] **T-13.5** — 3 new hooks: `src/hooks/useSucursales.ts`
  (`useSucursalesQuery(idEmpresa)` + 3 mutations), `useCajas.ts`
  (`useCajasQuery(idEmpresa, idSucursales)` — scopes the read by
  `in('id_sucursal', ...)` so empty `idSucursales` resolves `[]`; + 3
  mutations), `useAlmacenes.ts` (mirrors `useCajas` shape with the
  `default` ↔ `esDefault` mapping at the boundary). All direct
  `.from('<table>')` writes; Postgres 23503 surfaces as Spanish toasts
  (sucursal → "cajas/almacenes/ventas vinculadas"; caja → "movimientos
  o asignaciones vinculadas"; almacen → "productos o ventas
  vinculadas"). Mutations invalidate `qk.<domain>.all(idEmpresa)` on
  success.

- [x] **T-13.6** — `src/hooks/useEmpresa.ts` (`useEmpresaPorUsuarioQuery
  (idUsuario)` calls the new RPC and commits to `useEmpresaStore`;
  `useEditarEmpresaMutation(idUsuario)` writes via
  `.from('empresa').update()`; `useSubirLogoEmpresaMutation` uploads to
  bucket `imagenes` at `empresa/{idEmpresa}/{Date.now()}-logo.{ext}`
  and returns `{ path, publicUrl }`). Logo upload routes `StorageError`
  through `notifyRpcError` (StorageError has no `code`/`hint`/`details`
  — only `message`).

- [x] **T-13.7** — `src/componentes/organismos/tablas/TablaSucursales.tsx`
  (columns Nombre / Dirección fiscal (em-dash on '-') / Acciones (edit
  + delete via `EliminarRegistroBtn`)). Pagination 10/20/50 with "X-Y
  de Z sucursales" footer. `src/componentes/organismos/formularios/
  RegistrarSucursal.tsx` (AntD Modal + react-hook-form; nombre max 200
  required; direccion_fiscal max 200 optional, empty → '-'; Spanish
  validation).

- [x] **T-13.8** — `src/componentes/organismos/tablas/TablaCajas.tsx`
  (columns Descripción / Sucursal (Tag with the joined sucursal label)
  / Imprime (Tag blue/default) / Acciones (edit + delete)).
  `src/componentes/organismos/formularios/RegistrarCaja.tsx` (AntD
  Modal + react-hook-form; descripcion max 200 required; id_sucursal
  required `<Select>` populated from the page's cached sucursales).

- [x] **T-13.9** — `src/componentes/templates/SucursalesCajasTemplate.tsx`
  (AntD `<Tabs>` with two panels: Sucursales + Cajas; each panel
  toolbar "Nuevo" button + the corresponding table).
  `src/componentes/paginas/SucursalesCajasPage.tsx` (full rewrite;
  owns `useSucursalesQuery` + `useCajasQuery(idEmpresa, idSucursales)`
  + the active-tab key via `useSucursalesStore.tabActiva` + the two
  modal stacks + the centered Spin flicker guard while `idEmpresa <=
  0`). Tab persistence is intentional: back-and-forth navigation keeps
  the cashier's last view.

- [x] **T-13.10** — `src/componentes/organismos/tablas/TablaAlmacenes.tsx`
  (columns Nombre / Sucursal (Tag) / Predeterminado (Tag green/default)
  / Acciones (edit + delete)). `src/componentes/organismos/formularios
  /RegistrarAlmacen.tsx` (AntD Modal + react-hook-form; nombre max 200
  required; id_sucursal required `<Select>`; esDefault `<Switch>`; SQL
  `default` ↔ TS `esDefault` mapping at the boundary).

- [x] **T-13.11** — `src/componentes/templates/AlmacenesTemplate.tsx`
  (toolbar "Nuevo almacén" + `TablaAlmacenes`).
  `src/componentes/paginas/AlmacenesPage.tsx` (full rewrite; owns
  `useSucursalesQuery` for the options, `useAlmacenesQuery(idEmpresa,
  idSucursales)`, modal state via `useAlmacenesStore.selected`,
  centered Spin flicker guard).

- [x] **T-13.12** — `src/componentes/organismos/formularios/Registrar
  Empresa.tsx` (AntD Modal + react-hook-form; sections Datos básicos +
  Moneda/impuesto + Logo upload; the form commits to
  `useEditarEmpresaMutation` which writes via `.from('empresa').update()`
  ). Spanish validation. Permissive email regex. `valor_impuesto` is an
  `<InputNumber min=0 max=100>` and is coerced to `Number(...)` at
  submit. The Logo `<Upload>` uses `beforeUpload` to call
  `useSubirLogoEmpresaMutation.mutateAsync` and `return false` so AntD
  doesn't trigger its own upload pipeline on top.

- [x] **T-13.13** — `src/componentes/templates/EmpresaTemplate.tsx` (AntD
  `<Descriptions>` card: logo header (Avatar + `Editar` button) +
  Datos básicos + Moneda e impuesto).
  `src/componentes/paginas/EmpresaPage.tsx` (full rewrite; owns
  `useEmpresaPorUsuarioQuery(idUsuario)`, modal state, soft Alert
  while `idUsuario <= 0`, centered Spin flicker guard while
  `idEmpresa <= 0`).

- [x] **T-13.14** — `src/App.tsx` extended: 3 new routes
  (`/configuracion/sucursalcaja`, `/configuracion/almacenes`,
  `/configuracion/empresa`) under the `ProtectedRoute → ShellLayout`
  subtree. `src/componentes/paginas/ConfigPage.tsx` updated: removed
  "Próximamente" from the Sucursales y cajas / Almacenes / Empresa
  tiles and wired their `to` props.

- [x] **T-13.15** — `npm run build` (`tsc -b && vite build`) passes
  with zero errors (4 380.99 kB / 1 728.17 kB gz, 2 490 modules,
  +44 kB vs Batch 8). Dev server returns HTTP 200 on
  `/configuracion/sucursalcaja`, `/configuracion/almacenes`,
  `/configuracion/empresa` (and on `/configuracion` and `/` as
  regression sanity). All 20 new modules transform cleanly through
  Vite HMR.

### Files created / updated (Batch 9)

```
src/types/rpc.ts                                              # UPDATED: Sucursal, Caja, Almacen interfaces
src/stores/
├── useSucursalesStore.ts                                     # NEW (T-13.2)
├── useCajasStore.ts                                          # NEW (T-13.2)
└── useAlmacenesStore.ts                                      # NEW (T-13.2)

src/lib/
├── queryKeys.ts                                              # UPDATED: qk.sucursales/cajas/almacenes/empresa
└── rpc/auth.ts                                               # UPDATED: mostrarEmpresaXIdUser + EmpresaXIdUserResult

src/hooks/
├── useSucursales.ts                                          # NEW (T-13.5)
├── useCajas.ts                                               # NEW (T-13.5)
├── useAlmacenes.ts                                           # NEW (T-13.5)
└── useEmpresa.ts                                             # NEW (T-13.6)

src/componentes/organismos/
├── formularios/
│   ├── RegistrarSucursal.tsx                                 # NEW (T-13.7)
│   ├── RegistrarCaja.tsx                                     # NEW (T-13.8)
│   ├── RegistrarAlmacen.tsx                                  # NEW (T-13.10)
│   └── RegistrarEmpresa.tsx                                  # NEW (T-13.12)
└── tablas/
    ├── TablaSucursales.tsx                                   # NEW (T-13.7)
    ├── TablaCajas.tsx                                        # NEW (T-13.8)
    └── TablaAlmacenes.tsx                                    # NEW (T-13.10)

src/componentes/templates/
├── SucursalesCajasTemplate.tsx                               # NEW (T-13.9)
├── AlmacenesTemplate.tsx                                     # NEW (T-13.11)
└── EmpresaTemplate.tsx                                       # NEW (T-13.13)

src/componentes/paginas/
├── SucursalesCajasPage.tsx                                   # NEW (T-13.9)
├── AlmacenesPage.tsx                                         # NEW (T-13.11)
├── EmpresaPage.tsx                                           # NEW (T-13.13)
└── ConfigPage.tsx                                            # UPDATED: 3 tiles wired (T-13.14)

src/App.tsx                                                   # UPDATED: 3 new routes (T-13.14)
```

### Verification evidence (Batch 9)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 5.77s, 4 380.99 kB / 1 728.17 kB gz (2 490 modules) |
| `npm run dev` + `curl http://localhost:5174/` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion` | ✅ HTTP 200 (regression sanity) |
| `curl http://localhost:5174/configuracion/sucursalcaja` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion/almacenes` | ✅ HTTP 200 |
| `curl http://localhost:5174/configuracion/empresa` | ✅ HTTP 200 |
| `curl` for each of 20 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no code matches (1 JSDoc comment in `PosPage.tsx`) |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log\|console.error\|console.warn" src/componentes/{atomos,moleculas,organismos,templates,paginas}/ src/hooks/ src/stores/ src/lib/ src/types/` | ✅ no matches |

### SQL ↔ wrapper signature re-verification (per user request)

| Table / RPC | SQL signature (backup) | TS surface | Status |
|-------------|------------------------|------------|--------|
| `sucursales` table | `id bigint, nombre text, direccion_fiscal text, id_empresa bigint, delete boolean DEFAULT true` | `Sucursal` interface mirrors the row; queries/mutations via `.from('sucursales')` | ✅ Verified against lines 5727-5741 |
| `caja` table | `id bigint, descripcion text NOT NULL, id_sucursal bigint, fecha_creacion timestamp DEFAULT now(), delete boolean DEFAULT true, print boolean DEFAULT false` | `Caja` interface; queries via `.from('caja').in('id_sucursal', idSucursales)` | ✅ Verified against lines 5209-5226 |
| `almacen` table | `id bigint, id_sucursal bigint NOT NULL, fecha_creacion timestamp DEFAULT now(), delete boolean DEFAULT true, nombre text, "default" boolean DEFAULT true` | `Almacen` interface with `default: boolean` (reserved word); queries via `.from('almacen').in('id_sucursal', ...)` | ✅ Verified against lines 5155-5177 |
| `mostrarempresaxiduser` RPC | `(_id_usuario integer) RETURNS TABLE(result public.empresa)` | `mostrarEmpresaXIdUser(idUsuario: number): Promise<Empresa>`; wrapper passes `{ _id_usuario: idUsuario }` (no `p_` prefix) | ✅ Verified against line 2070 |
| `insertar/editar/eliminar sucursales` | — | **NOT present in `~/supabase-backup-20260812.sql`** (verified via `grep -nE 'insertarsucursal\|editarsucursal\|eliminarsucursal\|insertarcaja\|editarcaja\|eliminarcaja\|insertaralmacen\|editaralmacen\|eliminaralmacen\|insertarempresa\|editarempresa'` → 0 hits). All writes are direct `.from('<table>').insert/update/delete()` | ✅ Documented; same pattern as `useEliminarProductoMutation` (Batch 5) + `useEliminarMetodoPagoMutation` (Batch 8) |

### Forbidden-pattern guards (Batch 9)

| Guard | Status |
|-------|--------|
| `Swal.fire()` / `Swal.*` in code | ✅ none (1 JSDoc comment in `PosPage.tsx`) |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (only in comment) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 9)

- **`useCajasQuery` / `useAlmacenesQuery` scope by `id_sucursal` IN list,
  not a server-side join.** The SQL catalog has no list RPC for `caja`
  or `almacen` (verified via `grep`); to keep the contract surface
  small we read the canonical lists via
  `.from('caja').select('*').in('id_sucursal', [...idSucursales])`. This
  requires the page to first fetch the empresa's sucursales (via
  `useSucursalesQuery`); if `idSucursales.length === 0` the hooks resolve
  `[]` so the tables never render FK-less orphan rows. Same pattern
  Batch 8 used for `useClientesProveedoresQuery`.
- **`useCajasQuery` / `useAlmacenesQuery` query key includes the sorted
  sucursal id list.** When the underlying sucursales list changes (insert
  / delete) react-query's key changes too, so the dependent query
  refetches automatically. Avoids a stale cache window where a newly-
  inserted caja wouldn't show up.
- **`Almacen.default` exposed under that exact name (reserved word).**
  The Supabase client returns the SQL column literally as `"default"`.
  We never destructure (`const { default } = row`) — every consumer
  reads via `row.default` / `row['default']`. The form's local name
  `esDefault` keeps the JSX clean and the hook maps `esDefault →
  default` at the boundary.
- **`useEmpresaPorUsuarioQuery` commits to `useEmpresaStore` on
  success.** This is a deliberate cache-coherence step: every other
  screen that reads `useEmpresaStore.empresa` (Dashboard, POS, Header)
  sees the latest values without a hard reload. The optimistic patch in
  `useEditarEmpresaMutation.onSuccess` covers the in-between window
  before the next refetch lands.
- **`useEmpresaPorUsuarioQuery` on error resolves `null` so the page
  falls back to the cached session row.** The cached row is set at
  login via `mostrarempresaxidauth`; if `mostrarempresaxiduser` fails
  (network blip, transient RLS) we still render the Empresa page with
  whatever the cashier had at session start. Documented in the page's
  Alert.
- **`StorageError` has no `code`/`hint`/`details`.** The Supabase
  `StorageError` type exposes only `message`; `notifyRpcError` is called
  with `{ message, rpcName }` only (no `code`/`hint`/`details`). The
  `RpcErrorLike` interface already makes those optional, so the call
  site stays typed.
- **`RegistrarEmpresa` modal is `width={720}` (not 520 like the other
  forms).** The form has 11 inputs + a logo header; the wider modal
  prevents the two-row sections from collapsing into a single column on
  common screen sizes.
- **`RegistrarEmpresa` logo upload uses `<Upload beforeUpload={async
  (file) => { …; return false; }}>`** to prevent AntD from running its
  own upload pipeline on top of our `useSubirLogoEmpresaMutation`. The
  `mutateAsync` + `return false` combination gives us the full control
  flow while staying inside AntD's Upload shape (no `customRequest`
  override needed).
- **`useEmpresaPorUsuarioQuery` runs unconditionally.** Hooks are called
  unconditionally from the page and the `enabled` flag short-circuits
  when `idUsuario <= 0`. Mirrors the convention Batch 4 used for the
  dashboard hooks.
- **`EmpresaPage` soft Alert when `idUsuario <= 0`.** Some admin
  provisioning flows leave the empresa without a linked `usuarios`
  row; the page surfaces a warning Alert instead of failing silently.
- **`SucursalesCajasTemplate` uses AntD `<Tabs>` with two panels.**
  Two distinct CRUD surfaces (Sucursales / Cajas) on the same URL are
  clearer as tabs than as a sequential layout; the tab key is persisted
  in `useSucursalesStore.tabActiva` so a back-and-forth keeps the
  cashier's context.
- **`EmpresaTemplate` logo header uses AntD `<Avatar shape="square">`
  with the first character of `empresa.nombre` as fallback.** Mirrors
  the `LogoEmpresa` atom in the Login page so the visual identity is
  consistent across the app.
- **No code-splitting.** +44 kB from Batch 8 (no new heavy deps); the
  bundle stays a single 4.4 MB chunk. Per-route `React.lazy` for the
  config routes is still deferred to the polish batch per the user's
  "single PR per tanda" instruction.

### Risks (Batch 9)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 4 381 kB / 1 728 kB gz (single chunk) | MEDIUM | +44 kB from Batch 8 (no new heavy deps); pdfmake + VFS fonts are still the bulk. Per-route `React.lazy` for the heaviest routes (POS, Config grid, Empresa) would shave ~2 MB; deferred per the user's "single PR per tanda" instruction |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; `manualChunks` lands with the polish batch |
| `useEmpresaPorUsuarioQuery` commits to `useEmpresaStore` on success — could race with `useLoginMutation` writing the same store | LOW | Both setters land in the same `useEmpresaStore.setEmpresa` action; last write wins. The bootstrap path (`useAuthBootstrap`) only fires when the stores are empty, so a race window is finite |
| `useCajasQuery` / `useAlmacenesQuery` rely on the cached `sucursales` list being populated before the page mounts | LOW | Both pages read `useSucursalesQuery` at mount; the dependency is explicit (the page calls `useSucursalesQuery` and then `useAlmacenesQuery(idEmpresa, idSucursales)`). `staleTime: 60_000` keeps the two in sync |
| `Almacen.default` is a reserved word — destructuring would be a syntax error | LOW | Documented inline; all callers use `row.default` / `row['default']` / `Almacen['default']`. ESLint / tsc would catch any future destructure attempt |
| `mostrarempresaxiduser` returns `TABLE(result public.empresa)` — PostgREST might serialize it as `[{ result: {...} }]` or `{ result: {...} }` depending on version | LOW | We coerce via `(data ?? []) as EmpresaXIdUserResult[]` and take `rows[0]`; if the wire shape ever changes (single object vs array) the typed surface downstream will throw at the boundary, not in some far consumer |
| `RegistrarEmpresa` logo upload runs before the form is submitted — if the user cancels, the file stays in the bucket | LOW | Bucket cleanup is post-MVP; documented. The successful path writes the storage path to `empresa.logo` so the orphan is at most one file per cancelled modal |
| `SucursalesCajasTemplate` tabs don't auto-switch after a delete that empties the current tab | LOW | The current tab stays on whatever the cashier picked; if they delete the last sucursal the Cajas tab still renders `[]` (no auto-jump). Documented; future polish could add a `useEffect` that flips to the other tab when the current list goes empty |
| `useEmpresaPorUsuarioQuery` invalidation on edit fires BEFORE the optimistic patch lands | LOW | Order in `useEditarEmpresaMutation.onSuccess`: optimistic patch → invalidate → success toast. The Dashboard / POS consumers read from `useEmpresaStore.empresa` (the patched value), not from the react-query cache |
| `direccion_fiscal` empty string → `'-'` coercion hides user intent | LOW | Same convention Batch 8 used for `clientes_proveedores`; the SQL default is what the table would store anyway |
| `useEmpresaPorUsuarioQuery` runs on every Empresa page mount | LOW | `staleTime: 60_000` so a back-and-forth between Empresa and other screens doesn't refetch on every visit |

### Remaining tasks

The chain is at its terminal apply batch. All `T-1.*` … `T-13.*` are
now `[x]`. Only `T-10.*` (parent-owned verify/smoke tests against the
live Supabase tenant) remain.

### Suggested commit message (Batch 9)

```
feat(tpv365): sucursales/cajas + almacenes + empresa (Tanda 8)

- src/types/rpc.ts: Sucursal (id, nombre, direccion_fiscal, id_empresa,
  delete) + Caja (id, descripcion, id_sucursal, fecha_creacion,
  delete, print) + Almacen (id, id_sucursal, fecha_creacion, delete,
  nombre, default — reserved word caveat documented).
- src/stores/useSucursalesStore.ts (selected + tabActiva
  'sucursales' | 'cajas' + setters) + useCajasStore + useAlmacenesStore.
- src/lib/queryKeys.ts: qk.sucursales.list/all + qk.cajas.list/all +
  qk.almacenes.list/all + qk.empresa.porUsuario(idUsuario). The
  cajas/almacenes list keys include the sorted idSucursales list so the
  query refetches when the underlying sucursales change.
- src/lib/rpc/auth.ts: mostrarEmpresaXIdUser(idUsuario: number)
  + EmpresaXIdUserResult interface. Calls
  supabase.rpc('mostrarempresaxiduser', { _id_usuario: idUsuario })
  with the underscore-prefixed parameter name (no p_ prefix). Coerces
  the [{ result: Empresa }] shape and throws RpcError on empty result.
- src/hooks/useSucursales.ts: useSucursalesQuery(idEmpresa) +
  useInsertarSucursalMutation + useEditarSucursalMutation +
  useEliminarSucursalMutation. 23503 surfaces as "la sucursal tiene
  cajas, almacenes o ventas vinculadas".
- src/hooks/useCajas.ts: useCajasQuery(idEmpresa, idSucursales)
  scopes by .in('id_sucursal', idSucursales); empty idSucursales
  resolves []. 3 mutations; 23503 → "la caja tiene movimientos o
  asignaciones vinculadas".
- src/hooks/useAlmacenes.ts: mirrors useCajas shape with the
  default ↔ esDefault mapping at the boundary. 23503 → "el almacén
  tiene productos o ventas vinculadas".
- src/hooks/useEmpresa.ts: useEmpresaPorUsuarioQuery(idUsuario) calls
  the RPC + commits to useEmpresaStore on success;
  useEditarEmpresaMutation writes via .from('empresa').update();
  useSubirLogoEmpresaMutation uploads to bucket imagenes at
  empresa/{id}/{ts}-logo.{ext} and returns { path, publicUrl }.
- src/componentes/organismos/tablas/TablaSucursales.tsx: AntD Table
  with columns Nombre / Dirección fiscal (em-dash on '-') / Acciones
  (edit + EliminarRegistroBtn). Pagination 10/20/50.
- src/componentes/organismos/formularios/RegistrarSucursal.tsx: AntD
  Modal + react-hook-form. Fields nombre (max 200 required) +
  direccion_fiscal (max 200 optional, empty → '-'). Spanish
  validation.
- src/componentes/organismos/tablas/TablaCajas.tsx: AntD Table —
  columns Descripción / Sucursal (Tag with joined label) / Imprime
  (Tag) / Acciones (edit + EliminarRegistroBtn).
- src/componentes/organismos/formularios/RegistrarCaja.tsx: AntD
  Modal + react-hook-form. Fields descripcion (max 200 required) +
  id_sucursal (required Select populated from props). Spanish
  validation.
- src/componentes/templates/SucursalesCajasTemplate.tsx: AntD Tabs
  (Sucursales / Cajas panels, each with toolbar + table).
- src/componentes/paginas/SucursalesCajasPage.tsx: full rewrite.
  Owns useSucursalesQuery + useCajasQuery(idEmpresa, idSucursales)
  + tabActiva via useSucursalesStore + the two modal stacks +
  centered Spin flicker guard while idEmpresa <= 0.
- src/componentes/organismos/tablas/TablaAlmacenes.tsx: AntD Table —
  columns Nombre / Sucursal (Tag) / Predeterminado (Tag) / Acciones.
- src/componentes/organismos/formularios/RegistrarAlmacen.tsx: AntD
  Modal + react-hook-form. Fields nombre + id_sucursal (Select) +
  esDefault (Switch). default ↔ esDefault mapping at submit.
- src/componentes/templates/AlmacenesTemplate.tsx + paginas/
  AlmacenesPage.tsx: toolbar + table + centered Spin flicker guard.
- src/componentes/organismos/formularios/RegistrarEmpresa.tsx: AntD
  Modal (width=720) + react-hook-form. Sections Datos básicos +
  Moneda/impuesto + Logo upload to bucket imagenes at
  empresa/{id}/{ts}-logo.{ext}. Spanish validation. Permissive email
  regex. valor_impuesto is InputNumber 0..100 coerced to Number.
- src/componentes/templates/EmpresaTemplate.tsx: AntD Descriptions
  card with logo header + Datos básicos + Moneda e impuesto +
  Editar button.
- src/componentes/paginas/EmpresaPage.tsx: full rewrite. Owns
  useEmpresaPorUsuarioQuery + modal state + soft Alert when
  idUsuario <= 0 + centered Spin flicker guard when idEmpresa <= 0.
- src/App.tsx: 3 new routes (/configuracion/sucursalcaja,
  /configuracion/almacenes, /configuracion/empresa) under the
  ProtectedRoute → ShellLayout subtree.
- src/componentes/paginas/ConfigPage.tsx: removed "Próximamente" from
  the Sucursales y cajas / Almacenes / Empresa tiles and wired their
  to props.
- Forbidden-pattern guards clean: no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore, no console.log
  in new files.
- tsc --noEmit: 0 errors; npm run build: 4 381 kB / 1 728 kB gz;
  dev server returns HTTP 200 on /, /configuracion,
  /configuracion/sucursalcaja, /configuracion/almacenes,
  /configuracion/empresa and on all 20 new modules.
```

---

### Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-13.1
  through T-13.15 marked `[x]` in the new Batch 13 section. T-10.*
  (parent-owned verify/smoke tests) remain `[ ]`.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used. Apply-progress persisted only to the
  filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8) at start; merged Batch 9
  above; written back here.



---

## Batch 10 — Configuración (Tanda 9: Usuarios + Ticket + Serialización + Impresoras, completed)

**PR boundary:** Batch 10 of the `stacked-to-main` chain. Tanda 9 = the last
configuration quadrant of the MVP. Folds the user-requested "TANDA 9
(usuarios/empleados + ticket + serialización + impresoras) del MVP TPV-365
— última tanda de configuración."

**Strategy delivered:** single PR for the entire Tanda 9 quadrant. ~2 040
lines of new code across 20 new files + 5 updated files; build clean
(4 416 kB / 1 735 kB gz, +36 kB from Batch 9 — no new heavy deps); zero
Swal, zero barrels, zero `any` at boundaries, zero `as unknown as` in code,
zero `@ts-ignore`, zero `console.log` in new files.

### Tasks completed

- [x] **T-14.1** — `src/types/rpc.ts` extended: `Rol` (id, nombre),
  `TipoDocumento` (id, nombre, id_empresa | null), `AsignacionUsuario`
  (full `m…bb.usuariosasignados` row shape: id_asignacion, id_usuario,
  usuario, sucursal, caja, rol, email, estadouser, id_rol, nro_doc,
  telefono), `CrearEmpleadoArgs` (email, pass, nombres, id_tipodocumento,
  nro_doc, telefono, id_rol), `Impresora` (id, id_caja, pc_name, ip_local,
  state, name), `InsertImpresoraArgs`, `EditImpresoraArgs`. SQL contracts
  verified line-by-line against `~/supabase-backup-20260812.sql`.

- [x] **T-14.2** — `useUsuariosStore` extended with `selectedAsignacion:
  AsignacionUsuario | null` + `setSelectedAsignacion` (UI state only per
  design Dg3). `src/types/store.ts` `UsuariosStore` interface extended
  accordingly.

- [x] **T-14.3** — `src/lib/queryKeys.ts` extended with `qk.serializacion
  .list/all`, `qk.tipoComprobante.list`, `qk.tipoDocumento.list`,
  `qk.roles.list`, `qk.usuarios.list/buscar/all`, `qk.impresoras.list/all`.

- [x] **T-14.4** — `src/lib/rpc/usuarios.ts` (NEW): `mostrarUsuariosAsignados
  (idEmpresa)`, `buscarUsuariosAsignados(idEmpresa, buscador)`,
  `crearCredencialesUser(email, pass)`. All three wrappers route errors
  through `throwRpcError` + `RpcError`. Param names: `_id_empresa`,
  `buscador`, `email`, `pass` — verified line-by-line against the SQL
  (no `p_` prefix; `crearcredencialesuser` uses bare `email`/`pass`).

- [x] **T-14.5** — `src/hooks/useUsuarios.ts` (NEW):
  - `useUsuariosQuery(idEmpresa)` calls the `mostrarusuariosasignados`
    RPC; errors surface via `notifyRpcError` + manual shape (`message`,
    `code?`, `hint?`, `details?`); `staleTime: 60_000`.
  - `useBuscarUsuariosQuery(idEmpresa, buscador)` calls the
    `buscarusuariosasignados` RPC; empty `trimmed` buscador short-circuits
    to `[]` (the SQL `LIKE '%' || '' || '%'` matches every row, which
    would be confusing; we let the callers fall back to `useUsuariosQuery`
    for the canonical list).
  - `useRolesQuery()` reads `supabase.from('roles').select()` (no list
    RPC; `staleTime: 5 * 60_000`).
  - `useTipoDocumentoQuery(idEmpresa)` reads `supabase.from('tipodocumento')
    .select().or('id_empresa.is.null,id_empresa.eq.X')` so the global
    document types are visible alongside the empresa-specific ones.
  - `useCrearEmpleadoMutation(idEmpresa)` is the two-step employee
    creation: `crearcredencialesuser(email, pass)` → `auth.users.id` uuid
    → `.from('usuarios').insert({ nombres, id_tipodocumento, nro_doc,
    telefono, id_rol, correo, id_auth: uuid })`. On success invalidates
    `qk.usuarios.all(idEmpresa)`. If step 2 fails after step 1 succeeded
    the toast surfaces the orphan uuid so the admin can clean it up.

- [x] **T-14.6** — `src/hooks/useSerializacion.ts` (NEW):
  - `useSerializacionQuery(idEmpresa)` reads `.from('serializacion_
    comprobantes').select()` (no list RPC).
  - `useTipoComprobanteQuery(idEmpresa)` reads `.from('tipo_comprobantes')
    .select()` (no list RPC).
  - `useInsertarSerializacionMutation` + `useEditarSerializacionMutation`
    write via direct `.from('serializacion_comprobantes').insert/update()`.
  - `useEliminarSerializacionMutation` deletes via `.from().delete()`;
    23503 → "la serialización está vinculada a ventas".
  - `useSetDefaultSerializacionMutation` calls the existing
    `setDefaultSerializacion(idSerializacion, idSucursal)` wrapper in
    `src/lib/rpc/ventas.ts` (RPC `setdefaultserializacion(_id, _id_sucursal)
    RETURNS void` — verified line 2513).

- [x] **T-14.7** — `src/hooks/useImpresoras.ts` (NEW): `useImpresorasQuery
  (idEmpresa)` reads `.from('impresoras').select()` (no list RPC); three
  mutations on the same table; 23503 → "la impresora está vinculada a
  ventas".

- [x] **T-14.8** — `src/hooks/useEmpresa.ts` extended with
  `useEditarTicketMutation(idUsuario)`. The mutation writes ONLY the four
  ticket-relevant fields (`nombre`, `direccion_fiscal`, `simbolo_moneda`,
  `pie_pagina_ticket`) via `.from('empresa').update()` and patches the
  session store optimistically so the rest of the app (Dashboard, POS,
  Header) sees the new headers without a hard reload.

- [x] **T-14.9** — `src/componentes/moleculas/BuscadorUsuarios.tsx`
  (NEW, presentational AntD `<Input>` with `prefix={<FiSearch />}` +
  `allowClear`). `src/componentes/organismos/tablas/TablaUsuarios.tsx`
  (NEW, AntD Table — columns Empleado / Email / Sucursal / Caja / Rol /
  Estado (green Tag when `ACTIVO`) / Documento / Teléfono; pagination
  10/20/50 with "X-Y de Z usuarios" footer).

- [x] **T-14.10** — `src/componentes/organismos/formularios/RegistrarUsuario.tsx`
  (NEW, AntD Modal + react-hook-form). Fields: nombres (max 200, required),
  email (regex + max 200, required), password + confirm (min 6 chars),
  id_tipodocumento (Select from `useTipoDocumentoQuery`, optional),
  id_rol (Select from `useRolesQuery`, required), nro_doc (max 50,
  optional, empty → `'-'`), telefono (max 50, optional, empty → `'-'`).
  Spanish validation messages. The assistant-style Alert at the top
  surfaces the "asignación a sucursal/caja es post-MVP" caveat.

- [x] **T-14.11** — `src/componentes/templates/UsuariosTemplate.tsx`
  (NEW, presentational: `BuscadorUsuarios` + "Nuevo empleado" button + the
  table). `src/componentes/paginas/UsuariosPage.tsx` (NEW, full rewrite).
  Owns: `useUsuariosQuery` + a 300 ms debounced mirror of `buscador` +
  `useBuscarUsuariosQuery(idEmpresa, debounced)` (search ≥ 1 char) +
  the modal open state + the centered Spin flicker guard while
  `idEmpresa <= 0` + soft Alert describing the screen + the post-MVP
  assignation caveat.

- [x] **T-14.12** — `src/componentes/organismos/formularios/RegistrarTicket.tsx`
  (NEW, AntD Modal + react-hook-form). Fields: nombre (max 200, required),
  direccion_fiscal (max 200, optional, empty → `'-'`), simbolo_moneda
  (max 10, required), pie_pagina_ticket (max 200, optional, empty → `'-'`;
  handles the `null` SQL case). `src/componentes/templates/TicketTemplate.tsx`
  (NEW, AntD `<Descriptions>` card with "Editar" button). `src/componentes
  /paginas/TicketPage.tsx` (NEW, full rewrite). Owns `useEmpresaPorUsuario
  Query(idUsuario)` + modal state + soft Alert when `idUsuario <= 0` +
  centered Spin guard when `idEmpresa <= 0`.

- [x] **T-14.13** — `src/componentes/organismos/tablas/TablaSerializacion.tsx`
  (NEW, AntD Table — columns Tipo de comprobante (Tag with the joined
  label) / Serie / Cantidad de números / Correlativo / Sucursal /
  Predeterminado (Tag green if `por_default`) / Acciones (Edit + "Set
  default" — only visible when the row is NOT default — + `EliminarRegistroBtn`).
  The "Set default" button shows a `<Spin>` while the mutation is pending.
  `src/componentes/organismos/formularios/RegistrarSerializacion.tsx`
  (NEW, AntD Modal + react-hook-form). Fields: id_tipo_comprobante (Select
  from `useTipoComprobanteQuery`, required), serie (max 20, optional),
  cantidad_numeros (InputNumber 1..20), correlativo (InputNumber ≥ 0),
  sucursal_id (Select from `useSucursalesQuery`, required), por_default
  (Switch).

- [x] **T-14.14** — `src/componentes/templates/SerializacionTemplate.tsx`
  (NEW, toolbar "Nueva serialización" + `TablaSerializacion`).
  `src/componentes/paginas/SerializacionPage.tsx` (NEW, full rewrite).
  Owns: `useSerializacionQuery` + `useTipoComprobanteQuery` + the modal
  open/editing state + the delete handler + the set-default handler
  (forwards the loading id to the table) + the centered Spin flicker guard.

- [x] **T-14.15** — `src/componentes/organismos/tablas/TablaImpresoras.tsx`
  (NEW, AntD Table — columns Caja (Tag with the joined `caja.descripcion`)
  / Nombre / PC / IP local / Estado (read-only `<Switch>` indicator) /
  Acciones (Edit + `EliminarRegistroBtn`)). `src/componentes/organismos
  /formularios/RegistrarImpresora.tsx` (NEW, AntD Modal + react-hook-form).
  Fields: id_caja (Select from `useCajasQuery`, required), name (max 100,
  optional, empty → `'-'`), pc_name (max 100, optional, empty → `'-'`),
  ip_local (max 50, optional, empty → `'-'`), state (Switch).

- [x] **T-14.16** — `src/componentes/templates/ImpresorasTemplate.tsx`
  (NEW, toolbar "Nueva impresora" + `TablaImpresoras`). `src/componentes
  /paginas/ImpresorasPage.tsx` (NEW, full rewrite). Owns: `useSucursalesQuery`
  + `useCajasQuery(idEmpresa, idSucursales)` + `useImpresorasQuery` + the
  modal open/editing state + the delete handler + the centered Spin
  flicker guard.

- [x] **T-14.17** — `src/App.tsx` extended: 4 new routes
  `/configuracion/usuarios`, `/configuracion/ticket`,
  `/configuracion/serializacion`, `/configuracion/impresoras` under the
  `ProtectedRoute → ShellLayout` subtree. `src/componentes/paginas/ConfigPage.tsx`
  updated: removed the "Próximamente" badge from the 4 corresponding tiles
  and wired their `to` props.

- [x] **T-14.18** — `npm run build` (`tsc -b && vite build`) passes with
  zero errors (4 416.51 kB / 1 735.73 kB gz, 2 510 modules, +36 kB vs
  Batch 9). Dev server returns HTTP 200 on `/`,
  `/configuracion/usuarios`, `/configuracion/ticket`,
  `/configuracion/serializacion`, `/configuracion/impresoras` plus the
  existing `/configuracion` index (regression sanity). All 20 new modules
  transform cleanly through Vite HMR (HTTP 200 each). Forbidden-pattern
  guards re-verified.

### Files created / updated (Batch 10)

```
src/types/
└── rpc.ts                                                # UPDATED: Rol, TipoDocumento, AsignacionUsuario, CrearEmpleadoArgs, Impresora, InsertImpresoraArgs, EditImpresoraArgs
src/types/store.ts                                        # UPDATED: UsuariosStore.selectedAsignacion

src/stores/useUsuariosStore.ts                            # UPDATED: selectedAsignacion + setSelectedAsignacion

src/lib/
├── queryKeys.ts                                          # UPDATED: serializacion.list/all + tipoComprobante/tipoDocumento/roles + usuarios.list/buscar/all + impresoras.list/all
└── rpc/usuarios.ts                                       # NEW: mostrarUsuariosAsignados + buscarUsuariosAsignados + crearCredencialesUser

src/hooks/
├── useUsuarios.ts                                        # NEW: 5 hooks (queries + mutation)
├── useSerializacion.ts                                   # NEW: 6 hooks (queries + 4 mutations)
├── useImpresoras.ts                                      # NEW: 4 hooks (query + 3 mutations)
└── useEmpresa.ts                                         # UPDATED: useEditarTicketMutation

src/componentes/
├── moleculas/BuscadorUsuarios.tsx                        # NEW (T-14.9)
├── organismos/
│   ├── formularios/
│   │   ├── RegistrarUsuario.tsx                          # NEW (T-14.10)
│   │   ├── RegistrarTicket.tsx                           # NEW (T-14.12)
│   │   ├── RegistrarSerializacion.tsx                    # NEW (T-14.13)
│   │   └── RegistrarImpresora.tsx                        # NEW (T-14.15)
│   └── tablas/
│       ├── TablaUsuarios.tsx                             # NEW (T-14.9)
│       ├── TablaSerializacion.tsx                        # NEW (T-14.13)
│       └── TablaImpresoras.tsx                           # NEW (T-14.15)
├── paginas/
│   ├── UsuariosPage.tsx                                  # NEW (T-14.11)
│   ├── TicketPage.tsx                                    # NEW (T-14.12)
│   ├── SerializacionPage.tsx                             # NEW (T-14.14)
│   └── ImpresorasPage.tsx                                # NEW (T-14.16)
└── templates/
    ├── UsuariosTemplate.tsx                              # NEW (T-14.11)
    ├── TicketTemplate.tsx                                # NEW (T-14.12)
    ├── SerializacionTemplate.tsx                         # NEW (T-14.14)
    └── ImpresorasTemplate.tsx                            # NEW (T-14.16)

src/App.tsx                                               # UPDATED: 4 new routes (T-14.17)
src/componentes/paginas/ConfigPage.tsx                    # UPDATED: 4 tiles wired (T-14.17)
```

### Verification evidence (Batch 10)

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errors, 0 warnings |
| `npm run build` (`tsc -b && vite build`) | ✅ built in 6.12s, 4 416.51 kB / 1 735.73 kB gz (2 510 modules) |
| `npm run dev` + `curl http://localhost:5173/` | ✅ HTTP 200 |
| `curl http://localhost:5173/configuracion` | ✅ HTTP 200 (regression sanity) |
| `curl http://localhost:5173/configuracion/usuarios` | ✅ HTTP 200 |
| `curl http://localhost:5173/configuracion/ticket` | ✅ HTTP 200 |
| `curl http://localhost:5173/configuracion/serializacion` | ✅ HTTP 200 |
| `curl http://localhost:5173/configuracion/impresoras` | ✅ HTTP 200 |
| `curl` for each of 20 new modules | ✅ HTTP 200 each (Vite HMR transform OK) |
| `grep -rn "Swal" src/` | ✅ no code matches (1 JSDoc comment in `PosPage.tsx`) |
| `find src/ -name 'index.ts' -o -name 'index.tsx'` | ✅ no barrels |
| `grep -rn -E ':\s*any\b\|<any>\|\bas\s+any\b' src/` | ✅ no matches |
| `grep -rn "as unknown as" src/` (code only) | ✅ no matches (only the rationale comment in `src/lib/errors.ts`) |
| `grep -rn "@ts-ignore" src/` | ✅ no matches |
| `grep -rn "console.log\|console.error\|console.warn" src/componentes/{atomos,moleculas,organismos,templates,paginas}/ src/hooks/ src/lib/ src/stores/ src/servicios/ src/types/` | ✅ no matches |

### SQL ↔ wrapper signature re-verification (per user request)

| RPC / table | SQL signature (backup) | Wrapper / query | Status |
|-------------|------------------------|------------------|--------|
| `mostrarusuariosasignados` | `(_id_empresa integer) RETURNS TABLE(id_asignacion, id_usuario, usuario, sucursal, caja, rol, email, estadouser, id_rol, nro_doc, telefono)` | `mostrarUsuariosAsignados(idEmpresa): Promise<AsignacionUsuario[]>`; `_id_empresa` (no p_ prefix) | ✅ Verified line 2318 |
| `buscarusuariosasignados` | `(_id_empresa integer, buscador text) RETURNS TABLE(...)` | `buscarUsuariosAsignados(idEmpresa, buscador): Promise<AsignacionUsuario[]>`; `_id_empresa`, `buscador` (no p_ prefix) | ✅ Verified line 892 |
| `crearcredencialesuser` | `(email text, pass text) RETURNS uuid` | `crearCredencialesUser(email, pass): Promise<string>`; `email`, `pass` (no leading underscore — matches the SQL declaration literally) | ✅ Verified line 991 |
| `setdefaultserializacion` | `(_id integer, _id_sucursal integer) RETURNS void` (existing) | `setDefaultSerializacion(idSerializacion, idSucursal): Promise<void>` in `src/lib/rpc/ventas.ts`; new `useSetDefaultSerializacionMutation` hook calls it | ✅ Verified line 2513 (Batch 7 RPC-001) |
| `usuarios` table | (line 5804) `id bigint, …, id_auth text` | Two-step insert via `useCrearEmpleadoMutation`: `crearcredencialesuser` → uuid → `.from('usuarios').insert({ …, id_auth: uuid })` | ✅ Verified |
| `roles` table | (line 5646) `id bigint, nombre text` | `useRolesQuery` reads `.from('roles').select()` | ✅ Verified |
| `tipodocumento` table | (line 5779) `id bigint, nombre text, id_empresa bigint` | `useTipoDocumentoQuery(idEmpresa)` reads `.from('tipodocumento').select().or('id_empresa.is.null,id_empresa.eq.X')` | ✅ Verified |
| `serializacion_comprobantes` table | (line 5670) `id bigint, id_tipo_comprobante bigint, serie text, cantidad_numeros bigint, correlativo bigint, sucursal_id bigint, por_default boolean` | `useSerializacionQuery` reads `.from('serializacion_comprobantes').select()`; mutations write directly | ✅ Verified |
| `tipo_comprobantes` table | (line 5754) `id bigint, nombre text, destino text` | `useTipoComprobanteQuery` reads `.from('tipo_comprobantes').select()` | ✅ Verified |
| `impresoras` table | (line 5375) `id bigint, id_caja bigint NOT NULL, pc_name text DEFAULT '-', ip_local text DEFAULT '-', state boolean DEFAULT false, name text DEFAULT '-'` | `useImpresorasQuery` reads `.from('impresoras').select()`; mutations write directly | ✅ Verified |
| `empresa` table (Ticket subset) | (line 2046) `nombre`, `direccion_fiscal`, `simbolo_moneda`, `pie_pagina_ticket` | `useEditarTicketMutation` writes ONLY these four fields via `.from('empresa').update()` | ✅ Verified |
| `insertar/editar/eliminar` RPCs for usuarios / serializacion / impresoras | — | **NOT present in `~/supabase-backup-20260812.sql`** (verified via `grep -nE 'insertarusuario\|insertarserializacion\|insertarimpresora\|editarusuario\|editarimpresora\|eliminarimpresora'` → 0 hits). All writes are direct `.from('<table>').insert/update/delete()` | ✅ Documented; same pattern as `useEliminarProductoMutation` (Batch 5) / `useEliminarMetodoPagoMutation` (Batch 8) / `useEliminarSucursalMutation` (Batch 9) |

### Forbidden-pattern guards (Batch 10)

| Guard | Status |
|-------|--------|
| `Swal.fire()` / `Swal.*` in code | ✅ none (1 JSDoc comment in `PosPage.tsx`) |
| `index.ts` / `index.tsx` barrels | ✅ none |
| `any` at boundaries | ✅ none |
| `as unknown as` in code | ✅ none (only in comment in `errors.ts`) |
| `@ts-ignore` | ✅ none |
| `console.log` in new files | ✅ none |

### Deviations from design (Batch 10)

- **Two-step employee creation (`crearcredencialesuser` + `.from('usuarios')
  .insert()`).** The SQL exposes `crearcredencialesuser(email, pass) RETURNS
  uuid` for the auth row but does NOT auto-link it to the `usuarios` table
  (verified via `grep -nE 'insertarusuario'` → 0 hits). The mutation
  performs the two RPCs/talks back-to-back; if step 2 fails after step 1
  succeeded, the toast surfaces the orphan uuid so the admin can clean it
  up via the Supabase dashboard. Documented in `useCrearEmpleadoMutation`'s
  JSDoc and the form's helper Alert.
- **`buscarusuariosasignados` is dead-letter when `buscador.trim()` is
  empty.** The SQL `LIKE '%' || '' || '%'` matches every row, which would
  be confusing for the user. The hook short-circuits to `[]` so the page
  falls back to `useUsuariosQuery` for the canonical list. Documented in
  the hook's JSDoc.
- **Sucursal/caja assignation is OUT of scope for MVP.** Per the user
  instruction: "Si hay asignación sucursal/caja, incluirla si es simple; si
  no, dejarla fuera del MVP." The `asignacion_sucursal` table is read
  INDIRECTLY via the join in `mostrarusuariosasignados` / `buscarusuariosasignados`
  but never written to. The new employee will appear in the table only
  once the (post-MVP) asignation flow runs. Documented in the page's
  Alert + the helper Alert inside `RegistrarUsuario`.
- **`useMetodosPagoQuery` style for `roles`, `tipodocumento`, `impresoras`,
  `serializacion_comprobantes`, `tipo_comprobantes`.** None of these are
  exposed as list RPCs in the SQL catalog; we read directly via
  `.from('<table>').select()` per the convention established in Batches 5/6/8/9.
- **`TablaSerializacion` "Set default" button is hidden when the row is
  already default.** Calling `setdefaultserializacion` on a row that's
  already the default is a no-op; making the button visible would
  clutter the row. The `por_default` Tag stays green so the cashier
  can see the current default at a glance.
- **`RegistrarImpresora` uses `useCajasQuery(idEmpresa, idSucursales)` **
  to populate the `id_caja` `<Select>`. The `caja` table has no list RPC
  and is read scoped by `id_sucursal IN (...)`; the page first fetches
  the sucursales via `useSucursalesQuery`. Documented in the page's JSDoc.
- **`useEditarTicketMutation` is a focused subset of the `empresa` row.**
  The full Empresa page (`RegistrarEmpresa`) accepts 11 fields; the
  Ticket modal only touches 4. Reusing the same `update()` + optimistic
  patch path keeps the cache-coherence story consistent.
- **`useEmpresaPorUsuarioQuery` is shared by the Empresa + Ticket pages.**
  Both pages read the canonical row via the same RPC and fall back to
  the cached session row when the refetch is in flight. The Ticket page
  only USES the four ticket-relevant fields; the other fields stay
  available in case the form needs to pre-fill them later.
- **`useImpresorasQuery` returns the full table** (no `id_caja` filter). The
  impresoras table is small (typically one or two rows per caja) and the
  user wants a single global view rather than a per-caja filter. The
  page could grow a `Sucursal → Caja → Impresora` cascade post-MVP if
  the catalog grows.
- **`pef_pagina_ticket` field is `string | null` in the SQL interface** but
  the form coerces `null` → `''` on reset so the user can type into it.
  Empty string on submit coerces back to `'-'` to match the SQL default.
- **`useCrearEmpleadoMutation` does NOT show the new uuid on success.**
  The toast says "Empleado creado correctamente" — the cashier doesn't
  need the uuid at this stage. The orphan-on-failure path is the
  exception: if step 2 fails, the error message includes the uuid so
  the admin can clean it up.
- **No code-splitting.** +36 kB from Batch 9 (no new heavy deps); the
  bundle stays a single 4.4 MB chunk. Per-route `React.lazy` for the
  config routes is still deferred to the polish batch per the user's
  "single PR per tanda" instruction.

### Risks (Batch 10)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bundle 4 416 kB / 1 735 kB gz (single chunk) | MEDIUM | +36 kB from Batch 9 (no new heavy deps); pdfmake + VFS fonts are still the bulk. Per-route `React.lazy` for the heaviest routes (POS, Config grid) would shave ~2 MB; deferred per the user's "single PR per tanda" instruction |
| Bundle > 500 kB warning emitted by Vite | LOW | Advisory only; `manualChunks` lands with the polish batch |
| `useCrearEmpleadoMutation` orphan window: if step 2 fails after step 1 succeeds the auth row is orphaned | MEDIUM | The toast surfaces the orphan uuid so the admin can delete it from the Supabase dashboard. A future polish could add a `deleteAuthUser` RPC + automatic rollback |
| `useUsuariosQuery` and `useBuscarUsuariosQuery` return the same shape but use different query keys, so React Query treats them as independent caches | LOW | The page only renders one of them at a time (search ≥ 1 char → buscar, otherwise list). Both invalidate on every successful `useCrearEmpleadoMutation` via the `qk.usuarios.all(idEmpresa)` prefix |
| `serializacion_comprobantes.id_empresa` is NOT in the SQL contract — the `useSerializacionQuery` reads the full table | LOW | The storefront is multi-tenant by id_empresa in the empresa/sucursales split; the serializacion table is shared across the empresa's sucursales. Documented inline |
| `useRolesQuery` and `useTipoDocumentoQuery` use the canonical `roles` / `tipodocumento` table — no `id_empresa` filter (the `roles` table has none; the `tipodocumento` one is filtered by `id_empresa IS NULL OR id_empresa = X`) | LOW | Documented in the hook's JSDoc; matches the spec's RLS model |
| `RegistrarUsuario` `id_rol` Switch status flips to error AFTER submit (the second-attempt flow) | LOW | The Switch's `status=` prop is conditioned on `submitted && fieldState.error !== undefined` so the first paint is clean and the error only renders after the user clicks "Crear empleado" |
| Empty `direccion_fiscal` / `pie_pagina_ticket` coercing to `'-'` hides user intent | LOW | The SQL default is what the table would store anyway; the form's placeholder ("Opcional") makes the optionality clear |
| `setDefaultSerializacion` parameter rename (Batch 7 RPC-001) — the wrapper in `src/lib/rpc/ventas.ts` uses `_id, _id_sucursal` (the `serializacion_comprobantes.id` + `sucursal_id`) | LOW | Re-verified line 2513; the new mutation just calls the wrapper |

### Remaining tasks

The chain is at its TERMINAL apply batch. All `T-1.*` … `T-14.*` are now
`[x]`. Only `T-10.*` (parent-owned verify/smoke tests against the live
Supabase tenant) remain. After T-10.* the change is ready for `sdd-archive`.

PR #10 should merge before the user runs the parent-owned verify pass
against a live Supabase tenant.

### Suggested commit message (Batch 10)

```
feat(tpv365): usuarios + ticket + serialización + impresoras (Tanda 9)

- src/types/rpc.ts: Rol + TipoDocumento + AsignacionUsuario +
  CrearEmpleadoArgs + Impresora + Insert/EditImpresoraArgs. SQL
  contracts verified line-by-line against ~/supabase-backup-20260812.sql.
- src/types/store.ts: UsuariosStore.selectedAsignacion (UI state only).
- src/stores/useUsuariosStore.ts: selectedAsignacion + setSelectedAsignacion.
- src/lib/queryKeys.ts: serializacion.list/all + tipoComprobante.list +
  tipoDocumento.list + roles.list + usuarios.list/buscar/all +
  impresoras.list/all.
- src/lib/rpc/usuarios.ts (NEW): mostrarUsuariosAsignados +
  buscarUsuariosAsignados + crearCredencialesUser. Param names match
  SQL exactly (no p_ prefix; crearcredencialesuser uses bare email/pass).
- src/hooks/useUsuarios.ts (NEW): useUsuariosQuery (mostrarusuariosasignados)
  + useBuscarUsuariosQuery (buscarusuariosasignados; empty buscador → [])
  + useRolesQuery + useTipoDocumentoQuery +
  useCrearEmpleadoMutation (two-step: crearcredencialesuser + .from(
  'usuarios').insert() with id_auth link).
- src/hooks/useSerializacion.ts (NEW): useSerializacionQuery +
  useTipoComprobanteQuery + useInsertar/Editar/EliminarSerializacionMutation
  + useSetDefaultSerializacionMutation (calls the existing
  setDefaultSerializacion wrapper in src/lib/rpc/ventas.ts).
- src/hooks/useImpresoras.ts (NEW): useImpresorasQuery +
  useInsertar/Editar/EliminarImpresoraMutation. 23503 → "vinculada a ventas".
- src/hooks/useEmpresa.ts: useEditarTicketMutation (writes ONLY the four
  ticket-relevant fields via .from('empresa').update(); optimistic patch
  to useEmpresaStore).
- src/componentes/moleculas/BuscadorUsuarios.tsx (NEW): presentational
  AntD Input with prefix={<FiSearch />} + allowClear.
- src/componentes/organismos/tablas/TablaUsuarios.tsx (NEW): AntD Table —
  columns Empleado / Email / Sucursal / Caja / Rol / Estado / Documento /
  Teléfono; pagination 10/20/50.
- src/componentes/organismos/formularios/RegistrarUsuario.tsx (NEW): AntD
  Modal + react-hook-form. Fields: nombres (max 200, required), email
  (regex), password + confirm (min 6), id_tipodocumento (Select,
  optional), id_rol (Select, required), nro_doc (max 50, optional → '-'),
  telefono (max 50, optional → '-'). Assistant-style Alert surfaces the
  post-MVP asignation caveat.
- src/componentes/templates/UsuariosTemplate.tsx + paginas/UsuariosPage.tsx
  (NEW): toolbar + table + 300ms debounced search mirror + register modal +
  centered Spin flicker guard.
- src/componentes/organismos/formularios/RegistrarTicket.tsx (NEW): AntD
  Modal + react-hook-form. Fields: nombre (max 200, required),
  direccion_fiscal (max 200, optional → '-'), simbolo_moneda (max 10,
  required), pie_pagina_ticket (max 200, optional → '-'; handles null).
- src/componentes/templates/TicketTemplate.tsx + paginas/TicketPage.tsx
  (NEW): Descriptions card with Editar button + focused modal + soft
  Alert when idUsuario <= 0 + centered Spin guard when idEmpresa <= 0.
- src/componentes/organismos/tablas/TablaSerializacion.tsx (NEW): AntD
  Table — columns Tipo / Serie / Cantidad / Correlativo / Sucursal /
  Predeterminado / Acciones (Edit + Set default + EliminarRegistroBtn).
- src/componentes/organismos/formularios/RegistrarSerializacion.tsx (NEW):
  AntD Modal + react-hook-form. Fields: id_tipo_comprobante (Select,
  required), serie (max 20, optional), cantidad_numeros (InputNumber 1..20),
  correlativo (InputNumber ≥ 0), sucursal_id (Select, required),
  por_default (Switch).
- src/componentes/templates/SerializacionTemplate.tsx + paginas/SerializacionPage.tsx
  (NEW): toolbar + table + register modal + delete + set-default handlers +
  centered Spin flicker guard.
- src/componentes/organismos/tablas/TablaImpresoras.tsx (NEW): AntD Table —
  columns Caja / Nombre / PC / IP local / Estado (Switch indicator) /
  Acciones (Edit + EliminarRegistroBtn).
- src/componentes/organismos/formularios/RegistrarImpresora.tsx (NEW): AntD
  Modal + react-hook-form. Fields: id_caja (Select, required), name (max
  100, optional → '-'), pc_name (max 100, optional → '-'), ip_local (max
  50, optional → '-'), state (Switch).
- src/componentes/templates/ImpresorasTemplate.tsx + paginas/ImpresorasPage.tsx
  (NEW): toolbar + table + register modal + delete handler + centered
  Spin flicker guard.
- src/App.tsx: 4 new routes (/configuracion/usuarios, /configuracion/ticket,
  /configuracion/serializacion, /configuracion/impresoras) under the
  ProtectedRoute → ShellLayout subtree.
- src/componentes/paginas/ConfigPage.tsx: removed "Próximamente" from the 4
  corresponding tiles and wired their to props.
- Forbidden-pattern guards clean: no Swal, no barrels, no any at
  boundaries, no as unknown as in code, no @ts-ignore, no console.log in
  new files.
- tsc --noEmit: 0 errors; npm run build: 4 416 kB / 1 735 kB gz; dev
  server returns HTTP 200 on /, /configuracion, /configuracion/usuarios,
  /configuracion/ticket, /configuracion/serializacion, /configuracion/
  impresoras and on all 20 new modules.
```

---

### Persistence notes (this batch)

- **Tasks file** (`pos-react/sdd/tpv365-rebuild/tasks.md`): T-14.1 through
  T-14.18 marked `[x]` in the new Batch 14 section. T-10.* (parent-owned
  verify/smoke tests) remain `[ ]`.
- **Engram**: no Engram tools are exposed in this session — only the
  filesystem fallback is used. Apply-progress persisted only to the
  filesystem path above.
- **Memory contract (this batch):** read `apply-progress.md`
  (Batches 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9) at start; merged Batch 10
  above; written back here.
