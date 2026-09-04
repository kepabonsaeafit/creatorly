// Kevin Pabón

/**
 * Capa única de acceso a LocalStorage del navegador (ADR-0001).
 * Ningún otro módulo nuevo debe usar `localStorage` directamente;
 * los stores hidratan y persisten a través de este servicio.
 */

export type CollectionName = 'users' | 'creadores' | 'marcas' | 'pedidos'

interface SessionRecord {
  userId: string
}

const KEYS: Record<CollectionName, string> = {
  users: 'creatorly_users',
  creadores: 'creatorly_creadores',
  marcas: 'creatorly_marcas',
  pedidos: 'creatorly_pedidos',
}

const SESSION_KEY = 'creatorly_session'

export class StorageService {
  /** Lee una colección completa como objetos planos. */
  static read<T>(name: CollectionName): T[] {
    try {
      const raw = localStorage.getItem(KEYS[name])
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  /** Reemplaza el contenido completo de una colección. */
  static write<T>(name: CollectionName, data: T[]): void {
    localStorage.setItem(KEYS[name], JSON.stringify(data))
  }

  /** Indica si una colección ya tiene datos (usado por la siembra del primer arranque). */
  static hasData(name: CollectionName): boolean {
    return this.read(name).length > 0
  }

  /** Elimina todos los datos de Creatorly, incluida la sesión. */
  static clearAll(): void {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    localStorage.removeItem(SESSION_KEY)
  }

  /** Lee la sesión persistida. */
  static getSession(): SessionRecord | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as SessionRecord) : null
    } catch {
      return null
    }
  }

  /** Persiste la sesión activa. Nunca guarda la contraseña. */
  static setSession(userId: string): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
  }

  /** Elimina la sesión persistida. */
  static clearSession(): void {
    localStorage.removeItem(SESSION_KEY)
  }
}
