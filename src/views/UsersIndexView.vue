<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UsersTable from '@/components/UsersTable.vue'
import type { UserFilterDTO } from '@/dtos/UserFilterDTO'
import { resetDemoData } from '@/PiniaConfig'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { ROLE_LABELS, toSelectOptions } from '@/utils/labels'

const router = useRouter()
const toast = useToast()

// selectors
const filters = reactive<Pick<UserFilterDTO, 'role'>>({ role: undefined })

// state
const text = ref('')

// computed variables
const currentUser = computed(() => AuthService.getCurrentUser())
const roleOptions = computed(() => toSelectOptions(ROLE_LABELS))

const completeFilters = computed<UserFilterDTO>(() => ({ ...filters, text: text.value }))

const users = computed(() => {
  const allUsers = UserService.getAll()
  return UserService.filter(allUsers, completeFilters.value)
})

// functions
function clearFilters(): void {
  filters.role = undefined
  text.value = ''
}

function onDelete(id: string): void {
  try {
    UserService.validateDeletion(currentUser.value?.id, id)
    const removed = UserService.remove(id)
    if (removed) {
      toast.success('Usuario eliminado correctamente')
    } else {
      toast.error('No fue posible eliminar el usuario')
    }
  } catch (caughtError) {
    toast.error(
      caughtError instanceof Error ? caughtError.message : 'No fue posible eliminar el usuario',
    )
  }
}

function onResetDemo(): void {
  const message =
    '¿Restablecer los datos demo? Se borran creadores, marcas, pedidos y usuarios, ' +
    'se vuelve a sembrar y se cierra la sesión.'
  if (!confirm(message)) return
  resetDemoData()
  AuthService.logout()
  toast.success('Datos demo restablecidos: inicia sesión de nuevo')
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="Panel users">
    <div class="users__header">
      <h1>Usuarios</h1>
      <RouterLink class="users__create" :to="{ name: 'users.create' }"> Nuevo usuario </RouterLink>
    </div>

    <div class="users__filters">
      <input
        v-model="text"
        class="users__filter-input"
        type="search"
        placeholder="Buscar por nombre o email…"
      />

      <select v-model="filters.role" class="users__filter-input">
        <option :value="undefined">Todos los roles</option>
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <button type="button" class="users__clear" @click="clearFilters">Limpiar filtros</button>
    </div>

    <UsersTable :users="users" :current-user-id="currentUser?.id ?? ''" @delete="onDelete" />

    <section class="users__section">
      <h2 class="users__title">Datos demo</h2>
      <p class="users__demo-text">
        Borra todo lo guardado en el navegador y vuelve a sembrar los datos ficticios iniciales.
        Cierra la sesión, porque la siembra genera usuarios nuevos.
      </p>
      <button type="button" class="users__demo-button" @click="onResetDemo">
        Restablecer datos demo
      </button>
    </section>
  </main>
</template>

<style scoped>
.users__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.users__create {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
}

.users__filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.users__filter-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.users__clear {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.users__section {
  margin-top: 2rem;
}

.users__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.users__demo-text {
  color: var(--color-text);
  opacity: 0.8;
  max-width: 52ch;
  margin-bottom: 1rem;
}

.users__demo-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}
</style>
