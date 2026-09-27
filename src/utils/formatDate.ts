// Felipe Gómez

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Interpreta una fecha en hora local. Las fechas solo-día (`YYYY-MM-DD`, como
 * fechaSolicitud/fechaEntrega) no traen hora: `new Date('YYYY-MM-DD')` las
 * interpreta como medianoche UTC, y al mostrarlas en hora local (por ejemplo
 * Bogotá, UTC-5) aparecen un día antes. Un timestamp completo (con hora,
 * como createdAt/updatedAt) sí se interpreta tal cual.
 */
function parseLocalDate(iso: string): Date {
  if (DATE_ONLY_REGEX.test(iso)) {
    const [year, month, day] = iso.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(iso)
}

/** Fecha de hoy en hora local, en formato `YYYY-MM-DD`. */
export function todayIso(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Formatea una fecha ISO (`YYYY-MM-DD`) como fecha corta legible, p. ej. `12 ago 2026`. */
export function formatDate(iso: string | null): string {
  if (!iso) return 'Not set'
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(parseLocalDate(iso))
}

/** Etiqueta de mes a partir de una fecha ISO, p. ej. `2026-08-12` → `ago 2026`. */
export function formatMonthLabel(iso: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
    parseLocalDate(iso),
  )
}

/** Formatea un timestamp ISO como fecha y hora legibles, p. ej. `12 ago 2026, 3:45 p. m.`. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )
}
