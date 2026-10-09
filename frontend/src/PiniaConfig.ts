// Author: Kevin Pabón

// external imports
import { createPinia, type Pinia } from 'pinia'

export class PiniaConfig {
  /**
   * Creates the Pinia instance the app installs. Since ADR-0005 it neither
   * seeds nor hydrates anything: the data lives in the backend.
   * @returns The Pinia instance.
   */
  static init(): Pinia {
    return createPinia()
  }
}
