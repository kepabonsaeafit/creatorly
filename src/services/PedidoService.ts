// Kevin Pabón

// internal imports
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { PedidosPorCreadorDTO } from '@/dtos/PedidosPorCreadorDTO'
import type { PedidosPorEstadoDTO } from '@/dtos/PedidosPorEstadoDTO'
import type { PedidosPorMesDTO } from '@/dtos/PedidosPorMesDTO'
import type { PresupuestoPorMarcaDTO } from '@/dtos/PresupuestoPorMarcaDTO'
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { HomeStat } from '@/interfaces/HomeStatInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { PedidoActivity } from '@/interfaces/PedidoActivityInterface'
import {
  ESTADOS,
  ESTADOS_FINALES,
  type EstadoPedido,
  type PedidoInterface,
} from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { UserService } from '@/services/UserService'
import { usePedidoStore } from '@/stores/PedidoStore'
import { formatMonthLabel, todayIso } from '@/utils/formatDate'
import { generateId } from '@/utils/generateId'

export class PedidoService {
  private static readonly ESTADOS_ACTIVOS: EstadoPedido[] = [
    'solicitado',
    'asignado',
    'en_produccion',
  ]

  private static validate(datos: CreatePedidoDTO): void {
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
    if (!datos.userId || typeof datos.userId !== 'string') {
      throw new Error('Pedido: userId es obligatorio')
    }
    if (datos.creadorId !== null && typeof datos.creadorId !== 'string') {
      throw new Error('Pedido: creadorId debe ser un id o null')
    }
  }

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
    return UserService.getById(pedido.userId)
  }

  static estaActivo(pedido: PedidoInterface): boolean {
    return this.ESTADOS_ACTIVOS.includes(pedido.estado)
  }

  /** KPIs del HomeView. */
  static getStats(): HomeStat[] {
    const pedidos = this.getAll()
    const activos = pedidos.filter((pedido) => this.estaActivo(pedido))
    const presupuestoComprometido = activos.reduce((suma, pedido) => suma + pedido.presupuesto, 0)

    // Comparación por los primeros 7 caracteres ('YYYY-MM') de la fecha local de
    // hoy y de fechaEntrega, sin pasar por Date: evita que una fecha solo-día se
    // interprete como medianoche UTC y "se mueva" de mes en zonas al oeste de UTC.
    const mesActual = todayIso().slice(0, 7)
    const entregasDelMes = pedidos.filter(
      (pedido) =>
        ESTADOS_FINALES.includes(pedido.estado) &&
        pedido.fechaEntrega !== null &&
        pedido.fechaEntrega.slice(0, 7) === mesActual,
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

  /** Actividad reciente del HomeView. */
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
      fechaSolicitud: datos.fechaSolicitud ?? todayIso(),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoPedido: PedidoInterface = {
      ...normalizado,
      id: generateId(),
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
      // fechaEntrega y creadorId aceptan null a propósito (sin fecha, sin creador
      // asignado): `??` trataría ese null como "no cambió" y conservaría el valor
      // anterior, así que se compara contra undefined para distinguir "no vino en
      // los cambios" de "se borró a propósito".
      fechaEntrega:
        cambios.fechaEntrega !== undefined ? cambios.fechaEntrega : pedidos[indice].fechaEntrega,
      estado: cambios.estado ?? pedidos[indice].estado,
      marcaId: cambios.marcaId ?? pedidos[indice].marcaId,
      creadorId: cambios.creadorId !== undefined ? cambios.creadorId : pedidos[indice].creadorId,
      userId: cambios.userId ?? pedidos[indice].userId,
    }
    this.validate(combinado)
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

  /** Aplica un PedidoFiltroDTO sobre una lista de pedidos, sin ordenar. Usado por ReportesView. */
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

  /**
   * Igual que filtrar(), pero ordenado por fecha de solicitud descendente
   * (más recientes primero). Usado por PedidosIndexView; ReportesView sigue
   * usando filtrar() sin ordenar porque el orden de su tabla de detalle no
   * debe cambiar en esta fase.
   */
  static filtrarOrdenados(pedidos: PedidoInterface[], filtro: PedidoFiltroDTO): PedidoInterface[] {
    return this.filtrar(pedidos, filtro).sort((a, b) =>
      b.fechaSolicitud.localeCompare(a.fechaSolicitud),
    )
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
