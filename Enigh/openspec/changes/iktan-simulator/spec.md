# IKTAN Simulator — Specification

> **Change:** `iktan-simulator`  
> **Phase:** spec  
> **Status:** approved  
> **Date:** 2025-07-10  
> **Project:** ENIGH IKTAN Simulator  
> **Artifact Store:** engram + openspec  

---

## Purpose

This specification defines WHAT must be true after the IKTAN Simulator is implemented. It covers the data model, validation rules, wizard behavior, timer behavior, and report structure for all 7 ENIGH questionnaires plus the final report step.

### 🔢 Answer Coding System

**Todas las preguntas con respuesta cerrada se capturan mediante código numérico.** El usuario escribe el número correspondiente a la respuesta en un input de texto/número. No hay radio buttons, selects ni checkboxes visibles — como en el IKTAN real.

Ejemplo:
```
Clase de vivienda (1-7): [ 2 ]
  Donde: 1=Casa única, 2=Comparte terreno, 3=Dúplex, 4=Depto, 5=Vecindad, 6=Azotea, 7=Local no habitacional
```

**Excepciones:**
- `folioViv`, `folioHog` → input de texto (validación de dígitos)
- `nombreEntrevistador`, `nombreSupervisor`, `nombre` (integrante), `ocupacionPrincipal`, `observaciones` → input de texto libre
- `fechaInicio`, `fechaTermino`, `fechaNacimiento` → input de fecha
- `resultadoEntrevista` → input de texto (formato A1-A7)
- `bienes[]` → input de texto donde se escriben los códigos separados por coma (ej: "1,2,4,7")

**Validación:** el sistema valida que el código ingresado exista en el catálogo correspondiente y muestra mensaje de error con el rango válido.

---

### 👁️ Modo Ayuda (Catálogo visible)

Debajo de cada input numérico hay un botón "📖 Códigos" (o un ícono de ojo) que al presionarlo muestra la tabla de códigos disponibles para esa pregunta. El catálogo se oculta por defecto para simular el IKTAN real, pero el usuario puede consultarlo cuando lo necesite.

---

## 1. Global Types and Shared Infrastructure

### 1.1 Shared Fields (Repeated in Every Questionnaire)

| Field | Type | Format | Required | Notes |
|-------|------|--------|----------|-------|
| `folioViv` | `string` | Exactly 10 numeric digits | Yes | Propagated from Portada |
| `folioHog` | `string` | Exactly 1 digit, range 1–5 | Yes | Propagated from Portada |

### 1.2 TypeScript Shared Interfaces

```typescript
// src/domain/models/shared.ts

export interface SharedFolioFields {
  folioViv: string;  // 10 digits
  folioHog: string;  // 1 digit (1-5)
}

export type YesNo = '1' | '2'; // 1=Sí, 2=No
export type YesNoUnk = '1' | '2' | '9'; // 9=No sabe

// Catalog code types
export type EntidadCode = '01' | '02' | ... | '32'; // 32 states
export type DecenaCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'; // 0=decena 10
export type ResultadoEntrevista = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7';
export type ParentescoCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type SexoCode = '1' | '2'; // 1=Hombre, 2=Mujer
export type EstadoCivilCode = '1' | '2' | '3' | '4' | '5' | '6';
export type EscolaridadCode = '00' | '01' | ... | '16'; // See catalog A13
export type TipoTrabajoCode = '1' | '2' | '3' | '4';
export type DerechohabienciaCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type TipoEscuelaCode = '1' | '2';
export type QuienCuidaCode = '1' | '2' | '3' | '4';
export type ClaseViviendaCode = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type MaterialCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type MaterialPisoCode = '1' | '2' | '3';
export type OrigenAguaCode = '1' | '2' | '3' | '4' | '5' | '6';
export type DrenajeCode = '1' | '2' | '3' | '4' | '5';
export type CombustibleCode = '1' | '2' | '3' | '4';
export type BasuraCode = '1' | '2' | '3' | '4' | '5' | '6' | '7';
```

---

## 2. Questionnaire 1: Portada (ENIGH-1)

### 2.1 Fields Specification

| Field | Type | Format | Required | Valid Values | UI Element | Source |
|-------|------|--------|----------|--------------|------------|--------|
| `entidad` | `string` | 2 digits | Yes | `01`–`32` | Number input | Manual entry |
| `folioViv` | `string` | 10 digits | Yes | Numeric only | Text input (max 10) | Manual entry |
| `folioHog` | `string` | 1 digit | Yes | `1`–`5` | Text input (max 1) | Manual entry |
| `decena` | `string` | 1 digit | Yes | `1`–`9`, `0` (means 10) | Number input | Manual entry |
| `nombreEntrevistador` | `string` | Free text | Yes | Any text | Text input | Manual entry |
| `nombreSupervisor` | `string` | Free text | Yes | Any text | Text input | Manual entry |
| `resultadoEntrevista` | `string` | Code | Yes | `A1`–`A7` | Text input (code) | Manual entry |
| `fechaInicio` | `string` | DD/MM/AAAA | Yes | Valid date | Date input (3 campos: DD, MM, AAAA) | Manual entry |
| `fechaTermino` | `string` | DD/MM/AAAA | Yes | Valid date ≥ fechaInicio | Date input (3 campos: DD, MM, AAAA) | Manual entry |
| `observaciones` | `string` | Free text | No | Any text | Textarea | Manual entry |

### 2.2 Validation Rules

| Rule ID | Field | Rule | Error Message (Spanish) |
|---------|-------|------|------------------------|
| P-001 | `folioViv` | Exactly 10 numeric digits | "FOLIOVIV debe contener exactamente 10 dígitos numéricos" |
| P-002 | `folioViv` | First 7 digits = UPM (any 7 digits) | — |
| P-003 | `folioViv` | Digit 8 = decena (1-9, 0=10) | "El dígito 8 de FOLIOVIV debe corresponder a la decena" |
| P-004 | `folioViv` | Digits 9-10 = consecutive within UPM | — |
| P-005 | `folioHog` | 1 digit, range `1`–`5` | "FOLIOHOG debe ser un dígito del 1 al 5" |
| P-006 | `decena` | 1 digit, range `1`–`9`, `0` | "DECENA debe ser un dígito del 1 al 9, o 0 para decena 10" |
| P-007 | `entidad` | 2 digits, `01`–`32` | "ENTIDAD debe ser un código de 2 dígitos (01–32)" |
| P-008 | `nombreEntrevistador` | Not empty if resultado ≠ A3, A6 | "El nombre del entrevistador es obligatorio" |
| P-009 | `nombreSupervisor` | Not empty | "El nombre del supervisor es obligatorio" |
| P-010 | `resultadoEntrevista` | Must be one of A1–A7 | "Seleccione un resultado de entrevista válido" |
| P-011 | `fechaInicio` | Valid DD/MM/AAAA, ≤ today | "Fecha de inicio inválida" |
| P-012 | `fechaTermino` | Valid DD/MM/AAAA, ≥ fechaInicio | "Fecha de término debe ser igual o posterior a fecha de inicio" |
| P-013 | `fechaTermino` | If resultado = A1, fechaTermino must exist | "Fecha de término es obligatoria para entrevista completa" |

### 2.3 Data Model

