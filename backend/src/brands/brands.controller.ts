// Author: Kevin Pabón

// external imports
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

// internal imports
import { Brand } from './entities/brand.entity.js';
import { BrandsService } from './brands.service.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandsService.findOne(Number(id));
  }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }
}
