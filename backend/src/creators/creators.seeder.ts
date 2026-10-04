// Author: Kevin Pabón

// external imports
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Creator } from './entities/creator.entity.js';

/** Inserts the demo creators when the `creator` table is empty. */
@Injectable()
export class CreatorsSeeder implements OnModuleInit {
  private readonly logger = new Logger(CreatorsSeeder.name);

  constructor(
    @InjectRepository(Creator)
    private creatorsRepository: Repository<Creator>,
  ) {}

  /** Runs on module init, before the orders seeder; does nothing if creators exist. */
  async onModuleInit(): Promise<void> {
    if ((await this.creatorsRepository.count()) > 0) return;

    const creators = await this.creatorsRepository.save([
      {
        name: 'Valentina Ríos',
        niche: 'beauty',
        contentType: 'TikTok',
        rate: 1500,
        available: true,
        createdAt: new Date('2026-01-08T10:00:00.000Z'),
        updatedAt: new Date('2026-01-08T10:00:00.000Z'),
      },
      {
        name: 'Andrés Mesa',
        niche: 'gaming',
        contentType: 'YouTube',
        rate: 2400,
        available: true,
        createdAt: new Date('2026-01-09T11:00:00.000Z'),
        updatedAt: new Date('2026-01-09T11:00:00.000Z'),
      },
      {
        name: 'Daniela Kim',
        niche: 'fashion',
        contentType: 'Instagram',
        rate: 1800,
        available: true,
        createdAt: new Date('2026-01-12T14:00:00.000Z'),
        updatedAt: new Date('2026-01-12T14:00:00.000Z'),
      },
      {
        name: 'Sebastián Ortiz',
        niche: 'fitness',
        contentType: 'YouTube',
        rate: 2100,
        available: false,
        createdAt: new Date('2026-01-15T09:00:00.000Z'),
        updatedAt: new Date('2026-01-15T09:00:00.000Z'),
      },
      {
        name: 'Isabella Cruz',
        niche: 'food',
        contentType: 'TikTok',
        rate: 1200,
        available: true,
        createdAt: new Date('2026-02-02T16:00:00.000Z'),
        updatedAt: new Date('2026-02-02T16:00:00.000Z'),
      },
      {
        name: 'Mateo Vargas',
        niche: 'technology',
        contentType: 'Instagram',
        rate: 2000,
        available: true,
        createdAt: new Date('2026-02-10T10:30:00.000Z'),
        updatedAt: new Date('2026-02-10T10:30:00.000Z'),
      },
    ]);
    this.logger.log(`Seeded ${creators.length} creators`);
  }
}
