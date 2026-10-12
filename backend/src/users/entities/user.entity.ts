// Author: Felipe Gómez

// external imports
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

// internal imports
import { Order } from '../../orders/entities/order.entity.js';

/** Valid roles of a system User. */
export const ROLES = ['admin', 'coordinator'] as const;

export type UserRole = (typeof ROLES)[number];

/** Internal system user (administrator or coordinator); the `user` table. */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // excluded from every query by default; only loaded explicitly to check a login
  @Column({ select: false })
  passwordHash: string;

  @Column({ type: 'simple-enum', enum: ROLES })
  role: UserRole;

  // inverse side of Order.user; not loaded unless a query asks for it
  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
