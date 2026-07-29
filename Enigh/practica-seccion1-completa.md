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

## 💡 Tips para esta práctica

- **P10** (Lugar de cocina) aparece después de P9 — nuevo campo
- **P13** solo aplica si NO tienen agua entubada (P11=3)
- **P15-P18**: si P15=3 (no tienen sanitario), P16 y P17 no aplican
- **P24** solo aplica si cocinan con leña o carbón (P23=1 o 2)
- **P26.1-P26.4** varían según el código de tenencia (P26)
- **P27** solo si P26=3, 4 o 5
- **P28** solo si P27=1 (comprada hecha)
- **P32**: cada equipamiento se captura individualmente (1=Sí, 2=No)
- **P33**: acepta 9=No sabe además de 1/2
