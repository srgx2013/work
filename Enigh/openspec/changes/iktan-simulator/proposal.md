# IKTAN Simulator — Propuesta de Producto (PRD)

> **Change:** `iktan-simulator`  
> **Phase:** proposal  
> **Status:** draft  
> **Date:** 2025-07-10

---

## 1. Título y Resumen

**IKTAN Simulator** es una aplicación React que replica la experiencia de captura de datos del sistema IKTAN del INEGI para la ENIGH 2024. El simulador permite a aspirantes a capturistas practicar la digitación de los 7 cuestionarios que conforman un folio completo, con validaciones realistas, control de tiempo por sección, y un reporte final del estado del folio.

Es 100% frontend (Vite + React + TypeScript + Zustand), funciona offline con persistencia en localStorage, y presenta toda la interfaz en español tal como aparece en el IKTAN real.

---

## 2. Problema de Negocio / Motivación

### El problema

Los aspirantes a la posición de **Capturista (C)** para la ENIGH deben aprobar un examen de captura donde se evalúa velocidad, precisión y conocimiento del orden y reglas de digitación del sistema IKTAN. Actualmente la preparación es puramente teórica: estudian los manuales del INEGI pero **no tienen dónde practicar la digitación real** antes del examen.

### La oportunidad

Un simulador que replique fielmente:

- El **orden obligatorio** de los 7 cuestionarios (Portada → Hogares → Menores 12 → 12+ → Negocios → Gastos Hogar → Gastos Diarios)
- Las **validaciones** que haría el IKTAN real (tipos de datos, rangos, consistencia cruzada)
- La **presión del tiempo** (cada cuestionario se cronometra)
- La interfaz **en español** con la terminología exacta del INEGI

Esto convierte estudio pasivo en práctica activa y medible.

---

## 3. Usuarios Objetivo

| Perfil | Contexto |
|--------|----------|
| **Aspirante a Capturista** | Persona que se prepara para el examen de selección del INEGI. Conoce la teoría (manuales, estructura de la ENIGH) pero necesita práctica de digitación. |
| **Estudiante de la ENIGH** | Alguien que ya estudió la guía teórica (Stage 1) y ahora enfrenta el examen práctico de captura. |
| **Instructor/Capacitador** | Podría usar el simulador para demostrar el flujo de captura durante cursos (caso de uso secundario, no prioritario para v1). |

---

## 4. Funcionalidades (Features)

### 4.1 Los 7 Cuestionarios

El orden de captura es **obligatorio e inmutable**, igual que en el IKTAN real:

| # | Cuestionario | Descripción | Campos principales |
|---|-------------|-------------|-------------------|
| **1** | **Portada (ENIGH-1)** | Control por folio | ENTIDAD, FOLIOVIV (10 dígitos), FOLIOHOG (1 dígito), DECENA (1-10), Entrevistador, Supervisor, Resultado de entrevista (A1-A7), Fecha inicio/término, Observaciones |
| **2** | **Hogares y Vivienda** | Características de la vivienda + residentes + ingresos + alimentación + cambio climático | Clase de vivienda, Materiales (paredes/techos/pisos), Antigüedad, Cocina, Dormitorios, Agua/Drenaje/Electricidad, Combustible, Basura, Bienes; **Lista de integrantes** (NUMPER, Nombre, Parentesco, Sexo, Edad, Fecha nac., Estado civil, Alfabetismo, Escolaridad, Asistencia escolar); Ingresos por integrante; Acceso a la alimentación (6 preguntas); Cambio climático (5 eventos) |
| **3** | **Menores de 12 años** | Uno por cada integrante < 12 años | FOLIOVIV, FOLIOHOG, NUMPER, Nombre, Edad, Sexo; Salud (derechohabiencia, problema 2 sem., vacunación); Educación (asiste, grado, tipo escuela, beca); Cuidado (quién la cuida) |
| **4** | **Personas de 12+ años** | Uno por cada integrante ≥ 12 años | FOLIOVIV, FOLIOHOG, NUMPER; Generales (nombre, edad, sexo, parentesco); Educación (nivel, asistencia, alfabetismo); Salud (derechohabiencia, problema, fuma, alcohol); Actividad económica (trabajó, ocupación, tipo, horas, ingreso mensual, prestaciones, otro trabajo); Ingresos no laborales (jubilación, remesas, programa gobierno, ayuda); Gastos personales (transporte, comidas, cuidado personal) |
| **5** | **Negocios del Hogar** | Actividad económica independiente del hogar | ¿Tiene negocio? (Sí/No); Si Sí: NUMPER operador, Tipo de negocio, ¿Es actividad principal?, ¿Tiene local?, ¿Lleva contabilidad?, ¿Alta en Hacienda?, Ingreso mensual, Gastos mensuales |
| **6** | **Gastos del Hogar** | Gasto trimestral por rubros | 8 secciones: Alimentos/bebidas/tabaco (13 subrubros), Transporte y comunicaciones (5), Vivienda y servicios (6), Educación y esparcimiento (4), Salud (3), Vestido y calzado (2), Cuidados personales (3), Enseres domésticos (3) |
| **7** | **Cuadernillo de Gastos Diarios** | Gasto diario por 7 días + estimación mensual | 7 días (Lunes a Domingo) con items concepto+monto; Estimación mensual (tortillería, carnicería, verdulería, abarrotes, transporte, gasolina); Campo de informante (NUMPER) |

