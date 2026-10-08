// Author: Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Credentials for AuthService.login, sent to POST /api/auth/login. */
export type LoginDTO = Pick<UserInterface, 'email'> & {
  password: string
}
