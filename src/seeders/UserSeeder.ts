// Author: Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Fake user data. */
export function seedUsers(): UserInterface[] {
  return [
    {
      id: '1',
      name: 'Camila Torres',
      email: 'admin@creatorly.com',
      password: '1234',
      role: 'admin',
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-05T08:00:00.000Z',
    },
    {
      id: '2',
      name: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      password: '1234',
      role: 'coordinator',
      createdAt: '2026-01-05T08:05:00.000Z',
      updatedAt: '2026-01-05T08:05:00.000Z',
    },
    {
      id: '3',
      name: 'Sara Gómez',
      email: 'sara@creatorly.com',
      password: '1234',
      role: 'coordinator',
      createdAt: '2026-01-06T09:30:00.000Z',
      updatedAt: '2026-01-06T09:30:00.000Z',
    },
  ]
}
