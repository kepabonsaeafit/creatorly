// Author: Kevin Pabón

// external imports
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateCreatorDto } from './dto/create-creator.dto.js';
import { Creator } from './entities/creator.entity.js';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectRepository(Creator)
    private creatorsRepository: Repository<Creator>,
  ) {}

  private validate(createCreatorDto: CreateCreatorDto): void {
    if (!createCreatorDto.name || typeof createCreatorDto.name !== 'string') {
      throw new BadRequestException('Creator: name is required');
    }

    if (!createCreatorDto.niche || typeof createCreatorDto.niche !== 'string') {
      throw new BadRequestException('Creator: niche is required');
    }

    if (!createCreatorDto.contentType || typeof createCreatorDto.contentType !== 'string') {
      throw new BadRequestException('Creator: content type is required');
    }

    if (
      typeof createCreatorDto.rate !== 'number' ||
      Number.isNaN(createCreatorDto.rate) ||
      createCreatorDto.rate < 0
    ) {
      throw new BadRequestException('Creator: rate must be a number >= 0');
    }
  }

  /**
   * Finds every creator.
   * @returns All creators.
   */
  findAll(): Promise<Creator[]> {
    return this.creatorsRepository.find();
  }

  /**
   * Finds a creator by id.
   * @param id - Creator id.
   * @returns The creator, or `null` if none matches.
   */
  findOne(id: number): Promise<Creator | null> {
    return this.creatorsRepository.findOneBy({ id });
  }

  /**
   * Validates and creates a new creator; `available` defaults to `true`.
   * @param createCreatorDto - Data of the new creator.
   * @returns The created creator, with its id and timestamps.
   * @throws {BadRequestException} If any required field is missing or invalid.
   */
  create(createCreatorDto: CreateCreatorDto): Promise<Creator> {
    const creatorData: CreateCreatorDto = {
      name: createCreatorDto.name,
      niche: createCreatorDto.niche,
      contentType: createCreatorDto.contentType,
      rate: createCreatorDto.rate,
      available: Boolean(createCreatorDto.available ?? true),
    };

    this.validate(creatorData);

    const creator = this.creatorsRepository.create(creatorData);

    return this.creatorsRepository.save(creator);
  }

  /**
   * Validates and applies partial changes to a creator.
   * @param id - Id of the creator to update.
   * @param updateCreatorDto - Fields to change.
   * @returns The updated creator.
   * @throws {NotFoundException} If no creator has that id.
   * @throws {BadRequestException} If the merged data fails validation.
   */
  async update(id: number, updateCreatorDto: Partial<CreateCreatorDto>): Promise<Creator> {
    const creator = await this.creatorsRepository.findOneBy({ id });

    if (!creator) {
      throw new NotFoundException('Creator: not found');
    }

    const merged: CreateCreatorDto = {
      name: updateCreatorDto.name ?? creator.name,
      niche: updateCreatorDto.niche ?? creator.niche,
      contentType: updateCreatorDto.contentType ?? creator.contentType,
      rate: updateCreatorDto.rate ?? creator.rate,
      available: Boolean(updateCreatorDto.available ?? creator.available),
    };

    this.validate(merged);

    this.creatorsRepository.merge(creator, merged);

    return this.creatorsRepository.save(creator);
  }

  /**
   * Removes a creator; its orders keep existing with `creatorId` set to `null`.
   * @param id - Id of the creator to remove.
   * @throws {NotFoundException} If no creator has that id.
   */
  async remove(id: number): Promise<void> {
    const creator = await this.creatorsRepository.findOneBy({ id });

    if (!creator) {
      throw new NotFoundException('Creator: not found');
    }

    await this.creatorsRepository.remove(creator);
  }
}
