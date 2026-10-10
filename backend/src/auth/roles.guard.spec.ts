// Author: Felipe Gómez

// external imports
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// internal imports
import { RolesGuard } from './roles.guard.js';
import type { UserRole } from '../users/entities/user.entity.js';

// builds the minimum ExecutionContext the guard reads: a handler, a class and a request
function contextFor(role: UserRole): ExecutionContext {
  return {
    getHandler: () => (): void => {},
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => ({ user: { sub: 1, email: 'x@x.com', role } }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lets any logged-in role through a route without @Roles', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(contextFor('coordinator'))).toBe(true);
  });

  it('lets an admin through an admin-only route', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    expect(guard.canActivate(contextFor('admin'))).toBe(true);
  });

  it('blocks a coordinator on an admin-only route (403)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    expect(guard.canActivate(contextFor('coordinator'))).toBe(false);
  });
});