### 4.2 Navegación Tipo Wizard (Asistente Paso a Paso)

- **Barra de progreso visible** mostrando los 7 pasos, con el paso actual resaltado y los completados marcados.
- El usuario avanza y retrocede con botones **"Siguiente"** y **"Anterior"**.
- Cada paso debe pasar validación antes de permitir avanzar. Si hay errores, el wizard muestra los mensajes y no deja continuar hasta corregirlos.
- El usuario puede volver a pasos anteriores (los datos persisten).
- Desde cualquier paso se puede ver el estado general del folio.

### 4.3 Inicio en Blanco (Sin Datos Precargados)

- El simulador arranca con **todos los campos vacíos**, exactamente como en el IKTAN real cuando se abre un folio nuevo.
- No existe botón de "cargar datos demo". La práctica consiste en transcribir desde un folio físico o desde `practica-captura.md`.
- Este es un requisito deliberado: en el examen de captura no hay datos precargados.

### 4.4 Validaciones

#### Validaciones por campo (en tiempo real / on blur)

| Regla | Aplica a |
|-------|----------|
| Campos requeridos no vacíos | Todos los campos obligatorios |
| `FOLIOVIV` exactamente 10 dígitos numéricos | Portada, Hogares, Menores 12, 12+, Negocios, Gastos Hogar, Gastos Diarios |
| `FOLIOHOG` 1 dígito (1-5) | Todos los cuestionarios |
| `DECENA` 1-10 | Portada |
| `ENTIDAD` 2 dígitos (01-32) | Portada |
| `EDAD` numérica, entera, > 0 | Hogares (integrantes), Menores 12, 12+ |
| `FECHA` formato DD/MM/AAAA, fecha válida | Portada, Hogares (fecha nacimiento) |
| Montos numéricos, sin `$`, sin comas, con punto decimal opcional | Ingresos, Gastos Hogar, Gastos Diarios, Negocios |
| Opciones de lista cerrada (select/radio) sin valores inválidos | Clase de vivienda, Materiales, Parentesco, Sexo, Estado civil, etc. |
| Resultado de entrevista A1-A7 | Portada |

#### Validaciones entre secciones (cross-section)

