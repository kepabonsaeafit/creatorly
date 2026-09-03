// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Credenciales para AuthService.login (paso 4). */
export type LoginDTO = Pick<UserInterface, 'email' | 'password'>
