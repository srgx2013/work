# TPV-365 Rebuild — Architecture Design

> Phase: `sdd-design` · Change: `tpv365-rebuild` · Status: ACCEPTED
> Inputs: `sdd/tpv365-rebuild/proposal` · `sdd/tpv365-rebuild/spec` · `sdd/tpv365-rebuild/explore`
> Stack (fixed): TypeScript full · Ant Design + styled-components · Recharts · pdfmake · @tanstack/react-query · react-hook-form · zustand (persist) · react-router-dom v6 · supabase-js · dayjs

---

## 0. Architecture Principles

1. **Single source of truth.** Server data lives ONLY in react-query's cache. Client/UI state lives ONLY in zustand. Never mirror server rows into a store except session-scoped identity (`empresa`/`usuario`) cached once at login.
2. **Unidirectional data flow.** Pages orchestrate: they call hooks, receive server data, and pass it down as props. Leaf components emit events up via callbacks. No leaf component fetches.
3. **Typed boundaries.** Every RPC wrapper, store, hook, and component prop is typed. `noImplicitAny` + `strict: true`. Zero `any` at RPC/store boundaries.
4. **No barrels.** Imports are direct file paths (`import { mostrarProductos } from '@/lib/rpc/productos'`). No `index.ts` re-export hub for components or wrappers.
5. **Toast, not Swal.** All user-facing errors/success go through one notification layer backed by Ant Design `message`/`notification`.
6. **Server-authoritative stock & serialization.** Triggers (`validarstock`, `devolverstockaleliminardv`) and RPCs are the source of truth; the frontend surfaces their errors as toasts and never guesses stock or comprobante numbers client-side.

---

## 1. Layered Architecture

Atomic Design with five layers. Spanish layer names are kept (`componentes/atomos|moleculas|organismos|templates|paginas`) to match the spec's file structure and the reference base's naming.

```
paginas (Pages)
   │  compose + wire hooks
   ▼
templates (Templates)
   │  layout regions only
   ▼
organismos (Organisms)
   │  feature units; may read stores / own hooks
   ▼
moleculas (Molecules)
   │  small composite; props + callbacks only
   ▼
atomos (Atoms)
   │  leaf; props only
```

### 1.1 Layer responsibilities

| Layer | Directory | Responsibility | Can read stores? | Can call hooks? | Receives data via |
|-------|-----------|----------------|------------------|-----------------|-------------------|
| **Paginas** | `componentes/paginas/` | Route container. Calls react-query hooks, composes templates/organisms, owns page-level orchestration (e.g., "on submit → mutation → invalidate"). No business logic beyond wiring. | Yes (only to read `empresa.id`/session and set UI state) | Yes (react-query) | Hooks (server data) |
| **Templates** | `componentes/templates/` | Layout composition (grid, columns, header/footer regions). Renders `children`/slots. | No | No | Props |
| **Organismos** | `componentes/organismos/` | Feature unit (a table, a modal form, a sidebar, a POS region). Combines molecules/atoms into a working feature. | Yes (cross-cutting UI state: theme, sidebar, modals, cart) | Yes (only for the data domain it owns, e.g. `TablaProductos` uses `useProductosQuery`) | Props + Stores + own Hooks |
| **Moleculas** | `componentes/moleculas/` | Small composite with a single purpose (a card, a search input, a toggle, a payment entry row). Presentational + local interaction. | No | No | Props |
| **Atomos** | `componentes/atomos/` | Leaf (`LogoEmpresa`, `Reloj`, `CustomTooltip`, currency/date formatter wrappers, styled primitive buttons/inputs). | No | No | Props |

### 1.2 Communication rules

- **Props (top-down):** the ONLY way presentational data flows downward.
- **Callbacks (bottom-up):** the ONLY way events flow upward (`onAdd`, `onSubmit`, `onDelete`, `onSelect`, `onToggle`).
- **Stores (cross-cutting):** used ONLY for client/UI state shared by many unrelated components — `useThemeStore` (theme), `useGlobalStore` (sidebar + modals), `useVentasStore` (cart). Components subscribe with narrow selectors to avoid re-renders.
- **Hooks (server data):** called in pages and in organisms that own a data domain. Molecules/atoms NEVER call hooks.

**Violations that will be rejected in review:** an atom/molecule importing a store hook; a molecule calling `useQuery`; a page duplicating server data into a store; a component passing a whole `empresa` object down 4 levels when only `empresa.id` is needed (use a `simbolo_moneda`/`id` prop instead).

---

## 2. Data Flow (react-query vs zustand)

### 2.1 Ownership split

| Concern | Owner | Examples |
|---------|-------|----------|
| Server data (can change, invalidate, refetch) | **@tanstack/react-query** | productos, categorías, dashboard metrics, ventas/detalle, metodos_pago, serialización, movimientos caja live |
| Session identity (cached once, stable per session) | **zustand** (non-persisted) | `empresa`, `usuario` |
| UI / interaction state | **zustand** | cart (`useVentasStore`), theme, sidebar, modals, selected row, dashboard date range |
| Form state | **react-hook-form** (local to modal forms) | `RegistrarProductos`, `RegistrarCategorias` |

### 2.2 Decision rules (when to use which)

