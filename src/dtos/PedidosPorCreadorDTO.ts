// Felipe Gómez

/**
 * Agregación de pedidos por creador, para la vista de Reportes.
 * No deriva de PedidoInterface: es un DTO de lectura, no de escritura.
 */
export interface PedidosPorCreadorDTO {
  creadorId: string
  creadorNombre: string
  cantidad: number
}
