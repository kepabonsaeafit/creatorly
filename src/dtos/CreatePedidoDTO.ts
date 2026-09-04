// Kevin Pabón

// internal imports
import type { PedidoInterface } from '@/interfaces/PedidoInterface'

/** Datos necesarios para crear un Pedido; id y timestamps los genera el service. */
export type CreatePedidoDTO = Omit<PedidoInterface, 'id' | 'createdAt' | 'updatedAt'>