```typescript
// src/domain/models/portada.ts

import { SharedFolioFields, EntidadCode, DecenaCode, ResultadoEntrevista } from './shared';

export interface PortadaData extends SharedFolioFields {
  entidad: EntidadCode;
  decena: DecenaCode;
  nombreEntrevistador: string;
  nombreSupervisor: string;
  resultadoEntrevista: ResultadoEntrevista;
  fechaInicio: string; // DD/MM/AAAA
  fechaTermino: string; // DD/MM/AAAA
  observaciones: string;
}
```

### 2.4 Dynamic Behavior

- When `resultadoEntrevista` is `A3` (Nadie en el hogar) or `A6` (Vivienda desocupada), the wizard MAY skip directly to the Report step showing the folio as partial.
- The fecha de nacimiento de los integrantes (used later for age validation) is compared against `fechaInicio` (not today's date).

---

## 3. Questionnaire 2: Hogares y Vivienda

### 3.1 Fields Specification

#### Section I — Características de la Vivienda

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `claseVivienda` | `string` | Code | Yes | `1`–`7` | Number input |
| `materialParedes` | `string` | Code | Yes | `1`–`9` | Number input |
| `materialTecho` | `string` | Code | Yes | `1`–`10` | Number input |
| `materialPiso` | `string` | Code | Yes | `1`–`3` | Number input |
| `antiguedadVivienda` | `number` | Integer | No | `0`–`999` | Number input |
| `tieneCuartoCocina` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `duermenEnCocina` | `YesNo` | `1`/`2` | Conditional | — | Number input |
| `numeroDormitorios` | `number` | Integer | Yes | `0`–`20` | Number input |
| `numeroCuartos` | `number` | Integer | Yes | `1`–`30` | Number input |
| `aguaTipo` | `string` | Code | Yes | `1`=`Entubada dentro`, `2`=`Entubada fuera`, `3`=`No entubada` | Number input |
| `aguaOrigen` | `string` | Code | Conditional | `1`–`6` | Number input (if aguaTipo = 1 or 2) |
| `drenaje` | `string` | Code | Yes | `1`–`5` | Number input |
| `tieneElectricidad` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `numeroFocos` | `number` | Integer | Conditional | `1`–`99` | Number input (if tieneElectricidad = 1) |
| `focosAhorradores` | `number` | Integer | Conditional | `0`–`numeroFocos` | Number input (if tieneElectricidad = 1) |
| `combustibleCocina` | `string` | Code | Yes | `1`–`4` | Number input |
| `eliminaBasura` | `string` | Code | Yes | `1`–`7` | Number input |
| `bienes[]` | `string[]` | Codes | No | Multiple from catalog A12 | Text input (códigos separados por coma) |

#### Section II — Residentes (Dynamic List)

For each INTEGRANTE (starting with 01 = Jefe):

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `numPer` | `string` | 2 digits | Auto | `01`–`99` | Auto-generated, read-only |
| `nombre` | `string` | Free text | Yes | Any text | Text input |
| `parentesco` | `ParentescoCode` | Code | Yes | `1`–`9` | Number input |
| `sexo` | `SexoCode` | Code | Yes | `1`/`2` | Number input |
| `edad` | `number` | Integer | Yes | `0`–`120` | Number input |
| `fechaNacimiento` | `string` | DD/MM/AAAA | Yes | Valid date | Date input (3 campos: DD, MM, AAAA) |
| `estadoCivil` | `EstadoCivilCode` | Code | Yes | `1`–`6` | Number input |
| `sabeLeerEscribir` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `nivelEscolaridad` | `EscolaridadCode` | Code | Yes | `00`–`16` | Number input |
| `asisteEscuela` | `YesNo` | `1`/`2` | Yes | — | Number input |

#### Section III — Ingresos por Integrante (per household member)

| Field | Type | Format | Required | Valid Values | Conditional On |
|-------|------|--------|----------|--------------|----------------|
| `trabajoSemanaPasada` | `YesNo` | `1`/`2` | Conditional | — | Number input |
| `ocupacionPrincipal` | `string` | Free text | Conditional | — | Text input (trabajoSemanaPasada = 1) |
| `tipoTrabajo` | `TipoTrabajoCode` | Code | Conditional | `1`–`4` | Number input (trabajoSemanaPasada = 1) |
| `horasTrabajadas` | `number` | Integer | Conditional | `1`–`168` | Number input (trabajoSemanaPasada = 1) |
| `ingresoMensualTrabajo` | `number` | Decimal | Conditional | ≥ 0 | Number input (trabajoSemanaPasada = 1) |
| `tieneOtroTrabajo` | `YesNo` | `1`/`2` | Conditional | — | Number input (trabajoSemanaPasada = 1) |
| `recibeJubilacion` | `YesNo` | `1`/`2` | No | — | Number input |
| `recibeProgGobierno` | `YesNo` | `1`/`2` | No | — | Number input |
| `progGobiernoNombre` | `string` | Free text | Conditional | — | Text input (recibeProgGobierno = 1) |
| `progGobiernoMonto` | `number` | Decimal | Conditional | ≥ 0 | Number input (recibeProgGobierno = 1) |
| `progGobiernoPeriodicidad` | `string` | Code | Conditional | `1`=`semanal`, `2`=`quincenal`, `3`=`mensual`, `4`=`bimestral` | Number input (recibeProgGobierno = 1) |

#### Section IV — Acceso a la Alimentación

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `alimentosPocaVariedad` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `alimentosDejoComida` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `alimentosComioMenos` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `alimentosSinComida` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `alimentosSintioHambre` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `alimentosUnaVez` | `YesNo` | `1`/`2` | Yes | — | Number input |

#### Section VII — Cambio Climático

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `climaSequia` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `climaInundacion` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `climaHelada` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `climaIncendio` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `climaHuracan` | `YesNo` | `1`/`2` | Yes | — | Number input |

### 3.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| HV-001 | `numeroCuartos` | ≥ `numeroDormitorios` | "El número de cuartos no puede ser menor al de dormitorios" |
| HV-002 | `numeroDormitorios` | ≥ `1` if household has members | "Debe haber al menos 1 dormitorio para un hogar con integrantes" |
| HV-003 | `focosAhorradores` | ≤ `numeroFocos` | "Los focos ahorradores no pueden exceder el total de focos" |
| HV-004 | `numPer` (each) | Unique within household | "El NUMPER debe ser único dentro del hogar" |
| HV-005 | `numPer` (Jefe) | Must be `01` | "El integrante 01 debe ser el/la Jefe(a) del hogar" |
| HV-006 | `fechaNacimiento` (each) | Valid date format DD/MM/AAAA | "Fecha de nacimiento inválida (formato: DD/MM/AAAA)" |
| HV-007 | `fechaNacimiento` (each) | Calculated age ±1 year of declared `edad` | "La edad declarada no corresponde a la fecha de nacimiento (±1 año de tolerancia)" |
| HV-008 | `edad` (each) | Integer, ≥ 0, ≤ 120 | "Edad debe ser un número entre 0 y 120" |
| HV-009 | `ingresoMensualTrabajo` | ≥ 0, max 9999999.99 | "Ingreso mensual debe ser un valor numérico ≥ 0" |
| HV-010 | `ingresoMensualTrabajo` | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas (ej: 18500.00)" |
| HV-011 | At least one integrante | — | "Debe capturar al menos un integrante del hogar (el/la jefe/a)" |

### 3.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-001 | `folioViv` must be identical to value in Portada | Hogares ↔ Portada |
| CS-002 | `folioHog` must be identical to value in Portada | Hogares ↔ Portada |
| CS-003 | First integrante's `numPer` = `01` and `parentesco` = `1` (Jefe) | Hogares (internal) |
| CS-004 | Total count of integrantes in Hogares drives the number of Menores 12 and 12+ sub-steps | Hogares → Menores 12 / 12+ |
| CS-005 | Any `numPer` referenced in Menores 12, 12+, or Negocios must exist in Hogares list | Menores 12 / 12+ / Negocios → Hogares |

### 3.4 Dynamic Behavior

- **Integrantes list**: User can add/remove integrantes. `numPer` is auto-assigned sequentially (01, 02, 03...) but user CANNOT edit it directly. Removing an integrante re-numbers the remaining ones.
- **Conditional fields**: Ingreso fields (ocupacion, horas, monto) appear only when `trabajoSemanaPasada = '1'`.
- **Conditional fields**: `progGobiernoNombre`, `progGobiernoMonto`, `progGobiernoPeriodicidad` appear only when `recibeProgGobierno = '1'`.
- **Conditional fields**: `duermenEnCocina` appears only when `tieneCuartoCocina = '1'`.
- **Conditional fields**: `numeroFocos` and `focosAhorradores` appear only when `tieneElectricidad = '1'`.
- **Conditional fields**: `aguaOrigen` appears only when `aguaTipo = '1'` or `aguaTipo = '2'`.
- **Bienes**: Text input where codes are entered separated by commas (e.g. "1,2,4,7"). The system validates each code against the catalog.

### 3.5 Data Model

```typescript
// src/domain/models/hogares.ts

import { SharedFolioFields } from './shared';

export interface Integrante {
  numPer: string; // 01-99, auto-assigned
  nombre: string;
  parentesco: string;
  sexo: string;
  edad: number;
  fechaNacimiento: string; // DD/MM/AAAA
  estadoCivil: string;
  sabeLeerEscribir: string;
  nivelEscolaridad: string;
  asisteEscuela: string;
}

export interface IngresoIntegrante {
  numPer: string;
  trabajoSemanaPasada: string;
  ocupacionPrincipal?: string;
  tipoTrabajo?: string;
  horasTrabajadas?: number;
  ingresoMensualTrabajo?: number;
  tieneOtroTrabajo?: string;
  recibeJubilacion: string;
  recibeProgGobierno: string;
  progGobiernoNombre?: string;
  progGobiernoMonto?: number;
  progGobiernoPeriodicidad?: string;
}

export interface HogaresViviendaData extends SharedFolioFields {
  // Section I - Vivienda
  claseVivienda: string;
  materialParedes: string;
  materialTecho: string;
  materialPiso: string;
  antiguedadVivienda?: number;
  tieneCuartoCocina: string;
  duermenEnCocina?: string;
  numeroDormitorios: number;
  numeroCuartos: number;
  aguaTipo: string;
  aguaOrigen?: string;
  drenaje: string;
  tieneElectricidad: string;
  numeroFocos?: number;
  focosAhorradores?: number;
  combustibleCocina: string;
  eliminaBasura: string;
  bienes: string[];
  
  // Section II - Residentes
  integrantes: Integrante[];
  
  // Section III - Ingresos
  ingresosIntegrantes: IngresoIntegrante[];
  
  // Section IV - Alimentación
  alimentosPocaVariedad: string;
  alimentosDejoComida: string;
  alimentosComioMenos: string;
  alimentosSinComida: string;
  alimentosSintioHambre: string;
  alimentosUnaVez: string;
  
  // Section VII - Cambio Climático
  climaSequia: string;
  climaInundacion: string;
  climaHelada: string;
  climaIncendio: string;
  climaHuracan: string;
}
```

---

## 4. Questionnaire 3: Menores de 12 Años

### 4.1 Fields Specification

One sub-form per integrante with `edad < 12` from Hogares.

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `folioViv` | `string` | 10 digits | Yes (pre-filled) | Numeric | Read-only from Portada |
| `folioHog` | `string` | 1 digit | Yes (pre-filled) | 1–5 | Read-only from Portada |
| `numPer` | `string` | 2 digits | Yes (pre-filled) | From Hogares | Read-only |
| `nombre` | `string` | Free text | Yes (pre-filled) | From Hogares | Read-only |
| `edad` | `number` | Integer | Yes (pre-filled) | From Hogares | Read-only |
| `sexo` | `string` | Code | Yes (pre-filled) | From Hogares | Read-only |
| `tieneDerechohabiencia` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `institucionSalud` | `string` | Code | Conditional | `1`–`8` | Number input (if tieneDerechohabiencia = 1) |
| `problemaSalud2Semanas` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `vacunacionCompleta` | `YesNoUnk` | `1`/`2`/`9` | Yes | — | Number input |
| `asisteEscuela` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `gradoEscolar` | `string` | Free text | Conditional | — | Text input (if asisteEscuela = 1) |
| `tipoEscuela` | `TipoEscuelaCode` | Code | Conditional | `1`/`2` | Number input (if asisteEscuela = 1) |
| `recibeBeca` | `YesNo` | `1`/`2` | No | — | Number input |
| `quienCuida` | `QuienCuidaCode` | Code | Yes | `1`–`4` | Number input |

### 4.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| M12-001 | `folioViv` | Must match Portada value | "FOLIOVIV no coincide con el valor de la Portada" |
| M12-002 | `folioHog` | Must match Portada value | "FOLIOHOG no coincide con el valor de la Portada" |
| M12-003 | `numPer` | Must exist in Hogares.integrantes | "NUMPER no existe en la lista de integrantes" |
| M12-004 | `edad` | Must be < 12 | "Este cuestionario es solo para menores de 12 años" |
| M12-005 | `institucionSalud` | Required if tieneDerechohabiencia = 1 | "Seleccione la institución de salud" |
| M12-006 | `gradoEscolar` | Required if asisteEscuela = 1 | "Capture el grado escolar que cursa" |
| M12-007 | `tipoEscuela` | Required if asisteEscuela = 1 | "Seleccione el tipo de escuela" |

### 4.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-006 | Every `numPer` in Menores 12 must have `edad < 12` in Hogares | Menores 12 → Hogares |
| CS-007 | Total count of Menores 12 forms must match count of Hogares.integrantes where `edad < 12` | Menores 12 ↔ Hogares |
| CS-008 | `numPer` must be one of the integrantes listed in Hogares | Menores 12 → Hogares |

### 4.4 Dynamic Behavior

- **Sub-step generation**: The wizard automatically creates one sub-step for each integrante from Hogares where `edad < 12`.
- **Pre-filled fields**: `folioViv`, `folioHog`, `numPer`, `nombre`, `edad`, `sexo` are read-only, pre-populated from Hogares data.
- **Conditional fields**: `institucionSalud` appears only when `tieneDerechohabiencia = '1'`.
- **Conditional fields**: `gradoEscolar` and `tipoEscuela` appear only when `asisteEscuela = '1'`.

### 4.5 Data Model

```typescript
// src/domain/models/menores12.ts

import { SharedFolioFields } from './shared';

export interface Menor12Data extends SharedFolioFields {
  numPer: string;
  nombre: string;
  edad: number;
  sexo: string;
  
  // Salud
  tieneDerechohabiencia: string;
  institucionSalud?: string;
  problemaSalud2Semanas: string;
  vacunacionCompleta: string;
  
  // Educación
  asisteEscuela: string;
  gradoEscolar?: string;
  tipoEscuela?: string;
  recibeBeca: string;
  
  // Cuidado
  quienCuida: string;
}

export interface Menores12Section {
  menores: Menor12Data[];
}
```

---

## 5. Questionnaire 4: Personas de 12+ Años

### 5.1 Fields Specification

One sub-form per integrante with `edad >= 12` from Hogares.

#### I. Características Generales

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `folioViv` | `string` | 10 digits | Yes (pre-filled) | Numeric | Read-only |
| `folioHog` | `string` | 1 digit | Yes (pre-filled) | 1–5 | Read-only |
| `numPer` | `string` | 2 digits | Yes (pre-filled) | From Hogares | Read-only |
| `nombre` | `string` | Free text | Yes (pre-filled) | From Hogares | Read-only |
| `edad` | `number` | Integer | Yes (pre-filled) | From Hogares | Read-only |
| `sexo` | `string` | Code | Yes (pre-filled) | From Hogares | Read-only |
| `parentesco` | `string` | Code | Yes (pre-filled) | From Hogares | Read-only |

#### II. Educación

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `nivelAprobado` | `EscolaridadCode` | Code | Yes | `00`–`16` | Number input |
| `asisteEscuela` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `tipoEscuela` | `TipoEscuelaCode` | Code | Conditional | `1`/`2` | Number input (if asisteEscuela = 1) |
| `sabeLeerEscribir` | `YesNo` | `1`/`2` | Yes | — | Number input |

#### III. Salud

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `tieneDerechohabiencia` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `institucionSalud` | `string` | Code | Conditional | `1`–`8` | Number input (if tieneDerechohabiencia = 1) |
| `problemaSalud2Semanas` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `fuma` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `consumeAlcohol` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `frecuenciaAlcohol` | `string` | Free text | Conditional | — | Text input (if consumeAlcohol = 1) |

#### IV. Actividad Económica

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `trabajoSemanaPasada` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `ocupacionPrincipal` | `string` | Free text | Conditional | — | Text input (if trabajoSemanaPasada = 1) |
| `tipoTrabajo` | `TipoTrabajoCode` | Code | Conditional | `1`–`4` | Number input (if trabajoSemanaPasada = 1) |
| `horasTrabajadas` | `number` | Integer | Conditional | `1`–`168` | Number input (if trabajoSemanaPasada = 1) |
| `ingresoMensualNeto` | `number` | Decimal | Conditional | ≥ 0 | Number input (if trabajoSemanaPasada = 1) |
| `recibeAguinaldo` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 1) |
| `recibeVacaciones` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 1) |
| `contratoEscrito` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 1) |
| `prestacionesLey` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 1) |
| `tieneOtroTrabajo` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 1) |
| `buscaTrabajo` | `YesNo` | `1`/`2` | Conditional | — | Number input (if trabajoSemanaPasada = 2) |
| `motivoNoTrabaja` | `string` | Free text | Conditional | — | Text input (if trabajoSemanaPasada = 2) |

