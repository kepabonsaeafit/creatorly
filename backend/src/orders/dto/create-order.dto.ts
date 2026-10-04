// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '../entities/order.entity.js';

export class CreateOrderDto {
  description: string;
  budget: number;
  requestDate: string;
  deliveryDate: string | null;
  status: OrderStatus;
  brandId: number;
  creatorId: number | null;
  userId: number;
}
