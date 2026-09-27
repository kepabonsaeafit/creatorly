<script setup lang="ts">
// Felipe Gómez

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import OrderForm from '@/components/OrderForm.vue'
import type { CreateOrderDTO } from '@/dtos/CreateOrderDTO'
import { OrderService } from '@/services/OrderService'

const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// functions
function onSubmit(orderData: CreateOrderDTO): void {
  error.value = ''
  saving.value = true
  try {
    OrderService.create(orderData)
    toast.success('Order created successfully')
    router.push({ name: 'orders' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'It was not possible to create the order'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>New order</h1>
    <OrderForm :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