| Regla | Secciones involucradas |
|-------|----------------------|
| `FOLIOVIV` idéntico en los 7 cuestionarios | Todos |
| `FOLIOHOG` idéntico en los 7 cuestionarios | Todos |
| `NUMPER` de cada integrante es único dentro del hogar | Hogares y Vivienda |
| Cada `NUMPER` referenciado en Menores 12 / 12+ / Negocios existe en la lista de integrantes de Hogares y Vivienda | Hogares ↔ Menores 12 / 12+ / Negocios |
| Edad de cada `NUMPER` consistente con el cuestionario asignado: si edad < 12 → debe estar en Menores de 12; si edad ≥ 12 → debe estar en 12+ | Hogares ↔ Menores 12 / 12+ |
| Fecha de nacimiento coherente con la edad declarada (±1 año de tolerancia) | Hogares y Vivienda (por integrante) |
| Total de integrantes en Hogares = cantidad de cuestionarios de personas (Menores 12 + 12+) | Hogares ↔ Menores 12 + 12+ |
| Si Negocios dice "Sí", debe haber al menos un negocio registrado con datos completos | Negocios |
| Los totales de gastos diarios no deberían exceder dramáticamente los gastos trimestrales del hogar (advertencia, no bloqueo) | Gastos Diarios ↔ Gastos Hogar |
| Nombre del informante del Cuadernillo de Gastos Diarios (NUMPER) debe ser un integrante registrado | Hogares ↔ Gastos Diarios |

### 4.5 Temporizador por Cuestionario

- Cada cuestionario tiene un **cronómetro individual** que corre mientras el usuario está en ese paso.
- Al avanzar al siguiente cuestionario, el tiempo del anterior se congela.
- Si el usuario vuelve a un cuestionario anterior, el cronómetro **reanuda** desde donde estaba (no se reinicia).
- En el paso final (reporte) se muestran:
  - Tiempo por cuestionario
  - Tiempo total del folio

### 4.6 Reporte Final (Paso 8 post-captura)

Al completar los 7 cuestionarios, se presenta una vista de resumen con:

- **Estado del folio**: CONCLUIDO / INCOMPLETO (según validaciones cross-section)
- **Datos generales**: FOLIOVIV, FOLIOHOG, Entidad, Entrevistador, Fechas
- **Residentes**: tabla con todos los integrantes y sus datos
- **Totales**: Ingresos totales del hogar, Gastos trimestrales totales, Gasto diario total estimado
- **Tiempos**: tabla de tiempos por cuestionario y tiempo total
- **Alertas**: warnings de consistencia que no bloquearon pero ameritan revisión
- **Botón "Reiniciar"**: limpia todo y vuelve a empezar

### 4.7 Persistencia en localStorage

- El estado completo del folio (store Zustand) se persiste automáticamente en `localStorage`.
- Si el usuario cierra el navegador o recarga la página, **recupera exactamente donde estaba** (cuestionario, paso, datos ingresados, tiempos).
- El botón "Reiniciar" limpia localStorage y el store.
- No hay backend, no hay cuentas de usuario, no hay envío de datos.

---

## 5. Fuera de Alcance (Non-Goals)

| Lo que NO construimos | Por qué |
|------------------------|---------|
| Backend / API / base de datos | Es 100% frontend por requisito del usuario |
| Autenticación / cuentas de usuario | No aplica, es una herramienta de práctica individual |
| Carga de datos desde archivos externos (JSON, CSV) | La práctica es transcribir manualmente |
| Modo "llenado automático" o demo data | El usuario explícitamente dijo NO |
| Comparación automática con un folio "correcto" | v1 no incluye corrección automática; el usuario compara manualmente |
| Exportación a PDF/CSV | Podría ser v2, pero no ahora |
| Múltiples folios simultáneos | Un folio a la vez como en el examen |
| Modo colaborativo / multiusuario | Offline, single-user |
| Prettier de código ni ESLint config | Se configuran después, no son parte del PRD |
| i18n / multi-idioma | Solo español |
| Tests end-to-end (Playwright/Cypress) | Vitest + Testing Library es suficiente para v1; E2E sería v2 |

---

## 6. Enfoque Técnico

### Stack

| Capa | Tecnología |
|------|-----------|
| Bundler | Vite 5+ |
| UI | React 18+ |
| Lenguaje | TypeScript (estricto) |
| Estado global | Zustand |
| Persistencia | Zustand middleware `persist` con `localStorage` |
| Routing | No necesario (wizard single-page) — o React Router si se prefiere URL por paso |
| Estilos | CSS Modules o Tailwind CSS (a decidir en design) |
| Tests | Vitest + @testing-library/react |
| Validación | Zod (schemas tipados) |
| Formularios | React Hook Form (manejo de estado de formulario, errores) |

