// Author: Kevin Pabón

// external imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';

// internal imports
import { AuthService } from './auth.service.js';
import { Public } from './public.decorator.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { User } from '../users/entities/user.entity.js';
import type { UserRequestInterface } from '../interfaces/auth/UserRequestInterface.js';
import { UsersService } from '../users/users.service.js';

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
  getProfile(@Request() request: UserRequestInterface): Promise<User | null> {
    return this.usersService.findOne(request.user.sub);
  }
}
