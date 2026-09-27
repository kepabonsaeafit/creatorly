// Author: Kevin Pabón

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
      throw new Error('Order: description is required')
    }
    if (
      typeof orderData.budget !== 'number' ||
      Number.isNaN(orderData.budget) ||
      orderData.budget < 0
    ) {
      throw new Error('Order: budget must be a number >= 0')
    }
    if (!STATUSES.includes(orderData.status)) {
      throw new Error(`Order: status must be one of ${STATUSES.join(' | ')}`)
    }
    if (!orderData.brandId || typeof orderData.brandId !== 'string') {
      throw new Error('Order: brandId is required')
    }
    if (!orderData.userId || typeof orderData.userId !== 'string') {
      throw new Error('Order: userId is required')
    }
    if (orderData.creatorId !== null && typeof orderData.creatorId !== 'string') {
      throw new Error('Order: creatorId must be an id or null')
    }
  }

  /**
   * Gets every order in the store.
   * @returns All orders.
   */
  static getAll(): OrderInterface[] {
    return useOrderStore().orders
  }

  /**
   * Finds an order by id.
   * @param id - Id of the order to look up.
   * @returns The matching order, or `undefined` if not found.
   */
  static getById(id: string): OrderInterface | undefined {
    return useOrderStore().orders.find((order) => order.id === id)
  }

  /**
   * Gets the brand that requested an order.
   * @param order - Order to look up.
   * @returns The requesting brand, or `undefined` if not found.
   */
  static getBrand(order: OrderInterface): BrandInterface | undefined {
    return BrandService.getById(order.brandId)
  }

  /**
   * Gets the creator assigned to an order.
   * @param order - Order to look up.
   * @returns The assigned creator, or `undefined` if unassigned or not found.
   */
  static getCreator(order: OrderInterface): CreatorInterface | undefined {
    return order.creatorId ? CreatorService.getById(order.creatorId) : undefined
  }

  /**
   * Gets the coordinator (User) assigned to an order.
   * @param order - Order to look up.
   * @returns The assigned coordinator, or `undefined` if not found.
   */
  static getCoordinator(order: OrderInterface): UserInterface | undefined {
    return UserService.getById(order.userId)
  }

  /**
   * Checks whether an order is in one of the active statuses.
   * @param order - Order to check.
   * @returns `true` if the order's status is active.
   */
  static isActive(order: OrderInterface): boolean {
    return this.ACTIVE_STATUSES.includes(order.status)
  }

  /**
   * HomeView's KPIs.
   * @returns The Home KPI cards.
   */
  static getStats(): HomeStat[] {
    const orders = this.getAll()
    const activeOrders = orders.filter((order) => this.isActive(order))
    const committedBudget = activeOrders.reduce((sum, order) => sum + order.budget, 0)

    // Compared by the first 7 characters ('YYYY-MM') of today's local date and
    // of deliveryDate, without going through Date: this avoids a date-only
    // value being interpreted as UTC midnight and "moving" to another month
    // in timezones west of UTC.
    const currentMonth = todayIso().slice(0, 7)
    const deliveriesThisMonth = orders.filter(
      (order) =>
        FINAL_STATUSES.includes(order.status) &&
        order.deliveryDate !== null &&
        order.deliveryDate.slice(0, 7) === currentMonth,
    ).length

    return [
      { id: 'total', label: 'Total orders', value: orders.length, unit: '' },
      { id: 'active', label: 'Active orders', value: activeOrders.length, unit: '' },
      {
        id: 'budget',
        label: 'Committed budget',
        value: committedBudget,
        unit: '$',
      },
      { id: 'deliveries', label: 'Deliveries this month', value: deliveriesThisMonth, unit: '' },
    ]
  }

  /**
   * HomeView's recent activity.
   * @param limit - Maximum number of items to return.
   * @returns The most recent orders as activity items.
   */
  static getRecentOrders(limit: number = 5): OrderActivity[] {
    return [...this.getAll()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map((order) => ({
        id: order.id,
        title: `${order.description} — ${this.getBrand(order)?.name ?? 'no brand'}`,
        timestamp: order.createdAt,
        type: FINAL_STATUSES.includes(order.status) ? 'milestone' : 'default',
      }))
  }

  /**
   * Validates and creates a new order.
   * @param orderData - Data required to create the order.
   * @returns The created order, with its id and timestamps.
   * @throws {Error} If any required field is missing or invalid.
   */
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

  /**
   * Validates and applies partial changes to an order.
   * @param id - Id of the order to update.
   * @param changes - Partial fields to change.
   * @returns The updated order, or `undefined` if not found.
   * @throws {Error} If the merged data fails validation.
   */
  static update(id: string, changes: Partial<CreateOrderDTO>): OrderInterface | undefined {
    const orders = useOrderStore().orders
    const index = orders.findIndex((order) => order.id === id)
    if (index === -1) return undefined
    const merged: CreateOrderDTO = {
      description: changes.description ?? orders[index].description,
      budget: changes.budget ?? orders[index].budget,
      requestDate: changes.requestDate ?? orders[index].requestDate,
      // deliveryDate and creatorId accept null on purpose (no date, no creator
      // assigned): `??` would treat that null as "unchanged" and keep the
      // previous value, so it is compared against undefined to distinguish
      // "not included in the changes" from "cleared on purpose".
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

  /**
   * Removes an order by id.
   * @param id - Id of the order to remove.
   * @returns `true` if it was removed, `false` if not found.
   */
  static remove(id: string): boolean {
    const orders = useOrderStore().orders
    const index = orders.findIndex((order) => order.id === id)
    if (index === -1) return false
    orders.splice(index, 1)
    return true
  }

  /**
   * Applies an OrderFilterDTO over a list of orders, unsorted. Used by ReportsView.
   * @param orders - Orders to filter.
   * @param filter - Filter criteria.
   * @returns The filtered orders.
   */
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
   * Same as filter(), but sorted by request date descending (most recent
   * first). Used by OrdersIndexView; ReportsView keeps using filter()
   * unsorted because its detail table's order must not change in this phase.
   * @param orders - Orders to filter.
   * @param filter - Filter criteria.
   * @returns The filtered orders, sorted by request date descending.
   */
  static filterSorted(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return this.filter(orders, filter).sort((a, b) => b.requestDate.localeCompare(a.requestDate))
  }

  /**
   * Number of orders per status, in the lifecycle's fixed order.
   * @param orders - Orders to aggregate.
   * @returns The order count per status.
   */
  static getOrdersByStatus(orders: OrderInterface[]): OrdersByStatusDTO[] {
    return STATUSES.map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }))
  }

  /**
   * Number of orders assigned per creator (excludes orders with no creator assigned).
   * @param orders - Orders to aggregate.
   * @returns The order count per creator, sorted descending.
   */
  static getOrdersByCreator(orders: OrderInterface[]): OrdersByCreatorDTO[] {
    const counts = new Map<string, number>()
    for (const order of orders) {
      if (!order.creatorId) continue
      counts.set(order.creatorId, (counts.get(order.creatorId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([creatorId, count]) => ({
        creatorId,
        creatorName: CreatorService.getById(creatorId)?.name ?? 'Creator deleted',
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Total committed budget per brand.
   * @param orders - Orders to aggregate.
   * @returns The committed budget per brand, sorted descending.
   */
  static getBudgetByBrand(orders: OrderInterface[]): BudgetByBrandDTO[] {
    const totals = new Map<string, number>()
    for (const order of orders) {
      totals.set(order.brandId, (totals.get(order.brandId) ?? 0) + order.budget)
    }
    return [...totals.entries()]
      .map(([brandId, budget]) => ({
        brandId,
        brandName: BrandService.getById(brandId)?.name ?? 'Brand deleted',
        budget,
      }))
      .sort((a, b) => b.budget - a.budget)
  }

  /**
   * Number of orders and budget per request month, sorted chronologically.
   * @param orders - Orders to aggregate.
   * @returns The order count and budget per month.
   */
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

  /**
   * ReportsView's KPIs, with the same shape as HomeStat to reuse StatCardGrid.
   * @param orders - Orders to aggregate.
   * @returns The report KPI cards.
   */
  static getReportStats(orders: OrderInterface[]): HomeStat[] {
    const totalBudget = orders.reduce((sum, order) => sum + order.budget, 0)
    const approvedCount = orders.filter((order) => order.status === 'approved').length
    const approvalRate = orders.length > 0 ? Math.round((approvedCount / orders.length) * 100) : 0

    return [
      { id: 'total', label: 'Orders', value: orders.length, unit: '' },
      { id: 'budget', label: 'Total budget', value: totalBudget, unit: '$' },
      {
        id: 'average',
        label: 'Average budget',
        value: orders.length > 0 ? Math.round(totalBudget / orders.length) : 0,
        unit: '$',
      },
      { id: 'approvalRate', label: 'Approval rate (%)', value: approvalRate, unit: '' },
    ]
  }
}
