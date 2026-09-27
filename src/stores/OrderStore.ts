// Author: Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { OrderInterface } from '@/interfaces/OrderInterface'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<OrderInterface[]>([])
  return { orders }
})
