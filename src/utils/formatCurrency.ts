// Author: Felipe Gómez

/** Formats a budget in Colombian pesos with no decimals, e.g. `$3.200.000`. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}
