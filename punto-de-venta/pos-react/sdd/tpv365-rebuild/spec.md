# TPV-365 Rebuild — Specification

> Phase: `sdd-spec` · Change: `tpv365-rebuild` · Status: ACCEPTED
> Stack: TypeScript · Ant Design · styled-components · Recharts · pdfmake · @tanstack/react-query · react-hook-form · zustand (persist) · react-router-dom v6 · supabase-js · dayjs

---

## 1. Project Overview

### 1.1 Purpose

Rebuild the TPV-365 POS frontend from scratch against the existing Supabase cloud backend (`kdyflbexrensqzbquxyu`). The backend (26 tables, 112 functions) is **untouched**. The frontend is new, full TypeScript, with improved architecture: 12 stores (vs 25), toast notifications (vs Swal), typed RPC wrappers, and react-query for server state.

### 1.2 MVP Scope

Six screens: **Login → Shell → Dashboard → Config Productos → Config Categorías → POS**.

Post-MVP (explicitly deferred): inventario, reportes, caja completa (abrir/cerrar turno), clientes/proveedores, impresoras, usuarios/permisos/RBAC, almacenes, serialización UI, dark theme beyond shell toggle.

### 1.3 Decided Constraints (incorporated)

| # | Decision |
|---|----------|
| D1 | TypeScript everywhere; no `any` on RPC/store boundaries |
| D2 | Ant Design + styled-components; toasts replace `Swal.fire()` in MVP screens |
| D3 | No barrel import hub; feature-scoped modules |
| D4 | 12 stores: `useGlobalStore`, `useEmpresaStore`, `useUsuariosStore`, `useThemeStore`, `useProductosStore`, `useCategoriasStore`, `useVentasStore` (persist partialize → cart only), `useDetalleVentasStore`, `useMetodosPagoStore`, `useSerializacionStore`, `useReportesStore`, `useDashboardStore` |
| D5 | `CardMovimientosCajaLive` INCLUDED in dashboard, **defensive mode**: if `mostrarmovimientoscajalive` fails, the card is hidden |
| D6 | Product **delete IS included** (via `.from('productos').delete()`); constraint errors surface as toast |
| D7 | No test tenant → `sdd-verify` **MUST create a test empresa** before smoke-testing `confirmar_venta` |
| D8 | Open caja **assumed** in POS MVP; `movimientos_caja.id_cierre_caja` is `null` |
| D9 | No serialization configured → `confirmar_venta` shows **blocking toast**; no config UI in MVP |
| D10 | POS uses `mostrarproductos(_id_empresa, _buscador)` for product search (not `buscarproductos`) |

---

## 2. TypeScript Interfaces

All interfaces live in `src/types/rpc.ts`. These are the **source of truth** for typed RPC wrappers and store shapes.

```typescript
// ─── Auth / Empresa ───────────────────────────────────────────────────────────

export interface Empresa {
  id: number;
  nombre: string;
  id_fiscal: string;
  direccion_fiscal: string;
  simbolo_moneda: string;
  logo: string | null;
  id_auth: string | null;
  id_usuario: number | null;
  iso: string;
  pais: string;
  currency: string;
  impuesto: number;
  valor_impuesto: number;
  nombre_moneda: string;
  correo: string | null;
  pie_pagina_ticket: string | null;
}

export interface Usuario {
  id: number;
  nombres: string;
  id_tipodocumento: number | null;
  nro_doc: string | null;
  telefono: string | null;
  id_rol: number | null;
  correo: string;
  fecharegistro: string;
  estado: 'ACTIVO' | string;
  id_auth: string | null;
  tema: 'light' | string;
}

// ─── Productos ────────────────────────────────────────────────────────────────

export interface Producto {
  id: number;
  nombre: string;
  precio_venta: number;
  precio_compra: number;
  id_categoria: number | null;
  codigo_barras: string | null;
  codigo_interno: string | null;
  id_empresa: number;
  sevende_por: 'unidad' | string;
  maneja_inventarios: boolean;
  maneja_multiprecios: boolean;
  fecha_caducidad: string | null;
  // Joined fields (from buscarproductos / mostrardetalleventa)
  categoria_nombre?: string;
  stock?: number;
}

export type SevendePor = 'unidad' | string;

// ─── Categorías ──────────────────────────────────────────────────────────────

export interface Categoria {
  id: number;
  nombre: string;
  color: string;
  icono: string | null; // storage path or URL
  id_empresa: number;
}

// ─── Ventas / Detalle ─────────────────────────────────────────────────────────

export interface Venta {
  id: number;
  fecha: string;
  monto_total: number;
  total_impuestos: number;
  id_usuario: number;
  saldo: number;
  pago_con: number | null;
  referencia_tarjeta: string | null;
  vuelto: number | null;
  cantidad_productos: number;
  sub_total: number;
  id_cliente: number | null;
  id_sucursal: number;
  id_empresa: number;
  estado: 'pendiente' | 'completada' | string;
  valor_impuesto: number;
  id_cierre_caja: number | null;
  nro_comprobante: string | null;
}

export interface DetalleVenta {
  id: number;
  id_venta: number;
  cantidad: number;
  precio_venta: number;
  total: number;
  descripcion: string;
  id_producto: number | null;
  precio_compra: number;
  id_sucursal: number;
  estado: 'nueva' | string;
  id_almacen: number | null;
  // Joined
  producto?: string;
}

// ─── Métodos de Pago ─────────────────────────────────────────────────────────

export interface MetodoPago {
  id: number;
  nombre: string;
  id_empresa: number;
  icono: string | null;
  ver_nombre: boolean;
  delete_update: boolean;
}

// ─── Serialización ────────────────────────────────────────────────────────────

export interface SerializacionComprobante {
  id: number;
  id_tipo_comprobante: number;
  serie: string;
  cantidad_numeros: number;
  correlativo: number;
  sucursal_id: number;
  por_default: boolean;
}

export interface TipoComprobante {
  id: number;
  nombre: string;
  destino: string | null;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardVentasFecha {
  fecha: string;
  total_ventas: number;
}

export interface DashboardTopProducto {
  producto: string;
  total_vendido: number;
  cantidad_vendida: number;
}

export interface DashboardMetodoPago {
  metodo_pago: string;
  total: number;
}

export interface DashboardCajaSucursal {
  sucursal: string;
  caja: string;
  ventas: number;
  movimientos: number;
}

// ─── Movimientos Caja (live card) ────────────────────────────────────────────

export interface MovimientoCaja {
  id: number;
  fecha_movimiento: string;
  tipo_movimiento: string;
  monto: number;
  id_metodo_pago: number | null;
  descripcion: string;
  id_usuario: number | null;
  id_cierre_caja: number | null;
  id_ventas: number | null;
  vuelto: number | null;
  metodo_pago_nombre?: string;
}
```

