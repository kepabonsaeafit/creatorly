// Gerónimo Montes

// internal imports
import type { RolUsuario } from '@/interfaces/UserInterface'

/**
 * Filtros opcionales para acotar el catálogo de usuarios en UsuariosIndexView.
 * No deriva de UserInterface: es un DTO de lectura, no de escritura.
 */
export interface UsuarioFiltroDTO {
  rol?: RolUsuario
  texto?: string
}
