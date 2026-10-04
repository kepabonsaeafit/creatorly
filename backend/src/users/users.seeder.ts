// Author: Felipe Gómez

// external imports
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

// internal imports
import { User } from './user.entity.js';

/** Inserts the initial users when the `users` table is empty, so the app can be logged into. */
@Injectable()
export class UsersSeeder implements OnApplicationBootstrap {
  private static readonly SALT_ROUNDS = 10;
  // demo password shown on the login screen
  private static readonly DEMO_PASSWORD = '1234';

  private readonly logger = new Logger(UsersSeeder.name);

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  /** Runs once the app has started; does nothing if users already exist. */
  async onApplicationBootstrap(): Promise<void> {
    if ((await this.usersRepository.count()) > 0) return;

    const passwordHash = await hash(UsersSeeder.DEMO_PASSWORD, UsersSeeder.SALT_ROUNDS);
    await this.usersRepository.save([
      { name: 'Camila Torres', email: 'admin@creatorly.com', passwordHash, role: 'admin' },
      { name: 'Laura Restrepo', email: 'laura@creatorly.com', passwordHash, role: 'coordinator' },
      { name: 'Sara Gómez', email: 'sara@creatorly.com', passwordHash, role: 'coordinator' },
    ]);
    this.logger.log('Seeded 3 users');
  }
}
