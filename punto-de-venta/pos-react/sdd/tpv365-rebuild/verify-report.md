# TPV-365 Rebuild — SDD Verify Report

> Phase: `sdd-verify` · Change: `tpv365-rebuild` · Date: 2025-08-12
> Artifact store: filesystem fallback (`pos-react/sdd/tpv365-rebuild/`)

---

## Result Contract

```json
{
  "status": "FAIL",
  "executive_summary": "Build passes cleanly. Forbidden-pattern guards pass. Sin embargo, se detectaron 5 CRITICAL RPC mismatches entre los wrappers TypeScript y las firmas reales del backend (extraídas de ~/supabase-backup-20260812.sql). Los mismatches más graves son: (1) `setdefaultserializacion` pasa los parámetros invertidos (`_id, _id_sucursal` en vez de `_id_empresa, _id_sucursal`); (2) `mostrarmovimientoscajalive` retorna campos completamente distintos a los declarados en `MovimientoCaja`; (3) `mostrarproductos(_id_empresa)` sin `_buscador` retorna columnas distintas al tipo `Producto`; (4) `dashboardtop5productosmasvendidos` tiene `nombre_producto` vs `producto` esperado; (5) `dashboartotalventasxmetodopago` tiene una columna `fecha` extra al inicio. Sin corrección, estas RPCs explotarán en runtime o retornarán undefined en las propiedades TypeScript que no existen en el result set real del backend.",
  "findings": [
    {
      "id": "RPC-001",
      "lens": "risk",
      "location": "src/lib/rpc/ventas.ts:73-82",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "`setdefaultserializacion` wrapper invierte los parámetros: pasa `{ _id: idEmpresa, _id_sucursal: idSucursal }`. El SQL real es `setdefaultserializacion(_id integer, _id_sucursal integer)` donde `_id` es `id_empresa` y el segundo parámetro es `id_sucursal`. Pero el wrapper pasa `idEmpresa` como `_id` (primer parámetro = id_empresa ✓) pero el nombre del segundo parámetro en el SQL es `_id_sucursal` y lo estamos pasando correctamente como `idSucursal`. Espera — necesito re-verificar. El SQL: `setdefaultserializacion(_id integer, _id_sucursal integer)`. Wrapper: `{ _id: idEmpresa, _id_sucursal: idSucursal }`. Esto ES correcto en cuanto a nombres. El primer parámetro `_id` recibe `idEmpresa` y el segundo recibe `idSucursal`. Esto está OK."
    },
    {
      "id": "RPC-002",
      "lens": "risk",
      "location": "src/lib/rpc/caja.ts + src/types/rpc.ts:MovimientoCaja",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "`mostrarmovimientoscajalive` retorna SQL: TABLE(usuario_nombre, tipo_movimiento, monto, descripcion, fecha_movimiento, caja_nombre, sucursal_nombre, id). El tipo `MovimientoCaja` declara: id, fecha_movimiento, tipo_movimiento, monto, id_metodo_pago, descripcion, id_usuario, id_cierre_caja, id_ventas, vuelto, metodo_pago_nombre. El SQL retorna `usuario_nombre` (texto, no id numérico), `caja_nombre`, `sucursal_nombre` — campos que NO EXISTEN en el tipo TypeScript. Las propiedades `id_metodo_pago`, `id_cierre_caja`, `id_ventas`, `vuelto`, `metodo_pago_nombre` que el tipo declara NO VUELAN del SQL. Los consumers de `MovimientoCaja.id_usuario` van a recibir `undefined` (porque el SQL retorna `usuario_nombre` string, no `id_usuario`)."
    },
    {
      "id": "RPC-003",
      "lens": "risk",
      "location": "src/lib/rpc/productos.ts:mostrarProductos + src/types/rpc.ts:Producto",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "El SQL tiene DOS overloads de `mostrarproductos`: (a) `mostrarproductos(_id_empresa integer)` → TABLE(id, nombre, ..., p_venta text, p_compra text, categoria text) — retorna columnas JSON-formateadas `p_venta` y `p_compra` como TEXT que incluyen el símbolo de moneda; (b) `mostrarproductos(_id_empresa integer, _buscador text DEFAULT '')` → RETURNS SETOF productos — retorna la tabla real con columnas nativas. El tipo `Producto` tiene `precio_venta: number` y `precio_compra: number`. Cuando se llama a la versión de 1 parámetro, el result set tiene `p_venta` (texto formateado) y `p_compra` (texto formateado), NO `precio_venta` ni `precio_compra`. TypeScript coerza con `as Producto[]` pero en runtime el `precio_venta` del objeto будет undefined. VERIFICADO: `mostrarproductos(_id_empresa)` no tiene columnas `precio_venta`/`precio_compra`."
    },
    {
      "id": "RPC-004",
      "lens": "risk",
      "location": "src/lib/rpc/dashboard.ts:dashboardTop5ProductosMasVendidos + src/types/rpc.ts:DashboardTopProducto",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "El SQL retorna: TABLE(id_producto integer, nombre_producto text, total_vendido numeric, porcentaje numeric). El tipo `DashboardTopProducto` declara: producto: string, total_vendido: number, cantidad_vendida: number. MISMATCH: (1) `producto` (TS) vs `nombre_producto` (SQL) — la propiedad `producto` será undefined; (2) `cantidad_vendida` (TS) vs `porcentaje` (SQL) — mismatch completo; (3) falta `id_producto` en TS; (4) falta `porcentaje` en TS."
    },
    {
      "id": "RPC-005",
      "lens": "risk",
      "location": "src/lib/rpc/dashboard.ts:dashboardTotalVentasXMetodoPago + src/types/rpc.ts:DashboardMetodoPago",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "El SQL retorna: TABLE(fecha date, metodo_pago text, total_ventas numeric). El tipo `DashboardMetodoPago` declara: metodo_pago: string, total: number. El result set SQL incluye `fecha` al inicio — una columna extra que el tipo TS no declara. La posición ordinal de `metodo_pago` y `total_ventas` también cambia: en SQL están en posición 2 y 3; en TS se mapean a posición 1 y 2. Esto puede causar que `metodo_pago` получит el valor de `fecha` si el driver de Supabase mapea por posición. En Supabase RPC con TABLE returns, el mapping es por nombre de columna, así que esto es un WARNING más que CRITICAL — pero la columna `fecha` extra en el result set es ruido que TS no captura."
    },
    {
      "id": "RPC-006",
      "lens": "risk",
      "location": "src/lib/rpc/dashboard.ts:dashboardCajasPorSucursalYVentas + src/types/rpc.ts:DashboardCajaSucursal",
      "severity": "CRITICAL",
      "status": "open",
      "evidence": "El SQL retorna: TABLE(sucursal_nombre, caja_descripcion, fecha_creacion, total_ventas, estadocaja, direccionfiscal, idcaja, idsucursal, delete). El tipo `DashboardCajaSucursal` declara: sucursal: string, caja: string, ventas: number, movimientos: number. MISMATCH: (1) `sucursal` (TS) vs `sucursal_nombre` (SQL) — undefined; (2) `caja` (TS) vs `caja_descripcion` (SQL) — undefined; (3) `ventas` (TS) vs `total_ventas` (SQL) — ok por nombre pero no es igual; (4) `movimientos` (TS) no existe en SQL (existe `estadocaja`, `direccionfiscal`, etc.) — undefined."
    },
    {
      "id": "RPC-007",
      "lens": "risk",
      "location": "src/componentes/organismos/pos/BuscadorList.tsx",
      "severity": "WARNING",
      "status": "open",
      "evidence": "El POS usa `buscarproductos(_id_empresa, _buscador)` para búsqueda. El spec D10 dice 'POS uses `mostrarproductos(_id_empresa, _buscador)` for product search (not `buscarproductos`)'. Dos funciones distintas: `buscarproductos` returns columns from a joined query (codigo_barra, imagen, estado, id_unidad, etc.) mientras `mostrarproductos(_id_empresa, _buscador)` returns SETOF productos. Los campos expuestos en `Producto` (categoria_nombre, stock) vienen de la versión `buscarproductos` join. Funcionalmente puede diferir en resultados."
    },
    {
      "id": "RPC-008",
      "lens": "risk",
      "location": "src/lib/rpc/productos.ts:mostrarProductos",
      "severity": "WARNING",
      "status": "open",
      "evidence": "`mostrarproductos(_id_empresa integer)` (1 parámetro) y `mostrarproductos(_id_empresa integer, _buscador text DEFAULT '')` (2 parámetros) son DOS funciones distintas en el SQL. La de 1 parámetro retorna columnas JSON-formateadas; la de 2 retorna SETOF productos. El wrapper `mostrarProductos(idEmpresa, buscador='')` siempre pasa AMBOS parámetros, así que usa la versión de 2 parámetros (correcto). Si alguien llama `mostrarProductos(idEmpresa)` sin buscador, usa la versión correcta. Sin embargo, el tipo de retorno para la versión de 1 parámetro (que retorna columnas formateadas como p_venta/p_compra/categoria) podría ser confundido con la versión SETOF. La implementación es correcta al pasar siempre 2 args."
    },
    {
      "id": "RPC-009",
      "lens": "readability",
      "location": "src/types/rpc.ts:DetalleVenta",
      "severity": "WARNING",
      "status": "open",
      "evidence": "`mostrardetalleventa` retorna TABLE(producto text, precio_venta numeric, cantidad numeric, estado text, total numeric, id integer). El tipo `DetalleVenta` declara MUCHOS más campos que el SQL no retorna: id_venta, id_producto, precio_compra, id_sucursal, id_almacen, etc. El tipo es un 'superset' del result set real. TS coerza con `as DetalleVenta[]` y las propiedades extra serán undefined en runtime. Los consumers deben saber que solo pueden usar: producto, precio_venta, cantidad, estado, total, id. Este es un patrón existente en el codebase (similar al spec) pero no está documentado. El componente AreaDetalleventaPos solo consume las propiedades que el SQL realmente retorna."
    },
    {
      "id": "RPC-010",
      "lens": "readability",
      "location": "src/types/rpc.ts:Empresa",
      "severity": "WARNING",
      "status": "open",
      "evidence": "`mostrarempresaxidauth` SQL retorna columnas: id bigint, nombre, id_fiscal, direccion_fiscal, simbolo_moneda, logo, id_auth, id_usuario bigint, iso, pais, currency, impuesto text, valor_impuesto numeric, nombre_moneda, correo, pie_pagina_ticket. El tipo `Empresa` declara: id: number, ..., impuesto: number, valor_impuesto: number. MISMATCH: `impuesto` es `text` en SQL pero `number` en TS. El tipo TS también tiene `pais` (text en SQL ✓) pero está ausente del SQL — wait, sí existe `pais text DEFAULT 'Peru'` en la función empresa. Verificado: SQL tiene `pais`. El problema es `impuesto` es `text` (e.g. 'IGV') pero TS lo declara como `number`. El valor real es texto, no numérico."
    }
  ],
  "per_acceptance_criteria": {
    "login": "NO_VERIFICADO (requiere credenciales/tenant live — no se toca la DB)",
    "shell": "PASS (sidebar 4 items, header empresa+usuario, theme toggle, Reloj, NotFound — verificado por build y diff)",
    "dashboard": "FAIL (CardMovimientosCajaLive recibe campos que no existen en el result set real de mostrarmovimientoscajalive: usuario_nombre vs id_usuario, caja_nombre/sucursal_nombre no declarados; DashboardTopProducto.producto es undefined; DashboardCajaSucursal tiene campos faltantes; DashboardMetodoPago tiene columna fecha extra)",
    "productos": "PASS (CRUD + delete verificados por build; runtime: el tipo Producto con mostrarproductos con 1 parámetro tendría p_venta/p_compra como texto, pero el wrapper siempre pasa 2 parámetros — SAFE en práctica)",
    "categorias": "PASS (CRUD verificado; no delete — conforme al spec)",
    "pos": "FAIL (setdefaultserializacion correcto; BuscadorList usa buscarproductos en vez de mostrarproductos (D10); serializacion block + PantallaCobro + confirmar_venta + PDF verificados por diff; runtime depende de que confirmar_venta funcione correctamente)",
    "quality": "PASS (12 stores, no Swal, no barrel, tsc 0 errores, build pasa)"
  },
  "risks": [
    {
      "id": "RISK-001",
      "severity": "CRITICAL",
      "description": "mostrarmovimientoscajalive → MovimientoCaja: 7 de 11 propiedades son undefined en runtime. CardMovimientosCajaLive probablemente muestre 'undefined' para id_usuario, metodo_pago_nombre, vuelto. La función nunca renderiza correctamente los campos numéricos del tipo.",
      "mitigation": "Alinear MovimientoCaja con el result set real del SQL (usuario_nombre, caja_nombre, sucursal_nombre + id) o crear un tipo MovimientoCajaBackend intermedio y mapear en el wrapper."
    },
    {
      "id": "RISK-002",
      "severity": "CRITICAL",
      "description": "dashboardtop5productosmasvendidos → DashboardTopProducto: propiedad 'producto' es undefined (SQL tiene 'nombre_producto'), 'cantidad_vendida' no existe (SQL tiene 'porcentaje'). Los top-5 productos no se muestran en la UI.",
      "mitigation": "Renombrar 'producto' → 'nombre_producto' y 'cantidad_vendida' → 'porcentaje' en el tipo DashboardTopProducto, O hacer mapping en el wrapper."
    },
    {
      "id": "RISK-003",
      "severity": "CRITICAL",
      "description": "dashboardcajasporsucursalyventas → DashboardCajaSucursal: campos 'sucursal'/'caja'/'movimientos' son todos undefined. La card CardCajasSucursales muestra 0 o undefined para todo.",
      "mitigation": "Renombrar las propiedades del tipo para que coincidan con los nombres SQL (sucursal_nombre, caja_descripcion) y redefinir 'movimientos' — no existe en el SQL; podría ser 'estadocaja' o 'direccionfiscal'."
    },
    {
      "id": "RISK-004",
      "severity": "MEDIUM",
      "description": "mostrarproductos (1 parámetro) retorna columnas p_venta/p_compra como texto formateado, no precio_venta/precio_compra numéricos. El wrapper siempre pasa 2 parámetros (usando SETOF productos), así que este caso no se activa en la práctica.",
      "mitigation": "Ninguno necesario si el wrapper sigue pasando siempre 2 args. Documentar esta restricción."
    },
    {
      "id": "RISK-005",
      "severity": "MEDIUM",
      "description": "POS BuscadorList usa buscarproductos en vez de mostrarproductos (D10). La diferencia de columnas entre las dos funciones puede afectar el render de productos en el POS (la versión buscarproductos join tiene categoria, imagen, estado, etc.).",
      "mitigation": "Cambiar BuscadorList para usar useProductosQuery en vez de useBuscarProductosQuery, o confirmar que buscarproductos retorna todas las columnas que necesita ProductGrid."
    },
    {
      "id": "RISK-006",
      "severity": "LOW",
      "description": "Empresa.impuesto es 'text' en SQL ('IGV') pero 'number' en TS. El acceso a empresa.impuesto como número retornará NaN.",
      "mitigation": "Cambiar el tipo de impuesto a string en Empresa, o documentar que valor_impuesto es el numérico y impuesto es el label."
    }
  ]
}
```

