# TPV-365 Rebuild — Exploration Blueprint

## 1. Mapa de Features por Ruta

### AUTH
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/login` | Login con email/password | `useEmpresaStore`, `useUsuariosStore` | `mostrarempresaxidauth` (RPC), `contarproductosporauth` (RPC), auth.signInWithPassword |

### SHELL / LAYOUT
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/` | Home — redirect to `/dashboard` | — | — |
| `/miperfil` | Editar perfil del usuario | `useUsuariosStore`, `useGlobalStore` | `.from('usuarios').update(...)`, `useEditarPerfilMutation` |
| `*` | Catch-all 404 | — | — |

### DASHBOARD
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/dashboard` | Dashboard principal con métricas, charts, cards | `useReportesStore`, `useDashboardStore`, `useEmpresaStore` | `dashboartotalventasconfechas`, `dashboardsumarventasporempresa`, `dashboardsumarventasporempresaperiodoanterior`, `dashboardsumarcantidaddetalleventa`, `dashboardsumargananciadetalleventa`, `dashboardcajasporsucursalyventas`, `dashboartotalventasxmetodopago`, `dashboardtop5productosmasvendidos` |

**Componentes del Dashboard (reconstruidos del bundle):**
- `ChartVentas` — gráfico de línea de ventas por fechas (Recharts AreaChart)
- `CardVentas` — card total ventas con % cambio vs periodo anterior
- `CardCantidadVentas` — card cantidad items vendidos
- `CardGanancias` — card ganancias del periodo
- `CardProductosTopMonto` — top 10 productos vendidos por monto
- `CardMovimientosCajaLive` — últimos 10 movimientos de caja
- `DatePicker` (rango de fechas) — día, semana, mes personalizado

### POS / VENTAS
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/pos` | POS — pantalla de venta | `useVentasStore`, `useDetalleVentasStore`, `useProductosStore`, `useMetodosPagoStore`, `useSerializacionStore`, `useImpresorasStore`, `useClientesProveedoresStore`, `useEmpresaStore`, `useCierreCajaStore`, `useMovCajaStore` | `insertardetalleventa`, `editarcantidaddv`, `mostrardetalleventa`, `confirmar_venta`, `mostrarproductos` (buscador), `mostrarclientesproveedores`, `insertarventas` (.from), `sumarefectivosinventasmovcierrecaja`, `sumarventasmetodopagomovcierrecaja`, `mostrarmovimientoscajalive` |

**Sub-componentes del POS (reconstruidos):**
- `PantallaCobro` — overlay/modal de cobro con métodos de pago
- `IngresoCobro` — entrada de monto por método de pago (efectivo, tarjeta, crédito)
- `HeaderPos` — header del POS con info de sucursal/caja
- `AreaDetalleventaPos` — tabla de detalle de venta
- `AreaTecladoPos` — teclado numérico para cantidad
- `FooterPos` — footer con acciones (confirmar, cancelar)
- `TotalPos` — resumen de totales
- `BuscadorList` — buscador de productos con selección

**Flujo de venta reconstruido:**
1. Insertar venta (`insertarVentas` → .from('ventas').insert)
2. Insertar detalle de venta por cada item (`insertardetalleventa` RPC)
3. Abrir PantallaCobro → ingresar montos por método de pago
4. Confirmar venta (`confirmar_venta` RPC) — genera nro_comprobante, actualiza estado
5. Insertar movimientos de caja por método de pago
6. Imprimir ticket (opcional, via impresoras)

