<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import type { CreatorFilterDTO } from '@/dtos/Creators/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'
import CreatorsTableComponent from '@/components/CreatorsTableComponent.vue'
import { ErrorUtil } from '@/utils/ErrorUtil'
import type { SelectOptionInterface } from '@/interfaces/SelectOptionInterface'
import { StringUtil } from '@/utils/StringUtil'

// non-reactive variables
const toast = useToast()

// reactive variables
const allCreators = ref<CreatorInterface[]>([])
const text = ref('')
const loading = ref(true)
const filters = reactive<Pick<CreatorFilterDTO, 'niche' | 'available'>>({
  niche: undefined,
  available: undefined,
})

// selectors
const selectorNiches = computed(() =>
  CreatorService.getNiches(allCreators.value).map((niche: string): SelectOptionInterface => ({
    value: niche,
    label: StringUtil.capitalize(niche),
  })),
)

const selectorAvailability: SelectOptionInterface<boolean>[] = [
  { value: true, label: 'Available' },
  { value: false, label: 'Not available' },
]

// computed variables
const completeFilters = computed<CreatorFilterDTO>(() => ({ ...filters, text: text.value }))

const creators = computed(() => CreatorService.filter(allCreators.value, completeFilters.value))

// functions
async function loadCreators(): Promise<void> {
  try {
    allCreators.value = await CreatorService.getAll()
  } catch (caughtError) {
    toast.error(ErrorUtil.getMessage(caughtError, 'It was not possible to load the creators'))
  } finally {
    loading.value = false
  }
}

onMounted(loadCreators)

async function onDelete(id: number): Promise<void> {
  try {
    await CreatorService.remove(id)
    toast.success('Creator deleted successfully')
    await loadCreators()
  } catch (caughtError) {
    toast.error(ErrorUtil.getMessage(caughtError, 'It was not possible to delete the creator'))
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
      <h1>Creators</h1>
      <RouterLink class="creators__create" :to="{ name: 'creators.create' }">
        New creator
      </RouterLink>
    </div>

    <div class="creators__filters">
      <input
        v-model="text"
        class="creators__filter-input"
        type="search"
        placeholder="Search by name…"
      />

      <select v-model="filters.niche" class="creators__filter-input">
        <option :value="undefined">All niches</option>
        <option v-for="option in selectorNiches" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <select v-model="filters.available" class="creators__filter-input">
        <option :value="undefined">Any availability</option>
        <option v-for="option in selectorAvailability" :key="option.label" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <button type="button" class="creators__clear" @click="clearFilters">Clear filters</button>
    </div>

    <p v-if="loading" class="creators__loading">Loading creators…</p>

    <CreatorsTableComponent v-else :creators="creators" actionable @delete="onDelete" />
  </main>
</template>

<style scoped>
.creators__loading {
  color: var(--color-text);
  opacity: 0.75;
}

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
