// Author: Kevin Pabón

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from '../brands/entities/brand.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Creator } from '../creators/entities/creator.entity.js';
import { Order, STATUSES } from './entities/order.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(Creator)
    private creatorsRepository: Repository<Creator>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  // checked before saving, so a missing reference answers 400 instead of a
  // SQLite FOREIGN KEY failure (500)
  private async validateReferences(createOrderDto: CreateOrderDto): Promise<void> {
    if (!(await this.brandsRepository.existsBy({ id: createOrderDto.brandId }))) {
      throw new BadRequestException('Order: brand not found');
    }

    if (
      createOrderDto.creatorId !== null &&
      !(await this.creatorsRepository.existsBy({ id: createOrderDto.creatorId }))
    ) {
      throw new BadRequestException('Order: creator not found');
    }

    if (!(await this.usersRepository.existsBy({ id: createOrderDto.userId }))) {
      throw new BadRequestException('Order: user not found');
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
   * @throws {BadRequestException} If any required field is missing or invalid, or the
   * brand, creator or user it references does not exist.
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
    await this.validateReferences(orderData);

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
   * @throws {BadRequestException} If the merged data fails validation, or the brand,
   * creator or user it references does not exist.
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
    await this.validateReferences(merged);

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
