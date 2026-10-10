// Author: Kevin Pabón
// Author: Felipe Gómez

// external imports
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';

// internal imports
import { CreateUserDto } from './dto/create-user.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { User } from './entities/user.entity.js';
import type { UserRequestInterface } from '../interfaces/auth/UserRequestInterface.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Request() request: UserRequestInterface,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto, request.user.sub);
  }

  @Roles('admin')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: UserRequestInterface,
  ): Promise<void> {
    return this.usersService.remove(id, request.user.sub);
  }
}
