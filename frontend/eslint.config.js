// Kevin Pabón

// external imports
import js from '@eslint/js'
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'

// Este archivo sigue en .js a propósito: ESLint 10 exige la librería `jiti` para
// cargar un eslint.config.ts, y `jiti` no está dentro de los paquetes autorizados
// del paso 1. La integración con TypeScript está completa igual (vueTsConfigs).

// Migración a TypeScript completa (paso 7): todas las SFCs usan
// <script setup lang="ts">, así que scriptLangs vuelve al default (['ts']).
configureVueProject({})

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
