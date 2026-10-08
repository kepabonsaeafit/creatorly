// Author: Felipe Gómez

/**
 * Reads a brand variable from src/assets/base.css at runtime
 * (ADR-0003: Chart.js series colors come from the brand, never from
 * magic values in the chart configuration).
 */
function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Series palette for the Reports charts, in assignment order. */
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
