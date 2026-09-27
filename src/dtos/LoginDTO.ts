// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Credenciales para AuthService.login. */
export type LoginDTO = Pick<UserInterface, 'email' | 'password'>
