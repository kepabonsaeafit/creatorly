// Gerónimo Montes

/**
 * Filtros opcionales para acotar el catálogo de creadores en CreatorsIndexView.
 * No deriva de CreatorInterface: es un DTO de lectura, no de escritura.
 */
export interface CreatorFilterDTO {
  niche?: string
  available?: boolean
  text?: string
}
