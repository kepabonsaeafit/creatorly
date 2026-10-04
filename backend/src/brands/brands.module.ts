// Author: Kevin Pabón

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { BrandsController } from './brands.controller.js';
import { BrandsSeeder } from './brands.seeder.js';
import { BrandsService } from './brands.service.js';
import { Brand } from './entities/brand.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService, BrandsSeeder],
})
export class BrandsModule {}
