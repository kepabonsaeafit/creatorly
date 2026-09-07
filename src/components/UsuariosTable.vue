<script setup lang="ts">
// Gerónimo Montes

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { formatDate } from '@/utils/formatDate'

withDefaults(
  defineProps<{
    usuarios: UserInterface[]
    /** Id del User de la sesión activa: su fila no ofrece el botón de eliminar. */
    usuarioActualId?: string
  }>(),
  { usuarioActualId: '' },
)

const emit = defineEmits<{ editar: [id: string]; eliminar: [id: string] }>()

// functions
function onEliminar(id: string): void {
  if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
  emit('eliminar', id)
}
</script>

<template>
  <p v-if="usuarios.length === 0" class="usuarios-table__vacio">No hay usuarios registrados.</p>

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
      <tr v-for="usuario in usuarios" :key="usuario.id">
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.email }}</td>
        <td>
          <span class="usuarios-table__badge" :class="`usuarios-table__badge--${usuario.rol}`">
            {{ usuario.rol }}
          </span>
        </td>
        <td>{{ formatDate(usuario.createdAt) }}</td>
        <td class="usuarios-table__acciones">
          <button type="button" class="usuarios-table__editar" @click="emit('editar', usuario.id)">
            Editar
          </button>
          <button
            v-if="usuario.id !== usuarioActualId"
            type="button"
            class="usuarios-table__eliminar"
            @click="onEliminar(usuario.id)"
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
  color: #ffffff;
}

.usuarios-table__acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.usuarios-table__editar {
  border: none;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  font: inherit;
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
