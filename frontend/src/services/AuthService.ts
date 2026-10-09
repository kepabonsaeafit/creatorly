// Author: Kevin Pabón

/**
 * Owns the JWT session (ADR-0005). It is the only place that sets the
 * Authorization header: once logged in, the token travels on every axios
 * request through `axios.defaults.headers.common`, so no other service has
 * to know the token exists.
 */

// external imports
import axios, { type AxiosResponse } from 'axios'

// internal imports
import type { LoginDTO } from '@/dtos/Auth/LoginDTO'
import { StorageService } from '@/storage/StorageService'
import type { UserInterface } from '@/interfaces/UserInterface'
import { useSessionStore } from '@/stores/SessionStore'

export class AuthService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`

  private static applyToken(token: string | null): void {
    useSessionStore().token = token

    if (token === null) {
      StorageService.clearToken()
      delete axios.defaults.headers.common.Authorization

      return
    }

    StorageService.setToken(token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  /**
   * Logs a user in against POST /api/auth/login, stores the token and loads
   * the profile. The backend answers 401 on invalid credentials.
   * @param credentials - Email and password to validate.
   * @throws {AxiosError} If the API rejects the credentials.
   */
  static async login(credentials: LoginDTO): Promise<void> {
    const { data } = await axios.post(`${this.API_URL}/login`, credentials)

    this.applyToken(data.access_token)
    useSessionStore().currentUser = await this.getProfile()
  }

  /** Clears the session: token, current user and Authorization header. */
  static logout(): void {
    this.applyToken(null)
    useSessionStore().currentUser = null
  }

  /**
   * Loads the logged-in user from GET /api/auth/profile.
   * @returns The current user as the API returns it.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getProfile(): Promise<UserInterface> {
    const { data } = await axios.get(`${this.API_URL}/profile`)

    return data
  }

  /**
   * Restores the session after a page reload: re-applies the stored token and
   * loads the profile if it is not loaded yet. Called by the router guard
   * before resolving any navigation.
   * @returns `true` if there is a usable session.
   */
  static async restoreSession(): Promise<boolean> {
    const session = useSessionStore()

    if (session.currentUser !== null) return true

    const token = StorageService.getToken()

    if (token === null) return false

    this.applyToken(token)

    try {
      session.currentUser = await this.getProfile()

      return true
    } catch {
      this.logout()

      return false
    }
  }

  /**
   * Installs the axios interceptor that drops the session on any 401, so an
   * expired token cannot leave the app showing a logged-in screen.
   * @param onUnauthorized - Called after clearing the session, to leave the view.
   */
  static handleUnauthorized(onUnauthorized: () => void): void {
    axios.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      (error: unknown): Promise<never> => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          this.logout()
          onUnauthorized()
        }

        return Promise.reject(error)
      },
    )
  }

  /**
   * Gets the user of the active session.
   * @returns The current user, or `null` if there is no active session.
   */
  static getCurrentUser(): UserInterface | null {
    return useSessionStore().currentUser
  }

  /**
   * Role of the active session user; used by NavBarComponent to decide which links to show.
   * @returns `true` if the current user is an admin.
   */
  static isAdmin(): boolean {
    return useSessionStore().currentUser?.role === 'admin'
  }

  /**
   * Reads the backend error message out of a failed request, to show it in a toast.
   * @param caughtError - Error caught from an axios call.
   * @param fallback - Message to use when the API sent none.
   * @returns The message to display.
   */
  static getErrorMessage(caughtError: unknown, fallback: string): string {
    if (axios.isAxiosError(caughtError)) {
      const message = caughtError.response?.data?.message

      if (Array.isArray(message)) return message.join(', ')
      if (typeof message === 'string') return message
    }

    return fallback
  }
}
