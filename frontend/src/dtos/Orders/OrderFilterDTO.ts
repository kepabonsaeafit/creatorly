// Author: Felipe Gómez

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/**
 * Optional filters to narrow a list of orders, used both by the
 * OrdersIndexView table and by the KPIs and charts of ReportsView.
 * Does not derive from OrderInterface: it is a read DTO, not a write one.
 */
export interface OrderFilterDTO {
  status?: OrderStatus
  brandId?: number
  creatorId?: number
  from?: string
  to?: string
  text?: string
}
