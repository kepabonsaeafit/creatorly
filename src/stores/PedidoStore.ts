// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { PedidoInterface } from '@/interfaces/PedidoInterface'

export const usePedidoStore = defineStore('pedido', () => {
  const pedidos = ref<PedidoInterface[]>([])
  return { pedidos }
})
