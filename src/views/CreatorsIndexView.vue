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
  <main class="Panel creators">
    <div class="creators__header">
      <h1>Creadores</h1>
      <RouterLink class="creators__create" :to="{ name: 'creators.create' }">
        Nuevo creador
      </RouterLink>
    </div>

    <div class="creators__filters">
      <input
        v-model="text"
        class="creators__filter-input"
        type="search"
        placeholder="Buscar por nombre…"
      />

      <select v-model="filters.niche" class="creators__filter-input">
        <option :value="undefined">Todos los nichos</option>
        <option v-for="option in niches" :key="option" :value="option">{{ option }}</option>
      </select>

      <select v-model="filters.available" class="creators__filter-input">
        <option :value="undefined">Toda disponibilidad</option>
        <option :value="true">Disponibles</option>
        <option :value="false">No disponibles</option>
      </select>

      <button type="button" class="creators__clear" @click="clearFilters">Limpiar filtros</button>
    </div>

    <CreatorsTable :creators="creators" actionable @delete="onDelete" />
  </main>
</template>

<style scoped>
.creators__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.creators__create {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
}

.creators__filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.creators__filter-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.creators__clear {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
