// Author: Kevin Pabón

/**
 * AuthService does not follow the `throw new Error(...)` pattern of the other
 * services (UserService, CreatorService, BrandService, OrderService). login()
 * returns { ok, error } because "invalid credentials" is not malformed data
 * from the programmer (like a negative budget) but a legitimate, expected
 * response of a login form: the view needs to show the error without a
 * try/catch. The shape validations of the other services DO throw, because
 * there an invalid value is a programming error (a badly built DTO), not a
 * normal user interaction.
 */

// internal imports
import type { LoginDTO } from '@/dtos/LoginDTO'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'
import { StorageService } from '@/storage/StorageService'
import { useSessionStore } from '@/stores/SessionStore'

/** Result of a login attempt (AuthService.login). */
export interface LoginResult {
  ok: boolean
  error?: string
}

export class AuthService {
  /**
   * Logs a user in by credentials and persists the session.
   * @param credentials - Email and password to validate.
   * @returns `{ ok: true }` on success, or `{ ok: false, error }` on failure.
   */
  static login(credentials: LoginDTO): LoginResult {
    const user = UserService.findByCredentials(credentials)
    if (!user) return { ok: false, error: 'Invalid credentials' }
    useSessionStore().userId = user.id
    StorageService.setSession(user.id)
    return { ok: true }
  }

  /** Logs the current user out and clears the persisted session. */
  static logout(): void {
    useSessionStore().userId = null
    StorageService.clearSession()
  }

  /**
   * Gets the user of the active session.
   * @returns The current user, or `undefined` if there is no active session.
   */
  static getCurrentUser(): UserInterface | undefined {
    return useSessionStore().current
  }

  /**
   * Role of the active session's user; used by NavBar to decide which links to show.
   * @returns `true` if the current user is an admin.
   */
  static isAdmin(): boolean {
    return useSessionStore().isAdmin
  }
}
