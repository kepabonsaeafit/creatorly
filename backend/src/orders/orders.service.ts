// Author: Kevin Pabón

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from '../brands/entities/brand.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Creator } from '../creators/entities/creator.entity.js';
import { Order } from './entities/order.entity.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
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

  // checked before saving, so a missing reference answers 400 instead of a
  // SQLite FOREIGN KEY failure (500)
  private async validateReferences(
    brandId: number,
    creatorId: number | null,
    userId: number,
  ): Promise<void> {
    if (!(await this.brandsRepository.existsBy({ id: brandId }))) {
      throw new BadRequestException('Order: brand not found');
    }

    if (creatorId !== null && !(await this.creatorsRepository.existsBy({ id: creatorId }))) {
      throw new BadRequestException('Order: creator not found');
    }

    if (!(await this.usersRepository.existsBy({ id: userId }))) {
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
   * @returns The order.
   * @throws {NotFoundException} If no order has that id.
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Order: not found');
    }

    return order;
  }

  /**
   * Creates a new order; by default it has no delivery date, no creator, status
   * 'requested' and today as its request date. CreateOrderDto has already validated
   * the data.
   * @param createOrderDto - Data of the new order.
   * @returns The created order, with its id, timestamps and relation ids.
   * @throws {BadRequestException} If the brand, creator or user it references does not exist.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const creatorId = createOrderDto.creatorId ?? null;

    await this.validateReferences(createOrderDto.brandId, creatorId, createOrderDto.userId);

    const order = this.ordersRepository.create({
      description: createOrderDto.description,
      budget: createOrderDto.budget,
      requestDate: createOrderDto.requestDate ?? this.today(),
      deliveryDate: createOrderDto.deliveryDate ?? null,
      status: createOrderDto.status ?? 'requested',
      brand: { id: createOrderDto.brandId },
      creator: creatorId === null ? null : { id: creatorId },
      user: { id: createOrderDto.userId },
    });

    const saved = await this.ordersRepository.save(order);

    // reloaded so the response carries brandId, creatorId and userId
    return this.ordersRepository.findOneByOrFail({ id: saved.id });
  }

  /**
   * Applies partial changes to an order; UpdateOrderDto has already validated them.
   * `deliveryDate` and `creatorId` can be cleared on purpose by sending `null`.
   * @param id - Id of the order to update.
   * @param updateOrderDto - Fields to change.
   * @returns The updated order, with its relation ids.
   * @throws {NotFoundException} If no order has that id.
   * @throws {BadRequestException} If the brand, creator or user it references does not exist.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // deliveryDate and creatorId accept null on purpose, so they are compared
    // against undefined to tell "not sent" from "cleared"
    const brandId = updateOrderDto.brandId ?? order.brandId;
    const creatorId =
      updateOrderDto.creatorId !== undefined ? updateOrderDto.creatorId : order.creatorId;
    const userId = updateOrderDto.userId ?? order.userId;

    await this.validateReferences(brandId, creatorId, userId);

    this.ordersRepository.merge(order, {
      description: updateOrderDto.description ?? order.description,
      budget: updateOrderDto.budget ?? order.budget,
      requestDate: updateOrderDto.requestDate ?? order.requestDate,
      deliveryDate:
        updateOrderDto.deliveryDate !== undefined
          ? updateOrderDto.deliveryDate
          : order.deliveryDate,
      status: updateOrderDto.status ?? order.status,
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
    const order = await this.findOne(id);

    await this.ordersRepository.remove(order);
  }
}
