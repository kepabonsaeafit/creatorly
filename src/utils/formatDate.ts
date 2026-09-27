// Felipe Gómez

const SOLO_DIA_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Interpreta una fecha en hora local. Las fechas solo-día (`YYYY-MM-DD`, como
 * fechaSolicitud/fechaEntrega) no traen hora: `new Date('YYYY-MM-DD')` las
 * interpreta como medianoche UTC, y al mostrarlas en hora local (por ejemplo
 * Bogotá, UTC-5) aparecen un día antes. Un timestamp completo (con hora,
 * como createdAt/updatedAt) sí se interpreta tal cual.
 */
function parseFechaLocal(iso: string): Date {
  if (SOLO_DIA_REGEX.test(iso)) {
    const [anio, mes, dia] = iso.split('-').map(Number)
    return new Date(anio, mes - 1, dia)
  }
  return new Date(iso)
}

/** Fecha de hoy en hora local, en formato `YYYY-MM-DD`. */
export function todayIso(): string {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

/** Formatea una fecha ISO (`YYYY-MM-DD`) como fecha corta legible, p. ej. `12 ago 2026`. */
export function formatDate(iso: string | null): string {
  if (!iso) return 'Sin definir'
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(parseFechaLocal(iso))
}

/** Etiqueta de mes a partir de una fecha ISO, p. ej. `2026-08-12` → `ago 2026`. */
export function formatMonthLabel(iso: string): string {
  return new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' }).format(
    parseFechaLocal(iso),
  )
}

/** Formatea un timestamp ISO como fecha y hora legibles, p. ej. `12 ago 2026, 3:45 p. m.`. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )
}
