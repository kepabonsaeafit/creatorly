// Kevin Pabón

// internal imports
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { PedidosPorCreadorDTO } from '@/dtos/PedidosPorCreadorDTO'
import type { PedidosPorEstadoDTO } from '@/dtos/PedidosPorEstadoDTO'
import type { PedidosPorMesDTO } from '@/dtos/PedidosPorMesDTO'
import type { PresupuestoPorMarcaDTO } from '@/dtos/PresupuestoPorMarcaDTO'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { UserService } from '@/services/UserService'
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { EstadoPedido, PedidoInterface } from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { usePedidoStore } from '@/stores/PedidoStore'
import { formatMonthLabel } from '@/utils/formatDate'

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

  /** Aplica un PedidoFiltroDTO sobre una lista de pedidos. Usado por PedidosIndexView y ReportesView. */
  static filtrar(pedidos: PedidoInterface[], filtro: PedidoFiltroDTO): PedidoInterface[] {
    return pedidos.filter((pedido) => {
      if (filtro.estado && pedido.estado !== filtro.estado) return false
      if (filtro.marcaId && pedido.marcaId !== filtro.marcaId) return false
      if (filtro.creadorId && pedido.creadorId !== filtro.creadorId) return false
      if (filtro.desde && pedido.fechaSolicitud < filtro.desde) return false
      if (filtro.hasta && pedido.fechaSolicitud > filtro.hasta) return false
      if (filtro.texto) {
        const texto = filtro.texto.trim().toLowerCase()
        if (texto && !pedido.descripcion.toLowerCase().includes(texto)) return false
      }
      return true
    })
  }

  /** Cantidad de pedidos por estado, en el orden fijo del ciclo de vida. */
  static getPedidosPorEstado(pedidos: PedidoInterface[]): PedidosPorEstadoDTO[] {
    return ESTADOS.map((estado) => ({
      estado,
      cantidad: pedidos.filter((pedido) => pedido.estado === estado).length,
    }))
  }

  /** Cantidad de pedidos asignados por creador (excluye pedidos sin creador asignado). */
  static getPedidosPorCreador(pedidos: PedidoInterface[]): PedidosPorCreadorDTO[] {
    const conteos = new Map<string, number>()
    for (const pedido of pedidos) {
      if (!pedido.creadorId) continue
      conteos.set(pedido.creadorId, (conteos.get(pedido.creadorId) ?? 0) + 1)
    }
    return [...conteos.entries()]
      .map(([creadorId, cantidad]) => ({
        creadorId,
        creadorNombre: CreadorService.getById(creadorId)?.nombre ?? 'Creador eliminado',
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }

  /** Presupuesto total comprometido por marca. */
  static getPresupuestoPorMarca(pedidos: PedidoInterface[]): PresupuestoPorMarcaDTO[] {
    const totales = new Map<string, number>()
    for (const pedido of pedidos) {
      totales.set(pedido.marcaId, (totales.get(pedido.marcaId) ?? 0) + pedido.presupuesto)
    }
    return [...totales.entries()]
      .map(([marcaId, presupuesto]) => ({
        marcaId,
        marcaNombre: MarcaService.getById(marcaId)?.nombre ?? 'Marca eliminada',
        presupuesto,
      }))
      .sort((a, b) => b.presupuesto - a.presupuesto)
  }

  /** Cantidad de pedidos y presupuesto por mes de solicitud, ordenado cronológicamente. */
  static getPedidosPorMes(pedidos: PedidoInterface[]): PedidosPorMesDTO[] {
    const agregados = new Map<string, { cantidad: number; presupuesto: number }>()
    for (const pedido of pedidos) {
      const mes = pedido.fechaSolicitud.slice(0, 7)
      const actual = agregados.get(mes) ?? { cantidad: 0, presupuesto: 0 }
      agregados.set(mes, {
        cantidad: actual.cantidad + 1,
        presupuesto: actual.presupuesto + pedido.presupuesto,
      })
    }
    return [...agregados.entries()]
      .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
      .map(([mes, valores]) => ({
        mes,
        etiqueta: formatMonthLabel(`${mes}-01`),
        ...valores,
      }))
  }

  /** KPIs de ReportesView, con la misma forma que HomeStat para reusar StatCardGrid. */
  static getReportStats(pedidos: PedidoInterface[]): HomeStat[] {
    const presupuestoTotal = pedidos.reduce((suma, pedido) => suma + pedido.presupuesto, 0)
    const aprobados = pedidos.filter((pedido) => pedido.estado === 'aprobado').length
    const tasaAprobacion = pedidos.length > 0 ? Math.round((aprobados / pedidos.length) * 100) : 0

    return [
      { id: 'total', label: 'Pedidos', value: pedidos.length, unit: '' },
      { id: 'presupuesto', label: 'Presupuesto total', value: presupuestoTotal, unit: '$' },
      {
        id: 'promedio',
        label: 'Presupuesto promedio',
        value: pedidos.length > 0 ? Math.round(presupuestoTotal / pedidos.length) : 0,
        unit: '$',
      },
      { id: 'aprobacion', label: 'Tasa de aprobación (%)', value: tasaAprobacion, unit: '' },
    ]
  }
}
