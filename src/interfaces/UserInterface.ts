// Kevin Pabón

/** Roles válidos de un User del sistema. */
export const ROLES = ['admin', 'coordinador'] as const

export type RolUsuario = (typeof ROLES)[number]

/**
 * Usuario interno del sistema (administrador o coordinador).
 * Ver el glosario del dominio en CONTEXT.md.
 */
export interface UserInterface {
  id: string
  nombre: string
  email: string
  password: string
  rol: RolUsuario
  createdAt: string
  updatedAt: string
}
