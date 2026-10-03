// Author: Felipe Gómez

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { databaseConfig } from './config/databaseConfig.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: databaseConfig }), UsersModule],
})
export class AppModule {}
