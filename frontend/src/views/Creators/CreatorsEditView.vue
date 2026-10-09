<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import { confirmDeletion } from '@/utils/confirmDeletion'
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import CreatorFormComponent from '@/components/CreatorFormComponent.vue'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'

// non-reactive variables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const creatorId = Number(route.params.id)

// reactive variables
const creator = ref<CreatorInterface | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)

// functions
onMounted(async (): Promise<void> => {
  try {
    creator.value = await CreatorService.getById(creatorId)
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the creator'))
  } finally {
    loading.value = false
  }
})

async function onSubmit(creatorData: CreateCreatorDTO): Promise<void> {
  error.value = ''
  saving.value = true

  try {
    await CreatorService.update(creatorId, creatorData)
    toast.success('Creator updated successfully')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(
      caughtError,
      'It was not possible to update the creator',
    )
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

async function onDelete(): Promise<void> {
  if (!confirmDeletion('creator')) return

  try {
    await CreatorService.remove(creatorId)
    toast.success('Creator deleted successfully')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    toast.error(
      AuthService.getErrorMessage(caughtError, 'It was not possible to delete the creator'),
    )
  }
}
</script>

<template>
  <main class="Panel">
    <p v-if="loading" class="edit-creator__loading">Loading creator…</p>
    <template v-else-if="creator">
      <h1>Edit creator</h1>
      <CreatorFormComponent
        edit-mode
        :initial="creator"
        :saving="saving"
        :error="error"
        @submit="onSubmit"
      />
      <button type="button" class="edit-creator__delete" @click="onDelete">Delete creator</button>
    </template>
    <p v-else class="edit-creator__not-found">
      No creator was found with that id.
      <RouterLink :to="{ name: 'creators' }">Go back</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-creator__loading {
  color: var(--color-text);
  opacity: 0.75;
}

.edit-creator__delete {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-creator__not-found {
  color: var(--color-text);
}
</style>
