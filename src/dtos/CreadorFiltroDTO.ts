// Gerónimo Montes

/**
 * Filtros opcionales para acotar el catálogo de creadores en CreadoresIndexView.
 * No deriva de CreadorInterface: es un DTO de lectura, no de escritura.
 */
export interface CreadorFiltroDTO {
  nicho?: string
  disponible?: boolean
  texto?: string
}
