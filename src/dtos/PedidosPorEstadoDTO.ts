// Kevin Pabón

// internal imports
import type { EstadoPedido } from '@/interfaces/PedidoInterface'

/**
 * Agregación de pedidos por estado, para la vista de Reportes (paso 7).
 * No deriva de PedidoInterface: es un DTO de lectura, no de escritura.
 */
export interface PedidosPorEstadoDTO {
  estado: EstadoPedido
  cantidad: number
}