---

## 3. RPC Typed Wrappers

All wrappers live in `src/lib/rpc/`. Pattern: one file per domain. Every wrapper calls `supabase.rpc(name, params)` and returns typed data. Errors are thrown as typed `RpcError` objects, caught in hooks and surfaced as Ant Design toasts.

```
src/lib/rpc/
├── auth.ts        # mostrarempresaxidauth, contarproductosporauth
├── productos.ts   # mostrarproductos, buscarproductos, insertarproductos, editarproductos
├── categorias.ts  # insertarcategorias, editarcategorias
├── ventas.ts      # insertardetalleventa, editarcantidaddv, mostrardetalleventa, confirmar_venta
├── dashboard.ts   # 8 dashboard RPCs
└── caja.ts        # mostrarmovimientoscajalive
```

### 3.1 Auth Domain (`auth.ts`)

```typescript
// mostrarempresaxidauth(_id_auth text) → TABLE empresa
rpc.mostrarEmpresaXIdAuth = async (idAuth: string): Promise<Empresa[]> => { ... }

// contarproductosporauth(_id_auth text) → integer
rpc.contarProductosPorAuth = async (idAuth: string): Promise<number> => { ... }
```

### 3.2 Productos Domain (`productos.ts`)

```typescript
// mostrarproductos(_id_empresa integer, _buscador text DEFAULT '')
rpc.mostrarProductos = async (
  idEmpresa: number,
  buscador: string = ''
): Promise<Producto[]> => { ... }

// buscarproductos(_id_empresa integer, _buscador text)
rpc.buscarProductos = async (
  idEmpresa: number,
  buscador: string
): Promise<Producto[]> => { ... }

// insertarproductos(_nombre, _precio_venta, _precio_compra, _id_categoria,
//                   _codigo_barras, _codigo_interno, _id_empresa,
//                   _sevende_por, _maneja_inventarios, _maneja_multiprecios) → integer
rpc.insertarProductos = async (p: InsertProductoParams): Promise<number> => { ... }

// editarproductos(_id, _nombre, _precio_venta, _precio_compra, _id_categoria,
//                 _codigo_barras, _codigo_interno, _id_empresa,
//                 _sevende_por, _maneja_inventarios) → void
rpc.editarProductos = async (p: EditProductoParams): Promise<void> => { ... }
```

### 3.3 Categorías Domain (`categorias.ts`)

```typescript
// insertarcategorias(_nombre, _color, _icono, _id_empresa) → integer
rpc.insertarCategorias = async (
  nombre: string,
  color: string,
  icono: string | null,
  idEmpresa: number
): Promise<number> => { ... }

// editarcategorias(_nombre, _id_empresa, _color, _id) → void
rpc.editarCategorias = async (
  nombre: string,
  idEmpresa: number,
  color: string,
  id: number
): Promise<void> => { ... }
```

### 3.4 Ventas Domain (`ventas.ts`)

```typescript
// insertardetalleventa(_id_venta, _id_producto, _precio_venta, _descripcion,
//                       _cantidad, _precio_compra, _id_sucursal, _id_almacen) → bigint
rpc.insertarDetalleVenta = async (p: InsertDetalleVentaParams): Promise<bigint> => { ... }

// editarcantidaddv(_id integer, _cantidad numeric) → void
rpc.editarCantidadDv = async (id: number, cantidad: number): Promise<void> => { ... }

// mostrardetalleventa(_id_venta integer) → TABLE(producto, precio_venta, cantidad, estado, total, id)
rpc.mostrarDetalleVenta = async (idVenta: number): Promise<DetalleVenta[]> => { ... }

// confirmar_venta(_id_venta, _id_usuario, _vuelto, _id_tipo_comprobante, _serie,
//                 _id_sucursal, _id_cliente, _fecha, _monto_total) → SETOF ventas
rpc.confirmarVenta = async (p: ConfirmarVentaParams): Promise<Venta[]> => { ... }
```

### 3.5 Dashboard Domain (`dashboard.ts`)

