// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { generateId } from '@/utils/generateId'

/** Datos ficticios de usuarios. Mismos valores que services/seed.js:15-37. */
export function seedUsers(): UserInterface[] {
  return [
    {
      id: generateId(),
      nombre: 'Camila Torres',
      email: 'admin@creatorly.com',
      password: '1234',
      rol: 'admin',
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-05T08:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-05T08:05:00.000Z',
      updatedAt: '2026-01-05T08:05:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Sara Gómez',
      email: 'sara@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-06T09:30:00.000Z',
      updatedAt: '2026-01-06T09:30:00.000Z',
    },
  ]
}
