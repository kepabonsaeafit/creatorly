// Author: Kevin Pabón

// internal imports
import type { UserRole } from '../entities/user.entity.js';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
