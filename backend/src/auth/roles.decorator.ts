// Author: Kevin Pabón

// external imports
import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

// internal imports
import type { UserRole } from '../users/entities/user.entity.js';

export const ROLES_KEY = 'roles';

/** Restricts a route (or a whole controller) to the given roles. */
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