#### V. Ingresos No Laborales

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `recibeJubilacion` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `recibeRemesas` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `recibeProgGobierno` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `progGobiernoNombre` | `string` | Free text | Conditional | — | Text input (if recibeProgGobierno = 1) |
| `progGobiernoMonto` | `number` | Decimal | Conditional | ≥ 0 | Number input (if recibeProgGobierno = 1) |
| `progGobiernoPeriodicidad` | `string` | Code | Conditional | `1`/`2`/`3`/`4` | Number input (if recibeProgGobierno = 1) |
| `recibeAyudaOtros` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `ayudaMonto` | `number` | Decimal | Conditional | ≥ 0 | Number input (if recibeAyudaOtros = 1) |
| `ayudaPeriodicidad` | `string` | Code | Conditional | `1`/`2`/`3`/`4` | Number input (if recibeAyudaOtros = 1) |

#### VI. Gastos Personales

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `gastosTransporte` | `number` | Decimal | No | ≥ 0 | Number input |
| `gastosComidasFuera` | `number` | Decimal | No | ≥ 0 | Number input |
| `gastosCuidadoPersonal` | `number` | Decimal | No | ≥ 0 | Number input |
| `gastosEntretenimiento` | `number` | Decimal | No | ≥ 0 | Number input |

### 5.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| P12-001 | `folioViv` | Must match Portada value | "FOLIOVIV no coincide con el valor de la Portada" |
| P12-002 | `folioHog` | Must match Portada value | "FOLIOHOG no coincide con el valor de la Portada" |
| P12-003 | `numPer` | Must exist in Hogares.integrantes | "NUMPER no existe en la lista de integrantes" |
| P12-004 | `edad` | Must be >= 12 | "Este cuestionario es solo para personas de 12 o más años" |
| P12-005 | `ingresoMensualNeto` | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas" |
| P12-006 | `institucionSalud` | Required if tieneDerechohabiencia = 1 | "Seleccione la institución de salud" |
| P12-007 | `tipoEscuela` | Required if asisteEscuela = 1 | "Seleccione el tipo de escuela" |
| P12-008 | `ocupacionPrincipal` | Required if trabajoSemanaPasada = 1 | "Capture la ocupación principal" |
| P12-009 | `tipoTrabajo` | Required if trabajoSemanaPasada = 1 | "Seleccione el tipo de trabajo" |
| P12-010 | `horasTrabajadas` | Required if trabajoSemanaPasada = 1, range 1–168 | "Horas trabajadas debe ser entre 1 y 168" |
| P12-011 | `ingresoMensualNeto` | Required if trabajoSemanaPasada = 1 | "Capture el ingreso mensual neto" |
| P12-012 | `progGobiernoNombre` | Required if recibeProgGobierno = 1 | "Capture el nombre del programa de gobierno" |
| P12-013 | `progGobiernoMonto` | Required if recibeProgGobierno = 1 | "Capture el monto del programa de gobierno" |
| P12-014 | `ayudaMonto` | Required if recibeAyudaOtros = 1 | "Capture el monto de la ayuda" |
| P12-015 | `motivoNoTrabaja` | Required if trabajoSemanaPasada = 2 AND edad >= 14 AND not a student | "Capture el motivo por el cual no trabaja" |

