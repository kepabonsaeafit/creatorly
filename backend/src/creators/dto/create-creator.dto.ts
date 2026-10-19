// Author: Kevin Pabón

// external imports
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// internal imports
import { ToLowerCase } from '../../common/to-lower-case.decorator.js';
import { Trim } from '../../common/trim.decorator.js';

export class CreateCreatorDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  // lowercased so "gaming" and "Gaming" are stored as the same niche
  @Trim()
  @ToLowerCase()
  @IsString()
  @IsNotEmpty()
  niche: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @Min(0)
  rate: number;

  // defaults to true in CreatorsService when omitted
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
