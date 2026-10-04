// Author: Felipe Gómez

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { AuthModule } from './auth/auth.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { CreatorsModule } from './creators/creators.module.js';
import { HomeModule } from './home/home.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.SQLITE_PATH ?? 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HomeModule,
    AuthModule,
    UsersModule,
    CreatorsModule,
    BrandsModule,
    OrdersModule,
  ],
})
export class AppModule {}
