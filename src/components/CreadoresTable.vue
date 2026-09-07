<script setup lang="ts">
// Gerónimo Montes

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import { formatCurrency } from '@/utils/formatCurrency'

withDefaults(defineProps<{ creadores: CreadorInterface[]; accionable?: boolean }>(), {
  accionable: false,
})

const emit = defineEmits<{ eliminar: [id: string] }>()

// functions
function onEliminar(id: string): void {
  if (!confirm('¿Eliminar este creador? Esta acción no se puede deshacer.')) return
  emit('eliminar', id)
}
</script>

<template>
  <p v-if="creadores.length === 0" class="creadores-table__vacio">
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
        <th v-if="accionable"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="creador in creadores" :key="creador.id">
        <td>{{ creador.nombre }}</td>
        <td>{{ creador.nicho }}</td>
        <td>{{ creador.tipoContenido }}</td>
        <td>{{ formatCurrency(creador.tarifa) }}</td>
        <td>
          <span
            class="creadores-table__badge"
            :class="creador.disponible ? 'creadores-table__badge--disponible' : ''"
          >
            {{ creador.disponible ? 'Disponible' : 'No disponible' }}
          </span>
        </td>
        <td v-if="accionable" class="creadores-table__acciones">
          <RouterLink :to="{ name: 'creadores.edit', params: { id: creador.id } }">
            Editar
          </RouterLink>
          <button type="button" class="creadores-table__eliminar" @click="onEliminar(creador.id)">
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
  color: #ffffff;
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
