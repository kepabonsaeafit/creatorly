// Author: Kevin Pabón

// external imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// internal imports
import { Creator } from './entities/creator.entity.js';
import { CreatorsController } from './creators.controller.js';
import { CreatorsSeeder } from './creators.seeder.js';
import { CreatorsService } from './creators.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  controllers: [CreatorsController],
  providers: [CreatorsService, CreatorsSeeder],
})
export class CreatorsModule {}
