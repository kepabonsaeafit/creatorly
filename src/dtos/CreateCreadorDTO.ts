// Kevin Pabón

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'

/** Datos necesarios para crear un Creador; id y timestamps los genera el service. */
export type CreateCreadorDTO = Omit<CreadorInterface, 'id' | 'createdAt' | 'updatedAt'>
