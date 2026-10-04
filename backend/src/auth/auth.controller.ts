// Author: Kevin Pabón

// external imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';

// internal imports
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import type { AuthenticatedRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { Public } from './public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() request: AuthenticatedRequest): Promise<User | null> {
    return this.usersService.findOne(request.user.sub);
  }
}
