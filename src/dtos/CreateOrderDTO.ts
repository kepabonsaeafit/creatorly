// Kevin Pabón

// internal imports
import type { OrderInterface } from '@/interfaces/OrderInterface'

/** Datos necesarios para crear un Pedido; id y timestamps los genera el service. */
export type CreateOrderDTO = Omit<OrderInterface, 'id' | 'createdAt' | 'updatedAt'>