```typescript
// dashboartotalventasconfechas(_id_empresa, _fecha_inicio, _fecha_fin)
//   → TABLE(fecha, total_ventas)
rpc.dashboardTotalVentasConFechas = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<DashboardVentasFecha[]> => { ... }

// dashboardsumarventasporempresa(_id_empresa, _fecha_inicio, _fecha_fin) → numeric
rpc.dashboardSumarVentasPorEmpresa = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<number> => { ... }

// dashboardsumarventasporempresaperiodoanterior(_id_empresa, _fecha_inicio, _fecha_fin) → numeric
rpc.dashboardSumarVentasPorEmpresaPeriodoAnterior = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<number> => { ... }

// dashboardsumarcantidaddetalleventa(_id_empresa, _fecha_inicio, _fecha_fin) → numeric
rpc.dashboardSumarCantidadDetalleVenta = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<number> => { ... }

// dashboardsumargananciadetalleventa(_id_empresa, _fecha_inicio, _fecha_fin) → numeric
rpc.dashboardSumarGananciasDetalleVenta = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<number> => { ... }

// dashboardcajasporsucursalyventas(_id_empresa) → TABLE(sucursal, caja, ventas, movimientos)
rpc.dashboardCajasPorSucursalYVentas = async (
  idEmpresa: number
): Promise<DashboardCajaSucursal[]> => { ... }

// dashboartotalventasxmetodopago(_id_empresa, _fecha_inicio, _fecha_fin)
//   → TABLE(metodo_pago, total)
rpc.dashboardTotalVentasXMetodoPago = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<DashboardMetodoPago[]> => { ... }

// dashboardtop5productosmasvendidos(_id_empresa, _fecha_inicio, _fecha_fin)
//   → TABLE(producto, total_vendido, cantidad_vendida)
rpc.dashboardTop5ProductosMasVendidos = async (
  idEmpresa: number, fechaInicio: string, fechaFin: string
): Promise<DashboardTopProducto[]> => { ... }
```

### 3.6 Caja Domain (`caja.ts`)

```typescript
// mostrarmovimientoscajalive(_id_empresa) → TABLE(...)
rpc.mostrarMovimientosCajaLive = async (
  idEmpresa: number
): Promise<MovimientoCaja[]> => { ... }
```

---

## 4. Screen Specifications

---

### Screen A: Login

**Route:** `/login`

#### 4.A.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `LoginPage` | Page | Full-screen layout; logo + form |
| `LoginForm` | Molecule | Ant Design `<Form>` with email + password fields |
| `LogoEmpresa` | Atom | Company logo display |

#### 4.A.2 Stores

| Store | Usage |
|-------|-------|
| `useEmpresaStore` | Holds `empresa: Empresa \| null` and `setEmpresa()` |
| `useUsuariosStore` | Holds `usuario: Usuario \| null` and `setUsuario()` |

#### 4.A.3 Hooks

```typescript
// useLoginMutation — wraps auth.signInWithPassword + empresa fetch
useLoginMutation(): UseMutationResult<LoginResult, RpcError, LoginCredentials>

interface LoginCredentials { email: string; password: string }
interface LoginResult {
  session: Session;
  empresa: Empresa;
  usuario: Usuario;
  cantidadProductos: number;
}
```

#### 4.A.4 Data Contracts

| Step | Call | Input | Output |
|------|------|-------|--------|
| 1 | `supabase.auth.signInWithPassword({ email, password })` | `{ email, password }` | `{ data: { session }, error }` |
| 2 | `rpc.mostrarEmpresaXIdAuth(session.user.id)` | `idAuth: string` | `Empresa[]` (1 row) |
| 3 | `rpc.contarProductosPorAuth(session.user.id)` | `idAuth: string` | `number` |

#### 4.A.5 Validation & Error Handling

| Rule | Behavior |
|------|----------|
| Empty email / password | Ant Design form validation, Spanish message |
| Wrong credentials | `auth.errors.invalid_credentials` → toast error "Credenciales incorrectas", stay on `/login` |
| No empresa found | Toast warning "No se encontró empresa asociada" |
| Zero products | Allow login but toast info "Esta empresa aún no tiene productos registrados" |
| Network error | Toast error "Error de conexión. Intente nuevamente" |

#### 4.A.6 States & Acceptance Criteria

| State | Criteria |
|-------|----------|
| Loading | Ant Design `<Spin>` centered, form disabled |
| Idle / Error | Form re-enabled, error toast visible |
| Success | Redirect to `/dashboard`; empresa + usuario saved to stores |

**Acceptance:**
- Valid credentials → `empresa` loaded → redirect `/dashboard`
- Invalid credentials → toast error, no redirect, no crash
- Unauthenticated direct access to `/dashboard` → redirect to `/login`

---

### Screen B: Shell / Layout

**Route:** (wrapper — renders around all protected routes)

#### 4.B.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `ShellLayout` | Template | ` Outlet ` wrapped by sidebar + header |
| `Sidebar` | Organism | Left navigation with menu items |
| `Header` | Organism | Top bar: empresa name, user name, theme toggle, live clock |
| `ToggleTema` | Molecule | Light/dark switch; persists to `useThemeStore` |
| `Reloj` | Atom | Live `dayjs()` clock, updates every second |
| `ProtectedRoute` | HOC | Redirects unauthenticated users; wraps all app routes |
| `NotFoundPage` | Page | 404 catch-all |

#### 4.B.2 Stores

| Store | Usage |
|-------|-------|
| `useGlobalStore` | `sidebarCollapsed: boolean; toggleSidebar()` |
| `useThemeStore` | `theme: 'light' \| 'dark'; toggleTheme()` |
| `useEmpresaStore` | `empresa` for header display |
| `useUsuariosStore` | `usuario` for header display |

#### 4.B.3 Theme

CSS variables on `document.documentElement` set by `useThemeStore`. Ant Design `ConfigProvider` reads the theme token. No full per-screen re-theming beyond original behavior.

