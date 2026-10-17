// Author: Felipe Gómez

// external imports
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

// internal imports
import { AuthService } from './auth.service.js';
import type { User } from '../users/entities/user.entity.js';
import type { UsersService } from '../users/users.service.js';

describe('AuthService.signIn', () => {
  const jwtService = new JwtService({ secret: 'test-secret' });
  let storedUser: User;
  let authService: AuthService;

  beforeAll(async () => {
    storedUser = {
      id: 7,
      name: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      passwordHash: await hash('1234', 4),
      role: 'coordinator',
    } as User;

    // only findByEmail is used by signIn, so the rest of UsersService is not needed
    const usersService = {
      findByEmail: async (email: string): Promise<User | null> =>
        email === storedUser.email ? storedUser : null,
    } as unknown as UsersService;

    authService = new AuthService(usersService, jwtService);
  });

  it('returns a token carrying the id, email and role for valid credentials', async () => {
    const { access_token } = await authService.signIn('laura@creatorly.com', '1234');
    const payload = await jwtService.verifyAsync(access_token);

    expect(payload).toMatchObject({ sub: 7, email: 'laura@creatorly.com', role: 'coordinator' });
  });

  it('rejects a wrong password with 401', async () => {
    await expect(authService.signIn('laura@creatorly.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects an unknown email with the same 401', async () => {
    await expect(authService.signIn('nobody@creatorly.com', '1234')).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
