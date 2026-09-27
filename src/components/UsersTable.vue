<script setup lang="ts">
// Gerónimo Montes

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { confirmDeletion } from '@/utils/confirmDeletion'
import { formatDate } from '@/utils/formatDate'
import { formatRole } from '@/utils/labels'

withDefaults(
  defineProps<{
    users: UserInterface[]
    /** Id del User de la sesión activa: su fila no ofrece el botón de eliminar. */
    currentUserId?: string
  }>(),
  { currentUserId: '' },
)

const emit = defineEmits<{ delete: [id: string] }>()

// functions
function onDelete(id: string): void {
  if (!confirmDeletion('usuario')) return
  emit('delete', id)
}
</script>

<template>
  <p v-if="users.length === 0" class="users-table__empty">No hay usuarios registrados.</p>

  <table v-else class="users-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Creado</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          <span class="users-table__badge" :class="`users-table__badge--${user.role}`">
            {{ formatRole(user.role) }}
          </span>
        </td>
        <td>{{ formatDate(user.createdAt) }}</td>
        <td class="users-table__actions">
          <RouterLink :to="{ name: 'users.edit', params: { id: user.id } }"> Editar </RouterLink>
          <button
            v-if="user.id !== currentUserId"
            type="button"
            class="users-table__delete"
            @click="onDelete(user.id)"
          >
            Eliminar
          </button>
          <span v-else class="users-table__session">Sesión actual</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.users-table__empty {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.users-table th,
.users-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.users-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.users-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.users-table__badge--admin {
  background: var(--color-primary);
  color: var(--brand-white);
}

.users-table__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.users-table__delete {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.users-table__session {
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.85rem;
}
</style>
