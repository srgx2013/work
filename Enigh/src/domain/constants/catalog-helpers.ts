import type { Catalog, CatalogEntry, CatalogName } from './catalogs'
import { CATALOGS } from './catalogs'

export function getLabel(catalog: Catalog, code: string): string {
  return catalog[code]?.label ?? `Código desconocido: ${code}`
}

export function getEntries(catalog: Catalog): CatalogEntry[] {
  return Object.entries(catalog)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, entry]) => entry)
}

export function isValidCode(catalog: Catalog, code: string): boolean {
  return code in catalog
}

export function getValidRange(catalog: Catalog): string {
  const codes = Object.keys(catalog).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
  if (codes.length <= 8) {
    return codes.join(', ')
  }
  return `${codes[0]}-${codes[codes.length - 1]}`
}

export function getCatalogByName(name: CatalogName): Catalog {
  return CATALOGS[name]
}