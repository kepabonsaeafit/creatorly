// Author: Kevin Pabón

// external imports
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

// internal imports
import { CreateCreatorDto } from './dto/create-creator.dto.js';
import { Creator } from './entities/creator.entity.js';
import { CreatorsService } from './creators.service.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Get()
  findAll(): Promise<Creator[]> {
    return this.creatorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Creator> {
    return this.creatorsService.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto): Promise<Creator> {
    return this.creatorsService.create(createCreatorDto);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreatorDto: Partial<CreateCreatorDto>,
  ): Promise<Creator> {
    return this.creatorsService.update(id, updateCreatorDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.creatorsService.remove(id);
  }
}
