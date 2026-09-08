// Kevin Pabón

// internal imports
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import { generateId } from '@/utils/generateId'

/** Datos ficticios de marcas. Mismos valores que services/seed.js:90-119. */
export function seedMarcas(): MarcaInterface[] {
  return [
    {
      id: generateId(),
      nombre: 'Natura Belleza',
      industria: 'belleza y cuidado personal',
      contactoNombre: 'María Fernández',
      contactoEmail: 'maria@naturabelleza.com',
      createdAt: '2026-01-07T09:00:00.000Z',
      updatedAt: '2026-01-07T09:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'PixelPlay',
      industria: 'videojuegos',
      contactoNombre: 'Carlos Andrade',
      contactoEmail: 'carlos@pixelplay.co',
      createdAt: '2026-01-20T15:00:00.000Z',
      updatedAt: '2026-01-20T15:00:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'Áurea Moda',
      industria: 'moda y accesorios',
      contactoNombre: 'Paula Ruiz',
      contactoEmail: 'paula@aureamoda.com',
      createdAt: '2026-02-01T08:30:00.000Z',
      updatedAt: '2026-02-01T08:30:00.000Z',
    },
    {
      id: generateId(),
      nombre: 'FitPro Suplementos',
      industria: 'fitness y nutrición',
      contactoNombre: 'Diego Salazar',
      contactoEmail: 'diego@fitpro.com',
      createdAt: '2026-02-05T13:00:00.000Z',
      updatedAt: '2026-02-05T13:00:00.000Z',
    },
  ]
}
