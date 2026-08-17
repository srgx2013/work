# Práctica de Captura — Familia con Negocio (ENIGH 2024)

> Folio de práctica para una familia de 4 donde ambos padres trabajan
> y el jefe del hogar opera un negocio propio (tienda de abarrotes).
> Cubre todos los cuestionarios: Portada, Hogares y Vivienda,
> Menores 12, Personas 12+, Negocios, Gastos del Hogar, Gastos Diarios.
>
> Usalo con el simulador IKTAN para practicar la captura con códigos numéricos.

---

## 📋 DATOS DEL FOLIO

| Campo | Valor |
|-------|-------|
| **FOLIOVIV** | `1410029045` |
| **FOLIOHOG** | `1` |
| **Decena** | 2 |
| **Entidad** | 14 — Jalisco |
| **Entrevistador** | José Alfredo Ramírez Soto |
| **Supervisor** | María Guadalupe Hernández López |
| **Resultado** | A1 — Entrevista completa |
| **Fecha inicio** | 05/10/2024 |
| **Fecha término** | 11/10/2024 |

---

## SECCIÓN I — CARACTERÍSTICAS DE LA VIVIENDA

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
Años: [ 08 ]
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
Número: [ 4 ]
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
Solo con excusado:       [ 0 ]
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
Total de focos:    [ 7 ]
Focos ahorradores: [ 5 ]
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
Código: [ 1 ]
  1 = Rentada       3 = Propia, la están pagando   5 = Intestada o en litigio
  2 = Prestada      4 = Propia                     6 = Otra situación
```

#### P26.1 ¿Cuál es el monto de la renta mensual?

```
Monto: [ 6500.00 ]
```

> P26.2, P26.3, P26.4 no aplican (solo si rentada → solo P26.1)

### P27. Adquisición — La vivienda...

```
Código: [ — ]  (No aplica, es rentada)
  1 = La compró hecha          4 = La heredó
  2 = La mandó construir       5 = La recibió como apoyo del gobierno
  3 = La construyó ella/él     6 = La obtuvo de otra manera
  (Solo si P26 = 3, 4 o 5)
```

### P28. Cuando compraron esta vivienda, ¿era usada?

```
Código: [ — ]  (No aplica, es rentada)
  (Solo si P27 = 1)
```

### P29. ¿Para pagar o construir esta vivienda...?

```
Códigos: [ — ]  (No aplica, es rentada)
```

### P30. ¿Quién es la dueña o dueño?

```
Nombre:    [ Roberto Sánchez Morales ]
N.R.:      [ 1 ]
N.H.:      [ — ]  (Rentada, no aplica)
```

### P31. Escrituras

```
Código: [ — ]  (No aplica, es rentada)
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
  4     Tinaco en la azotea           [ 2 ]
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
  4     Humedad o filtraciones                      [ 1 ]
  5     Fracturas en columnas, vigas, trabes        [ 2 ]
  6     Problemas en sistema eléctrico              [ 2 ]
  7     Problemas en tuberías de agua/drenaje       [ 2 ]

  1 = Sí   2 = No   9 = No sabe
```

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
```

### Q7–Q9. Trabajo Doméstico

```
Q7. ¿Hay personas contratadas para trabajo doméstico que duerman aquí?
Código: [ 2 ]   1 = Sí   2 = No
```

---

## SECCIÓN II — RESIDENTES DEL HOGAR (INTEGRANTES)

### Integrante 01 — Jefe del Hogar

```
NUMPER:              [ 01 ]  (auto-asignado)
Nombre:              [ Roberto Sánchez Morales ]
Parentesco:          [ 1 ]  — Jefe(a) del hogar
Sexo:                [ 1 ]  — Hombre
Edad:                [ 38 ]
Fecha de Nacimiento: [ 12/03/1986 ]
Estado Civil:        [ 2 ]  — Casado(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 09 ]  — Licenciatura completa
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 01

```
Q5.  ¿Vive la madre en este hogar?   [ 2 ]  — No
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 1 ]  — Aquí, en este estado
Q8.  ¿Afrodescendiente?              [ 2 ]  — No

Q9. Discapacidad (1=Sin dificultad, 2=Poca, 3=Mucha, 4=No puede):
  A-H. Todas                           [ 1 ]  — Sin dificultad

