// Author: Kevin Pabón

// external imports
import { BadRequestException } from '@nestjs/common';
import type { Repository } from 'typeorm';

// internal imports
import type { Brand } from '../brands/entities/brand.entity.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { Creator } from '../creators/entities/creator.entity.js';
import type { Order } from './entities/order.entity.js';
import { OrdersService } from './orders.service.js';
import type { User } from '../users/entities/user.entity.js';

describe('OrdersService date validation', () => {
  let ordersService: OrdersService;

  const validOrder: CreateOrderDto = {
    description: 'Unboxing video',
    budget: 500000,
    requestDate: '2026-10-11',
    deliveryDate: null,
    status: 'requested',
    brandId: 1,
    creatorId: null,
    userId: 1,
  };

  beforeEach(() => {
    // every reference exists and save echoes the order, so only validate decides
    const ordersRepository = {
      create: (data: Partial<Order>) => data,
      save: async (order: Partial<Order>) => ({ ...order, id: 1 }),
      findOneByOrFail: async () => ({ id: 1 }),
    } as unknown as Repository<Order>;
    const referenceRepository = { existsBy: async () => true };

    ordersService = new OrdersService(
      ordersRepository,
      referenceRepository as unknown as Repository<Brand>,
      referenceRepository as unknown as Repository<Creator>,
      referenceRepository as unknown as Repository<User>,
    );
  });

  it('accepts dates written as YYYY-MM-DD', async () => {
    await expect(
      ordersService.create({ ...validOrder, deliveryDate: '2026-10-30' }),
    ).resolves.toMatchObject({ id: 1 });
  });

  it.each(['24/12/2026', '2026-2-3', '2026-02-30', 'tomorrow'])(
    'rejects the requestDate %s with 400',
    async (requestDate) => {
      await expect(ordersService.create({ ...validOrder, requestDate })).rejects.toThrow(
        BadRequestException,
      );
    },
  );

  it('rejects a deliveryDate that is not YYYY-MM-DD with 400', async () => {
    await expect(
      ordersService.create({ ...validOrder, deliveryDate: '30/10/2026' }),
    ).rejects.toThrow('Order: deliveryDate must be a date YYYY-MM-DD or null');
  });
});
