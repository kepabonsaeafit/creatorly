// Author: Kevin Pabón

// external imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from './entities/brand.entity.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  /**
   * Finds every brand.
   * @returns All brands.
   */
  findAll(): Promise<Brand[]> {
    return this.brandsRepository.find();
  }

  /**
   * Finds a brand by id.
   * @param id - Brand id.
   * @returns The brand.
   * @throws {NotFoundException} If no brand has that id.
   */
  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOneBy({ id });

    if (!brand) {
      throw new NotFoundException('Brand: not found');
    }

    return brand;
  }

  /**
   * Creates a new brand; CreateBrandDto has already validated and normalized the data.
   * @param createBrandDto - Data of the new brand.
   * @returns The created brand, with its id and timestamps.
   */
  create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandsRepository.create(createBrandDto);

    return this.brandsRepository.save(brand);
  }
}
