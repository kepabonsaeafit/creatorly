// Author: Kevin Pabón

// internal imports
import type { CalculatorOperator } from '~/types/CalculatorTypes'

export class CalculatorUtil {
  static readonly ERROR = 'Error'

  private static readonly OPERATIONS: Record<
    CalculatorOperator,
    (left: number, right: number) => number
  > = {
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '×': (left, right) => left * right,
    '÷': (left, right) => left / right,
  }

  static isOperator(key: string): key is CalculatorOperator {
    return key in CalculatorUtil.OPERATIONS
  }

  static appendKey(display: string, key: string): string {
    if (key === '.') {
      return display.includes('.') ? display : `${display}.`
    }

    return display === '0' ? key : display + key
  }

  static calculate(left: number, right: number, operator: CalculatorOperator): string {
    const result = CalculatorUtil.OPERATIONS[operator](left, right)
    if (!Number.isFinite(result)) {
      return CalculatorUtil.ERROR
    }

    // rounding to 10 decimals hides floating point noise such as 0.1 + 0.2
    return String(Math.round(result * 1e10) / 1e10)
  }
}
