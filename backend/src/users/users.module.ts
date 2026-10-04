// Author: Felipe Gómez

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { Order } from '../orders/entities/order.entity.js';
import { User } from './entities/user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersSeeder } from './users.seeder.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order])],
  controllers: [UsersController],
  providers: [UsersService, UsersSeeder],
  exports: [UsersService],
})
export class UsersModule {}
