// Author: Kevin Pabón

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { Brand } from '../brands/entities/brand.entity.js';
import { Creator } from '../creators/entities/creator.entity.js';
import { Order } from './entities/order.entity.js';
import { OrdersController } from './orders.controller.js';
import { OrdersSeeder } from './orders.seeder.js';
import { OrdersService } from './orders.service.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Brand, Creator, User])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersSeeder],
})
export class OrdersModule {}
