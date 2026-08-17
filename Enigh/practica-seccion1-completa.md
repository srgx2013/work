# Práctica de Captura — Sección I Completa (ENIGH 2024)

> Folio de práctica con TODAS las preguntas de la Sección I
> (Características de la Vivienda) según el cuestionario oficial INEGI 2024.
>
> Usalo con el simulador IKTAN para practicar la captura con códigos numéricos.

---

## 📋 DATOS DEL FOLIO

| Campo | Valor |
|-------|-------|
| **FOLIOVIV** | `1405028038` |
| **FOLIOHOG** | `1` |
| **Decena** | 3 |
| **Entidad** | 14 — Jalisco |
| **Entrevistador** | María Guadalupe Hernández López |
| **Supervisor** | José Alfredo Ramírez Soto |
| **Resultado** | A1 — Entrevista completa |
| **Fecha inicio** | 18/09/2024 |
| **Fecha término** | 24/09/2024 |

---

## SECCIÓN I — CARACTERÍSTICAS DE LA VIVIENDA

### P1. Clase de Vivienda

```
Código: [ 2 ]
  1 = Casa única en el terreno
  2 = Casa que comparte terreno con otra(s)
  3 = Casa dúplex
  4 = Departamento en edificio
  5 = Vivienda en vecindad o cuartería
  6 = Cuarto de azotea
  7 = Local no construido para habitación
```

### P2. Material de Paredes

```
Código: [ 8 ]
  1 = Desecho          5 = Embarro o bajareque
  2 = Lámina de cartón  6 = Madera
  3 = Lámina asbesto    7 = Adobe
  4 = Carrizo, bambú   8 = Tabique, block, piedra, cemento
```

### P3. Material de Techos

```
Código: [ 10 ]
  1 = Desecho           6 = Palma o paja
  2 = Lámina cartón     7 = Madera o tejamanil
  3 = Lámina metálica   8 = Terrado con viguería
  4 = Lámina asbesto    9 = Teja
  5 = Fibrocemento     10 = Losa de concreto o viguetas
```

### P4. Material de Pisos

```
Código: [ 3 ]
  1 = Tierra
  2 = Cemento o firme
  3 = Madera, mosaico u otro recubrimiento
```

### P5. Antigüedad de la Vivienda

```
Años: [ 12 ]
  (00 si < 1 año, 99 si > 99 años)
```

### P6. ¿Tiene cuarto para cocinar?

```
Código: [ 1 ]   1 = Sí   2 = No
```

### P7. ¿En el cuarto donde cocinan, también duermen?

```
Código: [ 2 ]   1 = Sí   2 = No
  (Solo si P6 = 1)
```

### P8. ¿Cuántos cuartos se usan para dormir?

```
Número: [ 3 ]
  (Sin contar pasillos ni baños)
```

### P9. ¿Cuántos cuartos tiene en total?

```
Número: [ 5 ]
  (Contando cocina, sin pasillos ni baños)
```

### P10. ¿El espacio para cocinar está...?

```
Código: [ 1 ]
  1 = Al interior de la vivienda
  2 = En un cuarto separado de la vivienda
  3 = En un pasillo o corredor fuera de la vivienda
  4 = En un tejabán o techito
  5 = Al aire libre
  6 = ¿No tiene espacio para cocinar?
```

### P11. ¿El agua la obtienen de llaves o mangueras que están...?

```
Código: [ 1 ]
  1 = Dentro de la vivienda
  2 = Solo en el patio o terreno
  3 = No tienen agua entubada → Pase a P13
```

### P12. ¿El agua que usan proviene...?

```
Código: [ 1 ]
  1 = Del servicio público de agua
  2 = De un pozo comunitario
  3 = De un pozo particular
  4 = De una pipa
  5 = De otra vivienda
  6 = De la lluvia
  7 = De otro lugar
  (Solo si P11 = 1 o 2)
```

### P13. Entonces, ¿acarrean el agua de...?

```
Código: [ — ]  (No aplica, tiene agua entubada)
  1 = Un pozo
  2 = Una llave comunitaria
  3 = Otra vivienda
  4 = Un río, arroyo o lago
  5 = La trae una pipa
  6 = La captan de la lluvia
  (Solo si P11 = 3)
```

### P14. ¿Cuántos días a la semana llega el agua?

```
Código: [ 1 ]
  1 = Diario
  2 = Cada tercer día
  3 = Dos veces por semana
  4 = Una vez por semana
  5 = De vez en cuando
```

