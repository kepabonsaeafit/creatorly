<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import CreatorForm from '@/components/CreatorForm.vue'
import { CreatorService } from '@/services/CreatorService'

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
const error = ref('')
const saving = ref(false)

// functions
async function onSubmit(creatorData: CreateCreatorDTO): Promise<void> {
  error.value = ''
  saving.value = true

  try {
    await CreatorService.create(creatorData)
    toast.success('Creator created successfully')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(
      caughtError,
      'It was not possible to create the creator',
    )
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>New creator</h1>
    <CreatorForm :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
