// Author: Kevin Pabón

// internal imports
import type { UserRole } from '../../users/entities/user.entity.js';

/** Data carried inside the access token; the AuthGuard puts it in `request.user`. */
export interface JWTPayloadInterface {
  sub: number;
  email: string;
  role: UserRole;
}
