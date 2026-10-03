<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UserForm from '@/components/UserForm.vue'
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import { UserService } from '@/services/UserService'

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
const error = ref('')
const saving = ref(false)

// functions
function onSubmit(userData: CreateUserDTO): void {
  error.value = ''
  saving.value = true
  try {
    UserService.create(userData)
    toast.success('User created successfully')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'It was not possible to create the user'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>New user</h1>
    <UserForm :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