### Arquitectura

Se sigue **Clean Architecture (Screaming)** con **Container-Presentational pattern**:

```
src/
  domain/           # Tipos, constantes, reglas de validación (puros, sin React)
    models/         # Tipos TypeScript para cada cuestionario
    constants/      # Catálogos (entidades, clases de vivienda, etc.)
    validation/     # Schemas Zod, reglas cross-section
  application/      # Lógica de aplicación (sin React)
    store/          # Slices de Zustand
    use-cases/      # Flujos: iniciar folio, validar sección, completar captura
  infrastructure/   # Adaptadores
    persistence/    # localStorage adapter
  ui/               # Presentación
    components/     # Componentes reutilizables (Wizard, ProgressBar, Timer, Field, etc.)
    pages/          # Pantallas (cada cuestionario es una "page" o "step")
    layouts/        # Layout del wizard
```

### Convenciones

- **UI en español**: labels, placeholders, mensajes de error, nombres de botones
- **Código en inglés**: nombres de funciones, variables, tipos, archivos
- **Dominio en español**: los nombres de cuestionarios, catálogos (ENTIDAD, FOLIOVIV, NUMPER, etc.) se mantienen como en el INEGI
- **Conventional commits**
- **Strict TDD**: tests antes de implementación

---

## 7. Estructura de UI (Component Tree Tentativo)

```
<App>
  <WizardLayout>
    <ProgressBar steps={7} currentStep={n} />
    <TimerDisplay questionnaireId={n} />

    <StepRouter>   // renderiza el step actual
      <PortadaStep />
      <HogaresViviendaStep />
      <Menores12Step />
      <Personas12PlusStep />
      <NegociosStep />
      <GastosHogarStep />
      <GastosDiariosStep />
      <ReporteFinalStep />   // step 8 post-captura
    </StepRouter>

    <WizardNavigation>
      <BackButton />
      <NextButton />
    </WizardNavigation>

    <ValidationSummary errors={currentErrors} />
  </WizardLayout>
</App>
```

### Campos compartidos (repetidos en todos los cuestionarios)

- `FOLIOVIV`
- `FOLIOHOG`

Estos se capturan una vez en Portada y se propagan automáticamente a los demás cuestionarios (el IKTAN real también los replica; el simulador puede pre-llenarlos para reducir fricción, pero el usuario DEBE poder verificarlos y el sistema debe validar que coincidan).

### Cuestionarios dinámicos

- **Menores de 12** y **Personas de 12+**: la cantidad de sub-formularios depende de cuántos integrantes hay en cada grupo. El usuario primero registra los integrantes en Hogares y Vivienda; luego el wizard genera automáticamente un sub-paso por cada menor de 12 y uno por cada persona de 12+.
- **Negocios**: si en Hogares nadie declara negocio, el wizard puede saltar este paso (o mostrar "No aplica — pase al siguiente").

---

## 8. Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|-------------|------------|
| **Complejidad de validaciones cross-section** — las reglas entre cuestionarios pueden ser muchas y entrelazadas | Alto | Alta | Usar Zod con refinements cross-section. Testear cada regla aisladamente. No incluir reglas "nice-to-have" en v1. |
| **Over-engineering inicial** — querer hacer una réplica exacta del IKTAN real | Medio | Media | Mantener el alcance en los 7 cuestionarios con los campos del folio mock. No modelar todos los catálogos del INEGI, solo los que aparecen en `practica-captura.md`. |
| **Performance con localStorage grande** — el estado de 7 cuestionarios puede ser pesado | Bajo | Baja | Zustand con persist selectiva (solo datos, no UI state). El folio de práctica cabe holgadamente en localStorage (estimado < 100KB). |
| **Estado del wizard complejo** — dinámico (sub-pasos variables según integrantes) | Medio | Media | Diseñar el store con arrays de integrantes, no con campos fijos. El wizard deriva los sub-pasos del array. |
| **Falta de diseño visual** — sin mockups previos | Medio | Alta | Usar un design system sencillo (CSS Modules con variables). Priorizar funcionalidad sobre estética en v1. |
| **localStorage no disponible** (modo incógnito, storage lleno) | Bajo | Baja | Detectar disponibilidad al iniciar y mostrar advertencia. La app funciona sin persistencia pero pierde datos al cerrar. |

