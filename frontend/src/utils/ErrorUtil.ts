// Author: Kevin Pabón

// external imports
import axios from 'axios'

export class ErrorUtil {
  /**
   * Reads the backend error message out of a failed request, to show it in a toast.
   * @param caughtError - Error caught from an axios call.
   * @param fallback - Message to use when the API sent none.
   * @returns The message to display.
   */
  static getMessage(caughtError: unknown, fallback: string): string {
    if (axios.isAxiosError(caughtError)) {
      const message = caughtError.response?.data?.message

      if (Array.isArray(message)) return message.join(', ')
      if (typeof message === 'string') return message
    }

    return fallback
  }
}