### P15. ¿Tienen...?

```
Código: [ 1 ]
  1 = Taza de baño (excusado o sanitario)
  2 = Letrina (pozo u hoyo)
  3 = No tienen taza de baño ni letrina → Pase a P20
```

### P16. ¿La taza de baño es compartida con otra vivienda?

```
Código: [ 2 ]   1 = Sí   2 = No
  (Solo si P15 = 1 o 2)
```

### P17. ¿La taza de baño...?

```
Código: [ 1 ]
  1 = Tiene descarga directa de agua
  2 = Le echan agua con cubeta
  3 = No se le puede echar agua
  (Solo si P15 = 1 o 2)
```

### P18. ¿El servicio sanitario cuenta con biodigestor?

```
Código: [ 2 ]   1 = Sí   2 = No
```

### P19. ¿Cuántos baños tiene esta vivienda...?

```
Con excusado y regadera: [ 1 ]
Solo con excusado:       [ 1 ]
Solo con regadera:       [ 0 ]
```

### P20. Drenaje

```
Código: [ 1 ]
  1 = Red pública
  2 = Fosa séptica o biodigestor
  3 = Barranca o grieta
  4 = Río, lago o mar
  5 = No tiene drenaje
```

### P21. ¿La luz eléctrica la obtienen de...?

```
Código: [ 1 ]
  1 = Del servicio público
  2 = De una planta particular
  3 = De panel solar
  4 = De otra fuente
  5 = No tiene luz eléctrica → Pase a P23
```

### P22. Focos

```
Total de focos:    [ 9 ]
Focos ahorradores: [ 6 ]
```

### P23. ¿El combustible que más usan para cocinar es...?

```
Código: [ 3 ]
  1 = Leña              5 = Electricidad → Pase a P25
  2 = Carbón            6 = Otro combustible
  3 = Gas de tanque     7 = No cocinan → Pase a P25
  4 = Gas natural
```

### P24. ¿El fogón donde cocinan con leña o carbón...?

```
Código: [ — ]  (No aplica, usa gas)
  1 = Tiene tubo o chimenea para sacar el humo
  2 = No tiene tubo o chimenea para sacar el humo
  (Solo si P23 = 1 o 2)
```

### P25. Eliminación de basura

```
Código: [ 1 ]
  1 = Camión de basura        5 = La entierran
  2 = Basurero público         6 = Terreno baldío
  3 = Contenedor               7 = Barranca o grieta
  4 = La queman                8 = Río, lago o mar
```

### P26. Tenencia — Esta vivienda es...

```
Código: [ 4 ]
  1 = Rentada       3 = Propia, la están pagando   5 = Intestada o en litigio
  2 = Prestada      4 = Propia                     6 = Otra situación
```

#### P26.1 ¿Cuál es el monto de la renta mensual?

```
Monto: [ — ]  (No aplica, es propia)
```

#### P26.2 ¿Cuánto pagaría mensualmente si la estuviera rentando?

```
Monto estimado: [ 8500.00 ]
```

#### P26.3 ¿Cuánto está pagando al mes? (si la están pagando)

```
Monto: [ — ]  (No aplica, ya es propia)
```

#### P26.4 ¿La pagó el mes pasado?

```
Código: [ — ]  (No aplica)
  1 = Sí   2 = No
```

### P27. Adquisición — La vivienda...

```
Código: [ 1 ]
  1 = La compró hecha          4 = La heredó
  2 = La mandó construir       5 = La recibió como apoyo del gobierno
  3 = La construyó ella/él     6 = La obtuvo de otra manera
  (Solo si P26 = 3, 4 o 5)
```

### P28. Cuando compraron esta vivienda, ¿era usada?

```
Código: [ 1 ]   1 = Sí   2 = No
  (Solo si P27 = 1)
```

### P29. ¿Para pagar o construir esta vivienda...?

```
Códigos (hasta 3, separados por coma): [ 8 ]
  1 = INFONAVIT          5 = Un banco
  2 = FOVISSSTE          6 = Otra institución
  3 = PEMEX              7 = Familiar, amigo o prestamista
  4 = FONHAPO            8 = Propios recursos
```

### P30. ¿Quién es la dueña o dueño?

```
Nombre:    [ Carlos Alberto García Mendoza ]
N.R.:      [ 01 ]
N.H.:      [ 1 ]
```

