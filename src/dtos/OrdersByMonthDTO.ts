// Felipe Gómez

/**
 * Agregación de pedidos y presupuesto por mes de solicitud, para la vista de Reportes.
 * No deriva de OrderInterface: es un DTO de lectura, no de escritura.
 */
export interface OrdersByMonthDTO {
  month: string
  label: string
  count: number
  budget: number
}
