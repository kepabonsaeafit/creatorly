<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import CreadorForm from '@/components/CreadorForm.vue'
import type { CreateCreadorDTO } from '@/dtos/CreateCreadorDTO'
import { CreadorService } from '@/services/CreadorService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// computed variables
const creador = computed(() => CreadorService.getById(String(route.params.id)))

// functions
function onSubmit(datos: CreateCreadorDTO): void {
  if (!creador.value) return
  error.value = ''
  guardando.value = true
  try {
    CreadorService.update(creador.value.id, datos)
    toast.success('Creador actualizado correctamente')
    router.push({ name: 'creadores' })
  } catch (excepcion) {
    error.value =
      excepcion instanceof Error ? excepcion.message : 'No fue posible actualizar el creador'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}

function onEliminar(): void {
  if (!creador.value) return
  if (!confirm('¿Eliminar este creador? Esta acción no se puede deshacer.')) return
  const eliminado = CreadorService.remove(creador.value.id)
  if (eliminado) {
    toast.success('Creador eliminado correctamente')
    router.push({ name: 'creadores' })
  } else {
    toast.error('No fue posible eliminar el creador')
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="creador">
      <h1>Editar creador</h1>
      <CreadorForm
        modo-edicion
        :initial="creador"
        :guardando="guardando"
        :error="error"
        @submit="onSubmit"
      />
      <button type="button" class="edit-creador__eliminar" @click="onEliminar">
        Eliminar creador
      </button>
    </template>
    <p v-else class="edit-creador__no-encontrado">
      No se encontró un creador con ese id.
      <RouterLink :to="{ name: 'creadores' }">Volver</RouterLink>
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
