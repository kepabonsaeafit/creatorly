// Author: Felipe Gómez

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { User } from './entities/user.entity.js';
import { UsersSeeder } from './users.seeder.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersSeeder],
  exports: [UsersService],
})
export class UsersModule {}
