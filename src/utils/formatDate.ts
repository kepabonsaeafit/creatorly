// Felipe Gómez

/** Formatea una fecha ISO (`YYYY-MM-DD`) como fecha corta legible, p. ej. `12 ago 2026`. */
export function formatDate(iso: string | null): string {
  if (!iso) return 'Sin definir'
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(iso))
}

/** Etiqueta de mes a partir de una fecha ISO, p. ej. `2026-08-12` → `ago 2026`. */
export function formatMonthLabel(iso: string): string {
  return new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' }).format(new Date(iso))
}
