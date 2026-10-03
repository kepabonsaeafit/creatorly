<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import CreatorForm from '@/components/CreatorForm.vue'
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import { CreatorService } from '@/services/CreatorService'

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
const error = ref('')
const saving = ref(false)

// functions
function onSubmit(creatorData: CreateCreatorDTO): void {
  error.value = ''
  saving.value = true
  try {
    CreatorService.create(creatorData)
    toast.success('Creator created successfully')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error
        ? caughtError.message
        : 'It was not possible to create the creator'
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