---

## 9. Éxito (Criterios de Aceptación)

1. Un usuario puede completar los 7 cuestionarios en orden exactamente como en el IKTAN real.
2. Las validaciones bloquean el avance si hay errores (campos requeridos, tipos incorrectos).
3. El temporizador registra tiempos por cuestionario y tiempo total.
4. Al recargar la página, el estado se recupera exactamente donde estaba.
5. El reporte final muestra todos los datos capturados, totales, tiempos y estado del folio.
6. La app corre completamente offline, sin llamadas a red.
7. Todas las etiquetas, mensajes y navegación están en español.
8. El código tiene ≥80% de cobertura de tests.

---

## Apéndice A: Catálogos (Listas Cerradas)

### A1. Entidades Federativas (ENTIDAD)

| Código | Entidad |
|--------|---------|
| 01 | Aguascalientes |
| 02 | Baja California |
| 03 | Baja California Sur |
| 04 | Campeche |
| 05 | Coahuila |
| 06 | Colima |
| 07 | Chiapas |
| 08 | Chihuahua |
| 09 | Ciudad de México |
| 10 | Durango |
| 11 | Guanajuato |
| 12 | Guerrero |
| 13 | Hidalgo |
| 14 | Jalisco |
| 15 | México |
| 16 | Michoacán |
| 17 | Morelos |
| 18 | Nayarit |
| 19 | Nuevo León |
| 20 | Oaxaca |
| 21 | Puebla |
| 22 | Querétaro |
| 23 | Quintana Roo |
| 24 | San Luis Potosí |
| 25 | Sinaloa |
| 26 | Sonora |
| 27 | Tabasco |
| 28 | Tamaulipas |
| 29 | Tlaxcala |
| 30 | Veracruz |
| 31 | Yucatán |
| 32 | Zacatecas |

### A2. Resultados de Entrevista

| Código | Descripción |
|--------|-------------|
| A1 | Entrevista completa |
| A2 | Entrevista incompleta |
| A3 | Nadie en el hogar |
| A4 | Ausencia temporal |
| A5 | Negativa |
| A6 | Vivienda desocupada |
| A7 | Otra situación |

### A3. Parentescos

1. Jefe(a) del hogar
2. Esposa(o) o compañera(o)
3. Hijo(a)
4. Nieto(a)
5. Yerno/Nuera
6. Padre/Madre/Suegro(a)
7. Hermano(a)/Cuñado(a)
8. Otro parentesco
9. Sin parentesco

### A4. Clases de Vivienda

1. Casa única en el terreno
2. Casa que comparte terreno con otra(s)
3. Casa dúplex
4. Departamento en edificio
5. Vivienda en vecindad o cuartería
6. Cuarto de azotea
7. Local no construido para habitación

### A5. Materiales (Paredes)

- Desecho
- Lámina de cartón
- Lámina de asbesto o metálica
- Carrizo, bambú o palma
- Embarro o bajareque
- Madera
- Adobe
- Tabique, ladrillo, block, piedra, cemento

### A6. Materiales (Techos)

- Desecho
- Lámina de cartón
- Lámina metálica
- Lámina de asbesto
- Fibrocemento
- Palma o paja
- Madera o tejamanil
- Terrado con viguería
- Teja
- Losa de concreto o viguetas con bovedilla

### A7. Materiales (Pisos)

- Tierra
- Cemento o firme
- Madera, mosaico u otro recubrimiento

### A8. Origen del Agua (si entubada)

- Servicio público
- Pozo comunitario
- Pozo particular
- Pipa
- Otra vivienda
- Lluvia

### A9. Drenaje

- Red pública
- Fosa séptica o biodigestor
- Barranca o grieta
- Río, lago o mar
- Sin drenaje

### A10. Eliminación de Basura