### CONFIGURACIÓN
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/configuracion` | Configuración — dashboard de config con links | — | — |
| `/configuracion/productos` | CRUD Productos | `useProductosStore`, `useCategoriasStore`, `useAlmacenesStore`, `useStockStore` | `insertarproductos`, `editarproductos`, `mostrarproductos`, `buscarproductos`, `.from('productos').delete()` |
| `/configuracion/categorias` | CRUD Categorías | `useCategoriasStore` | `insertarcategorias`, `editarcategorias`, `.from('categorias').select()`, storage('imagenes') |
| `/configuracion/serializacion` | Serialización de comprobantes | `useSerializacionStore`, `useGlobalStore` | `.from('serializacion_comprobantes').select()`, `setdefaultserializacion` |
| `/configuracion/ticket` | Config ticket (nombre empresa, moneda, pie de página) | `useEmpresaStore`, `useGlobalStore` | `.from('empresa').update()` |
| `/configuracion/empresa` | Datos empresa + logo | `useEmpresaStore`, `useGlobalStore` | `mostrarempresaxiduser` (RPC), `.from('empresa').update()`, storage('imagenes') |
| `/configuracion/clientes` | CRUD Clientes | `useClientesProveedoresStore` | `insertarclientesproveedores`, `editarclientesproveedores`, `.from('clientes_proveedores')` |
| `/configuracion/proveedores` | CRUD Proveedores (misma tabla que clientes) | `useClientesProveedoresStore` | misma que clientes, filtrado por `tipo` |
| `/configuracion/sucursalcaja` | Sucursales + Cajas | `useSucursalesStore`, `useCajasStore` | `.from('sucursales').select()`, `.from('caja').select()` |
| `/configuracion/impresoras` | Config impresoras por caja | `useImpresorasStore`, `useAsignacionCajaSucursalStore` | `.from('impresoras')` |
| `/configuracion/metodospago` | CRUD Métodos de pago | `useMetodosPagoStore` | `.from('metodos_pago').select()` |
| `/configuracion/usuarios` | Gestión usuarios + permisos + roles | `useUsuariosStore`, `useAsignacionCajaSucursalStore`, `useRolesStore`, `usePermisosStore` | `mostrarusuariosasignados`, `buscarusuariosasignados`, `crearcredencialesuser`, `.from('usuarios')`, `.from('permisos')`, `.from('asignacion_sucursal')` |
| `/configuracion/almacenes` | CRUD Almacenes por sucursal | `useAlmacenesStore`, `useSucursalesStore` | `.from('almacen').select()` |

### INVENTARIO
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/inventario` | Movimientos de stock (entradas/salidas/transferencias) | `useMovStockStore`, `useProductosStore`, `useSucursalesStore`, `useAlmacenesStore`, `useStockStore` | `incrementarstock`, `reducirstock`, `.from('movimientos_stock').insert()`, `.from('stock').select()`, `.from('kardex').select()` |

### REPORTES
| Ruta | Pantalla | Stores | RPCs / .from() |
|------|----------|--------|----------------|
| `/reportes` | Reportes (tabs: ventas por sucursal, stock por almacén, stock bajo mínimo) | `useReportesStore`, `useEmpresaStore` | `mostrarventasporsucursalfechas`, `report_stock_por_almacen_sucursal`, `report_stock_bajo_minimo` |

---

## 2. Catálogo de Esquema Supabase

### 2.1. Tablas (26 tablas public)

#### AUTH / USUARIOS
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `usuarios` | id (bigint PK), nombres, id_tipodocumento (FK), nro_doc, telefono, id_rol (FK), correo, fecharegistro, estado ('ACTIVO'), id_auth (FK→auth.users), tema ('light') | Core |
| `roles` | id (bigint PK), nombre | Core |
| `permisos` | id (bigint PK), id_usuario (FK), idmodulo (FK) | Core |
| `permisos_dafault` | id (bigint PK), id_rol (FK), id_modulo (FK) | Core |
| `tipodocumento` | id (bigint PK), nombre, id_empresa (FK) | Core |
| `modulos` | id (bigint PK), nombre, check (bool), descripcion, icono, link, etiquetas | Core |

#### EMPRESA / SUCURSALES / CAJA
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `empresa` | id (bigint PK), nombre, id_fiscal, direccion_fiscal, simbolo_moneda, logo, id_auth, id_usuario (FK→usuarios), iso, pais, currency, impuesto, valor_impuesto, nombre_moneda, correo, pie_pagina_ticket | Core |
| `sucursales` | id (bigint PK), nombre, direccion_fiscal, id_empresa (FK), delete (bool) | Core |
| `caja` | id (bigint PK), descripcion, id_sucursal (FK), fecha_creacion, delete (bool), print (bool) | Core |
| `asignacion_sucursal` | id (bigint PK), id_sucursal (FK), id_usuario (FK), id_caja (FK) | Core |
| `cierrecaja` | id (bigint PK), fechainicio, fechacierre, id_usuario, total_efectivo_calculado, total_efectivo_real, estado, diferencia_efectivo, id_caja | POS |
| `movimientos_caja` | id (bigint PK), fecha_movimiento, tipo_movimiento, monto, id_metodo_pago (FK), descripcion, id_usuario (FK), id_cierre_caja (FK), id_ventas (FK), vuelto | POS |

