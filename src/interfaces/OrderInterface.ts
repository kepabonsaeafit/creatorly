// Kevin Pabón

/** Estados válidos del ciclo de vida de un Pedido, en el orden fijo del ciclo de vida. */
export const STATUSES = [
  'solicitado',
  'asignado',
  'en_produccion',
  'entregado',
  'aprobado',
] as const

export type OrderStatus = (typeof STATUSES)[number]

/** Estados que marcan el cierre del ciclo de vida de un Pedido. */
export const FINAL_STATUSES: readonly OrderStatus[] = ['entregado', 'aprobado']

/**
 * Pedido: la unidad de trabajo del sistema. Conecta a una Marca (quien solicita),
 * un Creador (quien produce, opcional hasta la asignación) y un User coordinador
 * (quien lo gestiona). Ver ADR-0001: las referencias se guardan por id; el
 * coordinador se referencia con userId.
 */
export interface OrderInterface {
  id: string
  description: string
  budget: number
  requestDate: string
  deliveryDate: string | null
  status: OrderStatus
  brandId: string
  creatorId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
