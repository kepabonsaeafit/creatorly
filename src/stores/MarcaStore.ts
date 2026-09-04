// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { MarcaInterface } from '@/interfaces/MarcaInterface'

export const useMarcaStore = defineStore('marca', () => {
  const marcas = ref<MarcaInterface[]>([])
  return { marcas }
})
