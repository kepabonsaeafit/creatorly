// Author: Kevin Pabón

// external imports
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

// internal imports
import { Brand } from '../../brands/entities/brand.entity.js';
import { Creator } from '../../creators/entities/creator.entity.js';
import { User } from '../../users/entities/user.entity.js';

/** Valid statuses of an Order's lifecycle, in the lifecycle's fixed order. */
export const STATUSES = [
  'requested',
  'assigned',
  'in_production',
  'delivered',
  'approved',
] as const;

export type OrderStatus = (typeof STATUSES)[number];

/**
 * The system's unit of work: connects a Brand (who requests it), a Creator
 * (who produces it, optional until assigned) and a coordinator User (who
 * manages it); the `order` table.
 */
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  budget: number;

  // day-only date, 'YYYY-MM-DD'
  @Column({ type: 'varchar' })
  requestDate: string;

  // day-only date, 'YYYY-MM-DD'
  @Column({ type: 'varchar', nullable: true })
  deliveryDate: string | null;

  @Column({ type: 'simple-enum', enum: STATUSES })
  status: OrderStatus;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand: Relation<Brand>;

  @RelationId((order: Order) => order.brand)
  brandId: number;

  // deleting the creator keeps the order, without a creator assigned
  @ManyToOne(() => Creator, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<Creator> | null;

  @RelationId((order: Order) => order.creator)
  creatorId: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @RelationId((order: Order) => order.user)
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
