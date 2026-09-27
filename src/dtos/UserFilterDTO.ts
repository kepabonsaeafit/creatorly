// Gerónimo Montes

// internal imports
import type { UserRole } from '@/interfaces/UserInterface'

/**
 * Filtros opcionales para acotar el catálogo de usuarios en UsersIndexView.
 * No deriva de UserInterface: es un DTO de lectura, no de escritura.
 */
export interface UserFilterDTO {
  role?: UserRole
  text?: string
}
