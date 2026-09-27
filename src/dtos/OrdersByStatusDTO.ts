// Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/**
 * Agregación de pedidos por estado, para la vista de Reportes.
 * No deriva de OrderInterface: es un DTO de lectura, no de escritura.
 */
export interface OrdersByStatusDTO {
  status: OrderStatus
  count: number
}
