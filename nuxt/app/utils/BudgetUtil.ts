// Author: Felipe Gómez

export class BudgetUtil {
  /**
   * Calculates the production cost of an order from the creator rate and the
   * number of pieces, without using `eval`.
   * @param rate - Creator rate per piece.
   * @param pieces - Number of pieces in the order.
   * @returns The production cost in COP.
   */
  static getProduction(rate: number, pieces: number): number {
    const safeRate = Math.max(0, rate || 0)
    const safePieces = Math.max(0, pieces || 0)

    return Math.round(safeRate * safePieces)
  }

  /**
   * Calculates a percentage surcharge over the production cost (such as usage
   * rights or the agency commission), without using `eval`.
   * @param production - Production cost in COP.
   * @param percentage - Percentage to apply over the production cost.
   * @returns The calculated amount in COP.
   */
  static getPercentageAmount(production: number, percentage: number): number {
    const safeProduction = Math.max(0, production || 0)
    const safePercentage = Math.max(0, percentage || 0)

    return Math.round(safeProduction * (safePercentage / 100))
  }

  /**
   * Calculates the total budget of an order from the creator rate, the number
   * of pieces, the usage rights percentage and the agency commission
   * percentage, without using `eval`.
   * @param rate - Creator rate per piece.
   * @param pieces - Number of pieces in the order.
   * @param usagePercent - Usage rights percentage over the production cost.
   * @param commissionPercent - Agency commission percentage over the production cost.
   * @returns The total budget of the order in COP.
   */
  static getTotal(
    rate: number,
    pieces: number,
    usagePercent: number,
    commissionPercent: number,
  ): number {
    const production = this.getProduction(rate, pieces)
    const usageRights = this.getPercentageAmount(production, usagePercent)
    const commission = this.getPercentageAmount(production, commissionPercent)

    return production + usageRights + commission
  }
}
