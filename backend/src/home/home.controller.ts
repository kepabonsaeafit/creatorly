// Author: Kevin Pabón

// external imports
import { Controller, Get } from '@nestjs/common';

// internal imports
import { Public } from '../auth/public.decorator.js';

@Controller()
export class HomeController {
  @Public()
  @Get()
  index(): string {
    return 'API is running';
  }
}
