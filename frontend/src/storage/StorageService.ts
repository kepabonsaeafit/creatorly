// Author: Kevin Pabón

/**
 * Persistence layer: the only entry point to the browser LocalStorage.
 * Since ADR-0005 the database lives in the backend, so the only thing left
 * to persist here is the session token; no other module uses `localStorage`
 * directly.
 */

export class StorageService {
  private static readonly TOKEN_KEY = 'creatorly_token'

  /**
   * Reads the persisted session token.
   * @returns The stored token, or `null` if there is none.
   */
  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Persists the session token returned by the API.
   * @param token - Access token to store.
   */
  public static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /** Removes the persisted session token. */
  public static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }
}
