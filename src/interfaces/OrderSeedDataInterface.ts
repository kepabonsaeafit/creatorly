// Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

/** Datos de un pedido ficticio antes de derivarle createdAt/updatedAt en OrderSeeder. */
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
