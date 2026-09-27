// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/** Data of a fake order before deriving its createdAt/updatedAt in OrderSeeder. */
export interface OrderSeedData {
  description: string
  budget: number
  requestDate: string
  deliveryDate: string
  status: OrderStatus
  brandId: string
  creatorId: string | null
  userId: string
}