### 5.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-009 | Every `numPer` in 12+ must have `edad >= 12` in Hogares | 12+ → Hogares |
| CS-010 | Total count of 12+ forms must match count of Hogares.integrantes where `edad >= 12` | 12+ ↔ Hogares |
| CS-011 | Sum of Menores 12 + 12+ counts must equal total Hogares.integrantes.length | Menores 12 + 12+ ↔ Hogares |
| CS-012 | `numPer` must be one of the integrantes listed in Hogares | 12+ → Hogares |

### 5.4 Dynamic Behavior

- **Sub-step generation**: The wizard automatically creates one sub-step for each integrante from Hogares where `edad >= 12`.
- **Pre-filled fields**: `folioViv`, `folioHog`, `numPer`, `nombre`, `edad`, `sexo`, `parentesco` are read-only, pre-populated from Hogares data.
- **Conditional fields**: `institucionSalud` appears only when `tieneDerechohabiencia = '1'`.
- **Conditional fields**: `tipoEscuela` appears only when `asisteEscuela = '1'`.
- **Conditional fields**: `frecuenciaAlcohol` appears only when `consumeAlcohol = '1'`.
- **Conditional fields**: Activity fields (ocupacion, tipoTrabajo, horas, ingreso, prestaciones) appear only when `trabajoSemanaPasada = '1'`.
- **Conditional fields**: `buscaTrabajo` and `motivoNoTrabaja` appear only when `trabajoSemanaPasada = '2'`.
- **Conditional fields**: `progGobiernoNombre`, `progGobiernoMonto`, `progGobiernoPeriodicidad` appear only when `recibeProgGobierno = '1'`.
- **Conditional fields**: `ayudaMonto`, `ayudaPeriodicidad` appear only when `recibeAyudaOtros = '1'`.

