// Author: Kevin Pabón

// external imports
import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';

// internal imports
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(Number(id));
  }

  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Request() request: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.update(Number(id), updateUserDto, request.user.sub);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: AuthenticatedRequest): Promise<void> {
    return this.usersService.remove(Number(id), request.user.sub);
  }
}