Q12. ¿Habla lengua indígena?         [ 2 ]  — No
Q15. ¿Entiende alguna lengua indígena? [ 2 ]  — No
Q16. ¿Se considera indígena?         [ 2 ]  — No
```

---

### Integrante 02 — Esposa

```
NUMPER:              [ 02 ]  (auto-asignado)
Nombre:              [ Laura Hernández Díaz ]
Parentesco:          [ 2 ]  — Esposa(o) o compañera(o)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 35 ]
Fecha de Nacimiento: [ 28/06/1989 ]
Estado Civil:        [ 2 ]  — Casado(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 09 ]  — Licenciatura completa
¿Asiste a la escuela? [ 2 ]  — No
```

#### Datos Sociodemográficos — Integrante 02

```
Q5.  ¿Vive la madre en este hogar?   [ 2 ]  — No
Q6.  ¿Vive el padre en este hogar?   [ 2 ]  — No
Q7.  Lugar de nacimiento             [ 2 ]  — En otro estado
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
Nombre:              [ Diego Sánchez Hernández ]
Parentesco:          [ 3 ]  — Hijo(a)
Sexo:                [ 1 ]  — Hombre
Edad:                [ 14 ]
Fecha de Nacimiento: [ 15/08/2010 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 05 ]  — Secundaria completa
¿Asiste a la escuela? [ 1 ]  — Sí
```

#### Datos Sociodemográficos — Integrante 03

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Laura
Q6.  ¿Vive el padre en este hogar?   [ 1 ]  — Sí
Q6.1 ¿Quién es? (NUMPER)             [ 01 ] — Roberto
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
Nombre:              [ Valentina Sánchez Hernández ]
Parentesco:          [ 3 ]  — Hijo(a)
Sexo:                [ 2 ]  — Mujer
Edad:                [ 10 ]
Fecha de Nacimiento: [ 03/12/2013 ]
Estado Civil:        [ 1 ]  — Soltero(a)
¿Sabe leer y escribir? [ 1 ]  — Sí
Nivel Escolaridad:   [ 02 ]  — Primaria incompleta
¿Asiste a la escuela? [ 1 ]  — Sí
```

#### Datos Sociodemográficos — Integrante 04

```
Q5.  ¿Vive la madre en este hogar?   [ 1 ]  — Sí
Q5.1 ¿Quién es? (NUMPER)             [ 02 ] — Laura
Q6.  ¿Vive el padre en este hogar?   [ 1 ]  — Sí
Q6.1 ¿Quién es? (NUMPER)             [ 01 ] — Roberto
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

### Ingresos — Integrante 01 (Roberto Sánchez, 38 años)

```
¿Trabajó la semana pasada?          [ 1 ]  — Sí
Ocupación principal:                [ Administrador de tienda de abarrotes ]
Tipo de trabajo:                    [ 2 ]  — Patrón o empleador
Horas trabajadas:                   [ 55 ]
Ingreso mensual:                    [ 18500.00 ]
¿Tiene otro trabajo?                [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

### Ingresos — Integrante 02 (Laura Hernández, 35 años)

```
¿Trabajó la semana pasada?          [ 1 ]  — Sí
Ocupación principal:                [ Asistente administrativa ]
Tipo de trabajo:                    [ 1 ]  — Empleado u obrero
Horas trabajadas:                   [ 40 ]
Ingreso mensual:                    [ 15200.00 ]
¿Tiene otro trabajo?                [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

### Ingresos — Integrante 03 (Diego Sánchez, 14 años)

```
¿Trabajó la semana pasada?          [ 2 ]  — No
¿Recibe jubilación?                 [ 2 ]  — No
¿Recibe programa de gobierno?       [ 2 ]  — No
```

> Integrante 04 (10 años) no aparece en esta sección — solo aplica a ≥12 años.

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

## CUESTIONARIO: MENORES DE 12 AÑOS

### Menor 01 — Valentina Sánchez Hernández (NUMPER 04, 10 años)

> Datos básicos pre-llenados desde Hogares: NUMPER, Nombre, Sexo, Edad, Fecha Nacimiento.

```
¿Asiste a educación inicial o guardería?  [ 6 ]  — No asiste
¿Quién la cuida?                          [ 1 ]  — La madre
```

---

## CUESTIONARIO: PERSONAS DE 12+ AÑOS

### Persona 01 — Roberto Sánchez (NUMPER 01, 38 años)

```
¿Asiste a la escuela?                              [ 2 ]  — No
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 1 ]  — IMSS
¿Situación conyugal?                               [ 2 ]  — Casado(a)
```

### Persona 02 — Laura Hernández (NUMPER 02, 35 años)

```
¿Asiste a la escuela?                              [ 2 ]  — No
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 1 ]  — IMSS
¿Situación conyugal?                               [ 2 ]  — Casado(a)
```

### Persona 03 — Diego Sánchez (NUMPER 03, 14 años)

```
¿Asiste a la escuela?                              [ 1 ]  — Sí
  Tipo de escuela:                                 [ 1 ]  — Pública
  Nivel educativo:                                 [ 05 ] — Secundaria completa
  ¿Recibe beca?                                    [ 2 ]  — No
