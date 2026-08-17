import { read, write } from '@/services/storage'
import Marca from './Marca'
import Creador from './Creador'
import User from './User'

/** Estados válidos del ciclo de vida de un Pedido.
 * @type {Array<string>}
 */
export const ESTADOS = [
  'solicitado',
  'asignado',
  'en_produccion',
  'entregado',
  'aprobado',
]

/** Estados que consideran el pedido "activo" (aún en curso).
 * @type {Array<string>}
 */
export const ESTADOS_ACTIVOS = ['solicitado', 'asignado', 'en_produccion']

/**
 * Pedido: la unidad de trabajo del sistema. Conecta a una Marca (quien solicita),
 * un Creador (quien produce, opcional hasta la asignación) y un User coordinador
 * (quien lo gestiona). Ver ADR-0001: las referencias se guardan por id.
 */
export default class Pedido {
  /**
   * @param {Object} d
   * @param {string} [d.id] - UUID; se genera si no viene.
   * @param {string} d.descripcion
   * @param {number} d.presupuesto - Valor pactado (>= 0).
   * @param {string} [d.fechaSolicitud] - ISO date (yyyy-mm-dd).
   * @param {string} [d.fechaEntrega] - ISO date; null si aún sin fecha.
   * @param {string} [d.estado] - Uno de ESTADOS.
   * @param {string} d.marcaId - Id de la Marca que solicita (obligatorio).
   * @param {string} [d.creadorId] - Id del Creador asignado; null hasta asignar.
   * @param {string} d.coordinadorId - Id del User que lo gestiona (obligatorio).
   * @param {string} [d.createdAt] - ISO datetime.
   * @param {string} [d.updatedAt] - ISO datetime.
   */
  constructor({
    id,
    descripcion,
    presupuesto,
    fechaSolicitud,
    fechaEntrega = null,
    estado = 'solicitado',
    marcaId,
    creadorId = null,
    coordinadorId,
    createdAt,
    updatedAt,
  }) {
    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('Pedido: la descripción es obligatoria')
    }
    if (typeof presupuesto !== 'number' || Number.isNaN(presupuesto) || presupuesto < 0) {
      throw new Error('Pedido: el presupuesto debe ser un número >= 0')
    }
    if (!ESTADOS.includes(estado)) {
      throw new Error(`Pedido: el estado debe ser uno de ${ESTADOS.join(' | ')}`)
    }
    if (!marcaId || typeof marcaId !== 'string') {
      throw new Error('Pedido: marcaId es obligatorio')
    }
    if (!coordinadorId || typeof coordinadorId !== 'string') {
      throw new Error('Pedido: coordinadorId es obligatorio')
    }
    if (creadorId !== null && typeof creadorId !== 'string') {
      throw new Error('Pedido: creadorId debe ser un id o null')
    }
    this.id = id ?? crypto.randomUUID()
    this.descripcion = descripcion
    this.presupuesto = presupuesto
    this.fechaSolicitud = fechaSolicitud ?? new Date().toISOString().slice(0, 10)
    this.fechaEntrega = fechaEntrega
    this.estado = estado
    this.marcaId = marcaId
    this.creadorId = creadorId
    this.coordinadorId = coordinadorId
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? this.createdAt
  }

  /** Copia serializable para persistencia.
   * @returns {Object}
   */
  toPlain() {
    return { ...this }
  }

  /** La Marca que solicitó este pedido.
   * @returns {Marca | null}
   */
  marca() {
    return Marca.getById(this.marcaId)
  }

  /** El Creador asignado (null si aún no se asigna).
   * @returns {Creador | null}
   */
  creador() {
    return this.creadorId ? Creador.getById(this.creadorId) : null
  }

  /** El User coordinador que gestiona este pedido.
   * @returns {User | null}
   */
  coordinador() {
    return User.getById(this.coordinadorId)
  }

  /** Si el pedido sigue en curso.
   * @returns {boolean}
   */
  estaActivo() {
    return ESTADOS_ACTIVOS.includes(this.estado)
  }

  /** Todos los pedidos.
   * @returns {Array<Pedido>}
   */
  static all() {
    return read('pedidos').map((d) => new Pedido(d))
  }

  /**
   * @param {string} id
   * @returns {Pedido | null}
   */
  static getById(id) {
    return this.all().find((p) => p.id === id) ?? null
  }

  /** Crea y persiste un pedido.
   * @param {Object} data
   * @returns {Pedido}
   */
  static create(data) {
    const pedido = new Pedido(data)
    write('pedidos', [...this.all().map((p) => p.toPlain()), pedido.toPlain()])
    return pedido
  }

  /** Actualiza un pedido por id.
   * @param {string} id
   * @param {Object} data
   * @returns {Pedido | null}
   */
  static update(id, data) {
    const list = this.all()
    const i = list.findIndex((p) => p.id === id)
    if (i === -1) return null
    list[i] = new Pedido({ ...list[i].toPlain(), ...data, updatedAt: new Date().toISOString() })
    write('pedidos', list.map((p) => p.toPlain()))
    return list[i]
  }

  /** Elimina un pedido por id.
   * @param {string} id
   * @returns {boolean}
   */
  static remove(id) {
    const list = this.all()
    if (!list.some((p) => p.id === id)) return false
    write('pedidos', list.filter((p) => p.id !== id).map((p) => p.toPlain()))
    return true
  }
}