#### 4.B.4 Routes

```
/                   → redirect /dashboard
/login              → public (no redirect)
/dashboard          → protected
/configuracion/productos  → protected
/configuracion/categorias → protected
/pos                → protected
*                   → NotFoundPage
```

#### 4.B.5 Acceptance Criteria

| Criteria |
|----------|
| Sidebar shows 4 menu items: Dashboard, Productos, Categorías, POS |
| Header displays empresa.nombre + usuario.nombres |
| Theme toggle switches light/dark and persists across refresh |
| Clock shows current time in locale format |
| Unknown route renders 404 page |
| Unauthenticated user accessing any protected route → redirect `/login` |

---

### Screen C: Dashboard

**Route:** `/dashboard`

#### 4.C.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `DashboardPage` | Page | Container + date range picker + grid of cards/charts |
| `ChartVentas` | Organism | Recharts `<AreaChart>` — sales by date |
| `CardVentas` | Molecule | Total sales + % change vs previous period |
| `CardCantidadVentas` | Molecule | Items sold count |
| `CardGanancias` | Molecule | Gross margin of the period |
| `CardProductosTopMonto` | Molecule | Top 5 products by amount sold (list or mini table) |
| `CardMovimientosCajaLive` | Molecule | Last 10 caja movements — **defensive**: hide on RPC failure |
| `CardMetodosPago` | Molecule | Sales breakdown by payment method (pie/bar) |
| `CardCajasSucursales` | Molecule | Cajas per branch + sales summary |
| `DateRangePicker` | Molecule | Ant Design RangePicker with presets: Día, Semana, Mes, Custom |
| `CustomTooltip` | Atom | Recharts custom tooltip |

#### 4.C.2 Stores

| Store | Usage |
|-------|-------|
| `useDashboardStore` | `fechaInicio: string; fechaFin: string; rango: 'dia' \| 'semana' \| 'mes' \| 'custom'; setRango()` |
| `useEmpresaStore` | `empresa.id` for all RPC calls |

#### 4.C.3 Hooks

```typescript
// Dashboard queries — each runs independently
useDashboardVentasConFechas(idEmpresa, fechaInicio, fechaFin): UseQueryResult<DashboardVentasFecha[]>
useDashboardVentasSum(idEmpresa, fechaInicio, fechaFin): UseQueryResult<number>
useDashboardVentasPeriodoAnterior(idEmpresa, fechaInicio, fechaFin): UseQueryResult<number>
useDashboardCantidadVendida(idEmpresa, fechaInicio, fechaFin): UseQueryResult<number>
useDashboardGanancias(idEmpresa, fechaInicio, fechaFin): UseQueryResult<number>
useDashboardTopProductos(idEmpresa, fechaInicio, fechaFin): UseQueryResult<DashboardTopProducto[]>
useDashboardMetodosPago(idEmpresa, fechaInicio, fechaFin): UseQueryResult<DashboardMetodoPago[]>
useDashboardCajasSucursales(idEmpresa): UseQueryResult<DashboardCajaSucursal[]>
useDashboardMovimientosCajaLive(idEmpresa): UseQueryResult<MovimientoCaja[]>
```

#### 4.C.4 Date Range Logic (useDashboardStore)

| Preset | `fechaInicio` | `fechaFin` |
|--------|---------------|------------|
| Día | `dayjs().format('YYYY-MM-DD')` | `dayjs().format('YYYY-MM-DD')` |
| Semana | `dayjs().startOf('week').format('YYYY-MM-DD')` | `dayjs().format('YYYY-MM-DD')` |
| Mes | `dayjs().startOf('month').format('YYYY-MM-DD')` | `dayjs().format('YYYY-MM-DD')` |
| Custom | User-selected via RangePicker | User-selected |

`% cambio` = `(ventasPeriodoActual / ventasPeriodoAnterior - 1) * 100`. Handle division by zero (show `+∞` or `--`).

#### 4.C.5 CardMovimientosCajaLive — Defensive Mode

```
try {
  data = await rpc.mostrarMovimientosCajaLive(idEmpresa)
  if (data.length === 0) return null  // no data → card not shown
  return data
} catch (e) {
  return null  // RPC failed → card is hidden, no toast
}
```

The card is **never shown** if the RPC errors. No toast is shown for this specific failure — it is silent fallback.

#### 4.C.6 States

| State | Behavior |
|-------|----------|
| Loading | Each card shows `<Skeleton>` placeholder |
| Empty (no data for period) | Card renders with "Sin datos" / dashed chart / 0 values |
| Error (RPC fails) | Card renders with error icon + "Error al cargar" message |
| Success | Full card/chart rendered |

#### 4.C.7 Acceptance Criteria

| Criteria |
|----------|
| All 8 RPCs fire on mount and on date range change |
| Date range presets (Día/Semana/Mes/Custom) refetch all 8 queries |
| `CardVentas` shows numeric total + `%` badge (green ↑ / red ↓) |
| `ChartVentas` renders an AreaChart with `fecha` x-axis and `total_ventas` y-axis |
| `CardGanancias` shows the gross margin in local currency format |
| `CardMovimientosCajaLive` is hidden if `mostrarmovimientoscajalive` throws; shown otherwise |
| Empty date range → no crash; skeleton → empty state |
| `tsc` passes with no errors |

---

### Screen D: Configuración / Productos

**Route:** `/configuracion/productos`