¿Tiene derecho a servicio médico?                  [ 1 ]  — Sí
  Institución:                                     [ 1 ]  — IMSS
¿Situación conyugal?                               [ 1 ]  — Soltero(a)
```

---

## CUESTIONARIO: NEGOCIOS DEL HOGAR

```
¿Algún integrante del hogar tiene un negocio?  [ 1 ]  — Sí
```

### Negocio 1 — Abarrotes "La Esquina"

```
NUMPER del operador:          [ 01 ]
Tipo de negocio:              [ Abarrotes La Esquina ]
¿Es actividad principal?      [ 1 ]  — Sí
¿Tiene local o establecimiento? [ 1 ]  — Sí
¿Lleva contabilidad?          [ 1 ]  — Sí
¿Dado de alta en Hacienda?    [ 1 ]  — Sí
Ingreso mensual del negocio:  [ 12500.00 ]
Gastos mensuales del negocio: [ 7800.00 ]
```

> **Nota importante**: El ingreso mensual del negocio ($12,500) es adicional al ingreso por trabajo ($18,500) reportado en la Sección III de Hogares para el integrante 01. En el ENIGH real, estos se suman como fuentes de ingreso independientes.

---

## CUESTIONARIO: GASTOS DEL HOGAR — Trimestre julio-septiembre 2024

> Este cuestionario captura el gasto **trimestral** del hogar en 8 secciones
> con desglose detallado por concepto. Todos los montos son en pesos y
> corresponden al trimestre (3 meses).

### Sección I — Alimentos, Bebidas y Tabaco

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Carnes                           4,800.00
Cereales                         2,100.00
Verduras y legumbres             2,700.00
Frutas                           1,950.00
Leche y derivados                2,400.00
Huevo                              720.00
Aceites y grasas                   540.00
Azúcar y mieles                    360.00
Café/té/chocolate                  480.00
Bebidas no alcohólicas           1,200.00
Bebidas alcohólicas                900.00
Alimentos fuera del hogar        3,000.00
Otros alimentos                    450.00
──────────────────────────────────────────────
Subtotal Sección I              21,600.00
```

### Sección II — Transporte y Comunicaciones

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Transporte público              1,200.00
Gasolina                         7,500.00
Mantenimiento del auto           2,400.00
Teléfono celular                 1,800.00
Internet                         1,500.00
──────────────────────────────────────────────
Subtotal Sección II             14,400.00
```

### Sección III — Vivienda y Servicios

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Renta                           19,500.00
Electricidad                     2,700.00
Agua                             1,050.00
Gas                              2,400.00
Predial                           — (rentan, no aplica)
Mantenimiento del hogar          1,500.00
──────────────────────────────────────────────
Subtotal Sección III            27,150.00
```

### Sección IV — Educación y Esparcimiento

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Útiles escolares                 1,500.00
Uniformes                          900.00
Cuotas escolares                 1,200.00
Cine/eventos/entretenimiento     1,800.00
──────────────────────────────────────────────
Subtotal Sección IV              5,400.00
```

### Sección V — Salud

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Medicamentos                       900.00
Consultas médicas                2,100.00
Lentes o aparatos                    0.00
──────────────────────────────────────────────
Subtotal Sección V               3,000.00
```

