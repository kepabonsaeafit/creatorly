// Author: Felipe Gómez

// external imports
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

// internal imports
import { User } from './entities/user.entity.js';

/** Inserts the initial users when the `user` table is empty, so the app can be logged into. */
@Injectable()
export class UsersSeeder implements OnModuleInit {
  private static readonly SALT_ROUNDS = 10;
  // demo password shown on the login screen
  private static readonly DEMO_PASSWORD = '1234';

  private readonly logger = new Logger(UsersSeeder.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** Runs on module init, before any onApplicationBootstrap seeder; does nothing if users exist. */
  async onModuleInit(): Promise<void> {
    if ((await this.usersRepository.count()) > 0) return;

    const passwordHash = await hash(UsersSeeder.DEMO_PASSWORD, UsersSeeder.SALT_ROUNDS);
    await this.usersRepository.save([
      {
        name: 'Camila Torres',
        email: 'admin@creatorly.com',
        passwordHash,
        role: 'admin',
        createdAt: new Date('2026-01-05T08:00:00.000Z'),
        updatedAt: new Date('2026-01-05T08:00:00.000Z'),
      },
      {
        name: 'Laura Restrepo',
        email: 'laura@creatorly.com',
        passwordHash,
        role: 'coordinator',
        createdAt: new Date('2026-01-05T08:05:00.000Z'),
        updatedAt: new Date('2026-01-05T08:05:00.000Z'),
      },
      {
        name: 'Sara Gómez',
        email: 'sara@creatorly.com',
        passwordHash,
        role: 'coordinator',
        createdAt: new Date('2026-01-06T09:30:00.000Z'),
        updatedAt: new Date('2026-01-06T09:30:00.000Z'),
      },
    ]);
    this.logger.log('Seeded 3 users');
  }
}
