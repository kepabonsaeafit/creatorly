// Author: Kevin Pabón

// external imports
import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route (or a whole controller) as reachable without a token. */
export const Public = (): CustomDecorator<string> => SetMetadata(IS_PUBLIC_KEY, true);