- La dan a un camión de basura
- La llevan a basurero público
- La dejan en contenedor
- La queman
- La entierran
- La tiran en terreno baldío
- La tiran en barranca o río

### A11. Combustible para Cocinar

- Leña
- Carbón
- Gas de tanque
- Gas natural

### A12. Bienes y Equipamiento

- Radio
- TV digital
- Refrigerador
- Lavadora
- Computadora
- Línea telefónica fija
- Internet
- Teléfono celular
- TV de paga
- Automóvil
- Motocicleta
- Bicicleta

### A13. Niveles de Escolaridad

- Ninguno
- Preescolar
- Primaria incompleta
- Primaria completa
- Secundaria incompleta
- Secundaria completa
- Preparatoria incompleta
- Preparatoria completa
- Licenciatura incompleta
- Licenciatura completa
- Posgrado

### A14. Estado Civil

- Soltero(a)
- Casado(a)
- Unión libre
- Separado(a)
- Divorciado(a)
- Viudo(a)

### A15. Tipo de Trabajo

- Empleado u obrero
- Patrón o empleador
- Trabajador por cuenta propia
- Trabajador sin pago (familiar)

### A16. Instituciones de Salud

- IMSS
- ISSSTE
- ISSSTE Estatal
- PEMEX / Defensa / Marina
- IMSS-BIENESTAR
- INSABI / Centro de Salud
- Seguro privado
- Otra institución

### A17. Tipos de Escuela

- Pública
- Privada

### A18. ¿Quién cuida al menor?

- La madre
- El padre
- Otro familiar
- Guardería o estancia infantil

---

## Apéndice B: Reglas de Consistencia Detalladas

### B1. FOLIOVIV

- Formato: 10 dígitos numéricos.
- Primeros 7 dígitos: UPM.
- Dígito 8: Decena (1-9, 0 = decena 10).
- Dígitos 9-10: Consecutivo en la UPM.
- Debe ser **idéntico** en los 7 cuestionarios.

### B2. FOLIOHOG

- 1 dígito (1-5).
- Debe ser **idéntico** en los 7 cuestionarios.

### B3. NUMPER

- 2 dígitos (01-99).
- Único por integrante dentro del hogar.
- 01 = Jefe(a) del hogar (convención).
- Debe existir en la lista de Hogares y Vivienda para ser referenciado en Menores 12, 12+, Negocios o Gastos Diarios.

### B4. Edad vs Fecha de Nacimiento

- La edad calculada a partir de la fecha de nacimiento (contra la fecha de inicio de entrevista en Portada) debe coincidir con la edad declarada, con tolerancia de ±1 año.
- Si hay discrepancia > 1 año → error de validación.

### B5. Asignación de Cuestionario según Edad

- Edad < 12 → debe aparecer en lista de "Menores de 12 años".
- Edad ≥ 12 → debe aparecer en lista de "Personas de 12 o más años".
- La cantidad total de cuestionarios de persona (Menores 12 + 12+) debe ser igual al total de integrantes en Hogares y Vivienda.

### B6. Negocios

- Si la pregunta "¿Algún integrante tiene un negocio?" es "Sí", debe existir al menos un registro de negocio con `NUMPER` válido, tipo de negocio, ingreso y gasto.
- Si es "No", no debería haber registros de negocio (se salta el cuestionario).

### B7. Gastos Diarios — Informante

- El `NUMPER` del informante del Cuadernillo debe existir en la lista de integrantes.
- Advertencia si el ingreso mensual del hogar no es suficiente para cubrir la suma de gastos (no bloquea).

---

## Apéndice C: Fases Futuras (Ideas para v2+)

- **Modo comparación**: cargar un folio "gabarito" y que el sistema compare automáticamente con lo capturado, mostrando diferencias campo por campo.
- **Múltiples folios**: biblioteca de folios de práctica con diferentes estructuras familiares.
- **Exportación**: generar PDF/CSV del reporte final.
- **Modo examen**: tiempo límite total, sin posibilidad de pausa, puntuación automática.
- **Dashboard de progreso**: historial de folios completados, tiempo promedio, errores comunes.
