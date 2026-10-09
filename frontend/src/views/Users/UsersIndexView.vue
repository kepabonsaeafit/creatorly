<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import { ROLE_LABELS, toSelectOptions } from '@/utils/labels'
import type { UserFilterDTO } from '@/dtos/Users/UserFilterDTO'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'
import UsersTableComponent from '@/components/UsersTableComponent.vue'

// non-reactive variables
const toast = useToast()

// reactive variables
const allUsers = ref<UserInterface[]>([])
const text = ref('')

// selectors
const filters = reactive<Pick<UserFilterDTO, 'role'>>({ role: undefined })

// computed variables
const currentUser = computed(() => AuthService.getCurrentUser())
const roleOptions = computed(() => toSelectOptions(ROLE_LABELS))

const completeFilters = computed<UserFilterDTO>(() => ({ ...filters, text: text.value }))

const users = computed(() => UserService.filter(allUsers.value, completeFilters.value))

// functions
async function loadUsers(): Promise<void> {
  try {
    allUsers.value = await UserService.getAll()
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the users'))
  }
}

onMounted(loadUsers)

function clearFilters(): void {
  filters.role = undefined
  text.value = ''
}

async function onDelete(id: number): Promise<void> {
  try {
    await UserService.remove(id)
    toast.success('User deleted successfully')
    await loadUsers()
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to delete the user'))
  }
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

    <UsersTableComponent
      :users="users"
      :current-user-id="currentUser?.id ?? null"
      @delete="onDelete"
    />
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
</style>
