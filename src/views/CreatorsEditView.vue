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
    toast.success('Creador actualizado correctamente')
    router.push({ name: 'creators' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'No fue posible actualizar el creador'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

function onDelete(): void {
  if (!creator.value) return
  if (!confirmDeletion('creador')) return
  const removed = CreatorService.remove(creator.value.id)
  if (removed) {
    toast.success('Creador eliminado correctamente')
    router.push({ name: 'creators' })
  } else {
    toast.error('No fue posible eliminar el creador')
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="creator">
      <h1>Editar creador</h1>
      <CreatorForm
        edit-mode
        :initial="creator"
        :saving="saving"
        :error="error"
        @submit="onSubmit"
      />
      <button type="button" class="edit-creador__eliminar" @click="onDelete">
        Eliminar creador
      </button>
    </template>
    <p v-else class="edit-creador__no-encontrado">
      No se encontró un creador con ese id.
      <RouterLink :to="{ name: 'creators' }">Volver</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-creador__eliminar {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-creador__no-encontrado {
  color: var(--color-text);
}
</style>
