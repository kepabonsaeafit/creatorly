// Author: Kevin Pabón

// external imports
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { Brand } from './entities/brand.entity.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';

@Injectable()
export class BrandsService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  private validate(createBrandDto: CreateBrandDto): void {
    if (!createBrandDto.name || typeof createBrandDto.name !== 'string') {
      throw new BadRequestException('Brand: name is required');
    }

    if (!createBrandDto.industry || typeof createBrandDto.industry !== 'string') {
      throw new BadRequestException('Brand: industry is required');
    }

    if (!createBrandDto.contactName || typeof createBrandDto.contactName !== 'string') {
      throw new BadRequestException('Brand: contact name is required');
    }

    if (!BrandsService.EMAIL_REGEX.test(createBrandDto.contactEmail)) {
      throw new BadRequestException('Brand: contact email has an invalid format');
    }
  }

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
   * @returns The brand, or `null` if none matches.
   */
  findOne(id: number): Promise<Brand | null> {
    return this.brandsRepository.findOneBy({ id });
  }

  /**
   * Validates and creates a new brand; the contact email is trimmed and lowercased.
   * @param createBrandDto - Data of the new brand.
   * @returns The created brand, with its id and timestamps.
   * @throws {BadRequestException} If any required field is missing or the email is invalid.
   */
  create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brandData: CreateBrandDto = {
      name: createBrandDto.name,
      industry: createBrandDto.industry,
      contactName: createBrandDto.contactName,
      contactEmail: String(createBrandDto.contactEmail ?? '')
        .trim()
        .toLowerCase(),
    };

    this.validate(brandData);

    const brand = this.brandsRepository.create(brandData);

    return this.brandsRepository.save(brand);
  }
}
