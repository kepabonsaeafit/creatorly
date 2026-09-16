// Kevin Pabón

// external imports
import { describe, expect, it } from 'vitest'

// internal imports
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { formatEstado } from '@/utils/formatEstado'

describe('formatEstado', () => {
  it.each<[EstadoPedido, string]>([
    ['solicitado', 'Solicitado'],
    ['asignado', 'Asignado'],
    ['en_produccion', 'En producción'],
    ['entregado', 'Entregado'],
    ['aprobado', 'Aprobado'],
  ])('maps %s to its readable label', (estado, etiqueta) => {
    expect(formatEstado(estado)).toBe(etiqueta)
  })

  it('returns a distinct non-empty label for every estado', () => {
    const estados: EstadoPedido[] = [
      'solicitado',
      'asignado',
      'en_produccion',
      'entregado',
      'aprobado',
    ]

    const etiquetas = estados.map((estado) => formatEstado(estado))

    expect(etiquetas.every((etiqueta) => etiqueta.length > 0)).toBe(true)
    expect(new Set(etiquetas).size).toBe(estados.length)
  })

  it('returns undefined for an estado outside the lifecycle', () => {
    expect(formatEstado('cancelado' as EstadoPedido)).toBeUndefined()
  })
})