#### PRODUCTOS / INVENTARIO
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `productos` | id (bigint PK), nombre, precio_venta, precio_compra, id_categoria (FK), codigo_barras, codigo_interno, id_empresa (FK), sevende_por ('unidad'), maneja_inventarios (bool), maneja_multiprecios (bool), fecha_caducidad | Core |
| `categorias` | id (bigint PK), nombre, color, icono, id_empresa (FK) | Core |
| `stock` | id (bigint PK), id_almacen (FK), id_producto (FK), stock, stock_minimo, ubicacion | POS |
| `almacen` | id (bigint PK), id_sucursal (FK), fecha_creacion, delete (bool), nombre, default (bool) | POS |
| `multiprecios` | id (bigint PK), precio_venta, id_producto (FK), cantidad | POS |
| `movimientos_stock` | id (bigint PK), id_almacen (FK), id_producto (FK), tipo_movimiento, cantidad, fecha, detalle, origen | POS |
| `kardex` | id (bigint PK), fecha, motivo, cantidad, id_producto (FK), id_usuario (FK), tipo, estado, total, costo, habia, hay | POS |

#### VENTAS / DETALLE
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `ventas` | id (bigint PK), fecha, monto_total, total_impuestos, id_usuario (FK), saldo, pago_con, referencia_tarjeta, vuelto, cantidad_productos, sub_total, id_cliente (FK), id_sucursal (FK), id_empresa (FK), estado ('pendiente'), valor_impuesto, id_cierre_caja (FK), nro_comprobante | Core |
| `detalle_venta` | id (bigint PK), id_venta (FK), cantidad, precio_venta, total, descripcion, id_producto (FK), precio_compra, id_sucursal (FK), estado ('nueva'), id_almacen (FK) | Core |

#### CLIENTES / PROVEEDORES
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `clientes_proveedores` | id (bigint PK), nombres, id_empresa (FK), direccion, telefono, email, identificador_nacional, identificador_fiscal, tipo, estado ('activo'), fecha_registro | POS |

#### COMPROBANTES / SERIALIZACIÓN
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `tipo_comprobantes` | id (bigint PK), nombre, destino | POS |
| `serializacion_comprobantes` | id (bigint PK), id_tipo_comprobante (FK), serie, cantidad_numeros, correlativo, sucursal_id (FK), por_default (bool) | POS |

#### MÉTODOS DE PAGO
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `metodos_pago` | id (bigint PK), nombre, id_empresa (FK), icono, ver_nombre (bool), delete_update (bool) | Core |

#### IMPRESORAS
| Tabla | Columnas clave | Tipo |
|-------|---------------|------|
| `impresoras` | id (bigint PK), id_caja (FK), pc_name, ip_local, state (bool), name | POS |

### 2.2. Funciones RPC por Dominio

#### AUTH / EMPRESA
| Función | Firma | Notas |
|---------|-------|-------|
| `mostrarempresaxidauth` | `(_id_auth text) → TABLE(id, nombre, id_fiscal, ...)` | Login: obtener empresa por auth uid |
| `mostrarempresaxiduser` | `(_id_usuario integer) → TABLE(result empresa)` | Obtener empresa por usuario |
| `contarproductosporauth` | `(_id_auth text) → integer` | Login: verificar si tiene productos |
| `crearcredencialesuser` | `(email text, pass text) → uuid` | Crear usuario en auth.users |

