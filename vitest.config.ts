// Kevin Pabón

// external imports
import { defineConfig, mergeConfig } from 'vitest/config'

// internal imports
import viteConfig from './vite.config'

// Hereda el alias `@` de vite.config.ts. Entorno node: las pruebas cubren
// funciones puras, sin DOM ni localStorage.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/__tests__/*.spec.ts'],
    },
  }),
)
