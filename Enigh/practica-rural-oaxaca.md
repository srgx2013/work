# Práctica de Captura — Hogar Rural de Bajos Recursos (ENIGH 2024)

> **Dificultad: ALTA**  
> Folio de práctica para un hogar de 6 personas en zona rural de Oaxaca,
> con ingresos informales, lengua indígena, discapacidad, cocina con leña,
> letrina y condiciones de vivienda precarias.  
> **Todos los cuestionarios con todos los campos y variantes posibles.**
>
> Usalo con el simulador IKTAN para practicar la captura con códigos numéricos.

---

## 📋 DATOS DEL FOLIO

| Campo | Valor |
|-------|-------|
| **FOLIOVIV** | `2015037028` |
| **FOLIOHOG** | `1` |
| **Decena** | 5 |
| **Entidad** | 20 — Oaxaca |
| **Entrevistador** | Pedro Hernández Santiago |
| **Supervisor** | Ana Laura Vázquez Reyes |
| **Resultado** | A1 — Entrevista completa |
| **Fecha inicio** | 22/09/2024 |
| **Fecha término** | 29/09/2024 |

---

## SECCIÓN I — CARACTERÍSTICAS DE LA VIVIENDA (P1–P33)

### P1. Clase de Vivienda

```
Código: [ 1 ]
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
Código: [ 7 ]
  1 = Desecho          5 = Embarro o bajareque
  2 = Lámina de cartón  6 = Madera
  3 = Lámina asbesto    7 = Adobe
  4 = Carrizo, bambú   8 = Tabique, block, piedra, cemento
```

### P3. Material de Techos

```
Código: [ 3 ]
  1 = Desecho           6 = Palma o paja
  2 = Lámina cartón     7 = Madera o tejamanil
  3 = Lámina metálica   8 = Terrado con viguería
  4 = Lámina asbesto    9 = Teja
  5 = Fibrocemento     10 = Losa de concreto o viguetas
```

### P4. Material de Pisos

```
Código: [ 2 ]
  1 = Tierra
  2 = Cemento o firme
  3 = Madera, mosaico u otro recubrimiento
```

### P5. Antigüedad de la Vivienda

```
Años: [ 35 ]
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
Número: [ 2 ]
  (Sin contar pasillos ni baños)
```

### P9. ¿Cuántos cuartos tiene en total?

```
Número: [ 3 ]
  (Contando cocina, sin pasillos ni baños)
```

### P10. ¿El espacio para cocinar está...?

```
Código: [ 2 ]
  1 = Al interior de la vivienda
  2 = En un cuarto separado de la vivienda
  3 = En un pasillo o corredor fuera de la vivienda
  4 = En un tejabán o techito
  5 = Al aire libre
  6 = ¿No tiene espacio para cocinar?
```

### P11. ¿El agua la obtienen de llaves o mangueras que están...?

```
Código: [ 2 ]
  1 = Dentro de la vivienda
  2 = Solo en el patio o terreno
  3 = No tienen agua entubada → Pase a P13
```

### P12. ¿El agua que usan proviene...?

```
Código: [ 2 ]
  1 = Del servicio público de agua
  2 = De un pozo comunitario
  3 = De un pozo particular
  4 = De una pipa
  5 = De otra vivienda
  6 = De la lluvia
  (Solo si P11 = 1 o 2)
```

### P13. Entonces, ¿acarrean el agua de...?

```
Código: [ — ]  (No aplica, P11=2 tienen agua entubada en el patio)
```

### P14. ¿Cuántos días a la semana llega el agua?

```
Código: [ 2 ]
  1 = Diario
  2 = Cada tercer día
  3 = Dos veces por semana
  4 = Una vez por semana
  5 = De vez en cuando
```

### P15. ¿Tienen...?

```
Código: [ 2 ]
  1 = Taza de baño (excusado o sanitario)
  2 = Letrina (pozo u hoyo)
  3 = No tienen taza de baño ni letrina → Pase a P20
```

### P16. ¿La taza de baño (letrina) es compartida con otra vivienda?

```
Código: [ 2 ]   1 = Sí   2 = No
  (Solo si P15 = 1 o 2)
```

### P17. ¿La taza de baño (letrina)...?