#### 4.D.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `ProductosPage` | Page | Full page with toolbar + table + pagination |
| `ProductosTemplate` | Template | Wrapper layout |
| `TablaProductos` | Organism | Ant Design `<Table>` with columns, pagination, actions |
| `RegistrarProductos` | Organism | Modal form (`<Modal>` + `<Form>` via react-hook-form) |
| `BuscadorProductos` | Molecule | Search input with debounce |
| `EliminarProductoBtn` | Molecule | Icon button triggering delete |

#### 4.D.2 Stores

| Store | Usage |
|-------|-------|
| `useProductosStore` | Local UI state for selected row, modal open |
| `useCategoriasStore` | Populates category `<Select>` in form |
| `useEmpresaStore` | `empresa.id` for RPC calls |

#### 4.D.3 Hooks

```typescript
// Queries
useProductosQuery(idEmpresa: number, page: number, pageSize: number): UseQueryResult<Producto[]>
useBuscarProductosQuery(idEmpresa: number, buscador: string): UseQueryResult<Producto[]>
useCategoriasQuery(idEmpresa: number): UseQueryResult<Categoria[]>

// Mutations
useInsertarProductoMutation(): UseMutationResult<number, RpcError, InsertProductoParams>
useEditarProductoMutation(): UseMutationResult<void, RpcError, EditProductoParams>
useEliminarProductoMutation(): UseMutationResult<void, RpcError, { id: number }>
```

#### 4.D.4 Data Contract — TablaProductos

| Column | Source |
|--------|--------|
| Nombre | `producto.nombre` |
| Código | `producto.codigo_interno` |
| Precio Venta | `producto.precio_venta` formatted with `simbolo_moneda` |
| Precio Compra | `producto.precio_compra` formatted |
| Categoría | Joined `categoria.nombre` or "Sin categoría" |
| Stock | `producto.stock` or "—" |
| Acciones | Edit (pencil) + Delete (trash) icons |

**Pagination:** Ant Design Table built-in pagination. Page size: 10. Server-side pagination via `mostrarproductos` offset/limit (or client-side for MVP if the RPC returns all rows).

#### 4.D.5 RegistrarProductos Form

Fields (react-hook-form + Ant Design `<Form.Item>`):

| Field | Type | Validation |
|-------|------|------------|
| `nombre` | `<Input>` | Required, max 200 chars |
| `precio_venta` | `<InputNumber>` | Required, ≥ 0 |
| `precio_compra` | `<InputNumber>` | Required, ≥ 0 |
| `id_categoria` | `<Select>` | Optional; options from `useCategoriasQuery` |
| `codigo_barras` | `<Input>` | Optional |
| `codigo_interno` | `<Input>` | Optional |
| `sevende_por` | `<Select>` | Default `'unidad'` |
| `maneja_inventarios` | `<Switch>` | Default `false` |
| `maneja_multiprecios` | `<Switch>` | Default `false` |

Validation messages in **Spanish**.

#### 4.D.6 Validation & Error Handling

| Action | Success | Error |
|--------|---------|-------|
| Insert | Toast "Producto registrado correctamente" | Toast error with message |
| Edit | Toast "Producto actualizado correctamente" | Toast error |
| Delete | Confirm modal → `Supabase.from('productos').delete().eq('id', id)` → Toast "Producto eliminado" | Toast error "No se puede eliminar: existe[n] restricciones en los datos" |

**Delete constraint handling:** The original included delete. MVP keeps it. If the DB rejects delete (FK constraint from `detalle_venta`, `stock`, etc.), the error is surfaced as a toast.

#### 4.D.7 Acceptance Criteria

| Criteria |
|----------|
| Products table loads on mount |
| Search debounce (300ms) triggers `buscarproductos` RPC |
| Create modal opens blank; submits via `insertarproductos` RPC |
| Edit modal opens pre-filled from selected row; submits via `editarproductos` RPC |
| Delete button triggers Ant Design `<Modal.confirm>` then `.from('productos').delete()` |
| All errors surface as Ant Design toast, never as Swal |
| Form validation fires before submission; Spanish error messages |

---

### Screen E: Configuración / Categorías

**Route:** `/configuracion/categorias`

#### 4.E.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `CategoriasPage` | Page | Container |
| `TablaCategorias` | Organism | Table with color swatch, icono preview, actions |
| `RegistrarCategorias` | Organism | Modal form |
| `ImageSelector` | Molecule | Storage browser / upload for `icono` field |

#### 4.E.2 Stores

| Store | Usage |
|-------|-------|
| `useCategoriasStore` | Local UI state |
| `useGlobalStore` | Modal open state |
| `useEmpresaStore` | `empresa.id` |

#### 4.E.3 Hooks

```typescript
useCategoriasQuery(idEmpresa: number): UseQueryResult<Categoria[]>
useInsertarCategoriaMutation(): UseMutationResult<number, RpcError, InsertCategoriaParams>
useEditarCategoriaMutation(): UseMutationResult<void, RpcError, EditCategoriaParams>
```

#### 4.E.4 Data Contract — TablaCategorias

| Column | Source |
|--------|--------|
| Nombre | `categoria.nombre` |
| Color | `<Tag style={{ background: categoria.color }}>` or `<Badge>` |
| Icono | Image preview from `categoria.icono` (storage URL) |
| Acciones | Edit + Delete |

**Delete of categories is NOT in MVP.** Category deletion is a post-MVP concern (products reference categories). No delete button on this screen in MVP.

#### 4.E.5 RegistrarCategorias Form

| Field | Type | Validation |
|-------|------|------------|
| `nombre` | `<Input>` | Required, max 100 chars |
| `color` | `<ColorPicker>` or `<Input type="color">` | Required; default `#1890ff` |
| `icono` | `<Input>` or `ImageSelector` | Optional; storage path |

