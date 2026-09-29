// Author: Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'

export const useBrandStore = defineStore('brand', () => {
  const brands = ref<BrandInterface[]>([])
  return { brands }
})
