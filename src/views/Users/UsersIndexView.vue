<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UsersTable from '@/components/UsersTable.vue'
import type { UserFilterDTO } from '@/dtos/Users/UserFilterDTO'
import { resetDemoData } from '@/PiniaConfig'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { ROLE_LABELS, toSelectOptions } from '@/utils/labels'

// selectors
const filters = reactive<Pick<UserFilterDTO, 'role'>>({ role: undefined })

// non-reactive variables
const router = useRouter()
const toast = useToast()

// reactive variables
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
      toast.success('User deleted successfully')
    } else {
      toast.error('It was not possible to delete the user')
    }
  } catch (caughtError) {
    toast.error(
      caughtError instanceof Error ? caughtError.message : 'It was not possible to delete the user',
    )
  }
}

function onResetDemo(): void {
  const message =
    'Reset demo data? This deletes creators, brands, orders and users, ' +
    'reseeds them, and logs you out.'
  if (!confirm(message)) return
  resetDemoData()
  AuthService.logout()
  toast.success('Demo data reset: please log in again')
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="Panel users">
    <div class="users__header">
      <h1>Users</h1>
      <RouterLink class="users__create" :to="{ name: 'users.create' }"> New user </RouterLink>
    </div>

    <div class="users__filters">
      <input
        v-model="text"
        class="users__filter-input"
        type="search"
        placeholder="Search by name or email…"
      />

      <select v-model="filters.role" class="users__filter-input">
        <option :value="undefined">All roles</option>
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <button type="button" class="users__clear" @click="clearFilters">Clear filters</button>
    </div>

    <UsersTable :users="users" :current-user-id="currentUser?.id ?? ''" @delete="onDelete" />

    <section class="users__section">
      <h2 class="users__title">Demo data</h2>
      <p class="users__demo-text">
        Deletes everything stored in the browser and reseeds the initial demo data. Logs you out,
        because the seeding creates new users.
      </p>
      <button type="button" class="users__demo-button" @click="onResetDemo">Reset demo data</button>
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
