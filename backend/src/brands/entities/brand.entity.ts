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

/** The agency's client, who requests the content; the `brand` table. */
@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  industry: string;

  @Column()
  contactName: string;

  @Column()
  contactEmail: string;

  // inverse side of Order.brand; not loaded unless a query asks for it
  @OneToMany(() => Order, (order) => order.brand)
  orders: Relation<Order>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