```
Código: [ 3 ]
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
Con excusado y regadera: [ 0 ]
Solo con excusado:       [ 0 ]
Solo con regadera:       [ 0 ]
```

### P20. Drenaje

```
Código: [ 2 ]
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
Total de focos:    [ 4 ]
Focos ahorradores: [ 1 ]
```

### P23. ¿El combustible que más usan para cocinar es...?

```
Código: [ 1 ]
  1 = Leña              5 = Electricidad → Pase a P25
  2 = Carbón            6 = Otro combustible
  3 = Gas de tanque     7 = No cocinan → Pase a P25
  4 = Gas natural
```

### P24. ¿El fogón donde cocinan con leña o carbón...?

```
Código: [ 2 ]
  1 = Tiene tubo o chimenea para sacar el humo
  2 = No tiene tubo o chimenea para sacar el humo
  (Solo si P23 = 1 o 2)
```

### P25. Eliminación de basura

```
Código: [ 5 ]
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

#### P26.2 ¿Cuánto pagaría mensualmente si la estuviera rentando?

```
Monto estimado: [ 350.00 ]
  (P26=4 propia → aplica estimación de renta)
```

### P27. Adquisición — La vivienda...

```
Código: [ 3 ]
  1 = La compró hecha          4 = La heredó
  2 = La mandó construir       5 = La recibió como apoyo del gobierno
  3 = La construyó ella/él     6 = La obtuvo de otra manera
  (Solo si P26 = 3, 4 o 5)
```

### P28. Cuando compraron esta vivienda, ¿era usada?

```
Código: [ — ]  (P27=3, no aplica)
```

### P29. ¿Para pagar o construir esta vivienda...?

```
Códigos (separados por coma): [ 8 ]
  1 = INFONAVIT          5 = Un banco
  2 = FOVISSSTE          6 = Otra institución
  3 = PEMEX              7 = Familiar, amigo o prestamista
  4 = FONHAPO            8 = Propios recursos
```

### P30. ¿Quién es la dueña o dueño?

```
Nombre:    [ María Jiménez Cruz ]
N.R.:      [ 01 ]
N.H.:      [ 1 ]
```

### P31. Escrituras

```
Código: [ 3 ]
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
  2     Fregadero o tarja             [ 2 ]
  3     Regadera                      [ 2 ]
  4     Tinaco en la azotea           [ 2 ]
  5     Cisterna o aljibe             [ 2 ]
  6     Pileta, tanque de agua        [ 1 ]
  7     Calentador solar de agua      [ 2 ]
  8     Boiler o calentador (gas/e)   [ 2 ]
  9     Boiler o calentador (leña)    [ 1 ]
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
  1     Grietas en techos o muros                   [ 1 ]
  2     Pandeos en marcos de puertas/ventanas       [ 2 ]
  3     Levantamientos del piso                     [ 2 ]
  4     Humedad o filtraciones                      [ 1 ]
  5     Fracturas en columnas, vigas, trabes        [ 2 ]
  6     Problemas en sistema eléctrico              [ 2 ]
  7     Problemas en tuberías de agua/drenaje       [ 2 ]

  1 = Sí   2 = No   9 = No sabe
```

---

## SECCIÓN II — RESIDENTES E IDENTIFICACIÓN DE HOGARES (Q1–Q9)

### Q1. Personas que viven en esta vivienda

```
Total: [ 6 ]  (determinado por la lista de integrantes)
```

### Q2. ¿Todas las personas comparten un mismo gasto para comer?

```
Código: [ 1 ]
  1 = Sí, todas comparten
  2 = No, hay gasto separado
```

### Q4–Q6. Huéspedes

```
Q4. ¿Hay personas que paguen por dormir aquí?
Código: [ 2 ]   1 = Sí   2 = No
```

### Q7–Q9. Trabajo Doméstico

```
Q7. ¿Hay personas contratadas para trabajo doméstico que duerman aquí?
Código: [ 2 ]   1 = Sí   2 = No
```

---

## SECCIÓN II — RESIDENTES DEL HOGAR (6 INTEGRANTES)

---

### Integrante 01 — Jefa del Hogar (Abuela)

```
NUMPER:              [ 01 ]  (auto-asignado)
Nombre:              [ María Jiménez Cruz ]
Parentesco:          [ 1 ]  — Jefe(a) del hogar
Sexo:                [ 2 ]  — Mujer
Edad:                [ 68 ]
Fecha de Nacimiento: [ 10/05/1956 ]
Estado Civil:        [ 6 ]  — Viudo(a)
¿Sabe leer y escribir? [ 2 ]  — No
Nivel Escolaridad:   [ 00 ]  — Ninguno
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 01

