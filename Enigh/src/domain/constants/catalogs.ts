// All ENIGH IKTAN catalogs — typed lookup tables.
// Each catalog is a Record<string, CatalogEntry> keyed by code.

export type CatalogEntry = {
  code: string
  label: string
}

export type Catalog = Record<string, CatalogEntry>

export type CatalogName =
  | 'entidades'
  | 'resultadosEntrevista'
  | 'parentescos'
  | 'clasesVivienda'
  | 'materialesParedes'
  | 'materialesTechos'
  | 'materialesPisos'
  | 'origenesAgua'
  | 'drenajes'
  | 'combustibles'
  | 'basura'
  | 'bienes'
  | 'escolaridad'
  | 'estadosCiviles'
  | 'tiposTrabajo'
  | 'institucionesSalud'
  | 'tiposEscuela'
  | 'quienCuida'
  | 'lugarCocina'
  | 'aguaAcarreo'
  | 'aguaDiasSemana'
  | 'tipoSanitario'
  | 'sanitarioAgua'
  | 'tenencia'
  | 'adquisicion'
  | 'financiamiento'
  | 'fogonChimenea'
  | 'escritura'
  | 'equipamientoItems'
  | 'problemasEstructurales'

// ── Catalog definitions ──

export const entidades: Catalog = {
  '01': { code: '01', label: 'Aguascalientes' },
  '02': { code: '02', label: 'Baja California' },
  '03': { code: '03', label: 'Baja California Sur' },
  '04': { code: '04', label: 'Campeche' },
  '05': { code: '05', label: 'Coahuila' },
  '06': { code: '06', label: 'Colima' },
  '07': { code: '07', label: 'Chiapas' },
  '08': { code: '08', label: 'Chihuahua' },
  '09': { code: '09', label: 'Ciudad de México' },
  '10': { code: '10', label: 'Durango' },
  '11': { code: '11', label: 'Guanajuato' },
  '12': { code: '12', label: 'Guerrero' },
  '13': { code: '13', label: 'Hidalgo' },
  '14': { code: '14', label: 'Jalisco' },
  '15': { code: '15', label: 'México' },
  '16': { code: '16', label: 'Michoacán' },
  '17': { code: '17', label: 'Morelos' },
  '18': { code: '18', label: 'Nayarit' },
  '19': { code: '19', label: 'Nuevo León' },
  '20': { code: '20', label: 'Oaxaca' },
  '21': { code: '21', label: 'Puebla' },
  '22': { code: '22', label: 'Querétaro' },
  '23': { code: '23', label: 'Quintana Roo' },
  '24': { code: '24', label: 'San Luis Potosí' },
  '25': { code: '25', label: 'Sinaloa' },
  '26': { code: '26', label: 'Sonora' },
  '27': { code: '27', label: 'Tabasco' },
  '28': { code: '28', label: 'Tamaulipas' },
  '29': { code: '29', label: 'Tlaxcala' },
  '30': { code: '30', label: 'Veracruz' },
  '31': { code: '31', label: 'Yucatán' },
  '32': { code: '32', label: 'Zacatecas' },
}

export const resultadosEntrevista: Catalog = {
  A1: { code: 'A1', label: 'Entrevista completa' },
  A2: { code: 'A2', label: 'Entrevista incompleta' },
  A3: { code: 'A3', label: 'Nadie en el hogar' },
  A4: { code: 'A4', label: 'Ausencia temporal' },
  A5: { code: 'A5', label: 'Negativa' },
  A6: { code: 'A6', label: 'Vivienda desocupada' },
  A7: { code: 'A7', label: 'Otra situación' },
}

export const parentescos: Catalog = {
  '1': { code: '1', label: 'Jefe(a) del hogar' },
  '2': { code: '2', label: 'Esposa(o) o compañera(o)' },
  '3': { code: '3', label: 'Hijo(a)' },
  '4': { code: '4', label: 'Nieto(a)' },
  '5': { code: '5', label: 'Yerno/Nuera' },
  '6': { code: '6', label: 'Padre/Madre/Suegro(a)' },
  '7': { code: '7', label: 'Hermano(a)/Cuñado(a)' },
  '8': { code: '8', label: 'Otro parentesco' },
  '9': { code: '9', label: 'Sin parentesco' },
}

