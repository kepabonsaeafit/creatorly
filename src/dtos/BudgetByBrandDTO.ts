// Felipe Gómez

/**
 * Agregación de presupuesto comprometido por marca, para la vista de Reportes.
 * No deriva de OrderInterface: es un DTO de lectura, no de escritura.
 */
export interface BudgetByBrandDTO {
  brandId: string
  brandName: string
  budget: number
}