### 5.5 Data Model

```typescript
// src/domain/models/personas12plus.ts

import { SharedFolioFields } from './shared';

export interface Persona12PlusData extends SharedFolioFields {
  numPer: string;
  nombre: string;
  edad: number;
  sexo: string;
  parentesco: string;
  
  // II. Educación
  nivelAprobado: string;
  asisteEscuela: string;
  tipoEscuela?: string;
  sabeLeerEscribir: string;
  
  // III. Salud
  tieneDerechohabiencia: string;
  institucionSalud?: string;
  problemaSalud2Semanas: string;
  fuma: string;
  consumeAlcohol: string;
  frecuenciaAlcohol?: string;
  
  // IV. Actividad Económica
  trabajoSemanaPasada: string;
  ocupacionPrincipal?: string;
  tipoTrabajo?: string;
  horasTrabajadas?: number;
  ingresoMensualNeto?: number;
  recibeAguinaldo?: string;
  recibeVacaciones?: string;
  contratoEscrito?: string;
  prestacionesLey?: string;
  tieneOtroTrabajo?: string;
  buscaTrabajo?: string;
  motivoNoTrabaja?: string;
  
  // V. Ingresos No Laborales
  recibeJubilacion: string;
  recibeRemesas: string;
  recibeProgGobierno: string;
  progGobiernoNombre?: string;
  progGobiernoMonto?: number;
  progGobiernoPeriodicidad?: string;
  recibeAyudaOtros: string;
  ayudaMonto?: number;
  ayudaPeriodicidad?: string;
  
  // VI. Gastos Personales
  gastosTransporte?: number;
  gastosComidasFuera?: number;
  gastosCuidadoPersonal?: number;
  gastosEntretenimiento?: number;
}

export interface Personas12PlusSection {
  personas: Persona12PlusData[];
}
```

---

## 6. Questionnaire 5: Negocios del Hogar

### 6.1 Fields Specification

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `folioViv` | `string` | 10 digits | Yes (pre-filled) | Numeric | Read-only from Portada |
| `folioHog` | `string` | 1 digit | Yes (pre-filled) | 1–5 | Read-only from Portada |
| `tieneNegocio` | `YesNo` | `1`/`2` | Yes | — | Number input |

#### If `tieneNegocio = '1'`, show Negocio fields (repeatable):

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `numPerOperador` | `string` | 2 digits | Yes | From Hogares.integrantes | Number input |
| `tipoNegocio` | `string` | Free text | Yes | Any text | Text input |
| `esActividadPrincipal` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `tieneLocal` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `llevaContabilidad` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `dadoAltaHacienda` | `YesNo` | `1`/`2` | Yes | — | Number input |
| `ingresoMensual` | `number` | Decimal | Yes | ≥ 0 | Number input |
| `gastosMensuales` | `number` | Decimal | Yes | ≥ 0 | Number input |

### 6.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| NEG-001 | `folioViv` | Must match Portada value | "FOLIOVIV no coincide con el valor de la Portada" |
| NEG-002 | `folioHog` | Must match Portada value | "FOLIOHOG no coincide con el valor de la Portada" |
| NEG-003 | `numPerOperador` | Must exist in Hogares.integrantes | "El NUMPER del operador debe existir en la lista de integrantes" |
| NEG-004 | `ingresoMensual` | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas" |
| NEG-005 | `gastosMensuales` | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas" |
| NEG-006 | At least one negocio | Required if tieneNegocio = 1 | "Si tiene negocio, capture al menos uno" |
| NEG-007 | `tipoNegocio` | Required if tieneNegocio = 1 | "Capture el tipo de negocio" |

### 6.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-013 | If `tieneNegocio = '1'`, at least one negocio record must exist | Negocios (internal) |
| CS-014 | `numPerOperador` of each negocio must exist in Hogares.integrantes | Negocios → Hogares |

### 6.4 Dynamic Behavior

- **Skip behavior**: If `tieneNegocio = '2'` (No), the questionnaire shows a "No aplica" message and allows advancing without negocio data.
- **Add/Remove negocios**: User can add multiple businesses with the "Agregar negocio" button. Each negocio has its own set of fields.
- **Remove negocio**: Each negocio card has a "Eliminar" button (only visible if count > 1, or if > 0 when tieneNegocio = 1).

### 6.5 Data Model

```typescript
// src/domain/models/negocios.ts

import { SharedFolioFields } from './shared';

export interface Negocio {
  id: string; // UUID or generated ID
  numPerOperador: string;
  tipoNegocio: string;
  esActividadPrincipal: string;
  tieneLocal: string;
  llevaContabilidad: string;
  dadoAltaHacienda: string;
  ingresoMensual: number;
  gastosMensuales: number;
}

export interface NegociosData extends SharedFolioFields {
  tieneNegocio: string; // '1' = Sí, '2' = No
  negocios: Negocio[];
}
```

---

## 7. Questionnaire 6: Gastos del Hogar (Trimestral)

### 7.1 Fields Specification

All amounts are TRIMESTRAL (3 months).

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `folioViv` | `string` | 10 digits | Yes (pre-filled) | Numeric | Read-only |
| `folioHog` | `string` | 1 digit | Yes (pre-filled) | 1–5 | Read-only |

#### Section I — Alimentos, Bebidas y Tabaco (trimestral)

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `alimentosCarnes` | `number` | Decimal | No | Number input |
| `alimentosCereales` | `number` | Decimal | No | Number input |
| `alimentosVerduras` | `number` | Decimal | No | Number input |
| `alimentosFrutas` | `number` | Decimal | No | Number input |
| `alimentosLacteos` | `number` | Decimal | No | Number input |
| `alimentosHuevo` | `number` | Decimal | No | Number input |
| `alimentosAceites` | `number` | Decimal | No | Number input |
| `alimentosAzucar` | `number` | Decimal | No | Number input |
| `alimentosCafe` | `number` | Decimal | No | Number input |
| `alimentosBebidasNoAlcohol` | `number` | Decimal | No | Number input |
| `alimentosBebidasAlcohol` | `number` | Decimal | No | Number input |
| `alimentosFueraHogar` | `number` | Decimal | No | Number input |
| `alimentosOtros` | `number` | Decimal | No | Number input |

#### Section II — Transporte y Comunicaciones

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `transportePublico` | `number` | Decimal | No | Number input |
| `gasolina` | `number` | Decimal | No | Number input |
| `mantenimientoAuto` | `number` | Decimal | No | Number input |
| `telefonoCelular` | `number` | Decimal | No | Number input |
| `internet` | `number` | Decimal | No | Number input |

#### Section III — Vivienda y Servicios

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `viviendaRenta` | `number` | Decimal | No | Number input |
| `viviendaElectricidad` | `number` | Decimal | No | Number input |
| `viviendaAgua` | `number` | Decimal | No | Number input |
| `viviendaGas` | `number` | Decimal | No | Number input |
| `viviendaPredial` | `number` | Decimal | No | Number input |
| `viviendaMantenimiento` | `number` | Decimal | No | Number input |

#### Section IV — Educación y Esparcimiento

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `educacionUtiles` | `number` | Decimal | No | Number input |
| `educacionUniformes` | `number` | Decimal | No | Number input |
| `educacionCuotas` | `number` | Decimal | No | Number input |
| `educacionEntretenimiento` | `number` | Decimal | No | Number input |