export const clasesVivienda: Catalog = {
  '1': { code: '1', label: 'Casa única en el terreno' },
  '2': { code: '2', label: 'Casa que comparte terreno con otra(s)' },
  '3': { code: '3', label: 'Casa dúplex' },
  '4': { code: '4', label: 'Departamento en edificio' },
  '5': { code: '5', label: 'Vivienda en vecindad o cuartería' },
  '6': { code: '6', label: 'Cuarto de azotea' },
  '7': { code: '7', label: 'Local no construido para habitación' },
}

export const materialesParedes: Catalog = {
  '1': { code: '1', label: 'Desecho' },
  '2': { code: '2', label: 'Lámina de cartón' },
  '3': { code: '3', label: 'Lámina de asbesto o metálica' },
  '4': { code: '4', label: 'Carrizo, bambú o palma' },
  '5': { code: '5', label: 'Embarro o bajareque' },
  '6': { code: '6', label: 'Madera' },
  '7': { code: '7', label: 'Adobe' },
  '8': { code: '8', label: 'Tabique, ladrillo, block, piedra, cemento' },
}

export const materialesTechos: Catalog = {
  '1': { code: '1', label: 'Desecho' },
  '2': { code: '2', label: 'Lámina de cartón' },
  '3': { code: '3', label: 'Lámina metálica' },
  '4': { code: '4', label: 'Lámina de asbesto' },
  '5': { code: '5', label: 'Fibrocemento' },
  '6': { code: '6', label: 'Palma o paja' },
  '7': { code: '7', label: 'Madera o tejamanil' },
  '8': { code: '8', label: 'Terrado con viguería' },
  '9': { code: '9', label: 'Teja' },
  '10': { code: '10', label: 'Losa de concreto o viguetas con bovedilla' },
}

export const materialesPisos: Catalog = {
  '1': { code: '1', label: 'Tierra' },
  '2': { code: '2', label: 'Cemento o firme' },
  '3': { code: '3', label: 'Madera, mosaico u otro recubrimiento' },
}

export const origenesAgua: Catalog = {
  '1': { code: '1', label: 'Servicio público' },
  '2': { code: '2', label: 'Pozo comunitario' },
  '3': { code: '3', label: 'Pozo particular' },
  '4': { code: '4', label: 'Pipa' },
  '5': { code: '5', label: 'Otra vivienda' },
  '6': { code: '6', label: 'Lluvia' },
}

export const drenajes: Catalog = {
  '1': { code: '1', label: 'Red pública' },
  '2': { code: '2', label: 'Fosa séptica o biodigestor' },
  '3': { code: '3', label: 'Barranca o grieta' },
  '4': { code: '4', label: 'Río, lago o mar' },
  '5': { code: '5', label: 'Sin drenaje' },
}

export const combustibles: Catalog = {
  '1': { code: '1', label: 'Leña' },
  '2': { code: '2', label: 'Carbón' },
  '3': { code: '3', label: 'Gas de tanque' },
  '4': { code: '4', label: 'Gas natural' },
}

export const basura: Catalog = {
  '1': { code: '1', label: 'La dan a un camión de basura' },
  '2': { code: '2', label: 'La llevan a basurero público' },
  '3': { code: '3', label: 'La dejan en contenedor' },
  '4': { code: '4', label: 'La queman' },
  '5': { code: '5', label: 'La entierran' },
  '6': { code: '6', label: 'La tiran en terreno baldío' },
  '7': { code: '7', label: 'La tiran en barranca o río' },
}

export const bienes: Catalog = {
  '1': { code: '1', label: 'Radio' },
  '2': { code: '2', label: 'TV digital' },
  '3': { code: '3', label: 'Refrigerador' },
  '4': { code: '4', label: 'Lavadora' },
  '5': { code: '5', label: 'Computadora' },
  '6': { code: '6', label: 'Línea telefónica fija' },
  '7': { code: '7', label: 'Internet' },
  '8': { code: '8', label: 'Teléfono celular' },
  '9': { code: '9', label: 'TV de paga' },
  '10': { code: '10', label: 'Automóvil' },
  '11': { code: '11', label: 'Motocicleta' },
  '12': { code: '12', label: 'Bicicleta' },
}

