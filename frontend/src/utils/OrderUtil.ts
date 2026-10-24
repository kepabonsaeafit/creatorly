// Author: Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import type { OrderFilterDTO } from '@/dtos/Orders/OrderFilterDTO'
import type { OrderInterface, OrderStatus } from '@/interfaces/OrderInterface'
import { StringUtil } from '@/utils/StringUtil'

export class OrderUtil {
  private static readonly ACTIVE_STATUSES: OrderStatus[] = [
    'requested',
    'assigned',
    'in_production',
  ]

  /**
   * Resolves the brand that requested an order, over brands already fetched.
   * @param order - Order to look up.
   * @param brands - Brands already fetched from the API.
   * @returns The requesting brand, or `undefined` if not found.
   */
  static getBrand(order: OrderInterface, brands: BrandInterface[]): BrandInterface | undefined {
    return brands.find((brand: BrandInterface): boolean => brand.id === order.brandId)
  }

  /**
   * Resolves the creator assigned to an order, over creators already fetched.
   * @param order - Order to look up.
   * @param creators - Creators already fetched from the API.
   * @returns The assigned creator, or `undefined` if unassigned or not found.
   */
  static getCreator(
    order: OrderInterface,
    creators: CreatorInterface[],
  ): CreatorInterface | undefined {
    return creators.find((creator: CreatorInterface): boolean => creator.id === order.creatorId)
  }

  /**
   * Checks whether an order is in one of the active statuses.
   * @param order - Order to check.
   * @returns `true` if the order status is active.
   */
  static isActive(order: OrderInterface): boolean {
    return this.ACTIVE_STATUSES.includes(order.status)
  }

  /**
   * Applies an OrderFilterDTO over a list of orders, unsorted. Used by ReportsView.
   * @param orders - Orders to filter.
   * @param filter - Filter criteria.
   * @returns The filtered orders.
   */
  static filter(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return orders.filter((order: OrderInterface): boolean => {
      if (filter.status && order.status !== filter.status) return false
      if (filter.brandId && order.brandId !== filter.brandId) return false
      if (filter.creatorId && order.creatorId !== filter.creatorId) return false
      if (filter.from && order.requestDate < filter.from) return false
      if (filter.to && order.requestDate > filter.to) return false
      if (filter.text && !StringUtil.contains(order.description, filter.text)) return false

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
  static filterSorted(orders: OrderInterface[], filter: OrderFilterDTO): OrderInterface[] {
    return this.filter(orders, filter).sort(
      (first: OrderInterface, second: OrderInterface): number =>
        second.requestDate.localeCompare(first.requestDate),
    )
  }
}
