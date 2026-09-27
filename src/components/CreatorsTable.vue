<script setup lang="ts">
// Gerónimo Montes

// internal imports
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { confirmDeletion } from '@/utils/confirmDeletion'
import { formatCurrency } from '@/utils/formatCurrency'

withDefaults(defineProps<{ creators: CreatorInterface[]; actionable?: boolean }>(), {
  actionable: false,
})

const emit = defineEmits<{ delete: [id: string] }>()

// functions
function onDelete(id: string): void {
  if (!confirmDeletion('creator')) return
  emit('delete', id)
}
</script>

<template>
  <p v-if="creators.length === 0" class="creators-table__empty">No creators match these filters.</p>

  <table v-else class="creators-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Niche</th>
        <th>Content type</th>
        <th>Rate</th>
        <th>Availability</th>
        <th v-if="actionable"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="creator in creators" :key="creator.id">
        <td>{{ creator.name }}</td>
        <td>{{ creator.niche }}</td>
        <td>{{ creator.contentType }}</td>
        <td>{{ formatCurrency(creator.rate) }}</td>
        <td>
          <span
            class="creators-table__badge"
            :class="creator.available ? 'creators-table__badge--available' : ''"
          >
            {{ creator.available ? 'Available' : 'Not available' }}
          </span>
        </td>
        <td v-if="actionable" class="creators-table__actions">
          <RouterLink :to="{ name: 'creators.edit', params: { id: creator.id } }">
            Edit
          </RouterLink>
          <button type="button" class="creators-table__delete" @click="onDelete(creator.id)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.creators-table__empty {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.creators-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.creators-table th,
.creators-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.creators-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.creators-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.creators-table__badge--available {
  background: var(--color-success);
  color: var(--brand-white);
}

.creators-table__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.creators-table__delete {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}
</style>