```
Q5.  ¿Vive la madre en este hogar?   [ 2 ]  — No
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad (1=Sin dificultad, 2=Poca, 3=Mucha, 4=No puede):
  A. Ver, aun usando lentes              [ 3 ]  — Mucha dificultad
  B. Oír, aun usando aparato auditivo    [ 2 ]  — Poca dificultad
  C. Mover o usar brazos o manos         [ 2 ]  — Poca dificultad
  D. Caminar, subir o bajar              [ 3 ]  — Mucha dificultad
  E. Recordar o concentrarse             [ 2 ]  — Poca dificultad
  F. Bañarse, vestirse o comer           [ 2 ]  — Poca dificultad
  G. Hablar o comunicarse                [ 1 ]  — Sin dificultad
  H. Actividades por problemas mentales  [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 1 ]  — Sí
Q13. ¿Qué lengua?                    [ Zapoteco ]
Q14. ¿Habla también español?         [ 1 ]  — Sí
Q16. ¿Se considera indígena?         [ 1 ]  — Sí
```

---

### Integrante 02 — Hija

```
NUMPER:              [ 02 ]  (auto-asignado)
Nombre:              [ Rosa Jiménez Hernández ]
Parentesco:          [ 3 ]  — Hijo(a)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 45 ]
Fecha de Nacimiento: [ 02/11/1978 ]
Estado Civil:        [ 4 ]  — Separado(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 02 ]  — Primaria incompleta
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 02

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 01 ] — María Jiménez
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 1 ]  — Sí
Q13. ¿Qué lengua?                    [ Zapoteco ]
Q14. ¿Habla también español?         [ 1 ]  — Sí
Q16. ¿Se considera indígena?         [ 1 ]  — Sí
```

---

### Integrante 03 — Nieto mayor

```
NUMPER:              [ 03 ]  (auto-asignado)
Nombre:              [ Luis Hernández Jiménez ]
Parentesco:          [ 4 ]  — Nieto(a)
Sexo:                [ 1 ]  — Hombre
Edad:                [ 19 ]
Fecha de Nacimiento: [ 18/03/2005 ]
Estado Civil:        [ 3 ]  — Unión libre
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 03 ]  — Primaria completa
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 03

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Rosa Jiménez
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 1 ]  — Sí
Q16. ¿Se considera indígena?         [ 1 ]  — Sí
```

---

### Integrante 04 — Nieta adolescente

```
NUMPER:              [ 04 ]  (auto-asignado)
Nombre:              [ Carmen Hernández Jiménez ]
Parentesco:          [ 4 ]  — Nieto(a)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 15 ]
Fecha de Nacimiento: [ 25/12/2008 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 02 ]  — Primaria incompleta
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 04

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Rosa Jiménez
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 1 ]  — Sí
Q16. ¿Se considera indígena?         [ 1 ]  — Sí
```

---

### Integrante 05 — Nieto (niño)

```
NUMPER:              [ 05 ]  (auto-asignado)
Nombre:              [ Pedro Hernández Jiménez ]
Parentesco:          [ 4 ]  — Nieto(a)
Sexo:                [ 1 ]  — Hombre
Edad:                [ 10 ]
Fecha de Nacimiento: [ 08/07/2014 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 02 ]  — Primaria incompleta
¿Asiste a la escuela? [ 1 ]  — Sí
```