#### Section V — Salud

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `saludMedicamentos` | `number` | Decimal | No | Number input |
| `saludConsultas` | `number` | Decimal | No | Number input |
| `saludLentes` | `number` | Decimal | No | Number input |

#### Section VI — Vestido y Calzado

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `vestidoRopa` | `number` | Decimal | No | Number input |
| `vestidoCalzado` | `number` | Decimal | No | Number input |

#### Section VII — Cuidados Personales

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `cuidadosHigiene` | `number` | Decimal | No | Number input |
| `cuidadosEstetica` | `number` | Decimal | No | Number input |
| `cuidadosPañales` | `number` | Decimal | No | Number input |

#### Section VIII — Enseres Domésticos y Limpieza

| Field | Type | Format | Required | UI Element |
|-------|------|--------|----------|------------|
| `enseresDetergentes` | `number` | Decimal | No | Number input |
| `enseresUtensilios` | `number` | Decimal | No | Number input |
| `enseresBlancos` | `number` | Decimal | No | Number input |

### 7.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| GH-001 | `folioViv` | Must match Portada value | "FOLIOVIV no coincide con el valor de la Portada" |
| GH-002 | `folioHog` | Must match Portada value | "FOLIOHOG no coincide con el valor de la Portada" |
| GH-003 | All amount fields | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas" |
| GH-004 | All amount fields | >= 0, max 9999999.99 | "El monto debe ser un valor numérico válido" |

### 7.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-015 | Gastos Diarios total should not exceed 4x Gastos Hogar trimestral total (WARNING, not blocking) | Gastos Diarios ↔ Gastos Hogar |

### 7.4 Dynamic Behavior

- **No conditional fields**: All sections are always visible (no show/hide logic).
- **Zero amounts**: Fields can be `0` or empty. Both are valid. The system treats empty as `0` for calculations.
- **Section totals**: Each section shows a subtotal calculated as the sum of its fields.

### 7.5 Data Model

```typescript
// src/domain/models/gastos-hogar.ts

import { SharedFolioFields } from './shared';

export interface GastosHogarData extends SharedFolioFields {
  // Section I - Alimentos
  alimentosCarnes?: number;
  alimentosCereales?: number;
  alimentosVerduras?: number;
  alimentosFrutas?: number;
  alimentosLacteos?: number;
  alimentosHuevo?: number;
  alimentosAceites?: number;
  alimentosAzucar?: number;
  alimentosCafe?: number;
  alimentosBebidasNoAlcohol?: number;
  alimentosBebidasAlcohol?: number;
  alimentosFueraHogar?: number;
  alimentosOtros?: number;
  
  // Section II - Transporte
  transportePublico?: number;
  gasolina?: number;
  mantenimientoAuto?: number;
  telefonoCelular?: number;
  internet?: number;
  
  // Section III - Vivienda
  viviendaRenta?: number;
  viviendaElectricidad?: number;
  viviendaAgua?: number;
  viviendaGas?: number;
  viviendaPredial?: number;
  viviendaMantenimiento?: number;
  
  // Section IV - Educación
  educacionUtiles?: number;
  educacionUniformes?: number;
  educacionCuotas?: number;
  educacionEntretenimiento?: number;
  
  // Section V - Salud
  saludMedicamentos?: number;
  saludConsultas?: number;
  saludLentes?: number;
  
  // Section VI - Vestido
  vestidoRopa?: number;
  vestidoCalzado?: number;
  
  // Section VII - Cuidados
  cuidadosHigiene?: number;
  cuidadosEstetica?: number;
  cuidadosPañales?: number;
  
  // Section VIII - Enseres
  enseresDetergentes?: number;
  enseresUtensilios?: number;
  enseresBlancos?: number;
}
```

---

## 8. Questionnaire 7: Cuadernillo de Gastos Diarios

### 8.1 Fields Specification

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `folioViv` | `string` | 10 digits | Yes (pre-filled) | Numeric | Read-only |
| `folioHog` | `string` | 1 digit | Yes (pre-filled) | 1–5 | Read-only |
| `informanteNumPer` | `string` | 2 digits | Yes | From Hogares.integrantes | Number input |
| `informanteNombre` | `string` | Free text | Auto | From Hogares | Read-only display |

#### Per Day (7 days: Lunes–Domingo)

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `dia[1-7].fecha` | `string` | DD/MM/AAAA | Yes | Valid date | Date input |
| `dia[1-7].gastos[]` | `GastoDiario[]` | Array | Yes (at least 1) | — | Dynamic list |

#### GastoDiario Item

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `concepto` | `string` | Free text | Yes | Any text | Text input |
| `monto` | `number` | Decimal | Yes | ≥ 0 | Number input |

#### Estimación Mensual

| Field | Type | Format | Required | Valid Values | UI Element |
|-------|------|--------|----------|--------------|------------|
| `estimacionTortilleria` | `number` | Decimal | No | ≥ 0 | Number input |
| `estimacionCarniceria` | `number` | Decimal | No | ≥ 0 | Number input |
| `estimacionVerduleria` | `number` | Decimal | No | ≥ 0 | Number input |
| `estimacionAbarrotes` | `number` | Decimal | No | ≥ 0 | Number input |
| `estimacionTransporte` | `number` | Decimal | No | ≥ 0 | Number input |
| `estimacionGasolina` | `number` | Decimal | No | ≥ 0 | Number input |

### 8.2 Validation Rules

| Rule ID | Field | Rule | Error Message |
|---------|-------|------|---------------|
| GD-001 | `folioViv` | Must match Portada value | "FOLIOVIV no coincide con el valor de la Portada" |
| GD-002 | `folioHog` | Must match Portada value | "FOLIOHOG no coincide con el valor de la Portada" |
| GD-003 | `informanteNumPer` | Must exist in Hogares.integrantes | "El NUMPER del informante debe existir en la lista de integrantes" |
| GD-004 | `dia[1-7].fecha` | Valid DD/MM/AAAA | "Fecha inválida para el día X" |
| GD-005 | Each `gasto.monto` | No `$`, no commas, optional decimal | "Ingrese el monto sin signo de pesos ni comas" |
| GD-006 | Each `gasto.monto` | >= 0, max 9999999.99 | "Monto inválido" |
| GD-007 | Each `gasto.concepto` | Non-empty | "Capture el concepto del gasto" |
| GD-008 | At least one gasto per day | Required | "Capture al menos un gasto para este día" |

### 8.3 Cross-Section Consistency Rules

| Rule ID | Rule | Sections Involved |
|---------|------|------------------|
| CS-016 | `informanteNumPer` must exist in Hogares.integrantes | Gastos Diarios → Hogares |
| CS-017 | Total daily gastos sum should be plausible vs. income (WARNING, not blocking) | Gastos Diarios → Hogares (ingresos) |

### 8.4 Dynamic Behavior

- **Dynamic gasto list**: Each day has an expandable section. User can add multiple gasto items per day with "Agregar gasto" button.
- **Remove gasto**: Each gasto item has an "Eliminar" button (only visible if count > 1).
- **Day totals**: Each day shows a subtotal of all gastos for that day.
- **Pre-filled informante**: When user selects `informanteNumPer`, the `informanteNombre` is auto-populated from Hogares data (read-only display).
- **Day dates**: The first day's date is derived from `fechaInicio` in Portada (or can be entered manually). Subsequent days auto-increment.

