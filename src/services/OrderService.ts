// Kevin Pabón

// internal imports
import type { BudgetByBrandDTO } from '@/dtos/BudgetByBrandDTO'
import type { CreateOrderDTO } from '@/dtos/CreateOrderDTO'
import type { OrderFilterDTO } from '@/dtos/OrderFilterDTO'
import type { OrdersByCreatorDTO } from '@/dtos/OrdersByCreatorDTO'
import type { OrdersByMonthDTO } from '@/dtos/OrdersByMonthDTO'
import type { OrdersByStatusDTO } from '@/dtos/OrdersByStatusDTO'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import type { HomeStat } from '@/interfaces/HomeStatInterface'
import type { OrderActivity } from '@/interfaces/OrderActivityInterface'
import {
  FINAL_STATUSES,
  type OrderInterface,
  type OrderStatus,
  STATUSES,
} from '@/interfaces/OrderInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { BrandService } from '@/services/BrandService'
import { CreatorService } from '@/services/CreatorService'
import { UserService } from '@/services/UserService'
import { useOrderStore } from '@/stores/OrderStore'
import { formatMonthLabel, todayIso } from '@/utils/formatDate'
import { generateId } from '@/utils/generateId'

export class OrderService {
  private static readonly ACTIVE_STATUSES: OrderStatus[] = [
    'requested',
    'assigned',
    'in_production',
  ]

  private static validate(datos: CreateOrderDTO): void {
    if (!datos.description || typeof datos.description !== 'string') {
      throw new Error('Pedido: la descripción es obligatoria')
    }
    if (typeof datos.budget !== 'number' || Number.isNaN(datos.budget) || datos.budget < 0) {
      throw new Error('Pedido: el presupuesto debe ser un número >= 0')
    }
    if (!STATUSES.includes(datos.status)) {
      throw new Error(`Pedido: el estado debe ser uno de ${STATUSES.join(' | ')}`)
    }
    if (!datos.brandId || typeof datos.brandId !== 'string') {
      throw new Error('Pedido: marcaId es obligatorio')
    }
    if (!datos.userId || typeof datos.userId !== 'string') {
      throw new Error('Pedido: userId es obligatorio')
    }
    if (datos.creatorId !== null && typeof datos.creatorId !== 'string') {
      throw new Error('Pedido: creadorId debe ser un id o null')
    }
  }

  static getAll(): OrderInterface[] {
    return useOrderStore().orders
  }

  static getById(id: string): OrderInterface | undefined {
    return useOrderStore().orders.find((pedido) => pedido.id === id)
  }

  static getBrand(pedido: OrderInterface): BrandInterface | undefined {
    return BrandService.getById(pedido.brandId)
  }

  static getCreator(pedido: OrderInterface): CreatorInterface | undefined {
    return pedido.creatorId ? CreatorService.getById(pedido.creatorId) : undefined
  }

  static getCoordinator(pedido: OrderInterface): UserInterface | undefined {
    return UserService.getById(pedido.userId)
  }

  static isActive(pedido: OrderInterface): boolean {
    return this.ACTIVE_STATUSES.includes(pedido.status)
  }

