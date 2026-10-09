// Author: Kevin Pabón

// external imports
import { compare } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// internal imports
import type { JWTPayloadInterface } from '../interfaces/auth/JWTPayloadInterface.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // same normalization UsersService applies before storing an email
  private normalizeEmail(email: string): string {
    return String(email ?? '')
      .trim()
      .toLowerCase();
  }

  /**
   * Checks the credentials against the stored bcrypt hash and signs an access token.
   * @param email - Email of the user.
   * @param password - Plain password to check.
   * @returns The signed JWT, as `access_token`.
   * @throws {UnauthorizedException} If the email is unknown or the password is wrong
   * (same message for both, so the response doesn't reveal which emails exist).
   */
  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(this.normalizeEmail(email));

    if (!user || typeof password !== 'string' || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadInterface = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
