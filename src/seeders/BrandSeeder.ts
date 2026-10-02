// Author: Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'

/** Fake brand data. */
export function seedBrands(): BrandInterface[] {
  return [
    {
      id: '1',
      name: 'Natura Belleza',
      industry: 'beauty and personal care',
      contactName: 'María Fernández',
      contactEmail: 'maria@naturabelleza.com',
      createdAt: '2026-01-07T09:00:00.000Z',
      updatedAt: '2026-01-07T09:00:00.000Z',
    },
    {
      id: '2',
      name: 'PixelPlay',
      industry: 'video games',
      contactName: 'Carlos Andrade',
      contactEmail: 'carlos@pixelplay.co',
      createdAt: '2026-01-20T15:00:00.000Z',
      updatedAt: '2026-01-20T15:00:00.000Z',
    },
    {
      id: '3',
      name: 'Áurea Moda',
      industry: 'fashion and accessories',
      contactName: 'Paula Ruiz',
      contactEmail: 'paula@aureamoda.com',
      createdAt: '2026-02-01T08:30:00.000Z',
      updatedAt: '2026-02-01T08:30:00.000Z',
    },
    {
      id: '4',
      name: 'FitPro Suplementos',
      industry: 'fitness and nutrition',
      contactName: 'Diego Salazar',
      contactEmail: 'diego@fitpro.com',
      createdAt: '2026-02-05T13:00:00.000Z',
      updatedAt: '2026-02-05T13:00:00.000Z',
    },
  ]
}
