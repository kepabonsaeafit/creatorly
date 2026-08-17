import { read, write } from '@/services/storage'
import Pedido from './Pedido'

/**
 * Creador UGC del catálogo de la agencia (el talento que produce el contenido).
 */
export default class Creador {
  /**
   * @param {Object} d
   * @param {string} [d.id] - UUID; se genera si no viene.
   * @param {string} d.nombre
   * @param {string} d.nicho - Ej.: belleza, gaming, moda.
   * @param {string} d.tipoContenido - Ej.: TikTok, YouTube, Instagram.
   * @param {number} d.tarifa - Tarifa por pedido (>= 0).
   * @param {boolean} [d.disponible] - Si puede recibir pedidos nuevos.
   * @param {string} [d.createdAt] - ISO datetime.
   * @param {string} [d.updatedAt] - ISO datetime.
   */
  constructor({
    id,
    nombre,
    nicho,
    tipoContenido,
    tarifa,
    disponible = true,
    createdAt,
    updatedAt,
  }) {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('Creador: el nombre es obligatorio')
    }
    if (!nicho || typeof nicho !== 'string') {
      throw new Error('Creador: el nicho es obligatorio')
    }
    if (!tipoContenido || typeof tipoContenido !== 'string') {
      throw new Error('Creador: el tipo de contenido es obligatorio')
    }
    if (typeof tarifa !== 'number' || Number.isNaN(tarifa) || tarifa < 0) {
      throw new Error('Creador: la tarifa debe ser un número >= 0')
    }
    this.id = id ?? crypto.randomUUID()
    this.nombre = nombre
    this.nicho = nicho
    this.tipoContenido = tipoContenido
    this.tarifa = tarifa
    this.disponible = Boolean(disponible)
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? this.createdAt
  }

  /** Copia serializable para persistencia.
   * @returns {Object}
   */
  toPlain() {
    return { ...this }
  }

  /** Pedidos asignados a este Creador (relación inversa).
   * @returns {Array<Pedido>}
   */
  pedidos() {
    return Pedido.all().filter((p) => p.creadorId === this.id)
  }

  /** Todo el catálogo de creadores.
   * @returns {Array<Creador>}
   */
  static all() {
    return read('creadores').map((d) => new Creador(d))
  }

  /**
   * @param {string} id
   * @returns {Creador | null}
   */
  static getById(id) {
    return this.all().find((c) => c.id === id) ?? null
  }

  /** Crea y persiste un creador.
   * @param {Object} data
   * @returns {Creador}
   */
  static create(data) {
    const creador = new Creador(data)
    write('creadores', [...this.all().map((c) => c.toPlain()), creador.toPlain()])
    return creador
  }

  /** Actualiza un creador por id.
   * @param {string} id
   * @param {Object} data
   * @returns {Creador | null}
   */
  static update(id, data) {
    const list = this.all()
    const i = list.findIndex((c) => c.id === id)
    if (i === -1) return null
    list[i] = new Creador({ ...list[i].toPlain(), ...data, updatedAt: new Date().toISOString() })
    write('creadores', list.map((c) => c.toPlain()))
    return list[i]
  }

  /** Elimina un creador por id.
   * @param {string} id
   * @returns {boolean}
   */
  static remove(id) {
    const list = this.all()
    if (!list.some((c) => c.id === id)) return false
    write('creadores', list.filter((c) => c.id !== id).map((c) => c.toPlain()))
    return true
  }
}
