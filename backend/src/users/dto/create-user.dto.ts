// Author: Kevin Pabón

// external imports
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// internal imports
import { ROLES } from '../entities/user.entity.js';
import type { UserRole } from '../entities/user.entity.js';
import { ToLowerCase } from '../../common/to-lower-case.decorator.js';
import { Trim } from '../../common/trim.decorator.js';

export class CreateUserDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // defaults to 'coordinator' in UsersService when omitted
  @IsOptional()
  @IsIn(ROLES)
  role?: UserRole;
}
