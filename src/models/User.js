import { read, write } from '@/services/storage'
import Pedido from './Pedido'

/** Roles válidos de un User del sistema.
 * @type {Array<string>}
 */
export const ROLES = ['admin', 'coordinador']

/**
 * Usuario interno del sistema (administrador o coordinador).
 * Ver el glosario del dominio en CONTEXT.md.
 */
export default class User {
  /**
   * @param {Object} d
   * @param {string} [d.id] - UUID; se genera si no viene.
   * @param {string} d.nombre
   * @param {string} d.email
   * @param {string} d.password
   * @param {string} [d.rol] - 'admin' | 'coordinador'.
   * @param {string} [d.createdAt] - ISO datetime.
   * @param {string} [d.updatedAt] - ISO datetime.
   */
  constructor({ id, nombre, email, password, rol = 'coordinador', createdAt, updatedAt }) {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('User: el nombre es obligatorio')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
      throw new Error('User: el email no tiene un formato válido')
    }
    if (!password || typeof password !== 'string') {
      throw new Error('User: la contraseña es obligatoria')
    }
    if (!ROLES.includes(rol)) {
      throw new Error(`User: el rol debe ser uno de ${ROLES.join(' | ')}`)
    }
    this.id = id ?? crypto.randomUUID()
    this.nombre = nombre
    this.email = String(email).trim().toLowerCase()
    this.password = password
    this.rol = rol
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? this.createdAt
  }

  /** Copia serializable para persistencia.
   * @returns {Object}
   */
  toPlain() {
    return { ...this }
  }

  /** Pedidos que coordina este User (relación inversa).
   * @returns {Array<Pedido>}
   */
  pedidos() {
    return Pedido.all().filter((p) => p.coordinadorId === this.id)
  }

  /** Todos los usuarios.
   * @returns {Array<User>}
   */
  static all() {
    return read('users').map((d) => new User(d))
  }

  /**
   * @param {string} id
   * @returns {User | null}
   */
  static getById(id) {
    return this.all().find((u) => u.id === id) ?? null
  }

  /** Busca un usuario por credenciales (para el login).
   * @param {string} email
   * @param {string} password
   * @returns {User | null}
   */
  static findByCredentials(email, password) {
    const normalizado = String(email ?? '')
      .trim()
      .toLowerCase()
    return this.all().find((u) => u.email === normalizado && u.password === password) ?? null
  }

  /** Crea y persiste un usuario.
   * @param {Object} data
   * @returns {User}
   */
  static create(data) {
    const user = new User(data)
    write('users', [...this.all().map((u) => u.toPlain()), user.toPlain()])
    return user
  }

  /** Actualiza un usuario por id.
   * @param {string} id
   * @param {Object} data
   * @returns {User | null}
   */
  static update(id, data) {
    const list = this.all()
    const i = list.findIndex((u) => u.id === id)
    if (i === -1) return null
    list[i] = new User({ ...list[i].toPlain(), ...data, updatedAt: new Date().toISOString() })
    write(
      'users',
      list.map((u) => u.toPlain()),
    )
    return list[i]
  }

  /** Elimina un usuario por id.
   * @param {string} id
   * @returns {boolean}
   */
  static remove(id) {
    const list = this.all()
    if (!list.some((u) => u.id === id)) return false
    write(
      'users',
      list.filter((u) => u.id !== id).map((u) => u.toPlain()),
    )
    return true
  }
}
