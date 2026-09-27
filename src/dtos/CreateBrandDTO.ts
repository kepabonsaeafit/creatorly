// Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'

/** Datos necesarios para crear una Marca; id y timestamps los genera el service. */
export type CreateBrandDTO = Omit<BrandInterface, 'id' | 'createdAt' | 'updatedAt'>
