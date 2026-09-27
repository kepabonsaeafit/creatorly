<script setup lang="ts">
// Gerónimo Montes

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { confirmDeletion } from '@/utils/confirmDeletion'
import { formatDate } from '@/utils/formatDate'

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
  <p v-if="users.length === 0" class="usuarios-table__vacio">No hay usuarios registrados.</p>

  <table v-else class="usuarios-table">
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
          <span class="usuarios-table__badge" :class="`usuarios-table__badge--${user.role}`">
            {{ user.role }}
          </span>
        </td>
        <td>{{ formatDate(user.createdAt) }}</td>
        <td class="usuarios-table__acciones">
          <RouterLink :to="{ name: 'usuarios.edit', params: { id: user.id } }"> Editar </RouterLink>
          <button
            v-if="user.id !== currentUserId"
            type="button"
            class="usuarios-table__eliminar"
            @click="onDelete(user.id)"
          >
            Eliminar
          </button>
          <span v-else class="usuarios-table__sesion">Sesión actual</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.usuarios-table__vacio {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.usuarios-table th,
.usuarios-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.usuarios-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.usuarios-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.usuarios-table__badge--admin {
  background: var(--color-primary);
  color: var(--brand-white);
}

.usuarios-table__acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.usuarios-table__eliminar {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.usuarios-table__sesion {
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.85rem;
}
</style>
