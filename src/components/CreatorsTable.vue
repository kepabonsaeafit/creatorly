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
  if (!confirmDeletion('creador')) return
  emit('delete', id)
}
</script>

<template>
  <p v-if="creators.length === 0" class="creadores-table__vacio">
    No hay creadores que coincidan con estos filtros.
  </p>

  <table v-else class="creadores-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Nicho</th>
        <th>Tipo de contenido</th>
        <th>Tarifa</th>
        <th>Disponibilidad</th>
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
            class="creadores-table__badge"
            :class="creator.available ? 'creadores-table__badge--disponible' : ''"
          >
            {{ creator.available ? 'Disponible' : 'No disponible' }}
          </span>
        </td>
        <td v-if="actionable" class="creadores-table__acciones">
          <RouterLink :to="{ name: 'creators.edit', params: { id: creator.id } }">
            Editar
          </RouterLink>
          <button type="button" class="creadores-table__eliminar" @click="onDelete(creator.id)">
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.creadores-table__vacio {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.creadores-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.creadores-table th,
.creadores-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.creadores-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.creadores-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.creadores-table__badge--disponible {
  background: var(--color-success);
  color: var(--brand-white);
}

.creadores-table__acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.creadores-table__eliminar {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}
</style>
