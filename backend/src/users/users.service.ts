// Author: Felipe Gómez

// external imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  /**
   * Finds a user by email, including the password hash, to verify a login.
   * @param email - Email to search for.
   * @returns The user with `passwordHash` loaded, or `null` if none matches.
   */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });
  }

  /**
   * Finds a user by id (without the password hash).
   * @param id - User id.
   * @returns The user, or `null` if none matches.
   */
  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}