### P31. Escrituras

```
Código: [ 1 ]
  1 = A nombre de la dueña o dueño
  2 = A nombre de otra persona
  3 = No tiene escrituras
  4 = No sabe
```

### P32. Equipamiento del Hogar

```
Código  Concepto                     Respuesta
─────── ──────────────────────────── ─────────
  1     Lavadero                      [ 1 ]
  2     Fregadero o tarja             [ 1 ]
  3     Regadera                      [ 1 ]
  4     Tinaco en la azotea           [ 1 ]
  5     Cisterna o aljibe             [ 2 ]
  6     Pileta, tanque de agua        [ 2 ]
  7     Calentador solar de agua      [ 2 ]
  8     Boiler o calentador (gas/e)   [ 1 ]
  9     Boiler o calentador (leña)    [ 2 ]
 10     Medidor de luz                [ 1 ]
 11     Bomba de agua                 [ 2 ]
 12     Tanque de gas estacionario    [ 2 ]
 13     Aire acondicionado            [ 2 ]
 14     Calefacción                   [ 2 ]

  1 = Sí   2 = No
```

### P33. Problemas Estructurales

```
Código  Problema                                    Respuesta
─────── ─────────────────────────────────────────── ─────────
  1     Grietas en techos o muros                   [ 2 ]
  2     Pandeos en marcos de puertas/ventanas       [ 2 ]
  3     Levantamientos del piso                     [ 2 ]
  4     Humedad o filtraciones                      [ 2 ]
  5     Fracturas en columnas, vigas, trabes        [ 2 ]
  6     Problemas en sistema eléctrico              [ 2 ]
  7     Problemas en tuberías de agua/drenaje       [ 2 ]

  1 = Sí   2 = No   9 = No sabe
```

---

## ✅ CHECKLIST DE CAPTURA — SECCIÓN I

```
[  ] P1. Clase de Vivienda       = 2
[  ] P2. Material de Paredes     = 8
[  ] P3. Material de Techos      = 10
[  ] P4. Material de Pisos       = 3
[  ] P5. Antigüedad              = 12 años
[  ] P6. Cuarto para cocinar     = 1 (Sí)
[  ] P7. Duermen en cocina       = 2 (No)
[  ] P8. Dormitorios             = 3
[  ] P9. Cuartos totales         = 5
[  ] P10. Lugar de cocina        = 1
[  ] P11. Agua entubada          = 1 (Dentro)
[  ] P12. Origen del agua        = 1 (Servicio público)
[  ] P13. Acarreo de agua        = — (N/A)
[  ] P14. Días de agua semana    = 1 (Diario)
[  ] P15. Tipo sanitario         = 1 (Taza de baño)
[  ] P16. Sanitario compartido   = 2 (No)
[  ] P17. Descarga de agua       = 1 (Directa)
[  ] P18. Biodigestor            = 2 (No)
[  ] P19. Baños (c/r/s)          = 1 / 1 / 0
[  ] P20. Drenaje                = 1 (Red pública)
[  ] P21. Electricidad           = 1 (Servicio público)
[  ] P22. Focos (total/ahorr)    = 9 / 6
[  ] P23. Combustible            = 3 (Gas tanque)
[  ] P24. Fogón chimenea         = — (N/A)
[  ] P25. Eliminación basura     = 1 (Camión)
[  ] P26. Tenencia               = 4 (Propia)
[  ] P26.1 Renta mensual         = — (N/A)
[  ] P26.2 Estimación renta      = 8500.00
[  ] P26.3 Pago mensual          = — (N/A)
[  ] P26.4 Pagó mes pasado       = — (N/A)
[  ] P27. Adquisición            = 1 (Comprada)
[  ] P28. Vivienda usada         = 1 (Sí)
[  ] P29. Financiamiento         = 8 (Propios recursos)
[  ] P30. Dueño                  = Carlos García, NR 01
[  ] P31. Escrituras             = 1 (Sí, a su nombre)
[  ] P32. Equipamiento           = 1,2,3,4,8,10 (Sí)
[  ] P33. Problemas estructura   = Todos 2 (No)
```

---

---

## SECCIÓN II — RESIDENTES E IDENTIFICACIÓN DE HOGARES

### Q1. Personas que viven en esta vivienda

```
Total: [ 4 ]  (determinado por la lista de integrantes)
```

