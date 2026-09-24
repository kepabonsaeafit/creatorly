// Kevin Pabón

/** Estados válidos del ciclo de vida de un Pedido, en el orden fijo del ciclo de vida. */
export const ESTADOS = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado'] as const

export type EstadoPedido = (typeof ESTADOS)[number]

/** Estados que marcan el cierre del ciclo de vida de un Pedido. */
export const ESTADOS_FINALES: readonly EstadoPedido[] = ['entregado', 'aprobado']

/**
 * Pedido: la unidad de trabajo del sistema. Conecta a una Marca (quien solicita),
 * un Creador (quien produce, opcional hasta la asignación) y un User coordinador
 * (quien lo gestiona). Ver ADR-0001: las referencias se guardan por id; el
 * coordinador se referencia con userId.
 */
export interface PedidoInterface {
  id: string
  descripcion: string
  presupuesto: number
  fechaSolicitud: string
  fechaEntrega: string | null
  estado: EstadoPedido
  marcaId: string
  creadorId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
