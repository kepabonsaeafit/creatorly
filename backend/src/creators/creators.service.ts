// Author: Kevin Pabón

// external imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateCreatorDto } from './dto/create-creator.dto.js';
import { Creator } from './entities/creator.entity.js';
import { UpdateCreatorDto } from './dto/update-creator.dto.js';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectRepository(Creator)
    private creatorsRepository: Repository<Creator>,
  ) {}

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
   * @returns The creator.
   * @throws {NotFoundException} If no creator has that id.
   */
  async findOne(id: number): Promise<Creator> {
    const creator = await this.creatorsRepository.findOneBy({ id });

    if (!creator) {
      throw new NotFoundException('Creator: not found');
    }

    return creator;
  }

  /**
   * Creates a new creator; `available` defaults to `true`. CreateCreatorDto has already
   * validated and normalized the data.
   * @param createCreatorDto - Data of the new creator.
   * @returns The created creator, with its id and timestamps.
   */
  create(createCreatorDto: CreateCreatorDto): Promise<Creator> {
    const creator = this.creatorsRepository.create({
      ...createCreatorDto,
      available: createCreatorDto.available ?? true,
    });

    return this.creatorsRepository.save(creator);
  }

  /**
   * Applies partial changes to a creator; UpdateCreatorDto has already validated them.
   * @param id - Id of the creator to update.
   * @param updateCreatorDto - Fields to change.
   * @returns The updated creator.
   * @throws {NotFoundException} If no creator has that id.
   */
  async update(id: number, updateCreatorDto: UpdateCreatorDto): Promise<Creator> {
    const creator = await this.findOne(id);

    this.creatorsRepository.merge(creator, {
      name: updateCreatorDto.name ?? creator.name,
      niche: updateCreatorDto.niche ?? creator.niche,
      contentType: updateCreatorDto.contentType ?? creator.contentType,
      rate: updateCreatorDto.rate ?? creator.rate,
      available: updateCreatorDto.available ?? creator.available,
    });

    return this.creatorsRepository.save(creator);
  }

  /**
   * Removes a creator; its orders keep existing with `creatorId` set to `null`.
   * @param id - Id of the creator to remove.
   * @throws {NotFoundException} If no creator has that id.
   */
  async remove(id: number): Promise<void> {
    const creator = await this.findOne(id);

    await this.creatorsRepository.remove(creator);
  }
}