Use **react-query** when:
- The data lives in Supabase and can be mutated by other actors (or by our own mutations).
- You need caching, dedup, retry, refetch-on-window-focus, or invalidation.
- The data is derived from RPC/`.from()` calls.

Use **zustand** when:
- The state is ephemeral UI state (modal open, sidebar collapsed, theme, selected row).
- The state is a client-only interaction artifact (cart items, dashboard date range before refetch).
- The state must survive a full page refresh (cart via `persist`).

**Do NOT:** put fetched server rows into a store "for convenience". The store's `setProductos`/`setCategorias` setters exist to hold *selection/UI* state (selected row, search text), not to be the canonical list. The canonical list is the react-query cache. (This is a deliberate deviation from the original 25-store design where stores held server rows.)

> **Session identity exception.** `empresa` and `usuario` are fetched once at login, are stable for the session, and are needed by many components (header, query-key builders, POS). They are cached in `useEmpresaStore`/`useUsuariosStore` as *session context*, not as invalidatable server state. They are cleared on logout.

### 2.3 Query key factory (single source of truth)

`src/lib/queryKeys.ts` exports builder functions so keys never drift between queries and invalidations:

```typescript
export const qk = {
  productos: {
    list: (idEmpresa: number) => ['productos', 'list', idEmpresa] as const,
    buscar: (idEmpresa: number, buscador: string) => ['productos', 'buscar', idEmpresa, buscador] as const,
    all: (idEmpresa: number) => ['productos', idEmpresa] as const,          // prefix invalidation
  },
  categorias: {
    list: (idEmpresa: number) => ['categorias', 'list', idEmpresa] as const,
    all: (idEmpresa: number) => ['categorias', idEmpresa] as const,
  },
  dashboard: {
    totalVentas: (idEmpresa: number, ini: string, fin: string) => ['dashboard', 'totalVentas', idEmpresa, ini, fin] as const,
    // ... one per RPC, all prefixed with ['dashboard', ...]
    all: (idEmpresa: number) => ['dashboard', idEmpresa] as const,
  },
  ventas: {
    detalle: (idVenta: number) => ['ventas', 'detalle', idVenta] as const,
  },
  metodosPago: {
    list: (idEmpresa: number) => ['metodosPago', 'list', idEmpresa] as const,
  },
  serializacion: {
    default: (idEmpresa: number, idSucursal: number) => ['serializacion', 'default', idEmpresa, idSucursal] as const,
  },
  caja: {
    live: (idEmpresa: number) => ['caja', 'live', idEmpresa] as const,
  },
} as const;
```

Prefix invalidation (e.g. `['productos', idEmpresa]`) invalidates every productos query for that empresa in one call.

### 2.4 Invalidation after mutations

Every mutation invalidates the affected domain prefix in `onSuccess`, then the affected query refetches automatically.

```typescript
// useInsertarProductoMutation (example pattern)
const qc = useQueryClient();
return useMutation({
  mutationFn: (p: InsertProductoParams) => rpc.insertarProductos(p),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: qk.productos.all(idEmpresa) });
  },
});
```

Mapping of mutation → invalidation:

| Mutation | Invalidates |
|----------|-------------|
| insertar/editar/eliminar producto | `qk.productos.all(idEmpresa)` + `qk.productos.buscar(...)` |
| insertar/editar categoría | `qk.categorias.all(idEmpresa)` |
| insertardetalleventa / editarcantidaddv / delete detail | `qk.ventas.detalle(idVenta)` (cart UI is zustand, not react-query) |
| confirmar_venta | `qk.ventas.detalle`, `qk.caja.live(idEmpresa)`, `qk.dashboard.all(idEmpresa)` (sales changed) |

Dashboard: changing `fechaInicio`/`fechaFin` in `useDashboardStore` changes the query keys, so all 8 queries refetch automatically via react-query's key-based cache — no manual refetch call needed. `CardMovimientosCajaLive` uses `qk.caja.live(idEmpresa)` with `refetchInterval: 15_000` and `retry: 1`.

### 2.5 POS cart flow (client vs server split)

- **Client (zustand):** `cart: CartItem[]` is the optimistic source of what's on screen; `currentVentaId` tracks the sale row id.
- **Server (react-query + RPC):** the authoritative `detalle_venta` rows come from `mostrardetalleventa(idVenta)` and are held in the react-query cache (`qk.ventas.detalle`). The cart store mirrors the *intent*, the RPC result is the *truth*; on each successful RPC the detail query is invalidated/refetched so the table shows server-acknowledged rows.
- **Persist boundary:** only `cart` + `currentVentaId` are persisted (so a refresh survives), but on POS mount the persisted cart is reconciled against `mostrardetalleventa(currentVentaId)` — if the venta no longer exists or detail is empty, the persisted cart is discarded.

---

## 3. Typed RPC Layer

