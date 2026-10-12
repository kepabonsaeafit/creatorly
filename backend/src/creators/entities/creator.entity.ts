// Author: Kevin Pabón

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

/** UGC creator from the agency catalog (the talent that produces the content); the `creator` table. */
@Entity()
export class Creator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  niche: string;

  @Column()
  contentType: string;

  @Column()
  rate: number;

  @Column()
  available: boolean;

  // inverse side of Order.creator; not loaded unless a query asks for it
  @OneToMany(() => Order, (order) => order.creator)
  orders: Relation<Order>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
