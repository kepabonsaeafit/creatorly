// Author: Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { BudgetByBrandDTO } from '@/dtos/Reports/BudgetByBrandDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { DateUtil } from '@/utils/DateUtil'
import {
  FINAL_STATUSES,
  type OrderInterface,
  type OrderStatus,
  STATUSES,
} from '@/interfaces/OrderInterface'
import type { HomeStatInterface } from '@/interfaces/HomeStatInterface'
import type { MonthTotalsInterface } from '@/interfaces/MonthTotalsInterface'
import type { OrderActivityInterface } from '@/interfaces/OrderActivityInterface'
import type { OrdersByCreatorDTO } from '@/dtos/Reports/OrdersByCreatorDTO'
import type { OrdersByMonthDTO } from '@/dtos/Reports/OrdersByMonthDTO'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'
import { OrderUtil } from '@/utils/OrderUtil'

export class ReportUtil {
  /**
   * HomeView KPIs, over orders already fetched from the API.
   * @param orders - Orders to aggregate.
   * @returns The Home KPI cards.
   */
  static getStats(orders: OrderInterface[]): HomeStatInterface[] {
    const activeOrders = orders.filter((order: OrderInterface): boolean =>
      OrderUtil.isActive(order),
    )
    const committedBudget = activeOrders.reduce(
      (sum: number, order: OrderInterface): number => sum + order.budget,
      0,
    )

    // Compared by the month key (YYYY-MM) of today local date and of deliveryDate.
    const currentMonth = DateUtil.monthKey(DateUtil.todayIso())
    const deliveriesThisMonth = orders.filter(
      (order: OrderInterface): boolean =>
        FINAL_STATUSES.includes(order.status) &&
        order.deliveryDate !== null &&
        DateUtil.monthKey(order.deliveryDate) === currentMonth,
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
  static getRecentOrders(
    orders: OrderInterface[],
    brands: BrandInterface[],
    limit: number = 5,
  ): OrderActivityInterface[] {
    return [...orders]
      .sort((first: OrderInterface, second: OrderInterface): number =>
        second.createdAt.localeCompare(first.createdAt),
      )
      .slice(0, limit)
      .map((order: OrderInterface): OrderActivityInterface => ({
        id: order.id,
        title: `${order.description} — ${OrderUtil.getBrand(order, brands)?.name ?? 'no brand'}`,
        timestamp: order.createdAt,
        type: FINAL_STATUSES.includes(order.status) ? 'milestone' : 'default',
      }))
  }

  /**
   * Number of orders per status, in the lifecycle fixed order.
   * @param orders - Orders to aggregate.
   * @returns The order count per status.
   */
  static getOrdersByStatus(orders: OrderInterface[]): OrdersByStatusDTO[] {
    return STATUSES.map((status: OrderStatus): OrdersByStatusDTO => ({
      status,
      count: orders.filter((order: OrderInterface): boolean => order.status === status).length,
    }))
  }

  /**
   * Number of orders assigned per creator (excludes orders with no creator assigned).
   * @param orders - Orders to aggregate.
   * @param creators - Creators already fetched from the API, to resolve names.
   * @returns The order count per creator, sorted descending.
   */
  static getOrdersByCreator(
    orders: OrderInterface[],
    creators: CreatorInterface[],
  ): OrdersByCreatorDTO[] {
    const ordersByCreatorId = new Map<number, OrderInterface[]>()

    for (const order of orders) {
      if (order.creatorId === null) continue
      ordersByCreatorId.set(order.creatorId, [
        ...(ordersByCreatorId.get(order.creatorId) ?? []),
        order,
      ])
    }

    return [...ordersByCreatorId.entries()]
      .map(([creatorId, creatorOrders]: [number, OrderInterface[]]): OrdersByCreatorDTO => ({
        creatorId,
        creatorName: OrderUtil.getCreator(creatorOrders[0], creators)?.name ?? 'Creator deleted',
        count: creatorOrders.length,
      }))
      .sort(
        (first: OrdersByCreatorDTO, second: OrdersByCreatorDTO): number =>
          second.count - first.count,
      )
  }

  /**
   * Total committed budget per brand.
   * @param orders - Orders to aggregate.
   * @param brands - Brands already fetched from the API, to resolve names.
   * @returns The committed budget per brand, sorted descending.
   */
  static getBudgetByBrand(orders: OrderInterface[], brands: BrandInterface[]): BudgetByBrandDTO[] {
    const ordersByBrandId = new Map<number, OrderInterface[]>()

    for (const order of orders) {
      ordersByBrandId.set(order.brandId, [...(ordersByBrandId.get(order.brandId) ?? []), order])
    }

    return [...ordersByBrandId.entries()]
      .map(([brandId, brandOrders]: [number, OrderInterface[]]): BudgetByBrandDTO => ({
        brandId,
        brandName: OrderUtil.getBrand(brandOrders[0], brands)?.name ?? 'Brand deleted',
        budget: brandOrders.reduce(
          (sum: number, order: OrderInterface): number => sum + order.budget,
          0,
        ),
      }))
      .sort(
        (first: BudgetByBrandDTO, second: BudgetByBrandDTO): number => second.budget - first.budget,
      )
  }

  /**
   * Number of orders and budget per request month, sorted chronologically.
   * @param orders - Orders to aggregate.
   * @returns The order count and budget per month.
   */
  static getOrdersByMonth(orders: OrderInterface[]): OrdersByMonthDTO[] {
    const aggregates = new Map<string, MonthTotalsInterface>()

    for (const order of orders) {
      const month = DateUtil.monthKey(order.requestDate)
      const current = aggregates.get(month) ?? { count: 0, budget: 0 }
      aggregates.set(month, {
        count: current.count + 1,
        budget: current.budget + order.budget,
      })
    }

    return [...aggregates.entries()]
      .sort(
        (
          [monthA]: [string, MonthTotalsInterface],
          [monthB]: [string, MonthTotalsInterface],
        ): number => monthA.localeCompare(monthB),
      )
      .map(([month, values]: [string, MonthTotalsInterface]): OrdersByMonthDTO => ({
        month,
        label: DateUtil.formatMonthLabel(`${month}-01`),
        count: values.count,
        budget: values.budget,
      }))
  }

  /**
   * ReportsView KPIs, with the same shape as HomeStatInterface to reuse StatCardGridComponent.
   * @param orders - Orders to aggregate.
   * @returns The report KPI cards.
   */
  static getReportStats(orders: OrderInterface[]): HomeStatInterface[] {
    const totalBudget = orders.reduce(
      (sum: number, order: OrderInterface): number => sum + order.budget,
      0,
    )
    const approvedCount = orders.filter(
      (order: OrderInterface): boolean => order.status === 'approved',
    ).length
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
