// Author: Kevin Pabón

/**
 * Persistence layer: the only entry point to the browser's LocalStorage
 * (ADR-0001). It is not business logic: no other new module should use
 * `localStorage` directly; stores hydrate and persist through this class.
 */

// internal imports
import type { CollectionName, SessionRecord } from '@/interfaces/StorageInterface'

export class StorageService {
  private static readonly KEYS: Record<CollectionName, string> = {
    users: 'creatorly_users',
    creators: 'creatorly_creators',
    brands: 'creatorly_brands',
    orders: 'creatorly_orders',
  }

  private static readonly SESSION_KEY = 'creatorly_session'

  /** Reads a full collection as plain objects. */
  static read<T>(name: CollectionName): T[] {
    try {
      const raw = localStorage.getItem(this.KEYS[name])
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  /** Replaces a collection's full content. */
  static write<T>(name: CollectionName, data: T[]): void {
    localStorage.setItem(this.KEYS[name], JSON.stringify(data))
  }

  /** Indicates whether a collection already has data (used by first-boot seeding). */
  static hasData(name: CollectionName): boolean {
    return this.read(name).length > 0
  }

  /** Removes all Creatorly data, including the session. */
  static clearAll(): void {
    Object.values(this.KEYS).forEach((key) => localStorage.removeItem(key))
    localStorage.removeItem(this.SESSION_KEY)
  }

  /** Reads the persisted session. */
  static getSession(): SessionRecord | null {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY)
      return raw ? (JSON.parse(raw) as SessionRecord) : null
    } catch {
      return null
    }
  }

  /** Persists the active session. Never stores the password. */
  static setSession(userId: string): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({ userId }))
  }

  /** Removes the persisted session. */
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY)
  }
}
