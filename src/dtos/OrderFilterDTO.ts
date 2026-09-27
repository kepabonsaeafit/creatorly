// Felipe Gómez

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/**
 * Filtros opcionales para acotar una lista de pedidos, usado tanto por la
 * tabla de OrdersIndexView como por los KPIs y gráficos de ReportsView.
 * No deriva de OrderInterface: es un DTO de lectura, no de escritura.
 */
export interface OrderFilterDTO {
  status?: OrderStatus
  brandId?: string
  creatorId?: string
  from?: string
  to?: string
  text?: string
}
