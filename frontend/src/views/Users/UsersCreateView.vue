<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import UserFormComponent from '@/components/UserFormComponent.vue'
import { UserService } from '@/services/UserService'

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
const error = ref('')
const saving = ref(false)

// functions
async function onSubmit(userData: CreateUserDTO): Promise<void> {
  error.value = ''
  saving.value = true

  try {
    await UserService.create(userData)
    toast.success('User created successfully')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(caughtError, 'It was not possible to create the user')
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>New user</h1>
    <UserFormComponent :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