### 8.5 Data Model

```typescript
// src/domain/models/gastos-diarios.ts

import { SharedFolioFields } from './shared';

export interface GastoDiario {
  id: string;
  concepto: string;
  monto: number;
}

export interface DiaGastos {
  diaNumero: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  nombreDia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  fecha: string; // DD/MM/AAAA
  gastos: GastoDiario[];
}

export interface EstimacionMensual {
  tortilleria?: number;
  carniceria?: number;
  verduleria?: number;
  abarrotes?: number;
  transporte?: number;
  gasolina?: number;
}

export interface GastosDiariosData extends SharedFolioFields {
  informanteNumPer: string;
  dias: DiaGastos[];
  estimacionMensual: EstimacionMensual;
}
```

---

## 9. Wizard Specification

### 9.1 Step Flow

```
Step 1: Portada (ENIGH-1)
  └── Single form

Step 2: Hogares y Vivienda
  └── Single form (generates sub-steps for Step 3 & 4 based on integrantes)

Step 3: Menores de 12 años
  └── Sub-steps: 1 per integrante with edad < 12
  └── If 0 menores: shows "No hay menores de 12 años — pase al siguiente"
  └── Dynamic sub-step count

Step 4: Personas de 12+ años
  └── Sub-steps: 1 per integrante with edad >= 12
  └── Dynamic sub-step count

Step 5: Negocios del Hogar
  └── Single form (or "No aplica" if tieneNegocio = 2)

Step 6: Gastos del Hogar
  └── Single form (8 sections)

Step 7: Cuadernillo de Gastos Diarios
  └── Single form (7 days + estimation)

Step 8: Reporte Final (post-capture summary)
  └── Read-only summary
  └── No "Siguiente" — only "Reiniciar"
```

### 9.2 Progress Bar

- Shows all 7 questionnaire steps as labeled nodes.
- Current step is highlighted (e.g., bold, different background).
- Completed steps show a checkmark (✓).
- Inactive steps are dimmed.
- For Steps 3 and 4 (dynamic), the label shows the count: "Menores 12 (1)" or "12+ (3)".

### 9.3 Navigation Buttons

| Button | Behavior |
|--------|----------|
| **Anterior** | Goes to previous step. All data in current step is preserved. Timer continues from where it was. |
| **Siguiente** | Fires validation. If valid → advances. If invalid → shows error summary, does NOT advance. Timer for current step stops. Timer for next step starts. |
| **Reiniciar** | Clears all data, resets all timers, returns to Step 1. Prompts for confirmation. |

### 9.4 Validation Timing

| Trigger | Behavior |
|---------|----------|
| **On blur** (field loses focus) | Validates that single field. Shows inline error if invalid. Does NOT block navigation. |
| **On "Siguiente" click** | Runs full step validation (all fields). Shows error summary panel listing all errors. Blocks advancement until all errors are resolved. |
| **On "Anterior" click** | NO validation runs. Data is preserved regardless of state. |

### 9.5 Back Navigation

- **Data preservation**: All data entered in a step is preserved even if the step has validation errors.
- **Timer behavior**: When navigating back, the timer RESUMES from where it left off (does NOT restart).
- **Cross-section validation on return**: If user goes back to Hogares after visiting Step 3 or 4, the number of sub-steps recalculates based on current integrantes list. If a sub-step's numPer is removed, that sub-step is removed and data is lost.

### 9.6 Dynamic Sub-Step Logic

1. When entering Step 2 (Hogares), the system captures the list of integrantes.
2. Before entering Step 3, the system derives the list of menores (edad < 12).
3. Before entering Step 4, the system derives the list of personas 12+ (edad >= 12).
4. If the user goes back to Step 2 and modifies the integrantes list:
   - If a menor is removed, their Step 3 sub-form is removed.
   - If a persona 12+ is removed, their Step 4 sub-form is removed.
   - If ages are changed, sub-forms may move between Step 3 and Step 4.
5. **Warning**: If user navigates back to Step 2 after completing Steps 3 or 4, the system warns: "Modificar la lista de integrantes puede afectar los cuestionarios ya capturados."

---

## 10. Timer Specification

### 10.1 Behavior Per Questionnaire

| Step | Timer Behavior |
|------|----------------|
| **Step 1: Portada** | Starts automatically when step is first displayed. Stops when user clicks "Siguiente". Resumes if user clicks "Anterior" to return. |
| **Step 2: Hogares** | Starts when step is first displayed. Stops on "Siguiente". Resumes on "Anterior". |
| **Step 3: Menores 12** | Starts when first menor sub-form is displayed. Stops when user clicks "Siguiente" to leave step. Sub-form transitions do NOT restart the timer. |
| **Step 4: Personas 12+** | Same as Step 3. |
| **Step 5: Negocios** | Starts when step is displayed. Stops on "Siguiente". |
| **Step 6: Gastos Hogar** | Starts when step is displayed. Stops on "Siguiente". |
| **Step 7: Gastos Diarios** | Starts when step is displayed. Stops on "Siguiente". |
| **Step 8: Reporte** | Timer stops. Total time is computed. |

### 10.2 Timer Data Model

```typescript
// src/domain/models/timer.ts

export interface TimerEntry {
  step: number; // 1-7
  stepLabel: string; // e.g., "Portada", "Hogares", "Menores 12 (1)"
  elapsedSeconds: number; // accumulated time
  status: 'running' | 'stopped';
  startedAt?: number; // Unix timestamp when current segment started
}

export interface TimerData {
  entries: Record<number, TimerEntry>; // key = step number
  totalElapsedSeconds: number;
  isRunning: boolean;
  currentStep: number;
}
```

### 10.3 Timer Display

- Displayed as `MM:SS` or `HH:MM:SS` if ≥ 60 minutes.
- Shows the timer for the CURRENT step only.
- Format: `⏱ 12:34` (label: "Tiempo en Portada")
- On the Report step: Shows table with all step times and total.

### 10.4 Persistence

- Timer state is stored in the same Zustand store that persists to localStorage.
- On page reload, timer resumes from persisted `elapsedSeconds` + any time since `startedAt`.
- Timer continues counting even when the user is typing (no pause while active on page).

---

## 11. Reporte Final Specification

### 11.1 Displayed Data

#### Header Section

| Field | Source | Display |
|-------|--------|---------|
| FOLIOVIV | Portada | Literal value |
| FOLIOHOG | Portada | Literal value |
| Entidad | Portada.entidad | "14 — Jalisco" (code + name) |
| Entrevistador | Portada | Literal value |
| Fecha de inicio | Portada.fechaInicio | DD/MM/AAAA |
| Fecha de término | Portada.fechaTermino | DD/MM/AAAA |
| Estado del folio | Cross-section validation | **CONCLUIDO** (green) or **INCOMPLETO** (yellow/red) |

#### Residentes Section

Table with columns:
| NUMPER | Nombre | Parentesco | Sexo | Edad | Escolaridad |
|--------|--------|------------|------|------|-------------|

#### Ingresos Section

| Field | Calculation |
|-------|-------------|
| Ingreso laboral (jefe) | From Hogares.ingresosIntegrantes[0].ingresoMensualTrabajo |
| Ingreso laboral (cónyuge) | From Hogares.ingresosIntegrantes[1].ingresoMensualTrabajo |
| Otros ingresos del hogar | Sum of progGobierno, ayuda, remesas, jubilacion across all members |
| **Ingreso total mensual** | Sum of all income sources |

#### Gastos Section