#### PRODUCTOS / CATEGORÍAS
| Función | Firma | Notas |
|---------|-------|-------|
| `mostrarproductos` | `(_id_empresa integer, _buscador text DEFAULT '') → SETOF productos` | ✅ MVP |
| `buscarproductos` | `(_id_empresa integer, _buscador text) → TABLE(...)` | ✅ MVP |
| `insertarproductos` | `(_nombre, _precio_venta, _precio_compra, _id_categoria, _codigo_barras, _codigo_interno, _id_empresa, _sevende_por, _maneja_inventarios, _maneja_multiprecios) → integer` | ✅ MVP |
| `editarproductos` | `(_id, _nombre, _precio_venta, _precio_compra, _id_categoria, _codigo_barras, _codigo_interno, _id_empresa, _sevende_por, _maneja_inventarios) → void` | ✅ MVP |
| `insertarcategorias` | `(_nombre, _color, _icono, _id_empresa) → integer` | ✅ MVP |
| `editarcategorias` | `(_nombre, _id_empresa, _color, _id) → void` | ✅ MVP |

#### VENTAS
| Función | Firma | Notas |
|---------|-------|-------|
| `insertardetalleventa` | `(_id_venta, _id_producto, _precio_venta, _descripcion, _cantidad, _precio_compra, _id_sucursal, _id_almacen) → bigint` | ✅ MVP |
| `editarcantidaddv` | `(_id integer, _cantidad numeric) → void` | ✅ MVP |
| `mostrardetalleventa` | `(_id_venta integer) → TABLE(producto, precio_venta, cantidad, estado, total, id)` | ✅ MVP |
| `confirmar_venta` | `(_id_venta, _id_usuario, _vuelto, _id_tipo_comprobante, _serie, _id_sucursal, _id_cliente, _fecha, _monto_total) → SETOF ventas` | ✅ MVP — crítico |
| `generar_nro_comprobante` | `(_id_tipo_comprobante, _serie, _id_sucursal) → text` | ✅ MVP — interna |
| `setdefaultserializacion` | `(_id integer, _id_sucursal integer) → void` | ✅ MVP |

#### DASHBOARD
| Función | Firma | Notas |
|---------|-------|-------|
| `dashboartotalventasconfechas` | `(_id_empresa, _fecha_inicio, _fecha_fin) → TABLE(fecha, total_ventas)` | ✅ MVP |
| `dashboardsumarventasporempresa` | `(_id_empresa, _fecha_inicio, _fecha_fin) → numeric` | ✅ MVP |
| `dashboardsumarventasporempresaperiodoanterior` | `(_id_empresa, _fecha_inicio, _fecha_fin) → numeric` | ✅ MVP |
| `dashboardsumarcantidaddetalleventa` | `(_id_empresa, _fecha_inicio, _fecha_fin) → numeric` | ✅ MVP |
| `dashboardsumargananciadetalleventa` | `(_id_empresa, _fecha_inicio, _fecha_fin) → numeric` | ✅ MVP |
| `dashboardcajasporsucursalyventas` | `(_id_empresa) → TABLE(...)` | ✅ MVP |
| `dashboartotalventasxmetodopago` | `(_id_empresa, _fecha_inicio, _fecha_fin) → TABLE(...)` | ✅ MVP |
| `dashboardtop5productosmasvendidos` | `(_id_empresa, _fecha_inicio, _fecha_fin) → TABLE(...)` | ✅ MVP |

#### CAJA
| Función | Firma | Notas |
|---------|-------|-------|
| `mostrarcajasabiertasporempresa` | `(_id_empresa) → TABLE(...)` | POSPUESTO |
| `mostrarcajasabiertasporsucursal` | `(_id_sucursal) → TABLE(...)` | POSPUESTO |
| `mostrarcajasasignadas` | `(_id_usuario) → TABLE(...)` | POSPUESTO |
| `mostrarcierrecajaabierta` | `(_id_caja) → TABLE(...)` | POSPUESTO |
| `sumarefectivosinventasmovcierrecaja` | `(_id_cierre_caja) → TABLE(...)` | POSPUESTO |
| `sumarventasmetodopagomovcierrecaja` | `(_id_cierre_caja) → TABLE(...)` | POSPUESTO |
| `mostrarmovimientoscajalive` | `(_id_empresa) → TABLE(...)` | POSPUESTO |
| `obtenertotalescaja` | `(p_id_caja) → TABLE(...)` | POSPUESTO |

#### USUARIOS / ASIGNACIONES
| Función | Firma | Notas |
|---------|-------|-------|
| `mostrarusuariosasignados` | `(_id_empresa) → TABLE(...)` | POSPUESTO |
| `buscarusuariosasignados` | `(_id_empresa, buscador) → TABLE(...)` | POSPUESTO |
| `mostrarsucursalesasignadas` | `(_id_usuario) → TABLE(...)` | POSPUESTO |

