// Shared validation types used across all Zod schemas and cross-section validation.

export type FieldError = {
  field: string      // Zod path (e.g., 'folioViv', 'integrantes.0.edad')
  message: string    // Spanish error message
  ruleId?: string    // Optional rule identifier (P-001, HV-002, etc.)
}

export type ValidationResult = {
  isValid: boolean
  errors: FieldError[]
}

export type FormErrors = Record<string, string>

export type Severity = 'BLOCKER' | 'WARNING'

export type CrossSectionError = {
  ruleId: string
  severity: Severity
  message: string
  sections: string[]
}