#### 4.E.6 ImageSelector (MVP)

Simple `<Input>` accepting a storage public URL or path string. Full file upload UI (drag-drop, storage browser) is post-MVP.

#### 4.E.7 Acceptance Criteria

| Criteria |
|----------|
| Categories table loads on mount from `categorias` table |
| Create modal submits via `insertarcategorias` RPC |
| Edit modal submits via `editarcategorias` RPC |
| Color swatch renders correctly |
| Icono field stores and displays the image path |
| No delete button on categories (post-MVP) |
| All errors as Ant Design toast |

---

### Screen F: POS — Punto de Venta

**Route:** `/pos`

#### 4.F.1 Components

| Component | Type | Description |
|-----------|------|-------------|
| `PosPage` | Page | Full-screen POS layout (3-column: products / cart / keypad or stacked mobile) |
| `HeaderPos` | Organism | POS header: empresa, sucursal, caja, clock |
| `BuscadorList` | Organism | Product search panel; `<Input.Search>` + product grid/list |
| `AreaDetalleventaPos` | Organism | Cart items table with quantity controls |
| `AreaTecladoPos` | Organism | Numeric keypad for quick quantity entry |
| `TotalPos` | Molecule | Subtotal, taxes, total display |
| `FooterPos` | Organism | "Cobrar" button (opens PantallaCobro), "Cancelar" button |
| `PantallaCobro` | Organism | Full overlay/modal with payment method breakdown |
| `IngresoCobro` | Molecule | Per-method amount input + received/change calculation |
| `TicketVenta` | Molecule | PDF generation via pdfmake (triggered on sale confirm) |

#### 4.F.2 Stores (all 12 involved in POS)

| Store | Usage |
|-------|-------|
| `useVentasStore` (persist partialize) | `currentVentaId: number \| null; cart: CartItem[]; addItem(); removeItem(); updateQty(); clearCart()` |
| `useDetalleVentasStore` | `detalleVenta: DetalleVenta[]` from `mostrardetalleventa` |
| `useProductosStore` | Product search results |
| `useMetodosPagoStore` | Available payment methods |
| `useSerializacionStore` | Default serialization for comprobante |
| `useEmpresaStore` | `empresa.id`, `empresa.simbolo_moneda`, `empresa.nombre`, `empresa.pie_pagina_ticket` |
| `useGlobalStore` | `PantallaCobro` open/close |
| `useUsuariosStore` | `usuario.id` for `confirmar_venta` |
| `useReportesStore` | — |
| `useCategoriasStore` | — |
| `useThemeStore` | — |
| `useDashboardStore` | — |

#### 4.F.3 Hooks

```typescript
// Product search
useBuscarProductosPosQuery(idEmpresa: number, buscador: string): UseQueryResult<Producto[]>

// Cart management
useInsertarDetalleVentaMutation(): UseMutationResult<bigint, RpcError, InsertDetalleVentaParams>
useEditarCantidadDvMutation(): UseMutationResult<void, RpcError, { id: number; cantidad: number }>
useMostrarDetalleVentaQuery(idVenta: number): UseQueryResult<DetalleVenta[]>

// Payment
useMetodosPagoQuery(idEmpresa: number): UseQueryResult<MetodoPago[]>
useDefaultSerializacionQuery(idEmpresa: number, idSucursal: number): UseQueryResult<SerializacionComprobante | null>

// Sale confirmation
useConfirmarVentaMutation(): UseMutationResult<Venta[], RpcError, ConfirmarVentaParams>

// Cash movement recording
useInsertarMovimientoCajaMutation(): UseMutationResult<void, RpcError, InsertMovimientoCajaParams>

// Venta insert (via .from, not RPC)
useInsertarVentaMutation(): UseMutationResult<Venta, RpcError, InsertVentaParams>
```

#### 4.F.4 POS Data Contracts

**Cart item shape:**

```typescript
interface CartItem {
  tempId: string;          // client-generated UUID
  id_producto: number;
  nombre: string;
  precio_venta: number;
  precio_compra: number;
  cantidad: number;
  id_sucursal: number;
  id_almacen: number | null;
}
```

**InsertarVenta (`.from('ventas').insert()`):**

```typescript
interface InsertVentaParams {
  fecha: string;           // dayjs().format('YYYY-MM-DD')
  monto_total: number;
  id_usuario: number;
  id_sucursal: number;
  id_empresa: number;
  estado: 'pendiente';
  valor_impuesto: number;
  sub_total: number;
  cantidad_productos: number;
}
```

**ConfirmarVenta params:**

```typescript
interface ConfirmarVentaParams {
  _id_venta: number;
  _id_usuario: number;
  _vuelto: number;
  _id_tipo_comprobante: number;
  _serie: string;
  _id_sucursal: number;
  _id_cliente: number | null;
  _fecha: string;
  _monto_total: number;
}
```

**InsertarMovimientoCaja params:**

```typescript
interface InsertMovimientoCajaParams {
  fecha_movimiento: string;
  tipo_movimiento: 'entrada';
  monto: number;
  id_metodo_pago: number;
  descripcion: string;
  id_usuario: number;
  id_cierre_caja: null;   // null in MVP (open caja assumed)
  id_ventas: number;
  vuelto: number;
}
```

#### 4.F.5 POS Sale Flow (State Machine)

