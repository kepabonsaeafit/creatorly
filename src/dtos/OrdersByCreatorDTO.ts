// Felipe Gómez

/**
 * Agregación de pedidos por creador, para la vista de Reportes.
 * No deriva de OrderInterface: es un DTO de lectura, no de escritura.
 */
export interface OrdersByCreatorDTO {
  creatorId: string
  creatorName: string
  count: number
}