#### Datos Sociodemográficos — Integrante 05

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Rosa Jiménez
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 1 ]  — Sí
```

---

### Integrante 06 — Nieta (preescolar)

```
NUMPER:              [ 06 ]  (auto-asignado)
Nombre:              [ Lucía Hernández Jiménez ]
Parentesco:          [ 4 ]  — Nieto(a)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 4 ]
Fecha de Nacimiento: [ 14/02/2020 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 2 ]  — No
Nivel Escolaridad:   [ 00 ]  — Ninguno
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 05

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Rosa Jiménez
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad:
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla alguna lengua indígena?  [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

## SECCIÓN III — INGRESOS DE LOS INTEGRANTES (12+ años)

### Ingresos — Integrante 01 (María Jiménez, 68 años)

```
¿Trabajó la semana pasada?          [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 1 ]  — Sí
  Nombre del programa:              [ Pensión para el Bienestar de Adultos Mayores ]
  Monto del programa:               [ 3000.00 ]
  Periodicidad:                     [ 2 ]  — Bimestral
```

### Ingresos — Integrante 02 (Rosa Jiménez, 45 años)

```
¿Trabajó la semana pasada?          [ 1 ]  — Sí
Ocupación principal:                [ Jornalera agrícola y venta en tianguis ]
Tipo de trabajo:                    [ 3 ]  — Trabajador por cuenta propia
Horas trabajadas:                   [ 38 ]
Ingreso mensual:                    [ 3200.00 ]
¿Tiene otro trabajo?                [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 1 ]  — Sí
  Nombre del programa:              [ Sembrando Vida ]
  Monto del programa:               [ 2500.00 ]
  Periodicidad:                     [ 1 ]  — Semanal
```

### Ingresos — Integrante 03 (Luis Hernández, 19 años)

```
¿Trabajó la semana pasada?          [ 1 ]  — Sí
Ocupación principal:                [ Albañil ]
Tipo de trabajo:                    [ 3 ]  — Trabajador por cuenta propia
Horas trabajadas:                   [ 24 ]
Ingreso mensual:                    [ 1800.00 ]
¿Tiene otro trabajo?                [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

### Ingresos — Integrante 04 (Carmen Hernández, 15 años)

```
¿Trabajó la semana pasada?          [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 1 ]  — Sí
  Nombre del programa:              [ Beca Benito Juárez ]
  Monto del programa:               [ 920.00 ]
  Periodicidad:                     [ 2 ]  — Bimestral
```

> Integrantes 05 (10 años) y 06 (4 años) no aparecen en esta sección.

---

## SECCIÓN IV — ACCESO A LA ALIMENTACIÓN

```
Código  Pregunta                                           Respuesta
─────── ────────────────────────────────────────────────── ─────────
  1     ¿Los alimentos fueron de poca variedad?             [ 1 ]
  2     ¿Dejó de comer algún alimento?                      [ 1 ]
  3     ¿Comió menos de lo que debía?                       [ 1 ]
  4     ¿Se quedó sin comida?                               [ 2 ]
  5     ¿Sintió hambre pero no comió?                       [ 1 ]
  6     ¿Comió solo una vez al día?                         [ 2 ]

  1 = Sí   2 = No
```

> ⚠️ Este hogar presenta inseguridad alimentaria moderada (4 de 6 indicadores positivos).

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

## CUESTIONARIO: MENORES DE 12 AÑOS

### Menor 01 — Pedro Hernández Jiménez (NUMPER 05, 10 años)

```
¿Asiste a educación inicial o guardería?  [ 6 ]  — No asiste a guardería
```

### Menor 02 — Lucía Hernández Jiménez (NUMPER 06, 4 años)

```
¿Asiste a educación inicial o guardería?  [ 6 ]  — No asiste a guardería
  ¿Quién la cuida?                        [ 1 ]  — La madre (Rosa)
```

---

## CUESTIONARIO: PERSONAS DE 12+ AÑOS

### Persona 01 — María Jiménez (NUMPER 01, 68 años)

```
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 6 ]  — INSABI / Centro de Salud
¿Situación conyugal?                               [ 6 ]  — Viudo(a)
```

### Persona 02 — Rosa Jiménez (NUMPER 02, 45 años)

```
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 6 ]  — INSABI / Centro de Salud
¿Situación conyugal?                               [ 4 ]  — Separado(a)
```

### Persona 03 — Luis Hernández (NUMPER 03, 19 años)

```
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 6 ]  — INSABI / Centro de Salud
¿Situación conyugal?                               [ 3 ]  — Unión libre
```

### Persona 04 — Carmen Hernández (NUMPER 04, 15 años)

```
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 6 ]  — INSABI / Centro de Salud
¿Situación conyugal?                               [ 1 ]  — Soltero(a)
```

---

## CUESTIONARIO: NEGOCIOS DEL HOGAR

```
¿Algún integrante del hogar tiene un negocio?  [ 1 ]  — Sí
```

### Negocio 1 — Venta en tianguis

```
NUMPER del operador:          [ 02 ]
Tipo de negocio:              [ Venta de tortillas hechas a mano en el tianguis ]
¿Es actividad principal?      [ 2 ]  — No (también trabaja de jornalera)
¿Tiene local o establecimiento? [ 2 ]  — No (puesto ambulante en tianguis)
¿Lleva contabilidad?          [ 2 ]  — No
¿Dado de alta en Hacienda?    [ 2 ]  — No
Ingreso mensual del negocio:  [ 1600.00 ]
Gastos mensuales del negocio: [ 650.00 ]
```

---

## CUESTIONARIO: GASTOS DEL HOGAR — Trimestre julio-septiembre 2024

### Sección I — Alimentos, Bebidas y Tabaco

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Carnes                           1,500.00
Cereales                         2,100.00
Verduras y legumbres             1,200.00
Frutas                             450.00
Leche y derivados                  840.00
Huevo                              480.00
Aceites y grasas                   360.00
Azúcar y mieles                    300.00
Café/té/chocolate                  240.00
Bebidas no alcohólicas             180.00
Bebidas alcohólicas                120.00
Alimentos fuera del hogar          300.00
Otros alimentos                    150.00
──────────────────────────────────────────────
Subtotal Sección I              8,220.00
```

