// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { BudgetByBrandDTO } from '@/dtos/Reports/BudgetByBrandDTO'
import type { CreateOrderDTO } from '@/dtos/Orders/CreateOrderDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import {
  FINAL_STATUSES,
  type OrderInterface,
  type OrderStatus,
  STATUSES,
} from '@/interfaces/OrderInterface'
import { formatMonthLabel, todayIso } from '@/utils/formatDate'
import type { OrderFilterDTO } from '@/dtos/Orders/OrderFilterDTO'
import type { OrdersByCreatorDTO } from '@/dtos/Reports/OrdersByCreatorDTO'
import type { OrdersByMonthDTO } from '@/dtos/Reports/OrdersByMonthDTO'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'
import type { UserInterface } from '@/interfaces/UserInterface'

/** A KPI card, used by both HomeView and ReportsView. */
export interface HomeStat {
  id: string
  label: string
  value: number
  unit: string
}

/** An item of the recent activity shown in HomeView. */
export interface OrderActivity {
  id: number
  title: string
  timestamp: string
  type: 'default' | 'milestone'
}

export class OrderService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`

  private static readonly ACTIVE_STATUSES: OrderStatus[] = [
    'requested',
    'assigned',
    'in_production',
  ]

  /**
   * Gets every order from the API.
   * @returns All orders.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async getAll(): Promise<OrderInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds an order by id.
   * @param id - Id of the order to look up.
   * @returns The matching order, or `null` if none has that id.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async getById(id: number): Promise<OrderInterface | null> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    // the API answers an empty body (not JSON null) when no order has that id
    return data || null
  }

  /**
   * Creates a new order. The backend validates it, including that the
   * referenced brand, creator and coordinator exist.
   * @param orderData - Data required to create the order.
   * @returns The created order, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async create(orderData: CreateOrderDTO): Promise<OrderInterface> {
    const { data } = await axios.post(this.API_URL, orderData)

    return data
  }

  /**
   * Applies partial changes to an order. The backend validates them.
   * @param id - Id of the order to update.
   * @param changes - Partial fields to change.
   * @returns The updated order.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async update(
    id: number,
    changes: Partial<CreateOrderDTO>,
  ): Promise<OrderInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, changes)

    return data
  }

  /**
   * Removes an order by id.
   * @param id - Id of the order to remove.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async remove(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }

  /**
   * Resolves the brand that requested an order, over brands already fetched.
   * @param order - Order to look up.
   * @param brands - Brands already fetched from the API.
   * @returns The requesting brand, or `undefined` if not found.
   */
  public static getBrand(
    order: OrderInterface,
    brands: BrandInterface[],
  ): BrandInterface | undefined {
    return brands.find((brand) => brand.id === order.brandId)
  }

  /**
   * Resolves the creator assigned to an order, over creators already fetched.
   * @param order - Order to look up.
   * @param creators - Creators already fetched from the API.
   * @returns The assigned creator, or `undefined` if unassigned or not found.
   */
  public static getCreator(
    order: OrderInterface,
    creators: CreatorInterface[],
  ): CreatorInterface | undefined {
    return creators.find((creator) => creator.id === order.creatorId)
  }

  /**
   * Resolves the coordinator (User) assigned to an order, over users already fetched.
   * @param order - Order to look up.
   * @param users - Users already fetched from the API.
   * @returns The assigned coordinator, or `undefined` if not found.
   */
  public static getCoordinator(
    order: OrderInterface,
    users: UserInterface[],
  ): UserInterface | undefined {
    return users.find((user) => user.id === order.userId)
  }

  /**
   * Checks whether an order is in one of the active statuses.
   * @param order - Order to check.
   * @returns `true` if the order status is active.
   */
  public static isActive(order: OrderInterface): boolean {
    return this.ACTIVE_STATUSES.includes(order.status)
  }

  /**
   * HomeView KPIs, over orders already fetched from the API.
   * @param orders - Orders to aggregate.
   * @returns The Home KPI cards.
   */
  public static getStats(orders: OrderInterface[]): HomeStat[] {
    const activeOrders = orders.filter((order) => this.isActive(order))
    const committedBudget = activeOrders.reduce((sum, order) => sum + order.budget, 0)

    // Compared by the first 7 characters (YYYY-MM) of today local date and of
    // deliveryDate, without going through Date: this avoids a date-only value
    // being interpreted as UTC midnight and moving to another month in
    // timezones west of UTC.
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
      { id: 'budget', label: 'Committed budget', value: committedBudget, unit: '$' },
      { id: 'deliveries', label: 'Deliveries this month', value: deliveriesThisMonth, unit: '' },
    ]
  }

  /**
   * HomeView recent activity, over orders and brands already fetched.
   * @param orders - Orders to read the activity from.
   * @param brands - Brands already fetched from the API.
   * @param limit - Maximum number of items to return.
   * @returns The most recent orders as activity items.
   */
  public static getRecentOrders(
    orders: OrderInterface[],
    brands: BrandInterface[],
    limit: number = 5,
  ): OrderActivity[] {
    return [...orders]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
      .slice(0, limit)
      .map((order) => ({
        id: order.id,
        title: `${order.description} — ${this.getBrand(order, brands)?.name ?? 'no brand'}`,
        timestamp: order.createdAt,
        type: FINAL_STATUSES.includes(order.status) ? 'milestone' : 'default',
      }))
  }

  /**
   * Applies an OrderFilterDTO over a list of orders, unsorted. Used by ReportsView.
   * @param orders - Orders to filter.
   * @param filter - Filter criteria.
   * @returns The filtered orders.
   */
  public static filter(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
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
   * unsorted because its detail table order must not change in this phase.
   * @param orders - Orders to filter.
   * @param filter - Filter criteria.
   * @returns The filtered orders, sorted by request date descending.
   */
  public static filterSorted(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return this.filter(orders, filter).sort((first, second) =>
      second.requestDate.localeCompare(first.requestDate),
    )
  }

  /**
   * Number of orders per status, in the lifecycle fixed order.
   * @param orders - Orders to aggregate.
   * @returns The order count per status.
   */
  public static getOrdersByStatus(orders: OrderInterface[]): OrdersByStatusDTO[] {
    return STATUSES.map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }))
  }

  /**
   * Number of orders assigned per creator (excludes orders with no creator assigned).
   * @param orders - Orders to aggregate.
   * @param creators - Creators already fetched from the API, to resolve names.
   * @returns The order count per creator, sorted descending.
   */
  public static getOrdersByCreator(
    orders: OrderInterface[],
    creators: CreatorInterface[],
  ): OrdersByCreatorDTO[] {
    const counts = new Map<number, number>()

    for (const order of orders) {
      if (order.creatorId === null) continue
      counts.set(order.creatorId, (counts.get(order.creatorId) ?? 0) + 1)
    }

    return [...counts.entries()]
      .map(([creatorId, count]) => ({
        creatorId,
        creatorName:
          creators.find((creator) => creator.id === creatorId)?.name ?? 'Creator deleted',
        count,
      }))
      .sort((first, second) => second.count - first.count)
  }

  /**
   * Total committed budget per brand.
   * @param orders - Orders to aggregate.
   * @param brands - Brands already fetched from the API, to resolve names.
   * @returns The committed budget per brand, sorted descending.
   */
  public static getBudgetByBrand(
    orders: OrderInterface[],
    brands: BrandInterface[],
  ): BudgetByBrandDTO[] {
    const totals = new Map<number, number>()

    for (const order of orders) {
      totals.set(order.brandId, (totals.get(order.brandId) ?? 0) + order.budget)
    }

    return [...totals.entries()]
      .map(([brandId, budget]) => ({
        brandId,
        brandName: brands.find((brand) => brand.id === brandId)?.name ?? 'Brand deleted',
        budget,
      }))
      .sort((first, second) => second.budget - first.budget)
  }

  /**
   * Number of orders and budget per request month, sorted chronologically.
   * @param orders - Orders to aggregate.
   * @returns The order count and budget per month.
   */
  public static getOrdersByMonth(orders: OrderInterface[]): OrdersByMonthDTO[] {
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
   * ReportsView KPIs, with the same shape as HomeStat to reuse StatCardGrid.
   * @param orders - Orders to aggregate.
   * @returns The report KPI cards.
   */
  public static getReportStats(orders: OrderInterface[]): HomeStat[] {
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
