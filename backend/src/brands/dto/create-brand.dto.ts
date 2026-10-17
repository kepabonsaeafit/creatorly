// Author: Kevin Pabón

// external imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// internal imports
import { ToLowerCase } from '../../common/to-lower-case.decorator.js';
import { Trim } from '../../common/trim.decorator.js';

export class CreateBrandDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  industry: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @Trim()
  @ToLowerCase()
  @IsEmail()
  contactEmail: string;
}
