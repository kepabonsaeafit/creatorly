// Author: Gerónimo Montes

// internal imports
import type { UserRole } from '@/interfaces/UserInterface'

/**
 * Optional filters to narrow the user catalog in UsersIndexView.
 * Does not derive from UserInterface: it is a read DTO, not a write one.
 */
export interface UserFilterDTO {
  role?: UserRole
  text?: string
}
