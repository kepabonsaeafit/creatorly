// Author: Felipe Gómez

export class BudgetUtil {
  /**
   * Calculates the production cost of an order from the creator rate and the
   * number of pieces. An empty or negative value counts as 0.
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
   * Calculates a percentage over the production cost, such as the usage rights
   * or the agency commission. An empty or negative value counts as 0.
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
   * Adds up the three parts of the budget of an order.
   * @param production - Production cost in COP.
   * @param usageRights - Usage rights amount in COP.
   * @param commission - Agency commission amount in COP.
   * @returns The total budget of the order in COP.
   */
  static getTotal(production: number, usageRights: number, commission: number): number {
    return production + usageRights + commission
  }
}
