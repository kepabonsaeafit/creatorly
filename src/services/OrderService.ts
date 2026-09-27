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

  private static validate(orderData: CreateOrderDTO): void {
    if (!orderData.description || typeof orderData.description !== 'string') {
      throw new Error('Pedido: la descripción es obligatoria')
    }
    if (
      typeof orderData.budget !== 'number' ||
      Number.isNaN(orderData.budget) ||
      orderData.budget < 0
    ) {
      throw new Error('Pedido: el presupuesto debe ser un número >= 0')
    }
    if (!STATUSES.includes(orderData.status)) {
      throw new Error(`Pedido: el estado debe ser uno de ${STATUSES.join(' | ')}`)
    }
    if (!orderData.brandId || typeof orderData.brandId !== 'string') {
      throw new Error('Pedido: marcaId es obligatorio')
    }
    if (!orderData.userId || typeof orderData.userId !== 'string') {
      throw new Error('Pedido: userId es obligatorio')
    }
    if (orderData.creatorId !== null && typeof orderData.creatorId !== 'string') {
      throw new Error('Pedido: creadorId debe ser un id o null')
    }
  }

  static getAll(): OrderInterface[] {
    return useOrderStore().orders
  }

  static getById(id: string): OrderInterface | undefined {
    return useOrderStore().orders.find((order) => order.id === id)
  }

  static getBrand(order: OrderInterface): BrandInterface | undefined {
    return BrandService.getById(order.brandId)
  }

  static getCreator(order: OrderInterface): CreatorInterface | undefined {
    return order.creatorId ? CreatorService.getById(order.creatorId) : undefined
  }

  static getCoordinator(order: OrderInterface): UserInterface | undefined {
    return UserService.getById(order.userId)
  }

  static isActive(order: OrderInterface): boolean {
    return this.ACTIVE_STATUSES.includes(order.status)
  }

  /** KPIs del HomeView. */
  static getStats(): HomeStat[] {
    const orders = this.getAll()
    const activeOrders = orders.filter((order) => this.isActive(order))
    const committedBudget = activeOrders.reduce((sum, order) => sum + order.budget, 0)

    // Comparación por los primeros 7 caracteres ('YYYY-MM') de la fecha local de
    // hoy y de fechaEntrega, sin pasar por Date: evita que una fecha solo-día se
    // interprete como medianoche UTC y "se mueva" de mes en zonas al oeste de UTC.
    const currentMonth = todayIso().slice(0, 7)
    const deliveriesThisMonth = orders.filter(
      (order) =>
        FINAL_STATUSES.includes(order.status) &&
        order.deliveryDate !== null &&
        order.deliveryDate.slice(0, 7) === currentMonth,
    ).length

    return [
      { id: 'total', label: 'Pedidos totales', value: orders.length, unit: '' },
      { id: 'activos', label: 'Pedidos activos', value: activeOrders.length, unit: '' },
      {
        id: 'presupuesto',
        label: 'Presupuesto comprometido',
        value: committedBudget,
        unit: '$',
      },
      { id: 'entregas', label: 'Entregas del mes', value: deliveriesThisMonth, unit: '' },
    ]
  }

  /** Actividad reciente del HomeView. */
  static getRecentOrders(limit: number = 5): OrderActivity[] {
    return [...this.getAll()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map((order) => ({
        id: order.id,
        title: `${order.description} — ${this.getBrand(order)?.name ?? 'sin marca'}`,
        timestamp: order.createdAt,
        type: FINAL_STATUSES.includes(order.status) ? 'milestone' : 'default',
      }))
  }

  static create(orderData: CreateOrderDTO): OrderInterface {
    const normalizedData: CreateOrderDTO = {
      ...orderData,
      deliveryDate: orderData.deliveryDate ?? null,
      status: orderData.status ?? 'requested',
      creatorId: orderData.creatorId ?? null,
      requestDate: orderData.requestDate ?? todayIso(),
    }
    this.validate(normalizedData)
    const now = new Date().toISOString()
    const newOrder: OrderInterface = {
      ...normalizedData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    useOrderStore().orders.push(newOrder)
    return newOrder
  }

  static update(id: string, changes: Partial<CreateOrderDTO>): OrderInterface | undefined {
    const orders = useOrderStore().orders
    const index = orders.findIndex((order) => order.id === id)
    if (index === -1) return undefined
    const merged: CreateOrderDTO = {
      description: changes.description ?? orders[index].description,
      budget: changes.budget ?? orders[index].budget,
      requestDate: changes.requestDate ?? orders[index].requestDate,
      // deliveryDate y creatorId aceptan null a propósito (sin fecha, sin creador
      // asignado): `??` trataría ese null como "no cambió" y conservaría el valor
      // anterior, así que se compara contra undefined para distinguir "no vino en
      // los cambios" de "se borró a propósito".
      deliveryDate:
        changes.deliveryDate !== undefined ? changes.deliveryDate : orders[index].deliveryDate,
      status: changes.status ?? orders[index].status,
      brandId: changes.brandId ?? orders[index].brandId,
      creatorId: changes.creatorId !== undefined ? changes.creatorId : orders[index].creatorId,
      userId: changes.userId ?? orders[index].userId,
    }
    this.validate(merged)
    const updated: OrderInterface = {
      ...orders[index],
      ...merged,
      updatedAt: new Date().toISOString(),
    }
    orders[index] = updated
    return updated
  }

  static remove(id: string): boolean {
    const orders = useOrderStore().orders
    const index = orders.findIndex((order) => order.id === id)
    if (index === -1) return false
    orders.splice(index, 1)
    return true
  }

  /** Aplica un OrderFilterDTO sobre una lista de pedidos, sin ordenar. Usado por ReportsView. */
  static filter(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return orders.filter((order) => {
      if (filter.status && order.status !== filter.status) return false
      if (filter.brandId && order.brandId !== filter.brandId) return false
      if (filter.creatorId && order.creatorId !== filter.creatorId) return false
      if (filter.from && order.requestDate < filter.from) return false
      if (filter.to && order.requestDate > filter.to) return false
      if (filter.text) {
        const text = filter.text.trim().toLowerCase()
        if (text && !order.description.toLowerCase().includes(text)) return false
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
  static filterSorted(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return this.filter(orders, filter).sort((a, b) => b.requestDate.localeCompare(a.requestDate))
  }

  /** Cantidad de pedidos por estado, en el orden fijo del ciclo de vida. */
  static getOrdersByStatus(orders: OrderInterface[]): OrdersByStatusDTO[] {
    return STATUSES.map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }))
  }

  /** Cantidad de pedidos asignados por creador (excluye pedidos sin creador asignado). */
  static getOrdersByCreator(orders: OrderInterface[]): OrdersByCreatorDTO[] {
    const counts = new Map<string, number>()
    for (const order of orders) {
      if (!order.creatorId) continue
      counts.set(order.creatorId, (counts.get(order.creatorId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([creatorId, count]) => ({
        creatorId,
        creatorName: CreatorService.getById(creatorId)?.name ?? 'Creador eliminado',
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }

  /** Presupuesto total comprometido por marca. */
  static getBudgetByBrand(orders: OrderInterface[]): BudgetByBrandDTO[] {
    const totals = new Map<string, number>()
    for (const order of orders) {
      totals.set(order.brandId, (totals.get(order.brandId) ?? 0) + order.budget)
    }
    return [...totals.entries()]
      .map(([brandId, budget]) => ({
        brandId,
        brandName: BrandService.getById(brandId)?.name ?? 'Marca eliminada',
        budget,
      }))
      .sort((a, b) => b.budget - a.budget)
  }

  /** Cantidad de pedidos y presupuesto por mes de solicitud, ordenado cronológicamente. */
  static getOrdersByMonth(orders: OrderInterface[]): OrdersByMonthDTO[] {
    const aggregates = new Map<string, { count: number; budget: number }>()
    for (const order of orders) {
      const month = order.requestDate.slice(0, 7)
      const current = aggregates.get(month) ?? { count: 0, budget: 0 }
      aggregates.set(month, {
        count: current.count + 1,
        budget: current.budget + order.budget,
      })
    }
    return [...aggregates.entries()]
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([month, values]) => ({
        month,
        label: formatMonthLabel(`${month}-01`),
        count: values.count,
        budget: values.budget,
      }))
  }

  /** KPIs de ReportsView, con la misma forma que HomeStat para reusar StatCardGrid. */
  static getReportStats(orders: OrderInterface[]): HomeStat[] {
    const totalBudget = orders.reduce((sum, order) => sum + order.budget, 0)
    const approvedCount = orders.filter((order) => order.status === 'approved').length
    const approvalRate = orders.length > 0 ? Math.round((approvedCount / orders.length) * 100) : 0

    return [
      { id: 'total', label: 'Pedidos', value: orders.length, unit: '' },
      { id: 'presupuesto', label: 'Presupuesto total', value: totalBudget, unit: '$' },
      {
        id: 'promedio',
        label: 'Presupuesto promedio',
        value: orders.length > 0 ? Math.round(totalBudget / orders.length) : 0,
        unit: '$',
      },
      { id: 'aprobacion', label: 'Tasa de aprobación (%)', value: approvalRate, unit: '' },
    ]
  }
}
