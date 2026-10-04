// Author: Kevin Pabón

// external imports
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