export const escolaridad: Catalog = {
  '00': { code: '00', label: 'Ninguno' },
  '01': { code: '01', label: 'Preescolar' },
  '02': { code: '02', label: 'Primaria incompleta' },
  '03': { code: '03', label: 'Primaria completa' },
  '04': { code: '04', label: 'Secundaria incompleta' },
  '05': { code: '05', label: 'Secundaria completa' },
  '06': { code: '06', label: 'Preparatoria incompleta' },
  '07': { code: '07', label: 'Preparatoria completa' },
  '08': { code: '08', label: 'Licenciatura incompleta' },
  '09': { code: '09', label: 'Licenciatura completa' },
  '10': { code: '10', label: 'Posgrado' },
}

export const estadosCiviles: Catalog = {
  '1': { code: '1', label: 'Soltero(a)' },
  '2': { code: '2', label: 'Casado(a)' },
  '3': { code: '3', label: 'Unión libre' },
  '4': { code: '4', label: 'Separado(a)' },
  '5': { code: '5', label: 'Divorciado(a)' },
  '6': { code: '6', label: 'Viudo(a)' },
}

export const tiposTrabajo: Catalog = {
  '1': { code: '1', label: 'Empleado u obrero' },
  '2': { code: '2', label: 'Patrón o empleador' },
  '3': { code: '3', label: 'Trabajador por cuenta propia' },
  '4': { code: '4', label: 'Trabajador sin pago (familiar)' },
}

export const institucionesSalud: Catalog = {
  '1': { code: '1', label: 'IMSS' },
  '2': { code: '2', label: 'ISSSTE' },
  '3': { code: '3', label: 'ISSSTE Estatal' },
  '4': { code: '4', label: 'PEMEX / Defensa / Marina' },
  '5': { code: '5', label: 'IMSS-BIENESTAR' },
  '6': { code: '6', label: 'INSABI / Centro de Salud' },
  '7': { code: '7', label: 'Seguro privado' },
  '8': { code: '8', label: 'Otra institución' },
}

export const tiposEscuela: Catalog = {
  '1': { code: '1', label: 'Pública' },
  '2': { code: '2', label: 'Privada' },
}

export const quienCuida: Catalog = {
  '1': { code: '1', label: 'La madre' },
  '2': { code: '2', label: 'El padre' },
  '3': { code: '3', label: 'Otro familiar' },
  '4': { code: '4', label: 'Guardería o estancia infantil' },
}

// ── Section I: Vivienda — new catalogs for ENIGH 2024 ──

export const lugarCocina: Catalog = {
  '1': { code: '1', label: 'Al interior de la vivienda' },
  '2': { code: '2', label: 'En un cuarto separado de la vivienda' },
  '3': { code: '3', label: 'En un pasillo o corredor fuera de la vivienda' },
  '4': { code: '4', label: 'En un tejabán o techito' },
  '5': { code: '5', label: 'Al aire libre' },
  '6': { code: '6', label: 'No tiene espacio para cocinar' },
}

export const aguaAcarreo: Catalog = {
  '1': { code: '1', label: 'De un pozo' },
  '2': { code: '2', label: 'De una llave comunitaria' },
  '3': { code: '3', label: 'De otra vivienda' },
  '4': { code: '4', label: 'De un río, arroyo o lago' },
  '5': { code: '5', label: 'La trae una pipa' },
  '6': { code: '6', label: 'La captan de la lluvia' },
}

export const aguaDiasSemana: Catalog = {
  '1': { code: '1', label: 'Diario' },
  '2': { code: '2', label: 'Cada tercer día' },
  '3': { code: '3', label: 'Dos veces por semana' },
  '4': { code: '4', label: 'Una vez por semana' },
  '5': { code: '5', label: 'De vez en cuando' },
}

export const tipoSanitario: Catalog = {
  '1': { code: '1', label: 'Taza de baño (excusado o sanitario)' },
  '2': { code: '2', label: 'Letrina (pozo u hoyo)' },
  '3': { code: '3', label: 'No tienen taza de baño ni letrina' },
}

export const sanitarioAgua: Catalog = {
  '1': { code: '1', label: 'Tiene descarga directa de agua' },
  '2': { code: '2', label: 'Le echan agua con cubeta' },
  '3': { code: '3', label: 'No se le puede echar agua' },
}

export const tenencia: Catalog = {
  '1': { code: '1', label: 'Rentada' },
  '2': { code: '2', label: 'Prestada' },
  '3': { code: '3', label: 'Propia pero la están pagando' },
  '4': { code: '4', label: 'Propia' },
  '5': { code: '5', label: 'Intestada o en litigio' },
  '6': { code: '6', label: 'Otra situación' },
}

