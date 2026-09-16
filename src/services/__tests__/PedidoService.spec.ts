// Kevin Pabón

// external imports
import { describe, expect, it } from 'vitest'

// internal imports
import type { EstadoPedido, PedidoInterface } from '@/interfaces/PedidoInterface'
import { PedidoService } from '@/services/PedidoService'

let secuencia = 0

function buildPedido(cambios: Partial<PedidoInterface> = {}): PedidoInterface {
  secuencia += 1
  return {
    id: `pedido-${secuencia}`,
    descripcion: `Pedido de prueba ${secuencia}`,
    presupuesto: 100,
    fechaSolicitud: '2026-08-10',
    fechaEntrega: null,
    estado: 'solicitado',
    marcaId: 'marca-1',
    creadorId: null,
    coordinadorId: 'user-1',
    createdAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-08-10T12:00:00.000Z',
    ...cambios,
  }
}

describe('PedidoService.getPedidosPorEstado', () => {
  it('counts pedidos per estado in lifecycle order', () => {
    const pedidos = [
      buildPedido({ estado: 'solicitado' }),
      buildPedido({ estado: 'en_produccion' }),
      buildPedido({ estado: 'en_produccion' }),
      buildPedido({ estado: 'aprobado' }),
    ]

    expect(PedidoService.getPedidosPorEstado(pedidos)).toEqual([
      { estado: 'solicitado', cantidad: 1 },
      { estado: 'asignado', cantidad: 0 },
      { estado: 'en_produccion', cantidad: 2 },
      { estado: 'entregado', cantidad: 0 },
      { estado: 'aprobado', cantidad: 1 },
    ])
  })

  it('returns all five estados with zero count for an empty list', () => {
    const resultado = PedidoService.getPedidosPorEstado([])

    expect(resultado.map((fila) => fila.estado)).toEqual([
      'solicitado',
      'asignado',
      'en_produccion',
      'entregado',
      'aprobado',
    ])
    expect(resultado.every((fila) => fila.cantidad === 0)).toBe(true)
  })

  it('ignores pedidos whose estado is outside the lifecycle', () => {
    const pedidos = [
      buildPedido({ estado: 'aprobado' }),
      buildPedido({ estado: 'cancelado' as EstadoPedido }),
    ]

    const total = PedidoService.getPedidosPorEstado(pedidos).reduce(
      (suma, fila) => suma + fila.cantidad,
      0,
    )

    expect(total).toBe(1)
  })
})

describe('PedidoService.getReportStats', () => {
  it('computes total, sum, average and approval rate', () => {
    const pedidos = [
      buildPedido({ presupuesto: 100, estado: 'aprobado' }),
      buildPedido({ presupuesto: 200 }),
      buildPedido({ presupuesto: 300 }),
      buildPedido({ presupuesto: 400 }),
    ]

    expect(PedidoService.getReportStats(pedidos)).toEqual([
      { id: 'total', label: 'Pedidos', value: 4, unit: '' },
      { id: 'presupuesto', label: 'Presupuesto total', value: 1000, unit: '$' },
      { id: 'promedio', label: 'Presupuesto promedio', value: 250, unit: '$' },
      { id: 'aprobacion', label: 'Tasa de aprobación (%)', value: 25, unit: '' },
    ])
  })

  it('returns zeros instead of NaN for an empty list', () => {
    const valores = PedidoService.getReportStats([]).map((stat) => stat.value)

    expect(valores).toEqual([0, 0, 0, 0])
  })

  it('rounds average and approval rate to whole numbers', () => {
    const pedidos = [
      buildPedido({ presupuesto: 100, estado: 'aprobado' }),
      buildPedido({ presupuesto: 100 }),
      buildPedido({ presupuesto: 101 }),
    ]

    const [, , promedio, aprobacion] = PedidoService.getReportStats(pedidos)

    expect(promedio.value).toBe(100)
    expect(aprobacion.value).toBe(33)
  })

  it('reports 100% approval and zero average for a single approved pedido with zero budget', () => {
    const pedidos = [buildPedido({ presupuesto: 0, estado: 'aprobado' })]

    const [, , promedio, aprobacion] = PedidoService.getReportStats(pedidos)

    expect(promedio.value).toBe(0)
    expect(aprobacion.value).toBe(100)
  })

  it('does not count an estado outside the lifecycle as approved', () => {
    const pedidos = [
      buildPedido({ estado: 'Aprobado' as EstadoPedido }),
      buildPedido({ estado: 'aprobado' }),
    ]

    const [, , , aprobacion] = PedidoService.getReportStats(pedidos)

    expect(aprobacion.value).toBe(50)
  })
})

