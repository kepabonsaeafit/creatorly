// Author: Felipe Gómez

export class ColorUtil {
  /**
   * Reads a brand variable from src/assets/base.css at runtime
   * (ADR-0003: Chart.js series colors come from the brand, never from
   * magic values in the chart configuration).
   */
  private static readCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  /**
   * Series palette for the Reports charts, in assignment order.
   * @returns The resolved brand colors.
   */
  static getChartPalette(): string[] {
    return [
      this.readCssVar('--color-primary'),
      this.readCssVar('--color-success'),
      this.readCssVar('--color-danger'),
      this.readCssVar('--brand-primary-dark'),
      this.readCssVar('--brand-text-light-2'),
    ]
  }

  /**
   * Color of the chart grid lines.
   * @returns The resolved brand border color.
   */
  static getChartGridColor(): string {
    return this.readCssVar('--color-border')
  }

  /**
   * Color of the chart texts.
   * @returns The resolved brand text color.
   */
  static getChartTextColor(): string {
    return this.readCssVar('--color-text')
  }
}
