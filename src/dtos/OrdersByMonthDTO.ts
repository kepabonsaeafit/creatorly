// Author: Felipe Gómez

/**
 * Aggregation of orders and budget per request month, for the Reports view.
 * Does not derive from OrderInterface: it is a read DTO, not a write one.
 */
export interface OrdersByMonthDTO {
  month: string
  label: string
  count: number
  budget: number
}