#### REPORTES
| Función | Firma | Notas |
|---------|-------|-------|
| `mostrarventasporsucursalfechas` | `(_id_sucursal, _fecha_inicio, _fecha_fin) → SETOF ventas` | POSPUESTO |
| `report_stock_por_almacen_sucursal` | `(sucursal_id, almacen_id) → TABLE(...)` | POSPUESTO |
| `report_stock_bajo_minimo` | `(sucursal_id, almacen_id) → TABLE(...)` | POSPUESTO |
| `sumarventasporempresa` | `(_id_empresa, _fecha_inicio, _fecha_fin) → numeric` | POSPUESTO |

#### CLIENTES / PROVEEDORES
| Función | Firma | Notas |
|---------|-------|-------|
| `insertarclientesproveedores` | `(_nombres, _id_empresa, _direccion, _telefono, _email, _identificador_nacional, _identificador_fiscal, _tipo) → void` | POSPUESTO |
| `editarclientesproveedores` | `(_id, _nombres, _id_empresa, _direccion, _telefono, _email, _identificador_nacional, _identificador_fiscal, _tipo) → void` | POSPUESTO |

#### STOCK
| Función | Firma | Notas |
|---------|-------|-------|
| `incrementarstock` | `(_id integer, cantidad numeric) → void` | POSPUESTO |
| `reducirstock` | `(_id integer, cantidad numeric) → void` | POSPUESTO |

### 2.3. Triggers (Server-side)
| Trigger | Tabla | Función |
|---------|-------|---------|
| `deletedetalleventa` | detalle_venta | `deletedetalleventa()` |
| `devolverstockaleliminardv` | detalle_venta | `devolverstockaleliminardv()` |
| `validarstock` | detalle_venta | `validarstock()` |
| `insertarimpresora` | caja | `insertarimpresora()` |
| `insertarserializaciones` | serializacion_comprobantes | `insertarserializaciones()` |
| `insertarpermisohome` | usuarios | `insertarpermisohome()` |
| `insertpordefecto` | cierrecaja | `insertpordefecto()` |
| `asignarclientegenerico` | ventas | `asignarclientegenerico()` |
| `updateuseinventariosproductos` | stock | `updateuseinventariosproductos()` |
| `insertar_productos` | productos | `insertar_productos()` |

### 2.4. Storage Buckets
| Bucket | Uso |
|--------|-----|
| `imagenes` | Logo empresa, iconos categorías |
| `sucursales` | Datos de sucursales |
| `permisos_dafault` | Permisos por defecto |

### 2.5. Zustand Stores (25 identificados)
| Store | Dominio | Persist |
|-------|---------|---------|
| `useGlobalStore` | UI global (modals, sidebar, theme) | No |
| `useEmpresaStore` | Datos empresa | No |
| `useUsuariosStore` | CRUD usuarios | No |
| `useSucursalesStore` | CRUD sucursales | No |
| `useCajasStore` | CRUD cajas | No |
| `useAlmacenesStore` | CRUD almacenes | No |
| `useCategoriasStore` | CRUD categorías | No |
| `useProductosStore` | CRUD productos + búsqueda | No |
| `useStockStore` | Stock por almacén | No |
| `useMetodosPagoStore` | Métodos de pago | No |
| `useSerializacionStore` | Serialización comprobantes | No |
| `useDetalleVentasStore` | Detalle de venta activa | No |
| `useVentasStore` | Ventas + carrito | **Sí** (persist) |
| `useMovCajaStore` | Movimientos de caja | No |
| `useCierreCajaStore` | Cierre de caja | No |
| `useReportesStore` | Reportes dashboard | No |
| `useDashboardStore` | Fechas dashboard | No |
| `useImpresorasStore` | Config impresoras | No |
| `useClientesProveedoresStore` | Clientes/Proveedores | No |
| `useAsignacionCajaSucursalStore` | Asignaciones usuario-sucursal-caja | No |
| `useRolesStore` | Roles | No |
| `usePermisosStore` | Permisos | No |
| `useMonedasStore` | Config moneda/país | No |
| `useThemeStore` | Tema (light/dark) | No |
| `useMovStockStore` | Movimientos stock (inventario) | No |

