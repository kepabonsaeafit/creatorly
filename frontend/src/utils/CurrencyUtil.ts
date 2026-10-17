// Author: Felipe Gómez

export class CurrencyUtil {
  /**
   * Formats a budget in Colombian pesos with no decimals, e.g. `$3.200.000`.
   * @param value - Amount to format.
   * @returns The formatted amount.
   */
  static format(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value)
  }
}
