// Author: Kevin Pabón

// external imports
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from '../brands/entities/brand.entity.js';
import { Creator } from '../creators/entities/creator.entity.js';
import { Order, OrderStatus } from './entities/order.entity.js';
import { User } from '../users/entities/user.entity.js';

/** A demo order, referencing its brand and creator by name and its coordinator by email. */
interface OrderSeedRow {
  description: string;
  budget: number;
  requestDate: string;
  deliveryDate: string;
  status: OrderStatus;
  brandName: string;
  creatorName: string | null;
  userEmail: string;
}

/** Inserts the demo orders when the `order` table is empty. */
@Injectable()
export class OrdersSeeder implements OnApplicationBootstrap {
  // statuses that close an order's lifecycle; their updatedAt is the delivery date
  private static readonly FINAL_STATUSES: OrderStatus[] = ['delivered', 'approved'];

  private static readonly ROWS: OrderSeedRow[] = [
    {
      description: '3 TikTok videos for facial serum campaign',
      budget: 3200,
      requestDate: '2026-07-02',
      deliveryDate: '2026-08-20',
      status: 'in_production',
      brandName: 'Natura Belleza',
      creatorName: 'Valentina Ríos',
      userEmail: 'laura@creatorly.com',
    },
    {
      description: 'Series of 4 reels of nighttime skincare routine',
      budget: 2400,
      requestDate: '2026-03-10',
      deliveryDate: '2026-04-15',
      status: 'approved',
      brandName: 'Natura Belleza',
      creatorName: 'Valentina Ríos',
      userEmail: 'sara@creatorly.com',
    },
    {
      description: '10-min gameplay with product integration',
      budget: 4100,
      requestDate: '2026-08-01',
      deliveryDate: '2026-09-05',
      status: 'assigned',
      brandName: 'PixelPlay',
      creatorName: 'Andrés Mesa',
      userEmail: 'laura@creatorly.com',
    },
    {
      description: '2 stories and 1 post for DLC launch',
      budget: 1800,
      requestDate: '2026-08-10',
      deliveryDate: '2026-09-12',
      status: 'requested',
      brandName: 'PixelPlay',
      creatorName: null,
      userEmail: 'sara@creatorly.com',
    },
    {
      description: 'Seasonal lookbook with 6 Instagram photos',
      budget: 2600,
      requestDate: '2026-06-18',
      deliveryDate: '2026-08-14',
      status: 'delivered',
      brandName: 'Áurea Moda',
      creatorName: 'Daniela Kim',
      userEmail: 'laura@creatorly.com',
    },
    {
      description: 'Unboxing and review of the new catalog',
      budget: 2900,
      requestDate: '2026-07-22',
      deliveryDate: '2026-08-25',
      status: 'in_production',
      brandName: 'Áurea Moda',
      creatorName: 'Daniela Kim',
      userEmail: 'sara@creatorly.com',
    },
    {
      description: 'Workout routine with supplement stack',
      budget: 3500,
      requestDate: '2026-01-15',
      deliveryDate: '2026-02-20',
      status: 'approved',
      brandName: 'FitPro Suplementos',
      creatorName: 'Sebastián Ortiz',
      userEmail: 'laura@creatorly.com',
    },
    {
      description: '8-min YouTube video of pre-workout',
      budget: 2200,
      requestDate: '2026-05-06',
      deliveryDate: '2026-07-10',
      status: 'delivered',
      brandName: 'FitPro Suplementos',
      creatorName: 'Sebastián Ortiz',
      userEmail: 'sara@creatorly.com',
    },
    {
      description: 'Easy recipes with gourmet line',
      budget: 1500,
      requestDate: '2026-08-12',
      deliveryDate: '2026-09-01',
      status: 'requested',
      brandName: 'Natura Belleza',
      creatorName: null,
      userEmail: 'laura@creatorly.com',
    },
    {
      description: '1-hour live stream playing the new title',
      budget: 3900,
      requestDate: '2026-07-14',
      deliveryDate: '2026-08-28',
      status: 'in_production',
      brandName: 'PixelPlay',
      creatorName: 'Andrés Mesa',
      userEmail: 'sara@creatorly.com',
    },
    {
      description: '5 street style photos with accessories',
      budget: 1700,
      requestDate: '2026-08-05',
      deliveryDate: '2026-08-30',
      status: 'assigned',
      brandName: 'Áurea Moda',
      creatorName: 'Isabella Cruz',
      userEmail: 'laura@creatorly.com',
    },
    {
      description: 'Honest review of vegan protein',
      budget: 2000,
      requestDate: '2026-06-20',
      deliveryDate: '2026-08-08',
      status: 'delivered',
      brandName: 'FitPro Suplementos',
      creatorName: 'Mateo Vargas',
      userEmail: 'sara@creatorly.com',
    },
  ];

  private readonly logger = new Logger(OrdersSeeder.name);

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

  /**
   * Runs on application bootstrap, after every onModuleInit seeder, so the
   * brands, creators and users it references already exist; does nothing if
   * orders exist.
   */
  async onApplicationBootstrap(): Promise<void> {
    if ((await this.ordersRepository.count()) > 0) return;

    const brands = await this.brandsRepository.find();
    const creators = await this.creatorsRepository.find();
    const users = await this.usersRepository.find();

    const orders = OrdersSeeder.ROWS.map((row) => this.buildOrder(row, brands, creators, users));

    await this.ordersRepository.save(orders);
    this.logger.log(`Seeded ${orders.length} orders`);
  }

  // resolves the row's references to the ids actually inserted and derives
  // createdAt/updatedAt from requestDate, deliveryDate and status
  private buildOrder(
    row: OrderSeedRow,
    brands: Brand[],
    creators: Creator[],
    users: User[],
  ): Order {
    const brand = brands.find((brand) => brand.name === row.brandName);
    const creator = creators.find((creator) => creator.name === row.creatorName);
    const user = users.find((user) => user.email === row.userEmail);

    if (!brand || !user || (row.creatorName !== null && !creator)) {
      throw new Error(`OrdersSeeder: missing reference in "${row.description}"`);
    }

    const createdAt = new Date(`${row.requestDate}T09:00:00.000Z`);
    const updatedAt = OrdersSeeder.FINAL_STATUSES.includes(row.status)
      ? new Date(`${row.deliveryDate}T15:00:00.000Z`)
      : createdAt;

    return this.ordersRepository.create({
      description: row.description,
      budget: row.budget,
      requestDate: row.requestDate,
      deliveryDate: row.deliveryDate,
      status: row.status,
      brand,
      creator: creator ?? null,
      user,
      createdAt,
      updatedAt,
    });
  }
}