### Q2. ¿Todas las personas comparten un mismo gasto para comer?

```
Código: [ 1 ]
  1 = Sí, todas comparten
  2 = No, hay gasto separado
```

### Q3. ¿Cuántos hogares o grupos tienen gasto separado?

```
Número: [ — ]  (No aplica, comparten gasto)
```

### Q4–Q6. Huéspedes

```
Q4. ¿Hay personas que paguen por dormir aquí (huéspedes)?
Código: [ 2 ]   1 = Sí   2 = No

Q5. ¿Cuántos huéspedes?        [ — ]  (No aplica)
Q6. ¿Cuántos pagan para comer? [ — ]  (No aplica)
```

### Q7–Q9. Trabajo Doméstico

```
Q7. ¿Hay personas contratadas para trabajo doméstico que duerman aquí?
Código: [ 2 ]   1 = Sí   2 = No

Q8. ¿Cuántas personas contratadas?  [ — ]  (No aplica)
Q9. ¿Cuántas comen del hogar?       [ — ]  (No aplica)
```

---

## SECCIÓN II — RESIDENTES DEL HOGAR (INTEGRANTES)

### Integrante 01 — Jefe del Hogar

```
NUMPER:              [ 01 ]  (auto-asignado)
Nombre:              [ Carlos Alberto García Mendoza ]
Parentesco:          [ 1 ]  — Jefe(a) del hogar
Sexo:                [ 1 ]  — Hombre
Edad:                [ 45 ]
Fecha de Nacimiento: [ 15/03/1979 ]
Estado Civil:        [ 2 ]  — Casado(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 09 ]  — Licenciatura completa
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 01

```
Q5.  ¿Vive la madre en este hogar?   [ 2 ]  — No
Q5.1 ¿Quién es? (NUMPER)             [ — ]
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q6.1 ¿Quién es? (NUMPER)             [ — ]
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad (1=Sin dificultad, 2=Poca, 3=Mucha, 4=No puede):
  A. Ver, aun usando lentes              [ 2 ]
  B. Oír, aun usando aparato auditivo    [ 1 ]
  C. Mover o usar brazos o manos         [ 1 ]
  D. Caminar, subir o bajar              [ 1 ]
  E. Recordar o concentrarse             [ 1 ]
  F. Bañarse, vestirse o comer           [ 1 ]
  G. Hablar o comunicarse                [ 1 ]
  H. Actividades por problemas mentales  [ 1 ]

