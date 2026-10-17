// Author: Kevin Pabón

// external imports
import { PartialType } from '@nestjs/mapped-types';

// internal imports
import { CreateCreatorDto } from './create-creator.dto.js';

export class UpdateCreatorDto extends PartialType(CreateCreatorDto) {}
