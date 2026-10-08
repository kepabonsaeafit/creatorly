// Author: Kevin Pabón

// external imports
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

// internal imports
import { CreateCreatorDto } from './dto/create-creator.dto.js';
import { Creator } from './entities/creator.entity.js';
import { CreatorsService } from './creators.service.js';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Get()
  findAll(): Promise<Creator[]> {
    return this.creatorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Creator | null> {
    return this.creatorsService.findOne(Number(id));
  }

  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto): Promise<Creator> {
    return this.creatorsService.create(createCreatorDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreatorDto: Partial<CreateCreatorDto>,
  ): Promise<Creator> {
    return this.creatorsService.update(Number(id), updateCreatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.creatorsService.remove(Number(id));
  }
}
