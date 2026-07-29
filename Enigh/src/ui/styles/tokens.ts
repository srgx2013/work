// Design tokens — INEGI-inspired palette for the IKTAN Simulator.
// Colors match the @theme CSS variables in src/index.css.
// https://tailwindcss.com/docs/v4-beta#css-theme-variables

export const colors = {
  primary: '#1B3A5C',          // Inegi dark navy — headers, active step
  primaryLight: '#2D5F8A',     // hover, focus rings
  primaryPale: '#E8F0F8',       // active step background
  secondary: '#E8EDF2',        // neutral surface
  success: '#2E7D32',           // completed checkmark, CONCLUIDO badge
  warning: '#F57F17',           // warnings, INCOMPLETO badge
  error: '#C62828',             // errors, delete buttons
  text: '#212121',              // body text
  textMuted: '#757575',          // secondary text
  border: '#E0E0E0',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFA',
  surfaceDim: '#F5F5F5',
} as const

export const typography = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSizeXs: '0.75rem',         // catalog codes, small labels
  fontSizeSm: '0.875rem',        // field labels, error messages
  fontSizeBase: '1rem',          // body text, input values
  fontSizeLg: '1.125rem',        // section headers
  fontSizeXl: '1.25rem',         // step title
  fontSize2xl: '1.5rem',         // app title
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
} as const

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
} as const

export const radius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
} as const

export const shadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.10)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.10)',
} as const

export type DesignTokens = {
  colors: typeof colors
  typography: typeof typography
  spacing: typeof spacing
  radius: typeof radius
  shadow: typeof shadow
}

export const tokens: DesignTokens = { colors, typography, spacing, radius, shadow }