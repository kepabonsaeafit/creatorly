<script setup lang="ts">
// Felipe Gómez

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import PedidoForm from '@/components/PedidoForm.vue'
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import { PedidoService } from '@/services/PedidoService'

const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// functions
function onSubmit(datos: CreatePedidoDTO): void {
  error.value = ''
  guardando.value = true
  try {
    PedidoService.create(datos)
    toast.success('Pedido creado correctamente')
    router.push({ name: 'pedidos' })
  } catch (excepcion) {
    error.value = excepcion instanceof Error ? excepcion.message : 'No fue posible crear el pedido'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>Nuevo pedido</h1>
    <PedidoForm :guardando="guardando" :error="error" @submit="onSubmit" />
  </main>
</template>