```
IDLE → [Venta creada]
  │
  ▼
CART_BUILDING → [agregar/quitar items via RPC]
  │
  ▼
COBRO → [PantallaCobro abierto]
  │
  ├─ Pago incompleto → stay in COBRO
  │
  ▼
CONFIRMING → [confirmar_venta RPC]
  ├─ Success → RECORD_MOVIMIENTOS → CLEAR_CART → PDF → IDLE
  └─ Error (no serialization) → COBRO (blocking toast)
```

**Venta creation:** On first product add when `currentVentaId === null`, call `.from('ventas').insert()` synchronously to get `venta.id`. This ID is stored in `useVentasStore`.

**Serialization check before COBRO open:**
```typescript
const serializacion = await rpc.getDefaultSerializacion(idEmpresa, idSucursal)
if (!serializacion) {
  message.error('No existe configuración de serialización. Configure los comprobantes antes de cobrar.')
  return  // block PantallaCobro
}
```

#### 4.F.6 PantallaCobro / IngresoCobro

- Lists all `metodos_pago` for the empresa
- Per method: `<InputNumber>` for "Monto recibido"
- Total received = sum of all method inputs
- Vuelto = `totalRecibido - montoTotal`
- "Confirmar pago" button enabled only when `totalRecibido >= montoTotal`
- If `totalRecibido < montoTotal`: button disabled, warning message shown

#### 4.F.7 Ticket PDF (pdfmake)

Generated on `confirmar_venta` success:

