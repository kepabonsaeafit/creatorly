// Author: Kevin Pabón

/** Valid roles of a system User. */
export const ROLES = ['admin', 'coordinator'] as const

export type UserRole = (typeof ROLES)[number]

/**
 * Internal system user (administrator or coordinator).
 * See the domain glossary in CONTEXT.md.
 */
export interface UserInterface {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
