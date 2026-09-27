<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import CreatorForm from '@/components/CreatorForm.vue'
import type { CreateCreatorDTO } from '@/dtos/CreateCreatorDTO'
import { CreatorService } from '@/services/CreatorService'

const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// functions
function onSubmit(creatorData: CreateCreatorDTO): void {
  error.value = ''
  saving.value = true
  try {
    CreatorService.create(creatorData)
    toast.success('Creador creado correctamente')
    router.push({ name: 'creadores' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'No fue posible crear el creador'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>Nuevo creador</h1>
    <CreatorForm :saving="saving" :error="error" @submit="onSubmit" />
  </main>
</template>
