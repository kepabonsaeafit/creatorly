// Kevin Pabón

/**
 * Capa de persistencia: única puerta de acceso a LocalStorage del navegador
 * (ADR-0001). No es lógica de negocio: ningún otro módulo nuevo debe usar
 * `localStorage` directamente; los stores hidratan y persisten a través de
 * esta clase.
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

  /** Lee una colección completa como objetos planos. */
  static read<T>(name: CollectionName): T[] {
    try {
      const raw = localStorage.getItem(this.KEYS[name])
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  /** Reemplaza el contenido completo de una colección. */
  static write<T>(name: CollectionName, data: T[]): void {
    localStorage.setItem(this.KEYS[name], JSON.stringify(data))
  }

  /** Indica si una colección ya tiene datos (usado por la siembra del primer arranque). */
  static hasData(name: CollectionName): boolean {
    return this.read(name).length > 0
  }

  /** Elimina todos los datos de Creatorly, incluida la sesión. */
  static clearAll(): void {
    Object.values(this.KEYS).forEach((key) => localStorage.removeItem(key))
    localStorage.removeItem(this.SESSION_KEY)
  }

  /** Lee la sesión persistida. */
  static getSession(): SessionRecord | null {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY)
      return raw ? (JSON.parse(raw) as SessionRecord) : null
    } catch {
      return null
    }
  }

  /** Persiste la sesión activa. Nunca guarda la contraseña. */
  static setSession(userId: string): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({ userId }))
  }

  /** Elimina la sesión persistida. */
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY)
  }
}
