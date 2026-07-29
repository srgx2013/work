// Inline validation message shown below form fields.
// Renders nothing when message is null. Color and icon depend on `type`.

export type ValidationMessageType = 'error' | 'warning' | 'info'

interface ValidationMessageProps {
  message: string | null
  type: ValidationMessageType
  id?: string
}

const iconByType: Record<ValidationMessageType, string> = {
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

const classByType: Record<ValidationMessageType, string> = {
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary-light',
}

export function ValidationMessage({ message, type, id }: ValidationMessageProps) {
  if (message === null) return null

  return (
    <div
      id={id}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`animate-iktan-fade-in mt-1 flex items-center gap-1 text-sm ${classByType[type]}`}
    >
      <span aria-hidden="true">{iconByType[type]}</span>
      <span>{message}</span>
    </div>
  )
}