### Sección II — Transporte y Comunicaciones

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Transporte público              1,800.00
Gasolina                             0.00
Mantenimiento del auto               0.00
Teléfono celular                  600.00
Internet                             0.00
──────────────────────────────────────────────
Subtotal Sección II             2,400.00
```

### Sección III — Vivienda y Servicios

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Renta                                0.00 (propia)
Electricidad                       450.00
Agua                                30.00 (cooperación del pozo)
Gas                                900.00
Predial                              0.00
Mantenimiento del hogar            300.00
──────────────────────────────────────────────
Subtotal Sección III            1,680.00
```

### Sección IV — Educación y Esparcimiento

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Útiles escolares                   450.00
Uniformes                          150.00
Cuotas escolares                    75.00
Cine/eventos/entretenimiento        60.00
──────────────────────────────────────────────
Subtotal Sección IV               735.00
```

### Sección V — Salud

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Medicamentos                       360.00
Consultas médicas                  150.00
Lentes o aparatos                    0.00
──────────────────────────────────────────────
Subtotal Sección V                510.00
```

### Sección VI — Vestido y Calzado

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Ropa                               750.00
Calzado                            450.00
──────────────────────────────────────────────
Subtotal Sección VI             1,200.00
```

### Sección VII — Cuidados Personales

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Jabón/shampoo/pasta dental         360.00
Corte de cabello/estética          120.00
Pañales/toallas                    150.00
──────────────────────────────────────────────
Subtotal Sección VII              630.00
```