### Sección VI — Vestido y Calzado

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Ropa                             3,000.00
Calzado                          1,800.00
──────────────────────────────────────────────
Subtotal Sección VI              4,800.00
```

### Sección VII — Cuidados Personales

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Jabón/shampoo/pasta dental         750.00
Corte de cabello/estética          600.00
Pañales/toallas                    450.00
──────────────────────────────────────────────
Subtotal Sección VII             1,800.00
```

### Sección VIII — Enseres Domésticos y Limpieza

```
Concepto                       Monto trimestral
────────────────────────────── ────────────────
Detergentes y limpiadores          900.00
Utensilios de cocina               450.00
Blancos (sábanas, toallas)         600.00
──────────────────────────────────────────────
Subtotal Sección VIII            1,950.00
```

### 💰 GASTO TRIMESTRAL TOTAL

```
Sección                                         Subtotal
──────────────────────────────────────────────── ──────────────
I.   Alimentos, Bebidas y Tabaco                  21,600.00
II.  Transporte y Comunicaciones                  14,400.00
III. Vivienda y Servicios                         27,150.00
IV.  Educación y Esparcimiento                     5,400.00
V.   Salud                                         3,000.00
VI.  Vestido y Calzado                             4,800.00
VII. Cuidados Personales                           1,800.00
VIII.Enseres Domésticos y Limpieza                 1,950.00
──────────────────────────────────────────────── ──────────────
TOTAL TRIMESTRAL                                  80,100.00
```

---

## CUESTIONARIO: GASTOS DIARIOS (7 días)

### Informante

```
NUMPER del informante: [ 02 ]  — Laura Hernández
```

### Día a día

```
Día        Conceptos y montos
─────────  ──────────────────────────────────────────────────────
Lunes      Tortillería $42.00, Verdura $85.00, Pollo $120.00
Martes     Tortillería $42.00, Pan $38.00, Fruta $65.00
Miércoles  Tortillería $42.00, Leche $56.00, Huevo $48.00
Jueves     Tortillería $42.00, Verdura $72.00, Carne $145.00
Viernes    Tortillería $42.00, Pescado $160.00, Verdura $68.00
Sábado     Tortillería $42.00, Fruta $90.00, Queso $75.00
Domingo    Tortillería $42.00, Pan $45.00, Carne $180.00
```

### Estimación Mensual

```
Concepto       Monto
─────────────  ─────────
Tortillería     980.00
Carnicería     2200.00
Verdulería     1800.00
Abarrotes      1500.00
Transporte      600.00
Gasolina       2500.00
```

---

## ✅ CHECKLIST DE CAPTURA — TODOS LOS CUESTIONARIOS

