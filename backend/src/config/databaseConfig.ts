// Author: Felipe Gómez

// external imports
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

// internal imports
import { requireEnv } from '../utils/requireEnv.js';

/**
 * Builds the PostgreSQL connection options from the environment.
 * @returns TypeORM options for TypeOrmModule.forRootAsync.
 * @throws Error if a DB_* variable is missing.
 */
export function databaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT')),
    username: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME'),
    autoLoadEntities: true,
    // creates/updates tables from the entities; never in production, where it could drop data
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
