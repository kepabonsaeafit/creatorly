// Author: Felipe Gómez

/**
 * Reads a required environment variable.
 * @param name - Variable name, as declared in .env.example.
 * @returns The variable's value.
 * @throws Error if the variable is missing or empty, so the server fails at startup instead of at the first request.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