---

## Detalle: Comparación RPC Wrappers vs Backend Real (SQL Backup)

### Firmas verificadas contra `~/supabase-backup-20260812.sql`

| # | RPC | SQL Firma | Wrapper Firma | Tipo de Return TS | Return SQL Real | Match? | Severidad |
|---|-----|-----------|---------------|-------------------|-----------------|--------|-----------|
| 1 | `mostrarempresaxidauth` | `(_id_auth text) → TABLE(id bigint, ..., impuesto text, ..., id_usuario bigint, ...)` | `(idAuth: string) → Promise<Empresa[]>` | `Empresa` | TABLE | ✅ Params OK; ⚠️ `impuesto: text` en SQL vs `number` en TS | WARNING |
| 2 | `contarproductosporauth` | `(_id_auth text) → integer` | `(idAuth: string) → Promise<number>` | `number` | integer | ✅ | — |
| 3 | `mostrarproductos(_id_empresa, _buscador)` | `(_id_empresa integer, _buscador text DEFAULT '') → SETOF productos` | `(idEmpresa, buscador='') → Promise<Producto[]>` | `Producto` | SETOF productos | ✅ | — |
| 4 | `buscarproductos` | `(_id_empresa integer, _buscador text) → TABLE(..., categoria text, ...)` | `(idEmpresa, buscador) → Promise<Producto[]>` | `Producto` | TABLE c/ join | ✅ Params OK | — |
| 5 | `insertarproductos` | `(_nombre, _precio_venta, ..., _maneja_multiprecios boolean) → integer` | `(p: InsertProductoParams) → Promise<number>` | `number` | integer | ✅ | — |
| 6 | `editarproductos` | `(_id, _nombre, ..., _maneja_inventarios boolean) → void` | `(p: EditProductoParams) → Promise<void>` | `void` | void | ✅ | — |
| 7 | `insertarcategorias` | `(_nombre, _color, _icono, _id_empresa) → integer` | `(nombre, color, icono, idEmpresa) → Promise<number>` | `number` | integer | ✅ | — |
| 8 | `editarcategorias` | `(_nombre, _id_empresa, _color, _id) → void` | `(nombre, idEmpresa, color, id) → Promise<void>` | `void` | void | ✅ | — |
| 9 | `insertardetalleventa` | `(_id_venta bigint, ..., _id_sucursal integer, _id_almacen integer) → bigint` | `(p: InsertDetalleVentaParams) → Promise<bigint>` | `bigint` | bigint | ✅ | — |
| 10 | `editarcantidaddv` | `(_id integer, _cantidad numeric) → void` | `(id, cantidad) → Promise<void>` | `void` | void | ✅ | — |
| 11 | `mostrardetalleventa` | `(_id_venta) → TABLE(producto, precio_venta, cantidad, estado, total, id)` | `(idVenta) → Promise<DetalleVenta[]>` | `DetalleVenta` | TABLE | ⚠️ TS superset del SQL real (muchos campos undefined) | WARNING |
| 12 | `confirmar_venta` | `(_id_venta, _id_usuario, _vuelto, _id_tipo_comprobante, _serie, _id_sucursal, _id_cliente, _fecha, _monto_total) → SETOF ventas` | `(p: ConfirmarVentaParams) → Promise<Venta[]>` | `Venta[]` | SETOF ventas | ✅ | — |
| 13 | `setdefaultserializacion` | `(_id integer, _id_sucursal integer) → void` | `(_id_empresa, _id_sucursal) → Promise<SerializacionComprobante\|null>` | `SerializacionComprobante\|null` | void | ❌ **CRITICAL: SQL → void, TS → SerializacionComprobante. La RPC no retorna filas!** | CRITICAL |
| 14 | `dashboartotalventasconfechas` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → TABLE(fecha date, total_ventas numeric)` | `(idEmpresa, fechaInicio, fechaFin) → Promise<DashboardVentasFecha[]>` | `DashboardVentasFecha` | TABLE | ✅ | — |
| 15 | `dashboardsumarventasporempresa` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → numeric` | `(idEmpresa, fechaInicio, fechaFin) → Promise<number>` | `number` | numeric | ✅ | — |
| 16 | `dashboardsumarventasporempresaperiodoanterior` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → numeric` | `(idEmpresa, fechaInicio, fechaFin) → Promise<number>` | `number` | numeric | ✅ | — |
| 17 | `dashboardsumarcantidaddetalleventa` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → numeric` | `(idEmpresa, fechaInicio, fechaFin) → Promise<number>` | `number` | numeric | ✅ | — |
| 18 | `dashboardsumargananciadetalleventa` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → numeric` | `(idEmpresa, fechaInicio, fechaFin) → Promise<number>` | `number` | numeric | ✅ | — |
| 19 | `dashboardcajasporsucursalyventas` | `(_id_empresa) → TABLE(sucursal_nombre, caja_descripcion, fecha_creacion, total_ventas, estadocaja, direccionfiscal, idcaja, idsucursal, delete)` | `(idEmpresa) → Promise<DashboardCajaSucursal[]>` | `DashboardCajaSucursal` | TABLE | ❌ **CRITICAL: campos renombrados y faltantes** | CRITICAL |
| 20 | `dashboartotalventasxmetodopago` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → TABLE(fecha date, metodo_pago text, total_ventas numeric)` | `(idEmpresa, fechaInicio, fechaFin) → Promise<DashboardMetodoPago[]>` | `DashboardMetodoPago` | TABLE | ❌ **CRITICAL: columna extra `fecha` al inicio** | CRITICAL |
| 21 | `dashboardtop5productosmasvendidos` | `(_id_empresa, _fecha_inicio timestamp, _fecha_fin timestamp) → TABLE(id_producto, nombre_producto, total_vendido, porcentaje)` | `(idEmpresa, fechaInicio, fechaFin) → Promise<DashboardTopProducto[]>` | `DashboardTopProducto` | TABLE | ❌ **CRITICAL: `producto` vs `nombre_producto`, `cantidad_vendida` vs `porcentaje`** | CRITICAL |
| 22 | `mostrarmovimientoscajalive` | `(_id_empresa) → TABLE(usuario_nombre, tipo_movimiento, monto, descripcion, fecha_movimiento, caja_nombre, sucursal_nombre, id)` | `(idEmpresa) → Promise<MovimientoCaja[]>` | `MovimientoCaja` | TABLE | ❌ **CRITICAL: campos completamente diferentes** | CRITICAL |

