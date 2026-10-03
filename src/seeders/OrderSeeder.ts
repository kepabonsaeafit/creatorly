// Author: Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { FINAL_STATUSES, type OrderInterface, type OrderStatus } from '@/interfaces/OrderInterface'
import type { UserInterface } from '@/interfaces/UserInterface'

/** Data of a fake order before deriving its createdAt/updatedAt in OrderSeeder. */
interface OrderSeedData {
  id: string
  description: string
  budget: number
  requestDate: string
  deliveryDate: string
  status: OrderStatus
  brandId: string
  creatorId: string | null
  userId: string
}

/** Derives createdAt/updatedAt from requestDate, deliveryDate and status. */
function buildOrder(orderData: OrderSeedData): OrderInterface {
  const createdAt = `${orderData.requestDate}T09:00:00.000Z`
  const updatedAt = FINAL_STATUSES.includes(orderData.status)
    ? `${orderData.deliveryDate}T15:00:00.000Z`
    : createdAt
  return {
    id: orderData.id,
    description: orderData.description,
    budget: orderData.budget,
    requestDate: orderData.requestDate,
    deliveryDate: orderData.deliveryDate,
    status: orderData.status,
    brandId: orderData.brandId,
    creatorId: orderData.creatorId,
    userId: orderData.userId,
    createdAt,
    updatedAt,
  }
}

/**
 * Fake order data.
 * Receives already-seeded brands/creators/users to reference them by id,
 * capturing them by position before building the orders.
 */
export function seedOrders(
  brands: BrandInterface[],
  creators: CreatorInterface[],
  users: UserInterface[],
): OrderInterface[] {
  const [, laura, sara] = users
  const [valentina, andres, daniela, sebastian, isabella, mateo] = creators
  const [natura, pixel, aurea, fitpro] = brands

  return [
    buildOrder({
      id: '1',
      description: '3 TikTok videos for facial serum campaign',
      budget: 3200,
      requestDate: '2026-07-02',
      deliveryDate: '2026-08-20',
      status: 'in_production',
      brandId: natura.id,
      creatorId: valentina.id,
      userId: laura.id,
    }),
    buildOrder({
      id: '2',
      description: 'Series of 4 reels of nighttime skincare routine',
      budget: 2400,
      requestDate: '2026-03-10',
      deliveryDate: '2026-04-15',
      status: 'approved',
      brandId: natura.id,
      creatorId: valentina.id,
      userId: sara.id,
    }),
    buildOrder({
      id: '3',
      description: '10-min gameplay with product integration',
      budget: 4100,
      requestDate: '2026-08-01',
      deliveryDate: '2026-09-05',
      status: 'assigned',
      brandId: pixel.id,
      creatorId: andres.id,
      userId: laura.id,
    }),
    buildOrder({
      id: '4',
      description: '2 stories and 1 post for DLC launch',
      budget: 1800,
      requestDate: '2026-08-10',
      deliveryDate: '2026-09-12',
      status: 'requested',
      brandId: pixel.id,
      creatorId: null,
      userId: sara.id,
    }),
    buildOrder({
      id: '5',
      description: 'Seasonal lookbook with 6 Instagram photos',
      budget: 2600,
      requestDate: '2026-06-18',
      deliveryDate: '2026-08-14',
      status: 'delivered',
      brandId: aurea.id,
      creatorId: daniela.id,
      userId: laura.id,
    }),
    buildOrder({
      id: '6',
      description: 'Unboxing and review of the new catalog',
      budget: 2900,
      requestDate: '2026-07-22',
      deliveryDate: '2026-08-25',
      status: 'in_production',
      brandId: aurea.id,
      creatorId: daniela.id,
      userId: sara.id,
    }),
    buildOrder({
      id: '7',
      description: 'Workout routine with supplement stack',
      budget: 3500,
      requestDate: '2026-01-15',
      deliveryDate: '2026-02-20',
      status: 'approved',
      brandId: fitpro.id,
      creatorId: sebastian.id,
      userId: laura.id,
    }),
    buildOrder({
      id: '8',
      description: '8-min YouTube video of pre-workout',
      budget: 2200,
      requestDate: '2026-05-06',
      deliveryDate: '2026-07-10',
      status: 'delivered',
      brandId: fitpro.id,
      creatorId: sebastian.id,
      userId: sara.id,
    }),
    buildOrder({
      id: '9',
      description: 'Easy recipes with gourmet line',
      budget: 1500,
      requestDate: '2026-08-12',
      deliveryDate: '2026-09-01',
      status: 'requested',
      brandId: natura.id,
      creatorId: null,
      userId: laura.id,
    }),
    buildOrder({
      id: '10',
      description: '1-hour live stream playing the new title',
      budget: 3900,
      requestDate: '2026-07-14',
      deliveryDate: '2026-08-28',
      status: 'in_production',
      brandId: pixel.id,
      creatorId: andres.id,
      userId: sara.id,
    }),
    buildOrder({
      id: '11',
      description: '5 street style photos with accessories',
      budget: 1700,
      requestDate: '2026-08-05',
      deliveryDate: '2026-08-30',
      status: 'assigned',
      brandId: aurea.id,
      creatorId: isabella.id,
      userId: laura.id,
    }),
    buildOrder({
      id: '12',
      description: 'Honest review of vegan protein',
      budget: 2000,
      requestDate: '2026-06-20',
      deliveryDate: '2026-08-08',
      status: 'delivered',
      brandId: fitpro.id,
      creatorId: mateo.id,
      userId: sara.id,
    }),
  ]
}
