// Author: Felipe Gómez

/**
 * Aggregation of committed budget per brand, for the Reports view.
 * Does not derive from OrderInterface: it is a read DTO, not a write one.
 */
export interface BudgetByBrandDTO {
  brandId: number
  brandName: string
  budget: number
}
