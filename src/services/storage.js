/**
 * Capa única de acceso a LocalStorage del navegador (ADR-0001).
 * Ningún otro módulo de la aplicación debe usar `localStorage` directamente;
 * los modelos hidratan estos objetos planos a instancias.
 */

/** Nombres de colección soportados.
 * @typedef {'users'|'creadores'|'marcas'|'pedidos'} CollectionName
 */

const KEYS = {
  users: 'creatorly_users',
  creadores: 'creatorly_creadores',
  marcas: 'creatorly_marcas',
  pedidos: 'creatorly_pedidos',
}

const SESSION_KEY = 'creatorly_session'

/**
 * Lee una colección completa como objetos planos.
 * @param {CollectionName} name
 * @returns {Array<Object>}
 */
export function read(name) {
  try {
    const raw = localStorage.getItem(KEYS[name])
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Reemplaza el contenido completo de una colección.
 * @param {CollectionName} name
 * @param {Array<Object>} data - Objetos serializables (toPlain()).
 * @returns {void}
 */
export function write(name, data) {
  localStorage.setItem(KEYS[name], JSON.stringify(data))
}

/**
 * Indica si una colección ya tiene datos (usado por la siembra del primer arranque).
 * @param {CollectionName} name
 * @returns {boolean}
 */
export function hasData(name) {
  return read(name).length > 0
}

/**
 * Elimina todos los datos de Creatorly, incluida la sesión
 * (base del futuro botón "restablecer datos demo").
 * @returns {void}
 */
export function clearAll() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Lee la sesión persistida.
 * @returns {{ userId: string } | null}
 */
export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Persiste la sesión activa. Nunca guarda la contraseña.
 * @param {string} userId
 * @returns {void}
 */
export function writeSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

/**
 * Elimina la sesión persistida.
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
