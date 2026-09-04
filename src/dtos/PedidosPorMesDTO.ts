// Felipe Gómez

/**
 * Agregación de pedidos y presupuesto por mes de solicitud, para la vista de Reportes.
 * No deriva de PedidoInterface: es un DTO de lectura, no de escritura.
 */
export interface PedidosPorMesDTO {
  mes: string
  etiqueta: string
  cantidad: number
  presupuesto: number
}
