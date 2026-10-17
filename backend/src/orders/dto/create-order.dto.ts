// Author: Kevin Pabón

// external imports
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

// internal imports
import type { OrderStatus } from '../entities/order.entity.js';
import { STATUSES } from '../entities/order.entity.js';
import { Trim } from '../../common/trim.decorator.js';

// day-only date, 'YYYY-MM-DD'; IsDateString({ strict: true }) also rejects
// days that do not exist, such as '2026-02-30'
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CreateOrderDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  budget: number;

  // defaults to today in OrdersService when omitted
  @IsOptional()
  @Matches(DATE_PATTERN)
  @IsDateString({ strict: true })
  requestDate?: string;

  // null (or omitted) means no delivery date yet
  @IsOptional()
  @Matches(DATE_PATTERN)
  @IsDateString({ strict: true })
  deliveryDate?: string | null;

  // defaults to 'requested' in OrdersService when omitted
  @IsOptional()
  @IsIn(STATUSES)
  status?: OrderStatus;

  @IsInt()
  @Min(1)
  brandId: number;

  // null (or omitted) means no creator assigned yet
  @IsOptional()
  @IsInt()
  creatorId?: number | null;

  @IsInt()
  @Min(1)
  userId: number;
}
