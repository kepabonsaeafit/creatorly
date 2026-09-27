<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import CreatorForm from '@/components/CreatorForm.vue'
import type { CreateCreatorDTO } from '@/dtos/CreateCreatorDTO'
import { CreatorService } from '@/services/CreatorService'
import { confirmDeletion } from '@/utils/confirmDeletion'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// computed variables
const creator = computed(() => CreatorService.getById(String(route.params.id)))

// functions
function onSubmit(creatorData: CreateCreatorDTO): void {
  if (!creator.value) return
  error.value = ''
  saving.value = true
  try {
    CreatorService.update(creator.value.id, creatorData)
    toast.success('Creator updated successfully')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error
        ? caughtError.message
        : 'It was not possible to update the creator'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

function onDelete(): void {
  if (!creator.value) return
  if (!confirmDeletion('creator')) return
  const removed = CreatorService.remove(creator.value.id)
  if (removed) {
    toast.success('Creator deleted successfully')
    router.push({ name: 'creators' })
  } else {
    toast.error('It was not possible to delete the creator')
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="creator">
      <h1>Edit creator</h1>
      <CreatorForm
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
