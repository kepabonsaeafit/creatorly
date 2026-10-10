// Author: Felipe Gómez

// external imports
import axios from 'axios'

/**
 * GETs a single resource; the API answers 404 when no row has that id, which
 * the edit views treat as "not found" rather than as an error.
 * @param url - Full URL of the resource, e.g. `.../api/orders/7`.
 * @returns The resource, or `null` on a 404.
 * @throws {AxiosError} On any other failure (401, 500, network...).
 */
export async function getOrNull<T>(url: string): Promise<T | null> {
  try {
    const { data } = await axios.get<T>(url)

    return data
  } catch (caughtError) {
    if (axios.isAxiosError(caughtError) && caughtError.response?.status === 404) return null

    throw caughtError
  }
}