### Sección VIII — Enseres Domésticos y Limpieza

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Detergentes y limpiadores          300.00
Utensilios de cocina               120.00
Blancos (sábanas, toallas)         150.00
──────────────────────────────────────────────
Subtotal Sección VIII             570.00
```

### 💰 GASTO TRIMESTRAL TOTAL

```
Sección                                         Subtotal
──────────────────────────────────────────────── ──────────────
I.   Alimentos, Bebidas y Tabaco                   8,220.00
II.  Transporte y Comunicaciones                   2,400.00
III. Vivienda y Servicios                          1,680.00
IV.  Educación y Esparcimiento                       735.00
V.   Salud                                           510.00
VI.  Vestido y Calzado                              1,200.00
VII. Cuidados Personales                              630.00
VIII.Enseres Domésticos y Limpieza                    570.00
──────────────────────────────────────────────── ──────────────
TOTAL TRIMESTRAL                                  15,945.00
```

---

## CUESTIONARIO: GASTOS DIARIOS (7 días)

### Informante

```
NUMPER del informante: [ 02 ]  — Rosa Jiménez
```

### Día a día

```
Día        Conceptos y montos
─────────  ──────────────────────────────────────────────────────
Lunes      Tortillas $30.00, Frijol $25.00, Verdura mercada $40.00
Martes     Tortillas $30.00, Leña $0.00 (recolectada), Huevo $30.00
Miércoles  Tortillas $30.00, Verduras $35.00
Jueves     Tortillas $30.00, Pollo $85.00, Frijol $25.00
Viernes    Tortillas $30.00, Pescado seco $50.00
Sábado     Tortillas $30.00, Verdura $40.00
Domingo    Tortillas $30.00, Carne de res $95.00 (día de tianguis)
```

### Estimación Mensual

```
Concepto       Monto
─────────────  ─────────
Tortillería      — (hacen tortillas en casa)
Carnicería      420.00
Verdulería      360.00
Abarrotes       200.00
Transporte      400.00
Gasolina          0.00
```

---

## ✅ CHECKLIST DE CAPTURA — TODOS LOS CUESTIONARIOS

```
SECCIÓN I — Vivienda (P1-P33)
[  ] P1. Clase vivienda            = 1 (Casa única)
[  ] P2. Paredes                   = 7 (Adobe)
[  ] P3. Techos                    = 3 (Lámina metálica)
[  ] P4. Pisos                     = 2 (Cemento o firme)
[  ] P5. Antigüedad               = 35 años
[  ] P6. Cuarto cocina            = 1 (Sí)
[  ] P7. Duermen en cocina        = 2 (No)
[  ] P8. Dormitorios              = 2
[  ] P9. Cuartos totales          = 3
[  ] P10. Lugar cocina            = 2 (Cuarto separado)
[  ] P11. Agua entubada           = 2 (Solo patio)
[  ] P12. Origen agua             = 2 (Pozo comunitario)
[  ] P14. Días agua               = 2 (Cada tercer día)
[  ] P15. Tipo sanitario          = 2 (Letrina)
[  ] P16. Compartido              = 2 (No)
[  ] P17. Descarga agua           = 3 (No se le puede echar agua)
[  ] P18. Biodigestor             = 2 (No)
[  ] P19. Baños                   = 0/0/0
[  ] P20. Drenaje                 = 2 (Fosa séptica)
[  ] P21. Electricidad            = 1 (Servicio público)
[  ] P22. Focos                   = 4/1
[  ] P23. Combustible             = 1 (Leña) ⚠️
[  ] P24. Fogón chimenea          = 2 (Sin chimenea) ⚠️
[  ] P25. Basura                  = 5 (La entierran)
[  ] P26. Tenencia                = 4 (Propia)
[  ] P26.2 Estimación renta       = $350.00
[  ] P27. Adquisición             = 3 (La construyó)
[  ] P29. Financiamiento          = 8 (Propios recursos)
[  ] P30. Dueña                   = María Jiménez Cruz, NR 01
[  ] P31. Escrituras              = 3 (No tiene)
[  ] P32. Equipamiento            = lavadero, pileta, boiler leña, medidor luz
[  ] P33. Problemas               = grietas(1), humedad(1), resto(2)

SECCIÓN II — Identificación (Q1-Q9)
[  ] Q1. Total personas           = 6
[  ] Q2. Comparten gasto          = 1 (Sí)
[  ] Q4. Huéspedes                = 2 (No)
[  ] Q7. Trabajo doméstico        = 2 (No)

SECCIÓN II — Integrantes (6 personas)
[  ] 01 — María Jiménez (Jefa, 68, ♀, Viuda, Sin estudios, habla zapoteco, discapacidad)
[  ] 02 — Rosa Jiménez (Hija, 45, ♀, Separada, Prim.incomp., jornalera + tianguis)
[  ] 03 — Luis Hernández (Nieto, 19, ♂, Unión libre, Prim.completa, albañil)
[  ] 04 — Carmen Hernández (Nieta, 15, ♀, Soltera, Prim.incomp., no asiste escuela)
[  ] 05 — Pedro Hernández (Nieto, 10, ♂, Soltero, asiste primaria)
[  ] 06 — Lucía Hernández (Nieta, 4, ♀, Soltera, preescolar)

