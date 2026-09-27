// Kevin Pabón

// internal imports
import type { CreatorInterface } from '@/interfaces/CreatorInterface'

/** Datos necesarios para crear un Creador; id y timestamps los genera el service. */
export type CreateCreatorDTO = Omit<CreatorInterface, 'id' | 'createdAt' | 'updatedAt'>
