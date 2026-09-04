// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'

export const useCreadorStore = defineStore('creador', () => {
  const creadores = ref<CreadorInterface[]>([])
  return { creadores }
})
