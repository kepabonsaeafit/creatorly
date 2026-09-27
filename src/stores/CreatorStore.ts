// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { CreatorInterface } from '@/interfaces/CreatorInterface'

export const useCreatorStore = defineStore('creator', () => {
  const creators = ref<CreatorInterface[]>([])
  return { creators }
})