SECCIÓN III — Ingresos (4 perceptores 12+)
[  ] 01 — Pensión Bienestar Adultos Mayores ($3,000 bimestral = $1,500/mes)
[  ] 02 — Jornalera ($3,200/mes) + Sembrando Vida ($2,500/semana) + Tianguis ($1,600/mes − $650)
[  ] 03 — Albañil informal ($1,800/mes)
[  ] 04 — Beca Benito Juárez ($920 bimestral)

SECCIÓN IV — Alimentación
[  ] 4 de 6 en Sí — inseguridad alimentaria moderada

SECCIÓN VII — Cambio Climático
[  ] Solo sequía = 1 (Sí), resto = 2 (No)

MENORES 12 — 2 menores
[  ] 05 — No asiste guardería (6)
[  ] 06 — No asiste guardería (6), la cuida la madre

PERSONAS 12+ — 4 personas
[  ] 01 — INSABI (6), Viuda (6)
[  ] 02 — INSABI (6), Separada (4)
[  ] 03 — INSABI (6), Unión libre (3)
[  ] 04 — INSABI (6), Soltera (1)

NEGOCIOS — 1 negocio informal
[  ] Tiene negocio = 1 (Sí)
[  ] Venta de tortillas en tianguis, NUMPER 02
[  ] No es actividad principal, sin local, sin contabilidad ni Hacienda

GASTOS DEL HOGAR
[  ] 8 secciones → Total trimestral $15,945.00

GASTOS DIARIOS
[  ] Informante = 02 (Rosa)
[  ] 7 días con gastos reducidos
[  ] Sin tortillería (hacen en casa), sin gasolina
```

---

## 💡 Elementos de dificultad en esta práctica

### 🔥 Preguntas activadas que en las otras prácticas no aparecían

| Gatillo | Preguntas activadas | Por qué |
|---------|---------------------|---------|
| **P23 = Leña (1)** | P24 (fogón/chimenea) | Cocinan con leña, sin chimenea — riesgo de salud |
| **P15 = Letrina (2)** | P16, P17 con opciones específicas | Sanitario seco, sin agua |
| **P11 = Agua fuera (2)** | P12 activo, P13 oculto | Tienen agua entubada pero fuera de la vivienda |
| **P14 = Cada tercer día** | Prueba código 2 | No es diario — dato distintivo |
| **P25 = Entierran basura (5)** | Prueba código 5 | Sin servicio de recolección |
| **Adulto mayor sin estudios** | Escolaridad 00, no lee ni escribe | Códigos que no aparecen en hogares urbanos |
| **Q12 = Habla lengua indígena** | Q13 (nombre de lengua), Q14 (habla español) | Solo se activan si Q12=1 |
| **Q12 = No habla lengua** | Q15 (entiende lengua) | Solo se activa si Q12=2 |
| **Discapacidad con niveles 2-3** | Q9 A-H con valores variados | No todo es 1 — refleja condiciones reales |
| **Dos programas de gobierno distintos** | Sección III con nombres y periodicidades diferentes | Pensión (bimestral) vs Sembrando Vida (semanal) |
| **Negocio informal sin local** | Negocios con "No" en local, contabilidad, Hacienda | Diferente al negocio formal de la práctica anterior |

### 🧠 Consistencia entre cuestionarios

- **Lengua**: La abuela (01) y la hija (02) hablan zapoteco. Los nietos (03, 04) no lo hablan pero lo entienden (Q15=1). El nieto de 10 (05) ni habla ni entiende. La más chica (06) no se considera indígena. Esto es verosímil: pérdida generacional de la lengua.
- **Ingreso**: Hay 4 fuentes de ingreso para 6 personas. El ingreso mensual total del hogar es aproximadamente $3,200 + $1,500 + $1,800 + $460 + $950 (neto tianguis) = ~$7,910/mes, contra un gasto trimestral de $15,945 (~$5,315/mes). Cierra.
- **Vivienda**: Adobe, lámina metálica, piso de cemento — coherente con zona rural de Oaxaca.
- **Discapacidad en adulto mayor**: Abuela con mucha dificultad para ver (A=3) y caminar (D=3) — realista para 68 años en contexto rural.
- **Niña de 15 que no asiste a la escuela**: Dato duro pero realista en contextos de bajos recursos.