### 3.1 `src/lib/supabase.ts`

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_APP_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  throw new Error('Faltan variables de entorno VITE_APP_SUPABASE_URL / VITE_APP_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

`import.meta.env` is typed via `src/vite-env.d.ts` (Vite default) extended with the two custom keys, so `import.meta.env.VITE_APP_*` are `string | undefined` — no `any`.

### 3.2 `src/lib/rpc/` — one file per domain

```
src/lib/rpc/
├── auth.ts        # mostrarempresaxidauth, contarproductosporauth
├── productos.ts   # mostrarproductos, buscarproductos, insertarproductos, editarproductos
├── categorias.ts  # insertarcategorias, editarcategorias
├── ventas.ts      # insertardetalleventa, editarcantidaddv, mostrardetalleventa, confirmar_venta
├── dashboard.ts   # 8 dashboard RPCs
└── caja.ts        # mostrarmovimientoscajalive
```

No `index.ts` barrel (honors decision D3 / forbidden patterns; the spec's illustrative `rpc/index.ts` line is superseded — see §11 Decisions).

### 3.3 Wrapper pattern (single shape)

Every wrapper:
1. Calls `supabase.rpc('fn_name', params)`.
2. Destructures `{ data, error }`.
3. Throws a typed `RpcError` if `error` is present.
4. Returns `data as T` where `T` is the declared output type from `src/types/rpc.ts`.

```typescript
// src/lib/rpc/productos.ts
import { supabase } from '@/lib/supabase';
import { throwRpcError } from '@/lib/errors';
import type { Producto } from '@/types/rpc';

export async function mostrarProductos(idEmpresa: number, buscador = ''): Promise<Producto[]> {
  const { data, error } = await supabase.rpc('mostrarproductos', { _id_empresa: idEmpresa, _buscador: buscador });
  if (error) throwRpcError(error, 'mostrarproductos');
  return (data ?? []) as Producto[];
}
```

### 3.4 Error normalization — `src/lib/errors.ts`

```typescript
import type { PostgrestError, AuthError } from '@supabase/supabase-js';

export class RpcError extends Error {
  readonly code?: string;
  readonly hint?: string;
  readonly details?: string;
  readonly rpcName: string;
  constructor(message: string, rpcName: string, code?: string, hint?: string, details?: string) {
    super(message);
    this.name = 'RpcError';
    this.rpcName = rpcName;
    this.code = code;
    this.hint = hint;
    this.details = details;
  }
}

export function throwRpcError(e: PostgrestError | AuthError | null, rpcName: string): never {
  throw new RpcError(e?.message ?? `Error en ${rpcName}`, rpcName, e?.code, (e as PostgrestError)?.hint, (e as PostgrestError)?.details);
}

// Translate known Supabase/Postgres codes into Spanish user-facing messages
export function userMessage(err: RpcError): string {
  if (err.code === '23503') return 'No se puede eliminar: existen restricciones en los datos.';
  if (err.code === '23505') return 'Ya existe un registro con esos datos.';
  return err.message;
}
```

The wrapper layer NEVER calls `message.error` directly — it throws. Hooks catch `RpcError` in `onError` and route to the toast layer. This keeps the RPC layer pure and testable.

### 3.5 Avoiding `any`

- `tsconfig`: `"strict": true`, `"noImplicitAny": true`, `"noUncheckedIndexedAccess": true`.
- All RPC input/output types are declared in `src/types/rpc.ts` (§2 of spec) and reused by wrappers and hooks.
- `supabase.rpc` is treated as returning `unknown`-ish data; wrappers cast once at the boundary to the declared type (`data as Producto[]`). No intermediate `any`, no `as unknown as` chains, no `// @ts-ignore`.
- `.from()` inserts use typed params (`InsertVentaParams`, `InsertMovimientoCajaParams`) and typed `Insert` generics where practical; otherwise explicit type annotations on the payload object.
- Review gate: any `any` at a store boundary or RPC return is a BLOCKER.

---

## 4. The 12 Stores (design)

All in `src/stores/`, one file per store, no `stores/index.ts` barrel. Types in `src/types/store.ts`.

| # | Store | Persist? | Purpose |
|---|-------|----------|---------|
| 1 | `useGlobalStore` | no | sidebar collapsed + modal registry |
| 2 | `useEmpresaStore` | no | session identity: `empresa` |
| 3 | `useUsuariosStore` | no | session identity: `usuario` |
| 4 | `useThemeStore` | **yes** (`tpv365-theme`) | light/dark theme |
| 5 | `useProductosStore` | no | productos UI state (search text, selected row, pagination) |
| 6 | `useCategoriasStore` | no | categorías UI state (selected row) |
| 7 | `useVentasStore` | **yes** (`tpv365-ventas-store`, partialize → cart) | POS cart + current venta id |
| 8 | `useDetalleVentasStore` | no | server-acknowledged detalle (mirror for POS table reads) |
| 9 | `useMetodosPagoStore` | no | available payment methods (session cache) |
| 10 | `useSerializacionStore` | no | default serialization (session cache) |
| 11 | `useReportesStore` | no | reserved for `/reportes` (empty in MVP) |
| 12 | `useDashboardStore` | no | dashboard date range |

### 4.1 Store shapes (source: spec §5, finalized here)

```typescript
// useGlobalStore
interface GlobalStore {
  sidebarCollapsed: boolean;
  modalOpen: Record<string, boolean>;
  toggleSidebar: () => void;
  setModalOpen: (key: string, open: boolean) => void;
}

// useEmpresaStore / useUsuariosStore
interface EmpresaStore { empresa: Empresa | null; setEmpresa: (e: Empresa) => void; clearEmpresa: () => void; }
interface UsuariosStore { usuario: Usuario | null; setUsuario: (u: Usuario) => void; clearUsuario: () => void; }

// useThemeStore (persisted)
interface ThemeStore { theme: 'light' | 'dark'; toggleTheme: () => void; setTheme: (t: 'light' | 'dark') => void; }

// useProductosStore (UI state only — NOT canonical list)
interface ProductosStore {
  buscador: string;
  selectedProducto: Producto | null;
  pagination: { page: number; pageSize: number };
  setBuscador: (b: string) => void;
  setSelectedProducto: (p: Producto | null) => void;
  setPagination: (p: { page: number; pageSize: number }) => void;
}

// useCategoriasStore (UI state only)
interface CategoriasStore { selectedCategoria: Categoria | null; setSelectedCategoria: (c: Categoria | null) => void; }

// useVentasStore (persisted, partialize)
interface VentasStore {
  currentVentaId: number | null;
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tempId: string) => void;
  updateQty: (tempId: string, qty: number) => void;
  clearCart: () => void;
  setCurrentVentaId: (id: number | null) => void;
}

// useDetalleVentasStore
interface DetalleVentasStore { detalleVenta: DetalleVenta[]; setDetalleVenta: (d: DetalleVenta[]) => void; clearDetalleVenta: () => void; }

// useMetodosPagoStore
interface MetodosPagoStore { metodosPago: MetodoPago[]; setMetodosPago: (m: MetodoPago[]) => void; }

// useSerializacionStore
interface SerializacionStore { serializacionDefault: SerializacionComprobante | null; setSerializacionDefault: (s: SerializacionComprobante | null) => void; }

// useReportesStore (reserved, empty)
interface ReportesStore { [key: string]: unknown; }

// useDashboardStore
interface DashboardStore {
  rango: 'dia' | 'semana' | 'mes' | 'custom';
  fechaInicio: string;
  fechaFin: string;
  setRango: (r: 'dia' | 'semana' | 'mes' | 'custom', customDates?: { inicio: string; fin: string }) => void;
}
```

### 4.2 useVentasStore — persist + partialize (canonical)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VentasStore } from '@/types/store';

export const useVentasStore = create<VentasStore>()(
  persist(
    (set, get) => ({
      currentVentaId: null,
      cart: [],
      addItem: (item) => {
        const existing = get().cart.find((c) => c.tempId === item.tempId);
        if (existing) {
          set({ cart: get().cart.map((c) => c.tempId === item.tempId ? { ...c, cantidad: c.cantidad + item.cantidad } : c) });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeItem: (tempId) => set({ cart: get().cart.filter((c) => c.tempId !== tempId) }),
      updateQty: (tempId, qty) => set({ cart: get().cart.map((c) => c.tempId === tempId ? { ...c, cantidad: qty } : c) }),
      clearCart: () => set({ cart: [], currentVentaId: null }),
      setCurrentVentaId: (id) => set({ currentVentaId: id }),
    }),
    {
      name: 'tpv365-ventas-store',
      version: 1,
      partialize: (state) => ({ cart: state.cart, currentVentaId: state.currentVentaId }),
    }
  )
);
```

Rules:
- `partialize` persists ONLY `cart` + `currentVentaId`. Actions are never persisted.
- `version: 1` enables future migration (on version bump, drop stale carts).
- `clearCart()` is called ONLY after a fully successful sale (`confirmar_venta` success). On any failure the cart remains for retry.

---

## 5. Component Tree per Screen

Naming keeps the original POS component names (fidelity). "org." = organism, "mol." = molecule, "atm." = atom.

### Screen A — Login (`/login`)

```
LoginPage (paginas)
└── LoginForm (moleculas)
    ├── LogoEmpresa (atomos)
    ├── <Input> email  (AntD)
    ├── <Input.Password>  (AntD)
    └── <Button> Entrar
```
- Wires `useLoginMutation` (hooks/useLogin.ts).
- On success: set `empresa` + `usuario` in stores → navigate `/dashboard`.
- `LogoEmpresa` renders `empresa.logo` if present, else a styled placeholder (AntD `<Avatar>`/icon).

### Screen B — Shell / Layout (wrapper)

```
ShellLayout (templates)
├── Sidebar (organismos/sidebar)
│   └── MenuItem (mol.): Dashboard, Productos, Categorías, POS  (uses useGlobalStore, useThemeStore)
├── Header (organismos)
│   ├── empresa.nombre + usuario.nombres (text)
│   ├── ToggleTema (mol.) → useThemeStore
│   └── Reloj (atm.) → dayjs(), setInterval 1s
├── <Outlet /> (react-router)
└── NotFoundPage (paginas) — rendered on `*`
```

### Screen C — Dashboard (`/dashboard`)

```
DashboardPage (paginas)
└── DashboardTemplate (templates)
    ├── DateRangePicker (mol.)  → useDashboardStore (presets día/semana/mes/custom)
    └── Grid (organisms + molecules)
        ├── ChartVentas (org.)        → AreaChart (Recharts) + CustomTooltip (atm.)
        ├── CardVentas (mol.)         → total + % cambio badge
        ├── CardCantidadVentas (mol.)
        ├── CardGanancias (mol.)
        ├── CardProductosTopMonto (mol.)
        ├── CardMetodosPago (mol.)    → pie/bar
        ├── CardCajasSucursales (mol.)
        └── CardMovimientosCajaLive (mol.)  → defensive (hidden on RPC error)
```
- `DashboardPage` calls the 9 dashboard hooks (8 metrics + caja live), each independent `useQuery` with `staleTime` and skeleton/empty/error states.
- Date range changes are derived in `useDashboardStore.setRango()` (dayjs) and change the query keys → auto refetch.

### Screen D — Config Productos (`/configuracion/productos`)

```
ProductosPage (paginas)
└── ProductosTemplate (templates)
    ├── BuscadorProductos (mol.)   → debounced 300ms → useBuscarProductosQuery
    ├── Toolbar: "Nuevo producto" (Button) → opens RegistrarProductos
    ├── TablaProductos (org.)
    │   ├── AntD <Table> (columns: nombre, código, precio venta, precio compra, categoría, stock, acciones)
    │   ├── EliminarProductoBtn (mol.) → Modal.confirm → delete mutation
    │   └── Edit action → opens RegistrarProductos prefilled
    └── RegistrarProductos (org. modal)
        └── Form (react-hook-form + AntD): nombre, precio_venta, precio_compra, id_categoria (Select), codigo_barras, codigo_interno, sevende_por, maneja_inventarios (Switch), maneja_multiprecios (Switch)
```

### Screen E — Config Categorías (`/configuracion/categorias`)

```
CategoriasPage (paginas)
└── CategoriasTemplate (templates)
    ├── Toolbar: "Nueva categoría" (Button)
    ├── TablaCategorias (org.)
    │   └── AntD <Table> (nombre, color Tag/Badge, icono preview, acciones: edit only — NO delete)
    └── RegistrarCategorias (org. modal)
        ├── nombre (Input)
        ├── color (ColorPicker / Input type=color, default #1890ff)
        └── icono → ImageSelector (mol.)  (MVP: simple URL/path Input)
```

### Screen F — POS (`/pos`)

```
PosPage (paginas)
└── PosLayout (templates)  — 3-column grid (products | cart | keypad) or stacked mobile
    ├── HeaderPos (org.)                 → empresa, sucursal, caja, Reloj
    ├── BuscadorList (org.)              → <Input.Search> → useBuscarProductosPosQuery (mostrarproductos)
    │   └── ProductGrid (mol.)           → product cards/rows, onAdd
    ├── AreaDetalleventaPos (org.)       → cart table (name, unit price, qty controls, line total, remove)
    │   ├── QtyControl (mol.)
    │   └── CartRow (mol.)
    ├── AreaTecladoPos (org.)            → numeric keypad → writes qty to selected cart row
    │   └── Keypad (mol.)
    ├── TotalPos (mol.)                  → subtotal + impuesto + total (from empresa.valor_impuesto)
    ├── FooterPos (org.)                 → "Cobrar" (opens PantallaCobro) + "Cancelar"
    └── PantallaCobro (org. overlay)
        ├── IngresoCobro (mol.) × per metodos_pago → monto recibido
        ├── totalRecibido / vuelto display
        └── "Confirmar pago" (Button, disabled until totalRecibido >= total)
```
- `TicketVenta` is NOT a rendered component; it's a service (`src/servicios/pdfTicket.ts`) invoked on confirm success (§9).

---

## 6. Routing + Guard

react-router-dom v6, `createBrowserRouter` with a route object (or `Routes`/`Route`; object form preferred for loader-free declarative guards).

```typescript
// App.tsx (routing sketch)
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>          {/* redirects to /login if !session */}
    <Route element={<ShellLayout />}>            {/* renders Sidebar + Header + Outlet */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/configuracion/productos" element={<ProductosPage />} />
      <Route path="/configuracion/categorias" element={<CategoriasPage />} />
      <Route path="/pos" element={<PosPage />} />
    </Route>
  </Route>
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 6.1 `ProtectedRoute` (organismo/HOC)

```typescript
// hooks/useAuthGuard.ts + organism ProtectedRoute
export function ProtectedRoute() {
  const { data: session, isLoading } = useSession(); // supabase.auth.getSession + onAuthStateChange
  const location = useLocation();
  if (isLoading) return <FullScreenSpin />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
```

- `useSession` subscribes to `supabase.auth.onAuthStateChange` so logout/token-expiry re-triggers the guard.
- `ProtectedRoute` reads the live session (supabase), NOT the `empresa`/`usuario` stores — those are populated after login and may be empty on hard refresh; the session is the single auth truth.
- Redirect back to the originally requested route after login via `location.state.from` (optional, nice-to-have).

### 6.2 Guard behavior

| Condition | Behavior |
|-----------|----------|
| Unauthenticated → any protected route | redirect `/login` |
| Authenticated → `/login` | redirect `/dashboard` |
| `/` | redirect `/dashboard` |
| Unknown route | `NotFoundPage` (renders inside Shell if protected, or standalone) |

---

## 7. Project Setup

### 7.1 Location

New app at **`/Volumes/m2/Usuarios/Documents/work/punto-de-venta/tpv365-rebuild/`** (sibling of `pos-react/`, per proposal §5.9). Created during apply, not now. The SDD artifacts for this change live in `pos-react/sdd/tpv365-rebuild/` and remain where they are.

### 7.2 `package.json` dependencies

```jsonc
{
  "name": "tpv365-rebuild",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.51.0",
    "@tanstack/react-table": "^8.20.0",
    "antd": "^5.20.0",
    "dayjs": "^1.11.11",
    "pdfmake": "^0.2.10",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.0",
    "react-icons": "^5.2.1",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.12.7",
    "styled-components": "^6.1.12",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/styled-components": "^5.1.34",
    "@types/pdfmake": "^0.2.9",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.0"
  }
}
```

Note: `sweetalert2` is intentionally ABSENT (replaced by AntD `message`). `@types/styled-components` optional (styled-components v6 ships types); kept for safety.

### 7.3 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173 },
});
```

### 7.4 `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
```

### 7.5 `.env.example` / `.env`

```
# .env.example
VITE_APP_SUPABASE_URL=https://kdyflbexrensqzbquxyu.supabase.co
VITE_APP_SUPABASE_ANON_KEY=
```

- The Supabase URL is derived from the project ref `kdyflbexrensqzbquxyu`.
- The **anon key must be obtained from the Supabase dashboard** (Project Settings → API Keys → anon/public) during apply — it is NOT in the SDD artifacts. `.env` is git-ignored; `.env.example` is committed.
- `src/vite-env.d.ts` declares the two keys so `import.meta.env` is typed.

### 7.6 Final folder structure

```
tpv365-rebuild/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
└── src/
    ├── main.tsx                      # ReactDOM root + QueryClientProvider + AntD ConfigProvider + RouterProvider
    ├── App.tsx                       # <Routes> tree (§6)
    ├── vite-env.d.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── errors.ts                 # RpcError + throwRpcError + userMessage
    │   ├── notify.ts                 # toast layer (AntD message/notification)
    │   ├── queryKeys.ts              # qk factory
    │   ├── format.ts                 # formatCurrency(simbolo_moneda), formatDate
    │   └── rpc/
    │       ├── auth.ts
    │       ├── productos.ts
    │       ├── categorias.ts
    │       ├── ventas.ts
    │       ├── dashboard.ts
    │       └── caja.ts
    ├── types/
    │   ├── rpc.ts                    # all domain interfaces (§2 of spec)
    │   └── store.ts                  # store state types
    ├── stores/
    │   ├── useGlobalStore.ts
    │   ├── useEmpresaStore.ts
    │   ├── useUsuariosStore.ts
    │   ├── useThemeStore.ts
    │   ├── useProductosStore.ts
    │   ├── useCategoriasStore.ts
    │   ├── useVentasStore.ts
    │   ├── useDetalleVentasStore.ts
    │   ├── useMetodosPagoStore.ts
    │   ├── useSerializacionStore.ts
    │   ├── useReportesStore.ts
    │   └── useDashboardStore.ts
    ├── hooks/
    │   ├── useLogin.ts
    │   ├── useSession.ts
    │   ├── useProductos.ts
    │   ├── useCategorias.ts
    │   ├── useVentas.ts
    │   ├── useDashboard.ts
    │   └── useAuthGuard.ts
    ├── componentes/
    │   ├── atomos/       (LogoEmpresa, Reloj, CustomTooltip, BotonPrimario, ...)
    │   ├── moleculas/    (LoginForm, ToggleTema, DateRangePicker, BuscadorProductos, EliminarProductoBtn, TotalPos, IngresoCobro, CardVentas, CardCantidadVentas, CardGanancias, CardProductosTopMonto, CardMetodosPago, CardCajasSucursales, CardMovimientosCajaLive, ...)
    │   ├── organismos/
    │   │   ├── sidebar/    (Sidebar)
    │   │   ├── header/     (Header)
    │   │   ├── tablas/     (TablaProductos, TablaCategorias)
    │   │   ├── formularios/(RegistrarProductos, RegistrarCategorias, ImageSelector)
    │   │   └── pos/        (HeaderPos, AreaDetalleventaPos, AreaTecladoPos, FooterPos, BuscadorList, PantallaCobro)
    │   ├── templates/      (ShellLayout, DashboardTemplate, ProductosTemplate, CategoriasTemplate, PosLayout)
    │   └── paginas/        (LoginPage, DashboardPage, ProductosPage, CategoriasPage, PosPage, NotFoundPage)
    └── servicios/
        └── pdfTicket.ts
```

---

## 8. Error Handling

### 8.1 Notification layer — `src/lib/notify.ts`

Single entry point. Backed by AntD `message` for short toasts and `notification` for persistent errors.

```typescript
import { message, notification } from 'antd';
import { userMessage } from './errors';

export const notify = {
  success: (msg: string) => message.success(msg),
  error: (msg: string) => message.error(msg),
  warning: (msg: string) => message.warning(msg),
  info: (msg: string) => message.info(msg),
  blocking: (title: string, desc: string) =>
    notification.error({ message: title, description: desc, duration: 0 }),
};

export const notifyRpcError = (err: RpcError) => notify.error(userMessage(err));
```

- Mutations call `notifyRpcError(err)` in `onError`.
- **No component calls `Swal.fire`** — the forbidden-pattern review rejects any occurrence.
- AntD `message`/`notification` require a single `ConfigProvider`/`App` context; `main.tsx` wraps the tree in `<AntApp>` (AntD `App` component) so `message`/`notification` work with the theme.

### 8.2 Loading / empty / error states (per query)

Standardized per-card/table states:

| State | Pattern |
|-------|---------|
| Loading | AntD `<Skeleton>` / `<Spin>` (tables use `<Table loading>` prop) |
| Empty | "Sin datos" text, dashed chart placeholder, or `0` value — never a crash |
| Error | error icon + "Error al cargar" (molecules render `isError` branch) |
| Success | full render |

Hooks expose `isLoading`, `isError`, `error`, `data` — components branch on these. No try/catch in render; react-query holds the error.

### 8.3 Defensive mode — `CardMovimientosCajaLive`

`useDashboardMovimientosCajaLive` uses `retry: 1` and, on error, resolves to a sentinel that the card component maps to `null` (hidden). **No toast** for this specific failure (silent fallback, per spec §4.C.5).

```typescript
// hook returns data | undefined on error; component:
if (isError || !data || data.length === 0) return null;
```

### 8.4 Serialization blocking toast (POS)

Before `PantallaCobro` opens, `PosPage`/`FooterPos` checks the default serialization:

```typescript
const serializacion = useDefaultSerializacionQuery(idEmpresa, idSucursal).data;
const handleCobrar = () => {
  if (!serializacion) {
    notify.blocking(
      'Serialización no configurada',
      'No existe configuración de serialización. Configure los comprobantes antes de cobrar.'
    );
    return; // block PantallaCobro
  }
  setPantallaCobro(true);
};
```

`blocking` uses `notification.error({ duration: 0 })` so it persists until the user acknowledges — this is the one place a persistent notification (rather than a transient toast) is used, because it blocks a business-critical action.

### 8.5 Error mapping summary

| Scenario | Surface |
|----------|---------|
| Invalid credentials | `notify.error('Credenciales incorrectas')` |
| No empresa | `notify.warning('No se encontró empresa asociada')` |
| Zero products | `notify.info('Esta empresa aún no tiene productos registrados')` |
| Network error | `notify.error('Error de conexión. Intente nuevamente')` |
| RPC error (product/category/venta) | `notifyRpcError(err)` |
| Delete constraint (23503) | `notify.error('No se puede eliminar: existen restricciones en los datos')` |
| Stock trigger rejection | `notify.error(server message)` |
| No serialization | `notify.blocking(...)` (persistent) |
| `pago_con < total` | "Confirmar pago" disabled + inline warning |

---

## 9. Ticket PDF Design (pdfmake)

`src/servicios/pdfTicket.ts` — a pure function `generateTicket(input): TDocumentDefinitions` + a `downloadTicket(input)` helper using `pdfmake`'s `createPdf(...).download()`.

```typescript
export interface TicketInput {
  empresa: Pick<Empresa, 'nombre' | 'simbolo_moneda' | 'pie_pagina_ticket' | 'direccion_fiscal'>;
  usuario: Pick<Usuario, 'nombres'>;
  venta: Pick<Venta, 'nro_comprobante' | 'sub_total' | 'total_impuestos' | 'monto_total'>;
  detalle: Array<Pick<DetalleVenta, 'descripcion' | 'cantidad' | 'total'>>;
  fecha: string; // dayjs().format('DD/MM/YYYY HH:mm')
}

export function generateTicket(input: TicketInput): TDocumentDefinitions {
  const { empresa, usuario, venta, detalle, fecha } = input;
  const fmt = (n: number) => formatCurrency(n, empresa.simbolo_moneda);
  return {
    pageSize: { width: 302, height: 'auto' },   // 80mm thermal width, auto height
    pageMargins: [10, 10, 10, 10],
    content: [
      { text: empresa.nombre, bold: true, fontSize: 13, alignment: 'center' },
      empresa.direccion_fiscal ? { text: empresa.direccion_fiscal, fontSize: 8, alignment: 'center' } : {},
      { text: `Fecha: ${fecha}`, fontSize: 9 },
      { text: `Ticket #: ${venta.nro_comprobante ?? '—'}`, fontSize: 9 },
      { text: `Cajero: ${usuario.nombres}`, fontSize: 9 },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 282, y2: 0, lineWidth: 1 }] },
      // header row
      { columns: [
          { text: 'Descripción', bold: true, width: '*' },
          { text: 'Cant', bold: true, width: 32, alignment: 'right' },
          { text: 'Total', bold: true, width: 70, alignment: 'right' },
      ], fontSize: 9, margin: [0, 4, 0, 2] },
      // detail rows
      ...detalle.map((item) => ({
        columns: [
          { text: item.descripcion, width: '*' },
          { text: `x${item.cantidad}`, width: 32, alignment: 'right' },
          { text: fmt(item.total), width: 70, alignment: 'right' },
        ],
        fontSize: 9, margin: [0, 2, 0, 0],
      })),
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 282, y2: 0, lineWidth: 1 }] },
      { text: `Subtotal: ${fmt(venta.sub_total)}`, alignment: 'right', fontSize: 9 },
      { text: `Impuesto: ${fmt(venta.total_impuestos)}`, alignment: 'right', fontSize: 9 },
      { text: `TOTAL: ${fmt(venta.monto_total)}`, bold: true, alignment: 'right', fontSize: 12, margin: [0, 2, 0, 0] },
      empresa.pie_pagina_ticket
        ? { text: empresa.pie_pagina_ticket, fontSize: 8, alignment: 'center', margin: [0, 6, 0, 0] }
        : {},
    ],
    defaultStyle: { font: 'Helvetica' },
  };
}

