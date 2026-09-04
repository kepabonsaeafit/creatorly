// Kevin Pabón

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

/** Datos necesarios para crear un User; id y timestamps los genera el service. */
export type CreateUserDTO = Omit<UserInterface, 'id' | 'createdAt' | 'updatedAt'>