export const adquisicion: Catalog = {
  '1': { code: '1', label: 'La compró hecha' },
  '2': { code: '2', label: 'La mandó construir' },
  '3': { code: '3', label: 'La construyó ella (él) misma(o) o familiares' },
  '4': { code: '4', label: 'La heredó' },
  '5': { code: '5', label: 'La recibió como apoyo del gobierno' },
  '6': { code: '6', label: 'La obtuvo de otra manera' },
}

export const financiamiento: Catalog = {
  '1': { code: '1', label: 'INFONAVIT' },
  '2': { code: '2', label: 'FOVISSSTE' },
  '3': { code: '3', label: 'PEMEX' },
  '4': { code: '4', label: 'FONHAPO' },
  '5': { code: '5', label: 'Banco' },
  '6': { code: '6', label: 'Otra institución' },
  '7': { code: '7', label: 'Familiar, amiga(o) o prestamista' },
  '8': { code: '8', label: 'Recursos propios' },
}

export const fogonChimenea: Catalog = {
  '1': { code: '1', label: 'Tiene tubo o chimenea para sacar el humo' },
  '2': { code: '2', label: 'No tiene tubo o chimenea para sacar el humo' },
}

export const escritura: Catalog = {
  '1': { code: '1', label: 'A nombre de la dueña o dueño' },
  '2': { code: '2', label: 'A nombre de otra persona' },
  '3': { code: '3', label: 'No tiene escrituras' },
  '4': { code: '4', label: 'No sabe' },
}

// P32 Equipamiento — keyed by equipment name
export const equipamientoItems: Catalog = {
  'lavadero': { code: 'lavadero', label: 'Lavadero' },
  'fregadero': { code: 'fregadero', label: 'Fregadero o tarja' },
  'regadera': { code: 'regadera', label: 'Regadera' },
  'tinaco': { code: 'tinaco', label: 'Tinaco en la azotea' },
  'cisterna': { code: 'cisterna', label: 'Cisterna o aljibe' },
  'pileta': { code: 'pileta', label: 'Pileta, tanque o depósito de agua' },
  'calentadorSolar': { code: 'calentadorSolar', label: 'Calentador solar de agua' },
  'boilerGas': { code: 'boilerGas', label: 'Boiler o calentador de agua (gas, eléctrico)' },
  'boilerLena': { code: 'boilerLena', label: 'Boiler o calentador de agua (leña)' },
  'medidorLuz': { code: 'medidorLuz', label: 'Medidor de luz' },
  'bombaAgua': { code: 'bombaAgua', label: 'Bomba de agua' },
  'tanqueGas': { code: 'tanqueGas', label: 'Tanque de gas estacionario' },
  'aireAcondicionado': { code: 'aireAcondicionado', label: 'Aire acondicionado' },
  'calefaccion': { code: 'calefaccion', label: 'Calefacción' },
}

// P33 Problemas Estructurales — keyed by problem name
export const problemasEstructurales: Catalog = {
  'grietas': { code: 'grietas', label: 'Grietas o cuarteaduras en techos o muros' },
  'pandeos': { code: 'pandeos', label: 'Pandeos o deformaciones en los marcos de las puertas o ventanas' },
  'hundimientos': { code: 'hundimientos', label: 'Levantamientos o hundimientos del piso' },
  'humedad': { code: 'humedad', label: 'Humedad o filtraciones de agua en cimientos, muros o techos' },
  'fracturas': { code: 'fracturas', label: 'Fracturas, pandeos o deformación de columnas, vigas o trabes' },
  'electrico': { code: 'electrico', label: 'El sistema eléctrico (muros, techos, etcétera)' },
  'tuberias': { code: 'tuberias', label: 'Las tuberías de agua o drenaje dentro de la vivienda' },
}

export const CATALOGS: Record<CatalogName, Catalog> = {
  entidades,
  resultadosEntrevista,
  parentescos,
  clasesVivienda,
  materialesParedes,
  materialesTechos,
  materialesPisos,
  origenesAgua,
  drenajes,
  combustibles,
  basura,
  bienes,
  escolaridad,
  estadosCiviles,
  tiposTrabajo,
  institucionesSalud,
  tiposEscuela,
  quienCuida,
  lugarCocina,
  aguaAcarreo,
  aguaDiasSemana,
  tipoSanitario,
  sanitarioAgua,
  tenencia,
  adquisicion,
  financiamiento,
  fogonChimenea,
  escritura,
  equipamientoItems,
  problemasEstructurales,
}