export function downloadTicket(input: TicketInput): void {
  pdfMake.createPdf(generateTicket(input)).download(`ticket-${input.venta.nro_comprobante ?? 'venta'}.pdf`);
}
```

- Called on `confirmar_venta` success with the RPC's returned `Venta` (which carries `nro_comprobante`) + current `detalleVenta` + `empresa` + `usuario`.
- `formatCurrency` (`src/lib/format.ts`) applies `simbolo_moneda` + `Intl.NumberFormat` for the locale.
- `pageSize` targets 80mm thermal receipt width; `pageMargins` kept tight.

---

## 10. Data Flow Diagram (POS sale — end to end)

```
User searches product ──► useBuscarProductosPosQuery ──► rpc.mostrarProductos ──► react-query cache
        │
        ▼ (onAdd)
useVentasStore.addItem(tempId) [optimistic cart]
        │ if currentVentaId === null
        ▼
.insert('ventas') → setCurrentVentaId(id)
        │
        ▼
useInsertarDetalleVentaMutation → rpc.insertarDetalleVenta(idVenta, ...)
        │ onSuccess
        ▼
invalidate qk.ventas.detalle(idVenta) → useMostrarDetalleVentaQuery refetch
        │
        ▼ (onCobrar)
serialization check (qk.serializacion.default) ──missing──► notify.blocking (STOP)
        │ present
        ▼
