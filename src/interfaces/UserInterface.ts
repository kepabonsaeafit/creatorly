// Kevin Pabón

/** Roles válidos de un User del sistema. */
export const ROLES = ['admin', 'coordinador'] as const

export type UserRole = (typeof ROLES)[number]

/**
 * Usuario interno del sistema (administrador o coordinador).
 * Ver el glosario del dominio en CONTEXT.md.
 */
export interface UserInterface {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