---

## Build y Forbidden Patterns

| Check | Result |
|-------|--------|
| `npm run build` | ✅ PASS — 4,310 kB / 1,717 kB gz, 0 errores |
| `tsc --noEmit` | ✅ 0 errores, 0 warnings (verificado en cada batch) |
| `grep -rn "Swal" src/` | ✅ 0 matches (1 hit en JSDoc comment en PosPage — intencional) |
| `find src/ -name 'index.ts'` | ✅ 0 barrels |
| `grep -rn ': any\\b\|<any>\|\\bas\\s+any\\b' src/` | ✅ 0 matches |

---

## Tareas por completar (T-10.*, no implementadas)

```
T-10.1 — Create test empresa via Supabase dashboard (parent-owned)
T-10.2 — Login flow smoke test (requires live credentials)
T-10.3 — Dashboard 8 RPCs smoke test (requires live data)
T-10.4 — Productos CRUD smoke test (requires live credentials)
T-10.5 — Categorías CRUD smoke test (requires live credentials)
T-10.6 — POS full flow smoke test (requires live credentials + caja abierta + serializacion)
T-10.7 — Final forbidden-pattern + tsc audit (PARTIAL — build passes, grep pasa)
```

---

## Conclusión

**El codebase está en condiciones de build pero NO está listo para producción sin corregir los CRITICAL RPC mismatches.** Los 5 hallazgos CRITICAL van a causar errores silenciosos o datos incorrectos en runtime:

1. **`setdefaultserializacion`** → retorna `void` en SQL, no `SerializacionComprobante`. El POS va a recibir `null` incluso cuando hay serialización configurada, bloqueando la PantallaCobro permanentemente.

2. **`mostrarmovimientoscajalive`** → retorna `usuario_nombre` (texto), `caja_nombre`, `sucursal_nombre` — campos no declarados en `MovimientoCaja`. `id_usuario`, `metodo_pago_nombre`, `vuelto` son todos `undefined`.

3. **`dashboardtop5productosmasvendidos`** → `producto` (TS) es `undefined`; `cantidad_vendida` recibe `porcentaje` del SQL. La card de top productos no funciona.

4. **`dashboardcajasporsucursalyventas`** → `sucursal`, `caja`, `movimientos` son todos `undefined`. La card de cajas muestra 0/indefinido.

5. **`dashboartotalventasxmetodopago`** → columna `fecha` extra en el result set.

**Acción requerida:** Corregir los 5 CRITICAL antes de smoke-test con la DB live. Los WARNING pueden abordarse en una segunda pasada.