PantallaCobro (useGlobalStore.modalOpen['pantallaCobro'])
        │ per metodos_pago: IngresoCobro → totalRecibido, vuelto
        ▼ (confirmar pago, totalRecibido >= total)
useConfirmarVentaMutation → rpc.confirmarVenta(...) ──► returns Venta[] (nro_comprobante)
        │ onSuccess
        ├─► insert movimientos_caja per method (.insert)
        ├─► downloadTicket({empresa, usuario, venta, detalle, fecha})
        ├─► useVentasStore.clearCart()
        └─► notify.success('Venta confirmada') → IDLE
        │ onError (no serialization / validarstock)
        └─► notifyRpcError(err) → stay CART_BUILDING/COBRO
```

---

## 11. Design Decisions (resolving spec ambiguities)

| # | Decision | Rationale |
|---|----------|-----------|
| Dg1 | **No barrels anywhere**, including `lib/rpc/index.ts` and `stores/index.ts` shown in the spec's illustrative tree. | The spec's D3 and its own "Forbidden patterns: No `index.ts` barrel re-exports" contradict its file tree. D3 + forbidden patterns win. Imports are direct file paths. |
| Dg2 | App lives at `punto-de-venta/tpv365-rebuild/` (sibling of `pos-react/`), per proposal §5.9. | The spec's bare `tpv365-rebuild/` is ambiguous; the proposal pins an absolute path. |
| Dg3 | `useProductosStore`/`useCategoriasStore` hold **UI/selection state only**, NOT the canonical list. | Canonical server data is react-query's cache; a store copy would violate the single-source-of-truth principle. |
| Dg4 | `ProtectedRoute` reads the live Supabase **session**, not `empresa`/`usuario` stores. | Session is the auth truth; stores may be empty on hard refresh. |
| Dg5 | `CardMovimientosCajaLive` uses `refetchInterval: 15s` + `retry: 1` + silent hide on error. | Matches spec §4.C.5 (defensive) while keeping "live" semantics. |
| Dg6 | `RpcError` carries Postgres `code` (23503/23505) → `userMessage()` maps to Spanish. | Enables constraint-aware toasts (delete FK) without backend changes. |
| Dg7 | Anon key is a runtime secret fetched during apply, not committed in SDD artifacts. | Only the URL (from the public project ref) is derivable now. |

---

## 12. Risks & Mitigations (design-level)

| Risk | Severity | Mitigation |
|------|----------|------------|
| `confirmar_venta` internal behavior opaque (comprobante generation, estado update, stock trigger) | HIGH | Typed wrapper returns narrow `Venta[]`; treat server as authoritative; smoke-test in a test empresa before production; surface all errors as toasts. |
| Stock triggers (`validarstock`, `devolverstockaleliminardv`) reject detail inserts/deletes | HIGH | No client-side stock guessing; errors surface via `notifyRpcError`; cart stays for retry. |
| Payload-shape drift between bundle-era RPCs and live backend | MEDIUM | Single typed wrapper layer + typed query-key factory; smoke-test against live project in apply/verify. |
| Persisted cart leaking stale data after a venta is orphaned | MEDIUM | `partialize` (cart + id only), `version: 1`, reconcile on POS mount against `mostrardetalleventa`. |
| No serialization row blocks sale | MEDIUM | `notify.blocking` persistent notification before `PantallaCobro` opens (D9). |
| `CardMovimientosCajaLive` RPC unavailable | MEDIUM | Defensive hide (no toast), per D5. |
| Anon key missing in artifacts | LOW | `.env.example` + apply-time retrieval from dashboard; `.env` git-ignored. |

---

## 13. Out of Scope (confirmed)

Inventario, reportes screen, full caja (abrir/cerrar turno), clientes/proveedores, impresoras, usuarios/RBAC, almacenes, serialización configuration UI, per-screen deep re-theming. These are explicitly deferred (proposal §3.2); their stores (`useReportesStore`) are reserved but empty.
