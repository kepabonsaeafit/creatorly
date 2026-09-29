// Author: Kevin Pabón

/** Valid statuses of an Order's lifecycle, in the lifecycle's fixed order. */
export const STATUSES = ['requested', 'assigned', 'in_production', 'delivered', 'approved'] as const

export type OrderStatus = (typeof STATUSES)[number]

/** Statuses that mark the closing of an Order's lifecycle. */
export const FINAL_STATUSES: readonly OrderStatus[] = ['delivered', 'approved']

/**
 * Order: the system's unit of work. It connects a Brand (who requests it),
 * a Creator (who produces it, optional until assigned) and a coordinator User
 * (who manages it). See ADR-0001: references are stored by id; the
 * coordinator is referenced with userId.
 */
export interface OrderInterface {
  id: string
  description: string
  budget: number
  requestDate: string
  deliveryDate: string | null
  status: OrderStatus
  brandId: string
  creatorId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
