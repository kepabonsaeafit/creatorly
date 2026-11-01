// Author: Kevin Pabón

/** An operation the calculator can apply between two numbers. */
export type CalculatorOperator = '+' | '-' | '×' | '÷'

export class CalculatorUtil {
  static readonly ERROR = 'Error'

  private static readonly OPERATORS: CalculatorOperator[] = ['+', '-', '×', '÷']

  /**
   * Tells whether a calculator key is an operator.
   * @param key - Key pressed on the calculator.
   * @returns `true` for `+`, `-`, `×` and `÷`.
   */
  static isOperator(key: string): key is CalculatorOperator {
    return (CalculatorUtil.OPERATORS as string[]).includes(key)
  }

  /**
   * Adds a digit or the decimal point to the number on the display.
   * @param display - Number currently on the display.
   * @param key - Digit from `0` to `9`, or `.`.
   * @returns The new number on the display.
   */
  static appendKey(display: string, key: string): string {
    if (key === '.') {
      return display.includes('.') ? display : `${display}.`
    }

    return display === '0' ? key : display + key
  }

  /**
   * Applies an operation without `eval`.
   * @param left - First number.
   * @param right - Second number.
   * @param operator - Operation to apply.
   * @returns The result as text, or `Error` when dividing by zero.
   */
  static calculate(left: number, right: number, operator: CalculatorOperator): string {
    if (operator === '÷' && right === 0) {
      return CalculatorUtil.ERROR
    }

    let result = 0
    if (operator === '+') {
      result = left + right
    } else if (operator === '-') {
      result = left - right
    } else if (operator === '×') {
      result = left * right
    } else {
      result = left / right
    }

    // rounding to 10 decimals hides floating point noise such as 0.1 + 0.2
    return String(Math.round(result * 1e10) / 1e10)
  }
}
