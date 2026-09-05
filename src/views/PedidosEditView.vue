<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import PedidoForm from '@/components/PedidoForm.vue'
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import { PedidoService } from '@/services/PedidoService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// computed variables
const pedido = computed(() => PedidoService.getById(String(route.params.id)))

// functions
function onSubmit(datos: CreatePedidoDTO): void {
  if (!pedido.value) return
  error.value = ''
  guardando.value = true
  try {
    PedidoService.update(pedido.value.id, datos)
    toast.success('Pedido actualizado correctamente')
    router.push({ name: 'pedidos' })
  } catch (excepcion) {
    error.value =
      excepcion instanceof Error ? excepcion.message : 'No fue posible actualizar el pedido'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}

function onEliminar(): void {
  if (!pedido.value) return
  if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
  const eliminado = PedidoService.remove(pedido.value.id)
  if (eliminado) {
    toast.success('Pedido eliminado correctamente')
    router.push({ name: 'pedidos' })
  } else {
    toast.error('No fue posible eliminar el pedido')
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="pedido">
      <h1>Editar pedido</h1>
      <PedidoForm
        modo-edicion
        :initial="pedido"
        :guardando="guardando"
        :error="error"
        @submit="onSubmit"
      />
      <button type="button" class="edit-pedido__eliminar" @click="onEliminar">
        Eliminar pedido
      </button>
    </template>
    <p v-else class="edit-pedido__no-encontrado">
      No se encontró un pedido con ese id. <RouterLink :to="{ name: 'pedidos' }">Volver</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-pedido__eliminar {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-pedido__no-encontrado {
  color: var(--color-text);
}
</style>
