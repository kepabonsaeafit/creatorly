// Author: Kevin Pabón

// external imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// internal imports
import { ToLowerCase } from '../../common/to-lower-case.decorator.js';
import { Trim } from '../../common/trim.decorator.js';

export class SignInDto {
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
