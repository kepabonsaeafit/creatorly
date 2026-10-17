// Author: Kevin Pabón

// external imports
import { PartialType } from '@nestjs/mapped-types';

// internal imports
import { CreateOrderDto } from './create-order.dto.js';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
