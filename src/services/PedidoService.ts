// Kevin Pabón

// internal imports
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { UserService } from '@/services/UserService'
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { EstadoPedido, PedidoInterface } from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { usePedidoStore } from '@/stores/PedidoStore'

const ESTADOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado']

const ESTADOS_ACTIVOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion']

const ESTADOS_FINALES: EstadoPedido[] = ['entregado', 'aprobado']

export interface HomeStat {
  id: string
  label: string
  value: number
  unit: string
}

export interface PedidoActivity {
  id: string
  title: string
  timestamp: string
  type: 'default' | 'milestone'
}

function validate(datos: CreatePedidoDTO): void {
  if (!datos.descripcion || typeof datos.descripcion !== 'string') {
    throw new Error('Pedido: la descripción es obligatoria')
  }
  if (
    typeof datos.presupuesto !== 'number' ||
    Number.isNaN(datos.presupuesto) ||
    datos.presupuesto < 0
  ) {
    throw new Error('Pedido: el presupuesto debe ser un número >= 0')
  }
  if (!ESTADOS.includes(datos.estado)) {
    throw new Error(`Pedido: el estado debe ser uno de ${ESTADOS.join(' | ')}`)
  }
  if (!datos.marcaId || typeof datos.marcaId !== 'string') {
    throw new Error('Pedido: marcaId es obligatorio')
  }
  if (!datos.coordinadorId || typeof datos.coordinadorId !== 'string') {
    throw new Error('Pedido: coordinadorId es obligatorio')
  }
  if (datos.creadorId !== null && typeof datos.creadorId !== 'string') {
    throw new Error('Pedido: creadorId debe ser un id o null')
  }
}

export class PedidoService {
  static getAll(): PedidoInterface[] {
    return usePedidoStore().pedidos
  }

  static getById(id: string): PedidoInterface | undefined {
    return usePedidoStore().pedidos.find((pedido) => pedido.id === id)
  }

  static getMarca(pedido: PedidoInterface): MarcaInterface | undefined {
    return MarcaService.getById(pedido.marcaId)
  }

  static getCreador(pedido: PedidoInterface): CreadorInterface | undefined {
    return pedido.creadorId ? CreadorService.getById(pedido.creadorId) : undefined
  }

  static getCoordinador(pedido: PedidoInterface): UserInterface | undefined {
    return UserService.getById(pedido.coordinadorId)
  }

  static estaActivo(pedido: PedidoInterface): boolean {
    return ESTADOS_ACTIVOS.includes(pedido.estado)
  }

  /** KPIs del HomeView. Puerto de composables/useHomeStats.js (paso 7). */
  static getStats(): HomeStat[] {
    const pedidos = this.getAll()
    const activos = pedidos.filter((pedido) => this.estaActivo(pedido))
    const presupuestoComprometido = activos.reduce((suma, pedido) => suma + pedido.presupuesto, 0)

    const hoy = new Date()
    const esMismoMes = (fechaIso: string): boolean => {
      const fecha = new Date(fechaIso)
      return (
        fecha.getUTCFullYear() === hoy.getUTCFullYear() && fecha.getUTCMonth() === hoy.getUTCMonth()
      )
    }
    const entregasDelMes = pedidos.filter(
      (pedido) =>
        ESTADOS_FINALES.includes(pedido.estado) &&
        pedido.fechaEntrega !== null &&
        esMismoMes(pedido.fechaEntrega),
    ).length

    return [
      { id: 'total', label: 'Pedidos totales', value: pedidos.length, unit: '' },
      { id: 'activos', label: 'Pedidos activos', value: activos.length, unit: '' },
      {
        id: 'presupuesto',
        label: 'Presupuesto comprometido',
        value: presupuestoComprometido,
        unit: '$',
      },
      { id: 'entregas', label: 'Entregas del mes', value: entregasDelMes, unit: '' },
    ]
  }

  /** Actividad reciente del HomeView. Puerto de composables/useHomeStats.js (paso 7). */
  static getRecentPedidos(limite: number = 5): PedidoActivity[] {
    return [...this.getAll()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limite)
      .map((pedido) => ({
        id: pedido.id,
        title: `${pedido.descripcion} — ${this.getMarca(pedido)?.nombre ?? 'sin marca'}`,
        timestamp: pedido.createdAt,
        type: ESTADOS_FINALES.includes(pedido.estado) ? 'milestone' : 'default',
      }))
  }

  static create(datos: CreatePedidoDTO): PedidoInterface {
    const normalizado: CreatePedidoDTO = {
      ...datos,
      fechaEntrega: datos.fechaEntrega ?? null,
      estado: datos.estado ?? 'solicitado',
      creadorId: datos.creadorId ?? null,
      fechaSolicitud: datos.fechaSolicitud ?? new Date().toISOString().slice(0, 10),
    }
    validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoPedido: PedidoInterface = {
      ...normalizado,
      id: crypto.randomUUID(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    usePedidoStore().pedidos.push(nuevoPedido)
    return nuevoPedido
  }

  static update(id: string, cambios: Partial<CreatePedidoDTO>): PedidoInterface | undefined {
    const pedidos = usePedidoStore().pedidos
    const indice = pedidos.findIndex((pedido) => pedido.id === id)
    if (indice === -1) return undefined
    const combinado: CreatePedidoDTO = {
      descripcion: cambios.descripcion ?? pedidos[indice].descripcion,
      presupuesto: cambios.presupuesto ?? pedidos[indice].presupuesto,
      fechaSolicitud: cambios.fechaSolicitud ?? pedidos[indice].fechaSolicitud,
      fechaEntrega: cambios.fechaEntrega ?? pedidos[indice].fechaEntrega,
      estado: cambios.estado ?? pedidos[indice].estado,
      marcaId: cambios.marcaId ?? pedidos[indice].marcaId,
      creadorId: cambios.creadorId ?? pedidos[indice].creadorId,
      coordinadorId: cambios.coordinadorId ?? pedidos[indice].coordinadorId,
    }
    validate(combinado)
    const actualizado: PedidoInterface = {
      ...pedidos[indice],
      ...combinado,
      updatedAt: new Date().toISOString(),
    }
    pedidos[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const pedidos = usePedidoStore().pedidos
    const indice = pedidos.findIndex((pedido) => pedido.id === id)
    if (indice === -1) return false
    pedidos.splice(indice, 1)
    return true
  }
}
