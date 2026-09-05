// Felipe Gómez

/**
 * Agregación de presupuesto comprometido por marca, para la vista de Reportes.
 * No deriva de PedidoInterface: es un DTO de lectura, no de escritura.
 */
export interface PresupuestoPorMarcaDTO {
  marcaId: string
  marcaNombre: string
  presupuesto: number
}