| Field | Calculation |
|-------|-------------|
| Gastos trimestrales (Alimentos) | Sum of Section I fields in Gastos Hogar |
| Gastos trimestrales (Transporte) | Sum of Section II fields |
| Gastos trimestrales (Vivienda) | Sum of Section III fields |
| Gastos trimestrales (Educación) | Sum of Section IV fields |
| Gastos trimestrales (Salud) | Sum of Section V fields |
| Gastos trimestrales (Vestido) | Sum of Section VI fields |
| Gastos trimestrales (Cuidados) | Sum of Section VII fields |
| Gastos trimestrales (Enseres) | Sum of Section VIII fields |
| **Gasto trimestral total** | Sum of all 8 sections |
| Gasto diario estimado | Sum of all 7 days in Gastos Diarios |
| Gasto mensual estimado (diarios) | Sum of estimacionMensual fields |

#### Timer Section

Table:
| Cuestionario | Tiempo |
|--------------|--------|
| Portada | MM:SS |
| Hogares y Vivienda | MM:SS |
| Menores de 12 años | MM:SS |
| Personas de 12+ años | MM:SS |
| Negocios del Hogar | MM:SS |
| Gastos del Hogar | MM:SS |
| Gastos Diarios | MM:SS |
| **Total** | **HH:MM:SS** |

#### Alerts Section

List of warnings that did NOT block capture but may need review:
- "Gastos diarios totales son significativamente mayores a los gastos trimestrales"
- "Existen integrantes con inconsistencia entre edad y fecha de nacimiento"
- "NUMPER en Menores 12 no encontrado en lista de Hogares"

### 11.2 Report Actions

| Action | Behavior |
|--------|----------|
| **Ver folio completo** | Expands/hides the full data dump (collapsible JSON view) |
| **Imprimir / Exportar PDF** | v2 feature — not in scope for v1 |
| **Reiniciar** | Clears all data, localStorage, timers. Returns to Step 1. Confirmation prompt. |

---

## 12. Global Validation (Cross-Section)

### 12.1 Master Validation Run (on "Siguiente" from Step 7)

These rules are checked before marking the folio as CONCLUIDO:

| Rule ID | Rule | Severity |
|---------|------|----------|
| GV-001 | `folioViv` is identical in all 7 questionnaires | BLOCKER |
| GV-002 | `folioHog` is identical in all 7 questionnaires | BLOCKER |
| GV-003 | All required fields in all 7 questionnaires are filled | BLOCKER |
| GV-004 | All numeric fields have valid values (no `$`, no commas) | BLOCKER |
| GV-005 | Sum of Menores 12 count + 12+ count = total Hogares.integrantes.length | BLOCKER |
| GV-006 | All NUMPER in Menores 12, 12+, Negocios exist in Hogares | BLOCKER |
| GV-007 | All ages in Menores 12 are < 12 | BLOCKER |
| GV-008 | All ages in 12+ are >= 12 | BLOCKER |
| GV-009 | If `tieneNegocio = '1'`, at least one negocio exists with all required fields | BLOCKER |
| GV-010 | Gastos Diarios total (daily × 30) plausibly comparable to Gastos Hogar trimestral / 3 | WARNING |
| GV-011 | Date of birth vs. declared age consistency (±1 year) | WARNING |
| GV-012 | fechaTermino >= fechaInicio in Portada | BLOCKER |

---

## 13. Technical Requirements

### 13.1 TypeScript Interfaces Location

```
src/
  domain/
    models/
      shared.ts          # SharedFolioFields, catalog types
      portada.ts         # PortadaData
      hogares.ts         # HogaresViviendaData, Integrante, IngresoIntegrante
      menores12.ts       # Menor12Data, Menores12Section
      personas12plus.ts  # Persona12PlusData, Personas12PlusSection
      negocios.ts        # Negocio, NegociosData
      gastos-hogar.ts    # GastosHogarData
      gastos-diarios.ts  # GastoDiario, DiaGastos, GastosDiariosData
      timer.ts           # TimerEntry, TimerData
      folio.ts           # CompleteFolioData (all questionnaires combined)
    constants/
      catalogs.ts        # Entity names, parentesco options, etc.
    validation/
      schemas.ts         # Zod schemas per questionnaire
      cross-section.ts   # Cross-section validation functions
```

### 13.2 State Management

- **Zustand store** with `persist` middleware (localStorage).
- **Store shape**:
  ```typescript
  interface FolioStore {
    // Current state
    currentStep: number;
    currentSubStep: number; // for dynamic steps (Menores, 12+)
    
    // Questionnaire data
    portada: PortadaData | null;
    hogares: HogaresViviendaData | null;
    menores12: Menores12Section | null;
    personas12plus: Personas12PlusSection | null;
    negocios: NegociosData | null;
    gastosHogar: GastosHogarData | null;
    gastosDiarios: GastosDiariosData | null;
    
    // Timer
    timer: TimerData;
    
    // Validation
    errors: Record<string, string[]>; // step → error messages
    
    // Actions
    setPortada: (data: PortadaData) => void;
    setHogares: (data: HogaresViviendaData) => void;
    // ... similar for all questionnaires
    nextStep: () => void;
    prevStep: () => void;
    resetAll: () => void;
  }
  ```

### 13.3 Validation with Zod

Each questionnaire has a Zod schema in `src/domain/validation/schemas.ts`. Cross-section validation is a separate function that runs after individual schemas pass.

### 13.4 UI Components

| Component | Responsibility |
|-----------|----------------|
| `WizardLayout` | Container with ProgressBar, TimerDisplay, step router, navigation |
| `ProgressBar` | Shows 7 steps with completion status |
| `TimerDisplay` | Shows elapsed time for current step |
| `FieldInput` | Generic text/number input with error display |
| `FieldSelect` | Dropdown with catalog values |
| `FieldRadioGroup` | Radio button group |
| `FieldCheckboxGroup` | Multi-select checkboxes |
| `FieldYesNo` | Yes/No radio pair |
| `ValidationSummary` | Lists all errors for current step |
| `SectionHeader` | Collapsible section header with title |
| `IntegranteCard` | Card for displaying/editing one household member |
| `GastoItemRow` | Row for one gasto (concepto + monto + delete) |
| `DayExpenses` | Expandable section for one day's gastos |
| `NavigationButtons` | Anterior / Siguiente / Reiniciar |

---

## 14. Non-Goals (from Proposal)

- No backend, no API
- No authentication
- No file import (CSV/JSON)
- No auto-fill demo data
- No auto-comparison with a "correct" folio
- No PDF/CSV export
- No multiple simultaneous folios
- No multi-user mode
- No i18n (Spanish only)
- No E2E tests (Vitest + Testing Library is sufficient)

---

## 15. Acceptance Criteria

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| AC-1 | All 7 questionnaires can be completed in the specified order | Manual walkthrough |
| AC-2 | Validation blocks advancement on errors with Spanish error messages | Manual: try to advance with empty required fields |
| AC-3 | Timer records time per questionnaire and total | Manual: complete a folio, check report |
| AC-4 | Page reload recovers exact state (step, data, timers) | Manual: reload mid-folio, verify state |
| AC-5 | Report shows all captured data, totals, times, and folio status | Manual: complete a folio, verify report |
| AC-6 | App runs offline (no network calls) | DevTools Network tab: 0 requests |
| AC-7 | All UI labels in Spanish | Visual inspection |
| AC-8 | Code has ≥80% test coverage | `vitest --coverage` |
