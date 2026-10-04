// Author: Kevin Pabón

// the default is for local development only: production must set JWT_SECRET
// to a long random value kept outside the source code
export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'creatorly-dev-only-secret-do-not-use-in-production',
};
