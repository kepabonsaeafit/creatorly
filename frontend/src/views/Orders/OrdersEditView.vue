<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { BrandService } from '@/services/BrandService'
import { confirmDeletion } from '@/utils/confirmDeletion'
import type { CreateOrderDTO } from '@/dtos/Orders/CreateOrderDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'
import OrderFormComponent from '@/components/OrderFormComponent.vue'
import type { OrderInterface } from '@/interfaces/OrderInterface'
import { OrderService } from '@/services/OrderService'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'

// non-reactive variables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const orderId = Number(route.params.id)

// reactive variables
const order = ref<OrderInterface | null>(null)
const brands = ref<BrandInterface[]>([])
const creators = ref<CreatorInterface[]>([])
const users = ref<UserInterface[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)

// functions
onMounted(async (): Promise<void> => {
  try {
    const [loadedOrder, loadedBrands, loadedCreators, loadedUsers] = await Promise.all([
      OrderService.getById(orderId),
      BrandService.getAll(),
      CreatorService.getAll(),
      UserService.getAll(),
    ])

    order.value = loadedOrder
    brands.value = loadedBrands
    creators.value = loadedCreators
    users.value = loadedUsers
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the order'))
  } finally {
    loading.value = false
  }
})

async function onSubmit(orderData: CreateOrderDTO): Promise<void> {
  error.value = ''
  saving.value = true

  try {
    await OrderService.update(orderId, orderData)
    toast.success('Order updated successfully')
    router.push({ name: 'orders' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(
      caughtError,
      'It was not possible to update the order',
    )
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

async function onDelete(): Promise<void> {
  if (!confirmDeletion('order')) return

  try {
    await OrderService.remove(orderId)
    toast.success('Order deleted successfully')
    router.push({ name: 'orders' })
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to delete the order'))
  }
}
</script>

<template>
  <main class="Panel">
    <p v-if="loading" class="edit-order__loading">Loading order…</p>
    <template v-else-if="order">
      <h1>Edit order</h1>
      <OrderFormComponent
        edit-mode
        :initial="order"
        :brands="brands"
        :creators="creators"
        :users="users"
        :saving="saving"
        :error="error"
        @submit="onSubmit"
      />
      <button type="button" class="edit-order__delete" @click="onDelete">Delete order</button>
    </template>
    <p v-else class="edit-order__not-found">
      No order was found with that id. <RouterLink :to="{ name: 'orders' }">Go back</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-order__loading {
  color: var(--color-text);
  opacity: 0.75;
}

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
