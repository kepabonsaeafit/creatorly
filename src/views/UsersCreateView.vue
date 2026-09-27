<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UserForm from '@/components/UserForm.vue'
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import { UserService } from '@/services/UserService'

const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// functions
function onSubmit(userData: CreateUserDTO): void {
  error.value = ''
  saving.value = true
  try {
    UserService.create(userData)
    toast.success('Usuario creado correctamente')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'No fue posible crear el usuario'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>Nuevo usuario</h1>
    <UserForm :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
