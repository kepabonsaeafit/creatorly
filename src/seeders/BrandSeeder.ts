// Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { generateId } from '@/utils/generateId'

/** Datos ficticios de marcas. */
export function seedBrands(): BrandInterface[] {
  return [
    {
      id: generateId(),
      name: 'Natura Belleza',
      industry: 'belleza y cuidado personal',
      contactName: 'María Fernández',
      contactEmail: 'maria@naturabelleza.com',
      createdAt: '2026-01-07T09:00:00.000Z',
      updatedAt: '2026-01-07T09:00:00.000Z',
    },
    {
      id: generateId(),
      name: 'PixelPlay',
      industry: 'videojuegos',
      contactName: 'Carlos Andrade',
      contactEmail: 'carlos@pixelplay.co',
      createdAt: '2026-01-20T15:00:00.000Z',
      updatedAt: '2026-01-20T15:00:00.000Z',
    },
    {
      id: generateId(),
      name: 'Áurea Moda',
      industry: 'moda y accesorios',
      contactName: 'Paula Ruiz',
      contactEmail: 'paula@aureamoda.com',
      createdAt: '2026-02-01T08:30:00.000Z',
      updatedAt: '2026-02-01T08:30:00.000Z',
    },
    {
      id: generateId(),
      name: 'FitPro Suplementos',
      industry: 'fitness y nutrición',
      contactName: 'Diego Salazar',
      contactEmail: 'diego@fitpro.com',
      createdAt: '2026-02-05T13:00:00.000Z',
      updatedAt: '2026-02-05T13:00:00.000Z',
    },
  ]
}
