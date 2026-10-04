// Author: Felipe Gómez

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { BrandsModule } from './brands/brands.module.js';
import { CreatorsModule } from './creators/creators.module.js';
import { HomeModule } from './home/home.module.js';
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
    UsersModule,
    CreatorsModule,
    BrandsModule,
  ],
})
export class AppModule {}
