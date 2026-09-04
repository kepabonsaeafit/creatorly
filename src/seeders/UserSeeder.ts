// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Datos ficticios de usuarios. Mismos valores que services/seed.js:15-37. */
export function seedUsers(): UserInterface[] {
  return [
    {
      id: crypto.randomUUID(),
      nombre: 'Camila Torres',
      email: 'admin@creatorly.com',
      password: '1234',
      rol: 'admin',
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-05T08:00:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      nombre: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-05T08:05:00.000Z',
      updatedAt: '2026-01-05T08:05:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      nombre: 'Sara Gómez',
      email: 'sara@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-06T09:30:00.000Z',
      updatedAt: '2026-01-06T09:30:00.000Z',
    },
  ]
}
