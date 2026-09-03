// Kevin Pabón

// internal imports
import type { MarcaInterface } from '@/interfaces/MarcaInterface'

/** Datos necesarios para crear una Marca; id y timestamps los genera el service. */
export type CreateMarcaDTO = Omit<MarcaInterface, 'id' | 'createdAt' | 'updatedAt'>