  /** KPIs del HomeView. */
  static getStats(): HomeStat[] {
    const pedidos = this.getAll()
    const activos = pedidos.filter((pedido) => this.isActive(pedido))
    const presupuestoComprometido = activos.reduce((suma, pedido) => suma + pedido.budget, 0)

    // Comparación por los primeros 7 caracteres ('YYYY-MM') de la fecha local de
    // hoy y de fechaEntrega, sin pasar por Date: evita que una fecha solo-día se
    // interprete como medianoche UTC y "se mueva" de mes en zonas al oeste de UTC.
    const mesActual = todayIso().slice(0, 7)
    const entregasDelMes = pedidos.filter(
      (pedido) =>
        FINAL_STATUSES.includes(pedido.status) &&
        pedido.deliveryDate !== null &&
        pedido.deliveryDate.slice(0, 7) === mesActual,
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
  static getRecentOrders(limite: number = 5): OrderActivity[] {
    return [...this.getAll()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limite)
      .map((pedido) => ({
        id: pedido.id,
        title: `${pedido.description} — ${this.getBrand(pedido)?.name ?? 'sin marca'}`,
        timestamp: pedido.createdAt,
        type: FINAL_STATUSES.includes(pedido.status) ? 'milestone' : 'default',
      }))
  }

  static create(datos: CreateOrderDTO): OrderInterface {
    const normalizado: CreateOrderDTO = {
      ...datos,
      deliveryDate: datos.deliveryDate ?? null,
      status: datos.status ?? 'requested',
      creatorId: datos.creatorId ?? null,
      requestDate: datos.requestDate ?? todayIso(),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoPedido: OrderInterface = {
      ...normalizado,
      id: generateId(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useOrderStore().orders.push(nuevoPedido)
    return nuevoPedido
  }

  static update(id: string, cambios: Partial<CreateOrderDTO>): OrderInterface | undefined {
    const pedidos = useOrderStore().orders
    const indice = pedidos.findIndex((pedido) => pedido.id === id)
    if (indice === -1) return undefined
    const combinado: CreateOrderDTO = {
      description: cambios.description ?? pedidos[indice].description,
      budget: cambios.budget ?? pedidos[indice].budget,
      requestDate: cambios.requestDate ?? pedidos[indice].requestDate,
      // deliveryDate y creatorId aceptan null a propósito (sin fecha, sin creador
      // asignado): `??` trataría ese null como "no cambió" y conservaría el valor
      // anterior, así que se compara contra undefined para distinguir "no vino en
      // los cambios" de "se borró a propósito".
      deliveryDate:
        cambios.deliveryDate !== undefined ? cambios.deliveryDate : pedidos[indice].deliveryDate,
      status: cambios.status ?? pedidos[indice].status,
      brandId: cambios.brandId ?? pedidos[indice].brandId,
      creatorId: cambios.creatorId !== undefined ? cambios.creatorId : pedidos[indice].creatorId,
      userId: cambios.userId ?? pedidos[indice].userId,
    }
    this.validate(combinado)
    const actualizado: OrderInterface = {
      ...pedidos[indice],
      ...combinado,
      updatedAt: new Date().toISOString(),
    }
    pedidos[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const pedidos = useOrderStore().orders
    const indice = pedidos.findIndex((pedido) => pedido.id === id)
    if (indice === -1) return false
    pedidos.splice(indice, 1)
    return true
  }

  /** Aplica un OrderFilterDTO sobre una lista de pedidos, sin ordenar. Usado por ReportsView. */
  static filter(pedidos: OrderInterface[], filtro: OrderFilterDTO): OrderInterface[] {
    return pedidos.filter((pedido) => {
      if (filtro.status && pedido.status !== filtro.status) return false
      if (filtro.brandId && pedido.brandId !== filtro.brandId) return false
      if (filtro.creatorId && pedido.creatorId !== filtro.creatorId) return false
      if (filtro.from && pedido.requestDate < filtro.from) return false
      if (filtro.to && pedido.requestDate > filtro.to) return false
      if (filtro.text) {
        const texto = filtro.text.trim().toLowerCase()
        if (texto && !pedido.description.toLowerCase().includes(texto)) return false
      }
      return true
    })
  }

  /**
   * Igual que filter(), pero ordenado por fecha de solicitud descendente
   * (más recientes primero). Usado por OrdersIndexView; ReportsView sigue
   * usando filter() sin ordenar porque el orden de su tabla de detalle no
   * debe cambiar en esta fase.
   */
  static filterSorted(pedidos: OrderInterface[], filtro: OrderFilterDTO): OrderInterface[] {
    return this.filter(pedidos, filtro).sort((a, b) => b.requestDate.localeCompare(a.requestDate))
  }

  /** Cantidad de pedidos por estado, en el orden fijo del ciclo de vida. */
  static getOrdersByStatus(pedidos: OrderInterface[]): OrdersByStatusDTO[] {
    return STATUSES.map((estado) => ({
      status: estado,
      count: pedidos.filter((pedido) => pedido.status === estado).length,
    }))
  }

  /** Cantidad de pedidos asignados por creador (excluye pedidos sin creador asignado). */
  static getOrdersByCreator(pedidos: OrderInterface[]): OrdersByCreatorDTO[] {
    const conteos = new Map<string, number>()
    for (const pedido of pedidos) {
      if (!pedido.creatorId) continue
      conteos.set(pedido.creatorId, (conteos.get(pedido.creatorId) ?? 0) + 1)
    }
    return [...conteos.entries()]
      .map(([creatorId, cantidad]) => ({
        creatorId,
        creatorName: CreatorService.getById(creatorId)?.name ?? 'Creador eliminado',
        count: cantidad,
      }))
      .sort((a, b) => b.count - a.count)
  }

  /** Presupuesto total comprometido por marca. */
  static getBudgetByBrand(pedidos: OrderInterface[]): BudgetByBrandDTO[] {
    const totales = new Map<string, number>()
    for (const pedido of pedidos) {
      totales.set(pedido.brandId, (totales.get(pedido.brandId) ?? 0) + pedido.budget)
    }
    return [...totales.entries()]
      .map(([brandId, presupuesto]) => ({
        brandId,
        brandName: BrandService.getById(brandId)?.name ?? 'Marca eliminada',
        budget: presupuesto,
      }))
      .sort((a, b) => b.budget - a.budget)
  }

  /** Cantidad de pedidos y presupuesto por mes de solicitud, ordenado cronológicamente. */
  static getOrdersByMonth(pedidos: OrderInterface[]): OrdersByMonthDTO[] {
    const agregados = new Map<string, { cantidad: number; presupuesto: number }>()
    for (const pedido of pedidos) {
      const mes = pedido.requestDate.slice(0, 7)
      const actual = agregados.get(mes) ?? { cantidad: 0, presupuesto: 0 }
      agregados.set(mes, {
        cantidad: actual.cantidad + 1,
        presupuesto: actual.presupuesto + pedido.budget,
      })
    }
    return [...agregados.entries()]
      .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
      .map(([mes, valores]) => ({
        month: mes,
        label: formatMonthLabel(`${mes}-01`),
        count: valores.cantidad,
        budget: valores.presupuesto,
      }))
  }

  /** KPIs de ReportsView, con la misma forma que HomeStat para reusar StatCardGrid. */
  static getReportStats(pedidos: OrderInterface[]): HomeStat[] {
    const presupuestoTotal = pedidos.reduce((suma, pedido) => suma + pedido.budget, 0)
    const aprobados = pedidos.filter((pedido) => pedido.status === 'approved').length
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
