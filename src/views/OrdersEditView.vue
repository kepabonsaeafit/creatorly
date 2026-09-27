<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import OrderForm from '@/components/OrderForm.vue'
import type { CreateOrderDTO } from '@/dtos/CreateOrderDTO'
import { OrderService } from '@/services/OrderService'
import { confirmDeletion } from '@/utils/confirmDeletion'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// computed variables
const order = computed(() => OrderService.getById(String(route.params.id)))

// functions
function onSubmit(orderData: CreateOrderDTO): void {
  if (!order.value) return
  error.value = ''
  saving.value = true
  try {
    OrderService.update(order.value.id, orderData)
    toast.success('Pedido actualizado correctamente')
    router.push({ name: 'orders' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'No fue posible actualizar el pedido'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

function onDelete(): void {
  if (!order.value) return
  if (!confirmDeletion('pedido')) return
  const removed = OrderService.remove(order.value.id)
  if (removed) {
    toast.success('Pedido eliminado correctamente')
    router.push({ name: 'orders' })
  } else {
    toast.error('No fue posible eliminar el pedido')
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="order">
      <h1>Editar pedido</h1>
      <OrderForm edit-mode :initial="order" :saving="saving" :error="error" @submit="onSubmit" />
      <button type="button" class="edit-order__delete" @click="onDelete">Eliminar pedido</button>
    </template>
    <p v-else class="edit-order__not-found">
      No se encontró un pedido con ese id. <RouterLink :to="{ name: 'orders' }">Volver</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-order__delete {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-order__not-found {
  color: var(--color-text);
}
</style>