---

## 3. Alcance MVP — Login → Shell → Dashboard → Productos → POS

### 3.1. PANTALLAS MVP

#### A. Login
- **Ruta:** `/login`
- **Componentes:** `LoginForm` (email + password), `LogoEmpresa`
- **Stores:** `useEmpresaStore`, `useUsuariosStore`
- **RPCs:** `mostrarempresaxidauth`, `contarproductosporauth`
- **Auth:** `supabase.auth.signInWithPassword()`
- **Flujo:** Login → obtener empresa → redirect `/dashboard`

#### B. Shell / Layout
- **Ruta:** Layout global (sidebar + header)
- **Componentes:** `Sidebar` (menú lateral), `Header` (usuario, empresa), `ToggleTema` (light/dark), `Reloj`, `ContenedorApp`
- **Stores:** `useGlobalStore`, `useThemeStore`, `useEmpresaStore`
- **Sin RPCs propios**

#### C. Dashboard
- **Ruta:** `/dashboard`
- **Componentes:** `ChartVentas` (Recharts AreaChart), `CardVentas` (total + % cambio), `CardCantidadVentas`, `CardGanancias`, `CardProductosTopMonto`, `CardMovimientosCajaLive`, `DatePicker` (rango), `CustomTooltip`
- **Stores:** `useReportesStore`, `useDashboardStore`, `useEmpresaStore`
- **RPCs (8):** `dashboartotalventasconfechas`, `dashboardsumarventasporempresa`, `dashboardsumarventasporempresaperiodoanterior`, `dashboardsumarcantidaddetalleventa`, `dashboardsumargananciadetalleventa`, `dashboardcajasporsucursalyventas`, `dashboartotalventasxmetodopago`, `dashboardtop5productosmasvendidos`

#### D. Config Productos
- **Ruta:** `/configuracion/productos`
- **Componentes:** `ProductosTemplate`, `TablaProductos` (paginación), `RegistrarProductos` (modal), `BuscadorList`
- **Stores:** `useProductosStore`, `useCategoriasStore`, `useEmpresaStore`, `useAlmacenesStore`, `useStockStore`
- **RPCs:** `mostrarproductos`, `insertarproductos`, `editarproductos`, `buscarproductos`

#### E. Config Categorías
- **Ruta:** `/configuracion/categorias`
- **Componentes:** `TablaCategorias`, `RegistrarCategorias` (modal), `ImageSelector`
- **Stores:** `useCategoriasStore`, `useGlobalStore`
- **RPCs:** `insertarcategorias`, `editarcategorias`

#### F. POS (Punto de Venta)
- **Ruta:** `/pos`
- **Componentes:** `HeaderPos`, `AreaDetalleventaPos`, `AreaTecladoPos`, `TotalPos`, `FooterPos`, `BuscadorList`, `PantallaCobro` (overlay), `IngresoCobro` (montos), `TicketVenta` (PDF)
- **Stores (12):** `useVentasStore` (persist), `useDetalleVentasStore`, `useProductosStore`, `useMetodosPagoStore`, `useSerializacionStore`, `useImpresorasStore`, `useClientesProveedoresStore`, `useEmpresaStore`, `useCierreCajaStore`, `useMovCajaStore`, `useSucursalesStore`, `useGlobalStore`
- **RPCs:** `mostrarproductos` (buscador), `insertardetalleventa`, `editarcantidaddv`, `mostrardetalleventa`, `confirmar_venta`, `setdefaultserializacion`
- **Tablas (.from):** `ventas` (insert), `movimientos_caja` (insert)
- **Flujo:** Crear venta → agregar items → cobrar → confirmar → imprimir

### 3.2. TABLAS QUE TOCA EL MVP (16)

`empresa`, `usuarios`, `roles`, `productos`, `categorias`, `ventas`, `detalle_venta`, `metodos_pago`, `serializacion_comprobantes`, `tipo_comprobantes`, `sucursales`, `caja`, `asignacion_sucursal`, `movimientos_caja`, `cierrecaja` + auth.users

### 3.3. RPCs QUE TOCA EL MVP (22)

