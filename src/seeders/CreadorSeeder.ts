// Kevin Pabón

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import { generateId } from '@/utils/generateId'

/** Datos ficticios de creadores. Mismos valores que services/seed.js:39-88. */
export function seedCreadores(): CreadorInterface[] {
  return [
    {
      id: generateId(),
      nombre: 'Valentina Ríos',
      nicho: 'belleza',
      tipoContenido: 'TikTok',
      tarifa: 1500,
      disponible: true,
      createdAt: '2026-01-08T10:00:00.000Z',
      updatedAt: '2026-01-08T10:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Andrés Mesa',
      nicho: 'gaming',
      tipoContenido: 'YouTube',
      tarifa: 2400,
      disponible: true,
      createdAt: '2026-01-09T11:00:00.000Z',
      updatedAt: '2026-01-09T11:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Daniela Kim',
      nicho: 'moda',
      tipoContenido: 'Instagram',
      tarifa: 1800,
      disponible: true,
      createdAt: '2026-01-12T14:00:00.000Z',
      updatedAt: '2026-01-12T14:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Sebastián Ortiz',
      nicho: 'fitness',
      tipoContenido: 'YouTube',
      tarifa: 2100,
      disponible: false,
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-01-15T09:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Isabella Cruz',
      nicho: 'gastronomía',
      tipoContenido: 'TikTok',
      tarifa: 1200,
      disponible: true,
      createdAt: '2026-02-02T16:00:00.000Z',
      updatedAt: '2026-02-02T16:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Mateo Vargas',
      nicho: 'tecnología',
      tipoContenido: 'Instagram',
      tarifa: 2000,
      disponible: true,
      createdAt: '2026-02-10T10:30:00.000Z',
      updatedAt: '2026-02-10T10:30:00.000Z',
    },
  ]
}
