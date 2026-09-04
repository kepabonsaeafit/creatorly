// Felipe Gómez

/**
 * Lee variables de marca de src/assets/base.css en tiempo de ejecución
 * (ADR-0003: los colores de las series de Chart.js salen de la marca,
 * nunca de valores mágicos en la configuración del gráfico).
 */
function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Paleta de series para los gráficos de Reportes, en el orden en que se asignan. */
export function getChartPalette(): string[] {
  return [
    readCssVar('--color-primary'),
    readCssVar('--color-success'),
    readCssVar('--color-danger'),
    readCssVar('--brand-primary-dark'),
    readCssVar('--brand-text-light-2'),
  ]
}

export function getChartGridColor(): string {
  return readCssVar('--color-border')
}

export function getChartTextColor(): string {
  return readCssVar('--color-text')
}
