// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/**
 * Aggregation of orders per status, for the Reports view.
 * Does not derive from OrderInterface: it is a read DTO, not a write one.
 */
export interface OrdersByStatusDTO {
  status: OrderStatus
  count: number
}
