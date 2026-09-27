// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { generateId } from '@/utils/generateId'

/** Datos ficticios de usuarios. */
export function seedUsers(): UserInterface[] {
  return [
    {
      id: generateId(),
      name: 'Camila Torres',
      email: 'admin@creatorly.com',
      password: '1234',
      role: 'admin',
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-05T08:00:00.000Z',
    },
    {
      id: generateId(),
      name: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      password: '1234',
      role: 'coordinator',
      createdAt: '2026-01-05T08:05:00.000Z',
      updatedAt: '2026-01-05T08:05:00.000Z',
    },
    {
      id: generateId(),
      name: 'Sara Gómez',
      email: 'sara@creatorly.com',
      password: '1234',
      role: 'coordinator',
      createdAt: '2026-01-06T09:30:00.000Z',
      updatedAt: '2026-01-06T09:30:00.000Z',
    },
  ]
}