Q12. ¿Habla lengua indígena?         [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

### Integrante 02 — Esposa

```
NUMPER:              [ 02 ]  (auto-asignado)
Nombre:              [ María Elena Rodríguez López ]
Parentesco:          [ 2 ]  — Esposa(o) o compañera(o)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 42 ]
Fecha de Nacimiento: [ 22/07/1982 ]
Estado Civil:        [ 2 ]  — Casado(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 07 ]  — Preparatoria completa
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 02

```
Q5.  ¿Vive la madre en este hogar?   [ 2 ]  — No
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla lengua indígena?         [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

### Integrante 03 — Hijo

```
NUMPER:              [ 03 ]  (auto-asignado)
Nombre:              [ Carlos Alberto García Rodríguez ]
Parentesco:          [ 3 ]  — Hijo(a)
Sexo:                [ 1 ]  — Hombre
Edad:                [ 16 ]
Fecha de Nacimiento: [ 05/11/2008 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 05 ]  — Secundaria completa
¿Asiste a la escuela? [ 1 ]  — Sí
```

#### Datos Sociodemográficos — Integrante 03

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — María Elena
Q6.  ¿Vive el padre en este hogar?   [ 1 ]  — Sí
Q6.1 ¿Quién es? (NUMPER)             [ 01 ] — Carlos Alberto
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla lengua indígena?         [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

### Integrante 04 — Hija

```
NUMPER:              [ 04 ]  (auto-asignado)
Nombre:              [ Ana Sofía García Rodríguez ]
Parentesco:          [ 3 ]  — Hijo(a)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 8 ]
Fecha de Nacimiento: [ 30/01/2016 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 02 ]  — Primaria incompleta
¿Asiste a la escuela? [ 1 ]  — Sí
```

#### Datos Sociodemográficos — Integrante 04

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — María Elena
Q6.  ¿Vive el padre en este hogar?   [ 1 ]  — Sí
Q6.1 ¿Quién es? (NUMPER)             [ 01 ] — Carlos Alberto
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla lengua indígena?         [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

## SECCIÓN III — INGRESOS DE LOS INTEGRANTES (12+ años)

### Ingresos — Integrante 01 (Carlos Alberto García, 45 años)

```
¿Trabajó la semana pasada?          [ 1 ]  — Sí
Ocupación principal:                [ Contador público ]
Tipo de trabajo:                    [ 1 ]  — Empleado u obrero
Horas trabajadas:                   [ 45 ]
Ingreso mensual:                    [ 28500.00 ]
¿Tiene otro trabajo?                [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

### Ingresos — Integrante 02 (María Elena Rodríguez, 42 años)

```
¿Trabajó la semana pasada?          [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 1 ]  — Sí
  Nombre del programa:              [ Pensión para el Bienestar ]
  Monto del programa:               [ 3000.00 ]
  Periodicidad:                     [ 2 ]  — Bimestral
```

### Ingresos — Integrante 03 (Carlos Alberto García R., 16 años)

```
¿Trabajó la semana pasada?          [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

> Integrante 04 (8 años) no aparece en esta sección — solo aplica a ≥12 años.

---

## SECCIÓN IV — ACCESO A LA ALIMENTACIÓN

```
Código  Pregunta                                           Respuesta
─────── ────────────────────────────────────────────────── ─────────
  1     ¿Los alimentos fueron de poca variedad?             [ 2 ]
  2     ¿Dejó de comer algún alimento?                      [ 2 ]
  3     ¿Comió menos de lo que debía?                       [ 2 ]
  4     ¿Se quedó sin comida?                               [ 2 ]
  5     ¿Sintió hambre pero no comió?                       [ 2 ]
  6     ¿Comió solo una vez al día?                         [ 2 ]

  1 = Sí   2 = No
```

---

## SECCIÓN VII — CAMBIO CLIMÁTICO

```
Código  Pregunta                    Respuesta
─────── ─────────────────────────── ─────────
  1     ¿Hubo sequía?               [ 1 ]
  2     ¿Hubo inundación?           [ 2 ]
  3     ¿Hubo helada?               [ 2 ]
  4     ¿Hubo incendio?             [ 2 ]
  5     ¿Hubo huracán?              [ 2 ]

  1 = Sí   2 = No
```

---

```
─────────────────────────────────────────────
  CUESTIONARIO DE NEGOCIOS DEL HOGAR
─────────────────────────────────────────────
FOLIOVIV:  1405028038    FOLIOHOG:  1

¿ALGÚN INTEGRANTE DEL HOGAR TIENE UN NEGOCIO
(actividad económica independiente)?

  [X] Sí → Complete esta sección
  [ ] No → Pase al siguiente cuestionario

─────────────────────────────────────────────
NEGOCIO 1

Integrante que lo opera:  NUMPER 02 — Laura Elena Ríos
Tipo de negocio:          Venta de ropa por catálogo
¿Es la actividad principal?  No (es complementaria)

¿Tiene local o establecimiento?  [ ] Sí  [X] No — venta a domicilio
¿Lleva contabilidad del negocio? [ ] Sí  [X] No
¿Está dado de alta en Hacienda?  [ ] Sí  [X] No

Ingreso mensual estimado del negocio:   $2,500.00
Gastos mensuales del negocio:           $1,200.00 (compra de mercancía)

─────────────────────────────────────────────
```

---

## 6️⃣ CUESTIONARIO DE GASTOS DEL HOGAR

```
─────────────────────────────────────────────
  CUESTIONARIO DE GASTOS DEL HOGAR
─────────────────────────────────────────────
FOLIOVIV:  1405028038    FOLIOHOG:  1

Los siguientes gastos corresponden al TRIMESTRE
(julio, agosto, septiembre 2024).

SECCIÓN I — GASTO EN ALIMENTOS, BEBIDAS Y TABACO (trimestral)

  Carnes (res, cerdo, pollo):             $5,400.00
  Cereales (tortilla, pan, arroz, pasta): $3,200.00
  Verduras y legumbres:                   $2,800.00
  Frutas:                                 $1,100.00
  Leche y derivados:                      $1,350.00
  Huevo:                                  $720.00
  Aceites y grasas:                       $380.00
  Azúcar y mieles:                        $160.00
  Café, té, chocolate:                    $240.00
  Bebidas no alcohólicas:                 $600.00
  Bebidas alcohólicas:                    $450.00
  Alimentos fuera del hogar:              $3,600.00
  Otros alimentos:                        $850.00

SECCIÓN II — TRANSPORTE Y COMUNICACIONES

  Transporte público (camión, metro):     $3,000.00
  Gasolina para auto particular:          $4,800.00
  Mantenimiento del auto:                 $1,500.00
  Teléfono celular (2 líneas):            $1,200.00
  Internet del hogar:                     $1,500.00

SECCIÓN III — VIVIENDA Y SERVICIOS

  Renta de la vivienda:                   $0.00 (vivienda propia)
  Electricidad:                           $2,100.00
  Agua:                                   $600.00
  Gas (tanque estacionario):              $1,200.00
  Predial:                                $450.00 (anual, prorrateado)
  Mantenimiento del hogar:                $900.00

SECCIÓN IV — EDUCACIÓN Y ESPARCIMIENTO

  Útiles escolares:                       $1,800.00
  Uniformes:                              $2,400.00
  Cuotas escolares:                       $900.00
  Cine, eventos, entretenimiento:         $1,200.00

SECCIÓN V — SALUD

  Medicamentos:                           $600.00
  Consultas médicas particulares:         $1,200.00
  Lentes o aparatos:                      $0.00

SECCIÓN VI — VESTIDO Y CALZADO

  Ropa para todos los integrantes:        $4,500.00
  Calzado:                                $2,400.00

SECCIÓN VII — CUIDADOS PERSONALES

  Jabón, shampoo, pasta dental:           $900.00
  Corte de cabello, estética:             $750.00
  Pañales/toallas:                        $0.00

SECCIÓN VIII — ENSERES DOMÉSTICOS Y LIMPIEZA

  Detergentes y limpiadores:              $600.00
  Utensilios de cocina:                   $400.00
  Blancos (sábanas, toallas):             $300.00
─────────────────────────────────────────────
```

---

## 7️⃣ CUADERNILLO DE GASTOS DIARIOS

```
─────────────────────────────────────────────
  CUADERNILLO DE GASTOS DIARIOS
─────────────────────────────────────────────
FOLIOVIV:  1405028038    FOLIOHOG:  1

INFORMANTE:  Laura Elena Ríos Fuentes (NUMPER 02)
             (es quien realiza las compras del hogar)

PERIODO:  Semana del 18 al 24 de septiembre de 2024
─────────────────────────────────────────────

DÍA 1 — LUNES 18 DE SEPTIEMBRE

  Tortillería (2 kg tortilla):            $52.00
  Panadería (6 bolillos, 2 conchas):      $68.00
  Carnicería (1 kg bistec de res):        $180.00
  Frutería (1 kg plátano, 1/2 kg uva):    $72.00
  Leche (2 litros):                       $54.00
  Tiendita (1 coca 2L, 1 bolsa papas):   $62.00
  Transporte (2 pasajes camión):           $20.00

DÍA 2 — MARTES 19 DE SEPTIEMBRE

  Tortillería (2 kg tortilla):            $52.00
  Huevo (1/2 kg — 8 piezas):              $38.00
  Verdulería (jitomate, cebolla, chile):  $45.00
  Cremería (1/4 kg queso fresco):         $42.00
  Gasolina (20 litros):                   $480.00
  Farmacia (paracetamol):                 $85.00

DÍA 3 — MIÉRCOLES 20 DE SEPTIEMBRE

  Tortillería (2 kg):                     $52.00
  Pollería (1 kg pechuga):                $95.00
  Verdulería (lechuga, zanahoria):        $38.00
  Panadería (4 bolillos):                 $28.00
  Recarga celular:                        $100.00

DÍA 4 — JUEVES 21 DE SEPTIEMBRE

  Tortillería (2 kg):                     $52.00
  Pescadería (1/2 kg filete tilapia):     $78.00
  Frutería (1 kg manzana):                $45.00
  Abarrotes (1 kg frijol, 1 kg arroz):    $62.00
  Jabón de lavandería:                    $35.00

DÍA 5 — VIERNES 22 DE SEPTIEMBRE

  Tortillería (2 kg):                     $52.00
  Carnicería (1/2 kg carne molida):       $78.00
  Verdulería (calabaza, ejote, cilantro): $40.00
  Tiendita (refresco, galletas):          $48.00
  Corte de cabello Diego:                 $120.00

DÍA 6 — SÁBADO 23 DE SEPTIEMBRE

  Tortillería (2 kg):                     $52.00
  Panadería (6 bolillos, 1 pastelito):    $82.00
  Salchichonería (jamón, queso americano): $95.00
  Gasolina (15 litros):                   $360.00
  Cine (2 entradas, combo palomitas):     $320.00
  Pizza Domino's (familiar):              $289.00

DÍA 7 — DOMINGO 24 DE SEPTIEMBRE

  Tortillería (1 kg):                     $26.00
  Carnicería (1 kg chuleta de cerdo):     $145.00
  Verdulería (aguacate, limón):           $52.00
  Frutería (1 kg mango, 1/2 kg fresa):    $68.00
  Domingo para Diego:                     $200.00

─────────────────────────────────────────────
ESTIMACIÓN MENSUAL (anotada el día 6):

  Gasto mensual en tortillería:           $620.00
  Gasto mensual en carnicería:            $1,800.00
  Gasto mensual en verdulería/frutería:   $1,500.00
  Gasto mensual en abarrotes:             $900.00
  Transporte público mensual:             $320.00
  Gasolina mensual:                       $2,000.00
─────────────────────────────────────────────
```


## ✅ CHECKLIST DE CAPTURA — SECCIÓN II, III, IV, VII

```
SECCIÓN II — Identificación de Hogares
[  ] Q1. Total personas             = 4
[  ] Q2. Comparten gasto            = 1 (Sí)
[  ] Q3. Hogares gasto separado     = — (N/A)
[  ] Q4. Tiene huéspedes            = 2 (No)
[  ] Q7. Trabajo doméstico          = 2 (No)

SECCIÓN II — Integrantes
[  ] 01 — Carlos García (Jefe, 45, ♂, Casado, Licenciatura)
[  ] 02 — María Elena (Esposa, 42, ♀, Casada, Preparatoria)
[  ] 03 — Carlos García R. (Hijo, 16, ♂, Soltero, Secundaria)
[  ] 04 — Ana Sofía (Hija, 8, ♀, Soltera, Primaria incompleta)

SECCIÓN III — Ingresos
[  ] 01 — Trabaja (empleado, contador, $28,500/mes)
[  ] 02 — No trabaja, recibe Pensión Bienestar ($3,000/bimestral)
[  ] 03 — No trabaja, no recibe programas
[  ] 04 — No aplica (<12 años)

SECCIÓN IV — Alimentación
[  ] Todas 2 (No) — sin problemas de acceso

SECCIÓN VII — Cambio Climático
[  ] Solo sequía = 1 (Sí), resto = 2 (No)
```

---

## 💡 Tips para esta práctica

### Sección I — Vivienda
- **P10** (Lugar de cocina) aparece después de P9
- **P13** solo aplica si NO tienen agua entubada (P11=3)
- **P15-P18**: si P15=3 (no tienen sanitario), P16 y P17 no aplican
- **P24** solo aplica si cocinan con leña o carbón (P23=1 o 2)
- **P26.1-P26.4** varían según el código de tenencia (P26)
- **P27** solo si P26=3, 4 o 5
- **P28** solo si P27=1 (comprada hecha)
- **P32**: cada equipamiento se captura individualmente (1=Sí, 2=No)
- **P33**: acepta 9=No sabe además de 1/2

### Sección II — Residentes
- **Q3** solo aparece si Q2=2 (gasto separado)
- **Q5-Q6** solo si Q4=1 (tiene huéspedes)
- **Q8-Q9** solo si Q7=1 (tiene trabajo doméstico)
- Las preguntas de madre/padre (Q5-Q6) aparecen SOLO si la persona no es jefe ni esposa
- **Q13-Q14** (lengua indígena) solo si Q12=1 (habla lengua)
- **Q15** (entiende lengua) solo si Q12=2 (NO habla lengua)
- Cada integrante se agrega con el botón "+ Agregar Integrante" y se puede colapsar/expandir

### Sección III — Ingresos
- Solo aparecen los integrantes de **12 años o más**
- Campos de trabajo (ocupación, tipo, horas, ingreso) solo si trabajó la semana pasada
- Campos de programa (nombre, monto, periodicidad) solo si recibe programa

### Sección IV y VII
- Secciones simples: todas las preguntas usan código 1=Sí / 2=No
- Aparecen al final del cuestionario de Hogares y Vivienda, después de los ingresos
