// Author: Felipe Gómez

// external imports
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
