// Author: Kevin Pabón

// internal imports
import type { CreatorInterface } from '@/interfaces/CreatorInterface'

/** Fake creator data. */
export function seedCreators(): CreatorInterface[] {
  return [
    {
      id: '1',
      name: 'Valentina Ríos',
      niche: 'beauty',
      contentType: 'TikTok',
      rate: 1500,
      available: true,
      createdAt: '2026-01-08T10:00:00.000Z',
      updatedAt: '2026-01-08T10:00:00.000Z',
    },
    {
      id: '2',
      name: 'Andrés Mesa',
      niche: 'gaming',
      contentType: 'YouTube',
      rate: 2400,
      available: true,
      createdAt: '2026-01-09T11:00:00.000Z',
      updatedAt: '2026-01-09T11:00:00.000Z',
    },
    {
      id: '3',
      name: 'Daniela Kim',
      niche: 'fashion',
      contentType: 'Instagram',
      rate: 1800,
      available: true,
      createdAt: '2026-01-12T14:00:00.000Z',
      updatedAt: '2026-01-12T14:00:00.000Z',
    },
    {
      id: '4',
      name: 'Sebastián Ortiz',
      niche: 'fitness',
      contentType: 'YouTube',
      rate: 2100,
      available: false,
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-01-15T09:00:00.000Z',
    },
    {
      id: '5',
      name: 'Isabella Cruz',
      niche: 'food',
      contentType: 'TikTok',
      rate: 1200,
      available: true,
      createdAt: '2026-02-02T16:00:00.000Z',
      updatedAt: '2026-02-02T16:00:00.000Z',
    },
    {
      id: '6',
      name: 'Mateo Vargas',
      niche: 'technology',
      contentType: 'Instagram',
      rate: 2000,
      available: true,
      createdAt: '2026-02-10T10:30:00.000Z',
      updatedAt: '2026-02-10T10:30:00.000Z',
    },
  ]
}
