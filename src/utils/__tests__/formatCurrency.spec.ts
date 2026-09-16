// Kevin Pabón

// external imports
import { describe, expect, it } from 'vitest'

// internal imports
import { formatCurrency } from '@/utils/formatCurrency'

// Intl separa el símbolo `$` del número con un espacio no separable (U+00A0),
// no con un espacio normal.
const NBSP = ' '

describe('formatCurrency', () => {
  it('formats a budget in Colombian pesos with dot thousands separators', () => {
    expect(formatCurrency(3200000)).toBe(`$${NBSP}3.200.000`)
  })

  it('uses a non-breaking space between the symbol and the amount', () => {
    expect(formatCurrency(3200000)).not.toBe('$ 3.200.000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe(`$${NBSP}0`)
  })

  it('formats negative amounts with a leading minus sign', () => {
    expect(formatCurrency(-3200000)).toBe(`-$${NBSP}3.200.000`)
  })

  it('adds the thousands separator starting at 1000', () => {
    expect(formatCurrency(999)).toBe(`$${NBSP}999`)
    expect(formatCurrency(1000)).toBe(`$${NBSP}1.000`)
  })

  it('rounds to whole pesos without decimals', () => {
    expect(formatCurrency(1500.5)).toBe(`$${NBSP}1.501`)
    expect(formatCurrency(2500.4)).toBe(`$${NBSP}2.500`)
  })

  it('renders NaN literally instead of throwing', () => {
    expect(formatCurrency(Number.NaN)).toBe(`$${NBSP}NaN`)
  })
})