describe('PedidoService.filtrar', () => {
  const pedidos = [
    buildPedido({
      id: 'a',
      descripcion: 'Video unboxing',
      estado: 'solicitado',
      marcaId: 'marca-1',
      creadorId: 'creador-1',
      fechaSolicitud: '2026-08-01',
    }),
    buildPedido({
      id: 'b',
      descripcion: 'Reseña de producto',
      estado: 'aprobado',
      marcaId: 'marca-1',
      creadorId: null,
      fechaSolicitud: '2026-08-15',
    }),
    buildPedido({
      id: 'c',
      descripcion: 'VIDEO tutorial',
      estado: 'solicitado',
      marcaId: 'marca-2',
      creadorId: 'creador-2',
      fechaSolicitud: '2026-08-31',
    }),
  ]

  const ids = (resultado: PedidoInterface[]): string[] => resultado.map((pedido) => pedido.id)

  it('combines estado and marca filters', () => {
    const resultado = PedidoService.filtrar(pedidos, { estado: 'solicitado', marcaId: 'marca-1' })

    expect(ids(resultado)).toEqual(['a'])
  })

  it('returns every pedido when the filter is empty', () => {
    expect(ids(PedidoService.filtrar(pedidos, {}))).toEqual(['a', 'b', 'c'])
  })

  it('treats desde and hasta as inclusive bounds', () => {
    const resultado = PedidoService.filtrar(pedidos, { desde: '2026-08-01', hasta: '2026-08-31' })

    expect(ids(resultado)).toEqual(['a', 'b', 'c'])
  })

  it('matches a single day when desde equals hasta', () => {
    const resultado = PedidoService.filtrar(pedidos, { desde: '2026-08-15', hasta: '2026-08-15' })

    expect(ids(resultado)).toEqual(['b'])
  })

  it('matches texto case-insensitively after trimming', () => {
    const resultado = PedidoService.filtrar(pedidos, { texto: '  video ' })

    expect(ids(resultado)).toEqual(['a', 'c'])
  })

  it('ignores a texto made only of whitespace', () => {
    expect(ids(PedidoService.filtrar(pedidos, { texto: '   ' }))).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty list when desde is after hasta', () => {
    const resultado = PedidoService.filtrar(pedidos, { desde: '2026-08-31', hasta: '2026-08-01' })

    expect(resultado).toEqual([])
  })

  it('excludes pedidos without creador when filtering by creadorId', () => {
    const resultado = PedidoService.filtrar(pedidos, { creadorId: 'creador-1' })

    expect(ids(resultado)).toEqual(['a'])
  })

  it('does not mutate the input list', () => {
    const copia = [...pedidos]

    PedidoService.filtrar(pedidos, { estado: 'aprobado' })

    expect(pedidos).toEqual(copia)
  })
})

// Solo se verifican `mes`, `cantidad` y `presupuesto`: `etiqueta` sale de
// formatMonthLabel, cuyo resultado depende de la zona horaria (docs/findings-timezone.md).
describe('PedidoService.getPedidosPorMes', () => {
  const sinEtiqueta = (
    pedidos: PedidoInterface[],
  ): { mes: string; cantidad: number; presupuesto: number }[] =>
    PedidoService.getPedidosPorMes(pedidos).map(({ mes, cantidad, presupuesto }) => ({
      mes,
      cantidad,
      presupuesto,
    }))

  it('groups count and budget by month of fechaSolicitud', () => {
    const pedidos = [
      buildPedido({ fechaSolicitud: '2026-07-20', presupuesto: 500 }),
      buildPedido({ fechaSolicitud: '2026-08-05', presupuesto: 100 }),
      buildPedido({ fechaSolicitud: '2026-08-25', presupuesto: 250 }),
    ]

    expect(sinEtiqueta(pedidos)).toEqual([
      { mes: '2026-07', cantidad: 1, presupuesto: 500 },
      { mes: '2026-08', cantidad: 2, presupuesto: 350 },
    ])
  })

  it('groups the first and last day of a month together', () => {
    const pedidos = [
      buildPedido({ fechaSolicitud: '2026-01-01', presupuesto: 10 }),
      buildPedido({ fechaSolicitud: '2026-01-31', presupuesto: 20 }),
    ]

    expect(sinEtiqueta(pedidos)).toEqual([{ mes: '2026-01', cantidad: 2, presupuesto: 30 }])
  })

  it('sorts months chronologically across a year boundary regardless of input order', () => {
    const pedidos = [
      buildPedido({ fechaSolicitud: '2026-01-10' }),
      buildPedido({ fechaSolicitud: '2025-12-10' }),
      buildPedido({ fechaSolicitud: '2026-02-10' }),
    ]

    expect(sinEtiqueta(pedidos).map((fila) => fila.mes)).toEqual(['2025-12', '2026-01', '2026-02'])
  })

  it('returns an empty list when there are no pedidos', () => {
    expect(PedidoService.getPedidosPorMes([])).toEqual([])
  })

  it('sums an invalid negative presupuesto as-is, since validation lives in create and update', () => {
    const pedidos = [
      buildPedido({ fechaSolicitud: '2026-08-05', presupuesto: 300 }),
      buildPedido({ fechaSolicitud: '2026-08-06', presupuesto: -100 }),
    ]

    expect(sinEtiqueta(pedidos)).toEqual([{ mes: '2026-08', cantidad: 2, presupuesto: 200 }])
  })
})
