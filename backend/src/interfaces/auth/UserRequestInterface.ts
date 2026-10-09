// Author: Kevin Pabón

// external imports
import type { Request } from 'express';

// internal imports
import type { JWTPayloadInterface } from './JWTPayloadInterface.js';

/** A request that went through the AuthGuard, with the token's payload in `user`. */
export interface UserRequestInterface extends Request {
  user: JWTPayloadInterface;
}
