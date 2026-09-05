// Felipe Gómez

// internal imports
import type { EstadoPedido } from '@/interfaces/PedidoInterface'

/**
 * Filtros opcionales para acotar una lista de pedidos, usado tanto por la
 * tabla de PedidosIndexView como por los KPIs y gráficos de ReportesView.
 * No deriva de PedidoInterface: es un DTO de lectura, no de escritura.
 */
export interface PedidoFiltroDTO {
  estado?: EstadoPedido
  marcaId?: string
  creadorId?: string
  desde?: string
  hasta?: string
  texto?: string
}
