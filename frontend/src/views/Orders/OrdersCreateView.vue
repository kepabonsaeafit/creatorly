<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { BrandService } from '@/services/BrandService'
import type { CreateOrderDTO } from '@/dtos/Orders/CreateOrderDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'
import OrderFormComponent from '@/components/OrderFormComponent.vue'
import { OrderService } from '@/services/OrderService'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
const brands = ref<BrandInterface[]>([])
const creators = ref<CreatorInterface[]>([])
const users = ref<UserInterface[]>([])
const error = ref('')
const saving = ref(false)

// functions
onMounted(async (): Promise<void> => {
  try {
    const [loadedBrands, loadedCreators, loadedUsers] = await Promise.all([
      BrandService.getAll(),
      CreatorService.getAll(),
      UserService.getAll(),
    ])

    brands.value = loadedBrands
    creators.value = loadedCreators
    users.value = loadedUsers
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the form'))
  }
})

async function onSubmit(orderData: CreateOrderDTO): Promise<void> {
  error.value = ''
  saving.value = true

  try {
    await OrderService.create(orderData)
    toast.success('Order created successfully')
    router.push({ name: 'orders' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(
      caughtError,
      'It was not possible to create the order',
    )
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>New order</h1>
    <OrderFormComponent
      :brands="brands"
      :creators="creators"
      :users="users"
      :saving="saving"
      :error="error"
      @submit="onSubmit"
    />
  </main>
</template>
