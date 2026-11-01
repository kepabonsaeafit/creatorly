// Author: Felipe Gómez

export class CurrencyUtil {
  private static readonly FORMATTER = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

  static format(value: number): string {
    return CurrencyUtil.FORMATTER.format(value)
  }
}
