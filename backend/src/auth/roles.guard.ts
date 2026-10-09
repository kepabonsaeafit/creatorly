// Author: Kevin Pabón

// external imports
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// internal imports
import { ROLES_KEY } from './roles.decorator.js';
import type { UserRequestInterface } from '../interfaces/auth/UserRequestInterface.js';
import type { UserRole } from '../users/entities/user.entity.js';

/** Global guard, after the AuthGuard: a route with `@Roles(...)` only lets those roles in. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<UserRequestInterface>();

    return requiredRoles.includes(user.role);
  }
}