```
SECCIÓN I — Vivienda
[  ] P1. Clase vivienda            = 1 (Casa única)
[  ] P2. Paredes                   = 8 (Tabique)
[  ] P3. Techos                    = 10 (Losa concreto)
[  ] P4. Pisos                     = 3 (Mosaico)
[  ] P5. Antigüedad               = 8 años
[  ] P6. Cuarto cocina            = 1 (Sí)
[  ] P7. Duermen en cocina        = 2 (No)
[  ] P8. Dormitorios              = 2
[  ] P9. Cuartos totales          = 4
[  ] P10. Lugar cocina            = 1 (Interior)
[  ] P11. Agua entubada           = 1 (Dentro)
[  ] P12. Origen agua             = 1 (Servicio público)
[  ] P14. Días agua               = 1 (Diario)
[  ] P15. Tipo sanitario          = 1 (Taza)
[  ] P16. Compartido              = 2 (No)
[  ] P17. Descarga agua           = 1 (Directa)
[  ] P18. Biodigestor             = 2 (No)
[  ] P19. Baños                   = 1/0/0
[  ] P20. Drenaje                 = 1 (Red pública)
[  ] P21. Electricidad            = 1 (Servicio público)
[  ] P22. Focos                   = 7/5
[  ] P23. Combustible             = 3 (Gas tanque)
[  ] P25. Basura                  = 1 (Camión)
[  ] P26. Tenencia                = 1 (Rentada)
[  ] P26.1 Renta                  = $6,500
[  ] P30. Dueño                   = Roberto Sánchez, NR 1
[  ] P32. Equipamiento            = lavadero, fregadero, regadera, boiler gas, medidor
[  ] P33. Problemas               = humedad (4=1), resto 2

SECCIÓN II — Integrantes
[  ] 01 — Roberto Sánchez (Jefe, 38, ♂, Casado, Lic., trabaja + negocio)
[  ] 02 — Laura Hernández (Esposa, 35, ♀, Casada, Lic., trabaja)
[  ] 03 — Diego Sánchez (Hijo, 14, ♂, Soltero, Secundaria, estudiante)
[  ] 04 — Valentina Sánchez (Hija, 10, ♀, Soltera, Primaria, estudiante)

SECCIÓN III — Ingresos
[  ] 01 — Trabaja (patrón, tienda abarrotes, 55h, $18,500)
[  ] 02 — Trabaja (empleada, asistente admin, 40h, $15,200)
[  ] 03 — No trabaja (estudiante)
[  ] 04 — No aplica (<12)

MENORES 12 — Cuestionario 3
[  ] 04 — No asiste guardería (6), la cuida la madre (1)

PERSONAS 12+ — Cuestionario 4
[  ] 01 — IMSS (1), Casado (2), No asiste escuela
[  ] 02 — IMSS (1), Casada (2), No asiste escuela
[  ] 03 — IMSS (1), Soltero (1), Asiste escuela pública, Secundaria

NEGOCIOS — Cuestionario 5
[  ] Tiene negocio = 1 (Sí)
[  ] Negocio: Abarrotes La Esquina, operador=01, act. principal
[  ] Local=Sí, Contabilidad=Sí, Hacienda=Sí
[  ] Ingreso=$12,500, Gastos=$7,800

GASTOS DEL HOGAR — Cuestionario 6
[  ] I.   Alimentos, Bebidas y Tabaco    — 13 campos → $21,600.00
[  ] II.  Transporte y Comunicaciones     —  5 campos → $14,400.00
[  ] III. Vivienda y Servicios            —  6 campos → $27,150.00
[  ] IV.  Educación y Esparcimiento       —  4 campos →  $5,400.00
[  ] V.   Salud                           —  3 campos →  $3,000.00
[  ] VI.  Vestido y Calzado               —  2 campos →  $4,800.00
[  ] VII. Cuidados Personales             —  3 campos →  $1,800.00
[  ] VIII.Enseres Domésticos y Limpieza   —  3 campos →  $1,950.00
[  ] TOTAL TRIMESTRAL = $80,100.00

GASTOS DIARIOS — Cuestionario 7
[  ] Informante = 02 (Laura)
[  ] 7 días con gastos (tortillería diaria + variados)
[  ] Estimación mensual: 6 categorías
```

---

## 💡 Tips para esta práctica

### Vivienda
- Esta vivienda es **rentada** (P26=1). Eso cambia la lógica: P26.1 aparece, P27-P29 no aplican.
- P33: la casa tiene humedad detectada (código 4, humedad = 1)

### Negocios
- **Primero** respondé "1" en ¿Tiene negocio? para que aparezca el formulario del negocio.
- El NUMPER del operador (01) debe coincidir con un integrante ≥12 años.
- Ingreso del negocio y gastos van con dos decimales (ej: `12500.00`).

### Consistencia entre cuestionarios
- Ingreso trimestral del hogar: ($18,500 + $15,200) × 3 + ($12,500 − $7,800) × 3 = $101,100 + $14,100 = **$115,200**
- Gasto trimestral total: **$80,100**
- La diferencia (~$35,100) es ahorro y otros gastos no capturados — es razonable para una familia de 4 con doble ingreso.

### Menores 12
- Valentina (10 años) aparece en este cuestionario automáticamente.
- Diego (14 años) NO aparece aquí — va a Personas 12+.

### Gastos Diarios
- La tortillería es un gasto diario típico ($42/día × 30 ≈ $1,260/mes vs estimación de $980 — ajustá si querés que cuadre exacto).
- El informante (NUMPER 02) es Laura, no Roberto — consistente con que ella administra el hogar.