**Auth (2):** `mostrarempresaxidauth`, `contarproductosporauth`
**Productos (4):** `mostrarproductos`, `buscarproductos`, `insertarproductos`, `editarproductos`
**Categorías (2):** `insertarcategorias`, `editarcategorias`
**Ventas (6):** `insertardetalleventa`, `editarcantidaddv`, `mostrardetalleventa`, `confirmar_venta`, `generar_nro_comprobante` (interna), `setdefaultserializacion`
**Dashboard (8):** `dashboartotalventasconfechas`, `dashboardsumarventasporempresa`, `dashboardsumarventasporempresaperiodoanterior`, `dashboardsumarcantidaddetalleventa`, `dashboardsumargananciadetalleventa`, `dashboardcajasporsucursalyventas`, `dashboartotalventasxmetodopago`, `dashboardtop5productosmasvendidos`

### 3.4. STORES MVP (12)

`useGlobalStore`, `useEmpresaStore`, `useUsuariosStore`, `useThemeStore`, `useProductosStore`, `useCategoriasStore`, `useVentasStore` (persist), `useDetalleVentasStore`, `useMetodosPagoStore`, `useSerializacionStore`, `useReportesStore`, `useDashboardStore`

### 3.5. REFERENCIAS PATRÓN (pos-react-seguridad)
- Estructura atómica: `atomos/`, `moleculas/`, `organismos/`, `templates/`
- POS Design: `organismos/POSDesign/` (AreaDetalleventaPos, AreaTecladoPos, FooterPos, HeaderPos, TotalPos)
- Tablas: `organismos/tablas/` (TablaProductos, TablaCategorias, etc.)
- Formularios: `organismos/formularios/` (RegistrarProductos, RegistrarCategorias, InputText)
- Sidebar: `organismos/sidebar/Sidebar`
- CRUD pattern: store → hook (useQuery/useMutation) → template → tabla + modal

---

## 4. Riesgos / Gaps

### 4.1. Lo que NO se puede reconstruir 1:1

| Gap | Severidad | Descripción |
|-----|-----------|-------------|
| **Lógica de triggers SQL** | ALTA | `validarstock`, `devolverstockaleliminardv` — lógica server-side opaca. MVP: manejar stock solo en POS básico, omitir validación server-side. |
| **confirmar_venta internals** | ALTA | Generación de comprobante + update. Se reconstruye de la firma SQL, pero validar con datos reales. |
| **Permisos / RBAC** | MEDIA | Sistema complejo (modulos → permisos_dafault → permisos). MVP: omitir control de permisos. |
| **Lógica de caja** | MEDIA | Abrir/cerrar turno, movimientos. MVP: asumir caja abierta o flujo mínimo. |
| **Triggers de auto-creación** | BAJA | `insertarimpresora`, `insertarserializaciones`, `insertarpermisohome` — ejecutan server-side, no necesita frontend. |

### 4.2. Lo que CONVIENE reimplementar mejor

| Aspecto | Original | Propuesta |
|---------|----------|-----------|
| Estado del POS | `persist` (localStorage) | `persist` con `partialize` para solo guardar items |
| Búsqueda productos | Múltiples sobrecargas | Una función tipada |
| Tipado | Sin TypeScript | Full TypeScript |
| Error handling | `Swal.fire()` | Sistema de notificaciones (toast) |
| Stores | 22 stores | Consolidar a ~15 |
| Hooks | `useQuery` + store functions | Hooks custom encapsulados |

### 4.3. Datos que sobreviven del bundle

| Dato | Calidad |
|------|---------|
| Nombres de funciones RPC | EXCELENTE |
| Nombres de tablas | EXCELENTE |
| Nombres de stores | BUENA |
| UI copy / textos | ALTA (16k strings) |
| Estructura componentes | MEDIA |
| Lógica de negocio exacta | BAJA |
| Estilos CSS-in-JS | MEDIA |

### 4.4. Dependencias detectadas

React 18, React Router v1.15.1, Zustand (persist), TanStack React Query, React Hook Form, Ant Design, styled-components, Recharts, Supabase (auth + DB + storage), pdfmake, react-icons, dayjs, SweetAlert2, iso-country-currency, TanStack Table
