<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import CreatorsTable from '@/components/CreatorsTable.vue'
import type { CreatorFilterDTO } from '@/dtos/CreatorFilterDTO'
import { CreatorService } from '@/services/CreatorService'

const toast = useToast()

// selectors
const filters = reactive<Pick<CreatorFilterDTO, 'niche' | 'available'>>({
  niche: undefined,
  available: undefined,
})

// state
const text = ref('')

// computed variables
const niches = computed(() => CreatorService.getNiches())

const completeFilters = computed<CreatorFilterDTO>(() => ({ ...filters, text: text.value }))

const creators = computed(() => {
  const allCreators = CreatorService.getAll()
  return CreatorService.filter(allCreators, completeFilters.value)
})

// functions
function onDelete(id: string): void {
  const removed = CreatorService.remove(id)
  if (removed) {
    toast.success('Creador eliminado correctamente')
  } else {
    toast.error('No fue posible eliminar el creador')
  }
}

function clearFilters(): void {
  filters.niche = undefined
  filters.available = undefined
  text.value = ''
}
</script>

<template>
  <main class="Panel creadores">
    <div class="creadores__header">
      <h1>Creadores</h1>
      <RouterLink class="creadores__crear" :to="{ name: 'creadores.create' }">
        Nuevo creador
      </RouterLink>
    </div>

    <div class="creadores__filtros">
      <input
        v-model="text"
        class="creadores__filtro-input"
        type="search"
        placeholder="Buscar por nombre…"
      />

      <select v-model="filters.niche" class="creadores__filtro-input">
        <option :value="undefined">Todos los nichos</option>
        <option v-for="option in niches" :key="option" :value="option">{{ option }}</option>
      </select>

      <select v-model="filters.available" class="creadores__filtro-input">
        <option :value="undefined">Toda disponibilidad</option>
        <option :value="true">Disponibles</option>
        <option :value="false">No disponibles</option>
      </select>

      <button type="button" class="creadores__limpiar" @click="clearFilters">
        Limpiar filtros
      </button>
    </div>

    <CreatorsTable :creators="creators" actionable @delete="onDelete" />
  </main>
</template>

<style scoped>
.creadores__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.creadores__crear {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
}

.creadores__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.creadores__filtro-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.creadores__limpiar {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
