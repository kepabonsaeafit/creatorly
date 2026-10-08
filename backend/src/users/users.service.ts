// Author: Felipe Gómez

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateUserDto } from './dto/create-user.dto.js';
import { Order } from '../orders/entities/order.entity.js';
import { ROLES, User } from './entities/user.entity.js';
import type { UserRole } from './entities/user.entity.js';

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

  // an admin can't take the admin role away from their own session
  private validateOwnRoleChange(id: number, newRole: UserRole, currentUserId: number): void {
    if (id === currentUserId && newRole !== 'admin') {
      throw new BadRequestException(
        'User: you cannot remove the admin role while it is your own session',
      );
    }
  }

  // nobody can delete the user they are logged in as
  private validateDeletion(id: number, currentUserId: number): void {
    if (id === currentUserId) {
      throw new BadRequestException('User: you cannot delete the user you are logged in as');
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
   * @param currentUserId - Id of the logged-in user (from the token).
   * @returns The updated user (without the password hash).
   * @throws {NotFoundException} If no user has that id.
   * @throws {BadRequestException} If the merged data fails validation, the email is already
   * in use, or the logged-in admin removes their own admin role.
   */
  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
    currentUserId: number,
  ): Promise<User> {
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
    this.validateOwnRoleChange(id, merged.role, currentUserId);
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
   * Removes a user that manages no orders and is not the logged-in user.
   * @param id - Id of the user to remove.
   * @param currentUserId - Id of the logged-in user (from the token).
   * @throws {NotFoundException} If no user has that id.
   * @throws {BadRequestException} If it is the logged-in user, or the user still has orders.
   */
  async remove(id: number, currentUserId: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User: not found');
    }

    this.validateDeletion(id, currentUserId);

    const orderCount = await this.ordersRepository.count({
      where: { user: { id } },
    });

    if (orderCount > 0) {
      throw new BadRequestException('User: cannot delete a user with orders');
    }

    await this.usersRepository.remove(user);
  }
}