```typescript
const ticketDef: TDocumentDefinitions = {
  content: [
    { text: empresa.nombre, bold: true, fontSize: 14, alignment: 'center' },
    { text: `Fecha: ${dayjs().format('DD/MM/YYYY HH:mm')}`, fontSize: 10 },
    { text: `Ticket #: ${venta.nro_comprobante}`, fontSize: 10 },
    { text: `Cajero: ${usuario.nombres}`, fontSize: 10 },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
    // detail rows
    ...detalleVenta.map(item => ({
      columns: [
        { text: item.descripcion, width: '*' },
        { text: `x${item.cantidad}`, width: 40 },
        { text: formatCurrency(item.total), width: 80, alignment: 'right' }
      ]
    })),
    // totals
    { text: `Subtotal: ${formatCurrency(subtotal)}`, alignment: 'right' },
    { text: `Impuesto: ${formatCurrency(impuesto)}`, alignment: 'right' },
    { text: `TOTAL: ${formatCurrency(montoTotal)}`, bold: true, alignment: 'right' },
    { text: empresa.pie_pagina_ticket ?? '', fontSize: 8, alignment: 'center' },
  ],
  styles: { ... },
  defaultStyle: { font: 'Helvetica' },
}
```

#### 4.F.8 Validation & Error Handling

| Scenario | Behavior |
|----------|----------|
| No serialization configured | Blocking toast: "No existe serialización de comprobantes", PantallaCobro blocked |
| `confirmar_venta` fails (server trigger `validarstock`) | Toast error with server message, sale stays in CART_BUILDING |
| `insertardetalleventa` fails | Toast error, item not added to cart |
| No metodos_pago available | PantallaCobro shows warning "No hay métodos de pago configurados" |
| pago_con < monto_total | "Confirmar pago" button disabled, warning shown |
| Delete cart item | Server-side trigger `devolverstockaleliminardv` runs; any error surfaced as toast |

#### 4.F.9 States

| State | UI |
|-------|-----|
| IDLE (no venta) | Header + empty cart + product search active |
| CART_BUILDING | Cart table populated, TotalPos shows running total, Cobrar enabled |
| COBRO | PantallaCobro overlay open |
| CONFIRMING | Cobrar button shows `<Spin>`, all inputs disabled |
| Success | Toast "Venta confirmada", PDF auto-open/download, cart cleared, return to IDLE |
| Error | Toast error, return to CART_BUILDING |

#### 4.F.10 Acceptance Criteria

| Criteria |
|----------|
| POS loads with empty cart |
| Product search (`mostrarproductos`) returns matching products as user types |
| Adding a product creates a `ventas` row if none exists, then inserts `detalle_venta` via RPC |
| Quantity adjustment calls `editarcantidaddv` RPC |
| Cart displays item name, unit price, qty, line total |
| TotalPos shows subtotal + tax + grand total |
| PantallaCobro opens only after serialization check passes |
| PantallaCobro blocks if no serialization; shows clear toast |
| Payment split across multiple methods works correctly |
| Vuelto is calculated correctly |
| `confirmar_venta` returns `nro_comprobante` |
| `movimientos_caja` rows are inserted per payment method with `id_cierre_caja = null` |
| PDF ticket downloads/opens on success |
| Cart is cleared after successful confirmation |
| `useVentasStore` persists cart across page refresh (partialize → cart only) |
| All errors as Ant Design toast, never Swal |
| `tsc` passes with no errors |

---

## 5. Store Specifications (12 MVP Stores)

### 5.1 useGlobalStore

```typescript
interface GlobalStore {
  sidebarCollapsed: boolean;
  modalOpen: Record<string, boolean>;  // key = modal name
  toggleSidebar: () => void;
  setModalOpen: (key: string, open: boolean) => void;
}
```

### 5.2 useEmpresaStore

```typescript
interface EmpresaStore {
  empresa: Empresa | null;
  setEmpresa: (e: Empresa) => void;
  clearEmpresa: () => void;
}
```

### 5.3 useUsuariosStore

```typescript
interface UsuariosStore {
  usuario: Usuario | null;
  setUsuario: (u: Usuario) => void;
  clearUsuario: () => void;
}
```

### 5.4 useThemeStore

```typescript
interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: 'light' | 'dark') => void;
}
// Persisted to localStorage via zustand/persist
```

### 5.5 useProductosStore

```typescript
interface ProductosStore {
  productos: Producto[];
  buscador: string;
  selectedProducto: Producto | null;
  pagination: { page: number; pageSize: number };
  setProductos: (p: Producto[]) => void;
  setBuscador: (b: string) => void;
  setSelectedProducto: (p: Producto | null) => void;
  setPagination: (p: { page: number; pageSize: number }) => void;
}
```

### 5.6 useCategoriasStore

```typescript
interface CategoriasStore {
  categorias: Categoria[];
  selectedCategoria: Categoria | null;
  setCategorias: (c: Categoria[]) => void;
  setSelectedCategoria: (c: Categoria | null) => void;
}
```

### 5.7 useVentasStore (persist partialize)

```typescript
interface VentasStore {
  currentVentaId: number | null;
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tempId: string) => void;
  updateQty: (tempId: string, qty: number) => void;
  clearCart: () => void;
  setCurrentVentaId: (id: number | null) => void;
}
// Persisted: only 'cart' and 'currentVentaId' via partialize
// Storage key: 'tpv365-ventas-store'
```

### 5.8 useDetalleVentasStore

```typescript
interface DetalleVentasStore {
  detalleVenta: DetalleVenta[];
  setDetalleVenta: (d: DetalleVenta[]) => void;
  clearDetalleVenta: () => void;
}
```

### 5.9 useMetodosPagoStore

```typescript
interface MetodosPagoStore {
  metodosPago: MetodoPago[];
  setMetodosPago: (m: MetodoPago[]) => void;
}
```

### 5.10 useSerializacionStore

```typescript
interface SerializacionStore {
  serializacionDefault: SerializacionComprobante | null;
  setSerializacionDefault: (s: SerializacionComprobante | null) => void;
}
```

### 5.11 useReportesStore

```typescript
interface ReportesStore {
  // Reserved for future /reportes screen
  // Currently unused in MVP
  [key: string]: unknown;
}
```

### 5.12 useDashboardStore

```typescript
interface DashboardStore {
  rango: 'dia' | 'semana' | 'mes' | 'custom';
  fechaInicio: string;   // 'YYYY-MM-DD'
  fechaFin: string;      // 'YYYY-MM-DD'
  setRango: (r: 'dia' | 'semana' | 'mes' | 'custom', customDates?: { inicio: string; fin: string }) => void;
}
```

---

## 6. File Structure

```
tpv365-rebuild/                    # Created during apply
├── src/
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client instance
│   │   └── rpc/                   # Typed RPC wrappers
│   │       ├── index.ts           # Re-exports all
│   │       ├── auth.ts
│   │       ├── productos.ts
│   │       ├── categorias.ts
│   │       ├── ventas.ts
│   │       ├── dashboard.ts
│   │       └── caja.ts
│   ├── types/
│   │   ├── rpc.ts                 # All TypeScript interfaces (§2)
│   │   └── store.ts               # Store state types
│   ├── stores/
│   │   ├── index.ts
│   │   ├── useGlobalStore.ts
│   │   ├── useEmpresaStore.ts
│   │   ├── useUsuariosStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useProductosStore.ts
│   │   ├── useCategoriasStore.ts
│   │   ├── useVentasStore.ts       # persist with partialize
│   │   ├── useDetalleVentasStore.ts
│   │   ├── useMetodosPagoStore.ts
│   │   ├── useSerializacionStore.ts
│   │   ├── useReportesStore.ts
│   │   └── useDashboardStore.ts
│   ├── hooks/
│   │   ├── useLogin.ts
│   │   ├── useProductos.ts
│   │   ├── useCategorias.ts
│   │   ├── useVentas.ts
│   │   ├── useDashboard.ts
│   │   └── useAuthGuard.ts
│   ├── componentes/
│   │   ├── atomos/
│   │   ├── moleculas/
│   │   ├── organismos/
│   │   │   ├── sidebar/
│   │   │   ├── pos/               # POSDesign: HeaderPos, AreaDetalleventaPos, ...
│   │   │   └── tablas/
│   │   ├── templates/
│   │   └── paginas/
│   │       ├── LoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── ProductosPage.tsx
│   │       ├── CategoriasPage.tsx
│   │       └── PosPage.tsx
│   ├── servicios/
│   │   └── pdfTicket.ts           # pdfmake ticket generator
│   ├── App.tsx
│   └── main.tsx
├── .env.example
└── package.json
```

**Forbidden patterns (enforced in code review):**
- No `Swal.fire()` in any MVP file
- No `index.ts` barrel re-exports
- No `any` type on RPC wrapper return values or store state

---

## 7. Acceptance Criteria Summary

| Screen | Criterion |
|--------|-----------|
| Login | Valid → empresa loaded → `/dashboard`; invalid → toast; unauthenticated → redirect |
| Shell | Sidebar + header + theme toggle + clock + 404 catch-all work |
| Dashboard | 8 RPCs render; date range refetches all; `% cambio` correct; empty/no-data graceful |
| Dashboard | `CardMovimientosCajaLive` hidden on RPC failure; no toast |
| Productos | CRUD + delete via `.from().delete()`; constraint errors as toast |
| Categorías | CRUD; no delete button; color/icono stored |
| POS | Venta creation → add items → `mostrarproductos` search → quantity adjust → serialization check → PantallaCobro → payment split → `confirmar_venta` → `nro_comprobante` returned → `movimientos_caja` inserted → PDF → cart cleared |
| POS | No serialization → blocking toast, PantallaCobro not openable |
| Quality | 12 stores exactly; no Swal; no barrel; `tsc` clean |
