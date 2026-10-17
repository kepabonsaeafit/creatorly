// Author: Kevin Pabón

// external imports
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// internal imports
import { Trim } from '../../common/trim.decorator.js';

export class CreateCreatorDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Trim()
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
