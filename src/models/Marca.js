import { read, write } from '@/services/storage'
import Pedido from './Pedido'

/**
 * Marca: el cliente de la agencia, quien solicita el contenido.
 */
export default class Marca {
  /**
   * @param {Object} d
   * @param {string} [d.id] - UUID; se genera si no viene.
   * @param {string} d.nombre
   * @param {string} d.industria - Ej.: belleza, videojuegos.
   * @param {string} d.contactoNombre
   * @param {string} d.contactoEmail
   * @param {string} [d.createdAt] - ISO datetime.
   * @param {string} [d.updatedAt] - ISO datetime.
   */
  constructor({ id, nombre, industria, contactoNombre, contactoEmail, createdAt, updatedAt }) {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('Marca: el nombre es obligatorio')
    }
    if (!industria || typeof industria !== 'string') {
      throw new Error('Marca: la industria es obligatoria')
    }
    if (!contactoNombre || typeof contactoNombre !== 'string') {
      throw new Error('Marca: el nombre del contacto es obligatorio')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoEmail ?? '')) {
      throw new Error('Marca: el email del contacto no tiene un formato válido')
    }
    this.id = id ?? crypto.randomUUID()
    this.nombre = nombre
    this.industria = industria
    this.contactoNombre = contactoNombre
    this.contactoEmail = String(contactoEmail).trim().toLowerCase()
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? this.createdAt
  }

  /** Copia serializable para persistencia.
   * @returns {Object}
   */
  toPlain() {
    return { ...this }
  }

  /** Pedidos solicitados por esta Marca (relación inversa).
   * @returns {Array<Pedido>}
   */
  pedidos() {
    return Pedido.all().filter((p) => p.marcaId === this.id)
  }

  /** Todas las marcas.
   * @returns {Array<Marca>}
   */
  static all() {
    return read('marcas').map((d) => new Marca(d))
  }

  /**
   * @param {string} id
   * @returns {Marca | null}
   */
  static getById(id) {
    return this.all().find((m) => m.id === id) ?? null
  }

  /** Crea y persiste una marca.
   * @param {Object} data
   * @returns {Marca}
   */
  static create(data) {
    const marca = new Marca(data)
    write('marcas', [...this.all().map((m) => m.toPlain()), marca.toPlain()])
    return marca
  }

  /** Actualiza una marca por id.
   * @param {string} id
   * @param {Object} data
   * @returns {Marca | null}
   */
  static update(id, data) {
    const list = this.all()
    const i = list.findIndex((m) => m.id === id)
    if (i === -1) return null
    list[i] = new Marca({ ...list[i].toPlain(), ...data, updatedAt: new Date().toISOString() })
    write(
      'marcas',
      list.map((m) => m.toPlain()),
    )
    return list[i]
  }

  /** Elimina una marca por id.
   * @param {string} id
   * @returns {boolean}
   */
  static remove(id) {
    const list = this.all()
    if (!list.some((m) => m.id === id)) return false
    write(
      'marcas',
      list.filter((m) => m.id !== id).map((m) => m.toPlain()),
    )
    return true
  }
}
