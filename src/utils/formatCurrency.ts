// Felipe Gómez

/** Formatea un presupuesto en pesos colombianos sin decimales, p. ej. `$3.200.000`. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}
