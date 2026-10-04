// Author: Felipe Gómez

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

// internal imports
import { Order } from '../orders/entities/order.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ROLES, User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.name || typeof createUserDto.name !== 'string') {
      throw new BadRequestException('User: name is required');
    }

    if (!UsersService.EMAIL_REGEX.test(createUserDto.email)) {
      throw new BadRequestException('User: email has an invalid format');
    }

    if (!createUserDto.password || typeof createUserDto.password !== 'string') {
      throw new BadRequestException('User: password is required');
    }

    if (!ROLES.includes(createUserDto.role)) {
      throw new BadRequestException(`User: role must be one of ${ROLES.join(' | ')}`);
    }
  }

  // emails are stored trimmed and lowercase, so the login and the uniqueness check match
  private normalizeEmail(email: string): string {
    return String(email ?? '')
      .trim()
      .toLowerCase();
  }

  private async validateUniqueEmail(email: string, ownId: number | null): Promise<void> {
    const existing = await this.usersRepository.findOneBy({ email });

    if (existing && existing.id !== ownId) {
      throw new BadRequestException('User: email is already in use');
    }
  }

  /**
   * Finds every user (without the password hash).
   * @returns All users.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds a user by id (without the password hash).
   * @param id - User id.
   * @returns The user, or `null` if none matches.
   */
  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Finds a user by email, including the password hash, to verify a login.
   * @param email - Email to search for.
   * @returns The user with `passwordHash` loaded, or `null` if none matches.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });
  }

  /**
   * Validates and creates a new user, storing the password as a bcrypt hash;
   * the role defaults to 'coordinator'.
   * @param createUserDto - Data of the new user, with the plain password.
   * @returns The created user (without the password hash).
   * @throws {BadRequestException} If any field is missing or invalid, or the email is already in use.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData: CreateUserDto = {
      name: createUserDto.name,
      email: this.normalizeEmail(createUserDto.email),
      password: createUserDto.password,
      role: createUserDto.role ?? 'coordinator',
    };

    this.validate(userData);
    await this.validateUniqueEmail(userData.email, null);

    const { password, ...rest } = userData;
    const passwordHash = await hash(password, UsersService.SALT_ROUNDS);
    const user = this.usersRepository.create({ ...rest, passwordHash });

    const saved = await this.usersRepository.save(user);

    // reloaded so the response leaves out the password hash
    return this.usersRepository.findOneByOrFail({ id: saved.id });
  }

  /**
   * Validates and applies partial changes to a user; a new password is hashed,
   * otherwise the current hash is kept.
   * @param id - Id of the user to update.
   * @param updateUserDto - Fields to change.
   * @returns The updated user (without the password hash).
   * @throws {NotFoundException} If no user has that id.
   * @throws {BadRequestException} If the merged data fails validation or the email is already in use.
   */
  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException('User: not found');
    }

    // without a new password, the stored hash stands in as the current credential
    const merged: CreateUserDto = {
      name: updateUserDto.name ?? user.name,
      email: this.normalizeEmail(updateUserDto.email ?? user.email),
      password: updateUserDto.password ?? user.passwordHash,
      role: updateUserDto.role ?? user.role,
    };

    this.validate(merged);
    await this.validateUniqueEmail(merged.email, id);

    const passwordHash =
      updateUserDto.password !== undefined
        ? await hash(merged.password, UsersService.SALT_ROUNDS)
        : user.passwordHash;
    this.usersRepository.merge(user, {
      name: merged.name,
      email: merged.email,
      role: merged.role,
      passwordHash,
    });

    await this.usersRepository.save(user);

    // reloaded so the response leaves out the password hash
    return this.usersRepository.findOneByOrFail({ id });
  }

  /**
   * Removes a user that manages no orders.
   * @param id - Id of the user to remove.
   * @throws {NotFoundException} If no user has that id.
   * @throws {BadRequestException} If the user still has orders.
   */
  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User: not found');
    }

    const orderCount = await this.ordersRepository.count({
      where: { user: { id } },
    });

    if (orderCount > 0) {
      throw new BadRequestException('User: cannot delete a user with orders');
    }

    await this.usersRepository.remove(user);
  }
}
