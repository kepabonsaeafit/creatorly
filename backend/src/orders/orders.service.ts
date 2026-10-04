// Author: Kevin Pabón

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order, STATUSES } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private validate(createOrderDto: CreateOrderDto): void {
    if (!createOrderDto.description || typeof createOrderDto.description !== 'string') {
      throw new BadRequestException('Order: description is required');
    }

    if (
      typeof createOrderDto.budget !== 'number' ||
      Number.isNaN(createOrderDto.budget) ||
      createOrderDto.budget < 0
    ) {
      throw new BadRequestException('Order: budget must be a number >= 0');
    }

    if (!STATUSES.includes(createOrderDto.status)) {
      throw new BadRequestException(`Order: status must be one of ${STATUSES.join(' | ')}`);
    }

    if (!createOrderDto.brandId || typeof createOrderDto.brandId !== 'number') {
      throw new BadRequestException('Order: brandId is required');
    }

    if (!createOrderDto.userId || typeof createOrderDto.userId !== 'number') {
      throw new BadRequestException('Order: userId is required');
    }

    if (createOrderDto.creatorId !== null && typeof createOrderDto.creatorId !== 'number') {
      throw new BadRequestException('Order: creatorId must be an id or null');
    }
  }

  // today's date in the server's local time, as 'YYYY-MM-DD'
  private today(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Finds every order, with its brandId, creatorId and userId.
   * @returns All orders.
   */
  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  /**
   * Finds an order by id, with its brandId, creatorId and userId.
   * @param id - Order id.
   * @returns The order, or `null` if none matches.
   */
  findOne(id: number): Promise<Order | null> {
    return this.ordersRepository.findOneBy({ id });
  }

  /**
   * Validates and creates a new order; by default it has no delivery date,
   * no creator, status 'requested' and today as its request date.
   * @param createOrderDto - Data of the new order.
   * @returns The created order, with its id, timestamps and relation ids.
   * @throws {BadRequestException} If any required field is missing or invalid.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderData: CreateOrderDto = {
      description: createOrderDto.description,
      budget: createOrderDto.budget,
      requestDate: createOrderDto.requestDate ?? this.today(),
      deliveryDate: createOrderDto.deliveryDate ?? null,
      status: createOrderDto.status ?? 'requested',
      brandId: createOrderDto.brandId,
      creatorId: createOrderDto.creatorId ?? null,
      userId: createOrderDto.userId,
    };

    this.validate(orderData);

    const { brandId, creatorId, userId, ...rest } = orderData;
    const order = this.ordersRepository.create({
      ...rest,
      brand: { id: brandId },
      creator: creatorId === null ? null : { id: creatorId },
      user: { id: userId },
    });

    const saved = await this.ordersRepository.save(order);

    // reloaded so the response carries brandId, creatorId and userId
    return this.ordersRepository.findOneByOrFail({ id: saved.id });
  }

  /**
   * Validates and applies partial changes to an order; `deliveryDate` and
   * `creatorId` can be cleared on purpose by sending `null`.
   * @param id - Id of the order to update.
   * @param updateOrderDto - Fields to change.
   * @returns The updated order, with its relation ids.
   * @throws {NotFoundException} If no order has that id.
   * @throws {BadRequestException} If the merged data fails validation.
   */
  async update(id: number, updateOrderDto: Partial<CreateOrderDto>): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order: not found');
    }

    // deliveryDate and creatorId accept null on purpose, so they are compared
    // against undefined to tell "not sent" from "cleared"
    const merged: CreateOrderDto = {
      description: updateOrderDto.description ?? order.description,
      budget: updateOrderDto.budget ?? order.budget,
      requestDate: updateOrderDto.requestDate ?? order.requestDate,
      deliveryDate:
        updateOrderDto.deliveryDate !== undefined
          ? updateOrderDto.deliveryDate
          : order.deliveryDate,
      status: updateOrderDto.status ?? order.status,
      brandId: updateOrderDto.brandId ?? order.brandId,
      creatorId:
        updateOrderDto.creatorId !== undefined ? updateOrderDto.creatorId : order.creatorId,
      userId: updateOrderDto.userId ?? order.userId,
    };

    this.validate(merged);

    const { brandId, creatorId, userId, ...rest } = merged;
    this.ordersRepository.merge(order, {
      ...rest,
      brand: { id: brandId },
      creator: creatorId === null ? null : { id: creatorId },
      user: { id: userId },
    });

    await this.ordersRepository.save(order);

    // reloaded so the response carries the updated relation ids
    return this.ordersRepository.findOneByOrFail({ id });
  }

  /**
   * Removes an order.
   * @param id - Id of the order to remove.
   * @throws {NotFoundException} If no order has that id.
   */
  async remove(id: number): Promise<void> {
    const order = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order: not found');
    }

    await this.ordersRepository.remove(order);
  }
}
