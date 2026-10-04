// Author: Kevin Pabón

// external imports
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from './entities/brand.entity.js';

/** Inserts the demo brands when the `brand` table is empty. */
@Injectable()
export class BrandsSeeder implements OnModuleInit {
  private readonly logger = new Logger(BrandsSeeder.name);

  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  /** Runs on module init, before the orders seeder; does nothing if brands exist. */
  async onModuleInit(): Promise<void> {
    if ((await this.brandsRepository.count()) > 0) return;

    const brands = await this.brandsRepository.save([
      {
        name: 'Natura Belleza',
        industry: 'beauty and personal care',
        contactName: 'María Fernández',
        contactEmail: 'maria@naturabelleza.com',
        createdAt: new Date('2026-01-07T09:00:00.000Z'),
        updatedAt: new Date('2026-01-07T09:00:00.000Z'),
      },
      {
        name: 'PixelPlay',
        industry: 'video games',
        contactName: 'Carlos Andrade',
        contactEmail: 'carlos@pixelplay.co',
        createdAt: new Date('2026-01-20T15:00:00.000Z'),
        updatedAt: new Date('2026-01-20T15:00:00.000Z'),
      },
      {
        name: 'Áurea Moda',
        industry: 'fashion and accessories',
        contactName: 'Paula Ruiz',
        contactEmail: 'paula@aureamoda.com',
        createdAt: new Date('2026-02-01T08:30:00.000Z'),
        updatedAt: new Date('2026-02-01T08:30:00.000Z'),
      },
      {
        name: 'FitPro Suplementos',
        industry: 'fitness and nutrition',
        contactName: 'Diego Salazar',
        contactEmail: 'diego@fitpro.com',
        createdAt: new Date('2026-02-05T13:00:00.000Z'),
        updatedAt: new Date('2026-02-05T13:00:00.000Z'),
      },
    ]);
    this.logger.log(`Seeded ${brands.length} brands`);
  }
}
