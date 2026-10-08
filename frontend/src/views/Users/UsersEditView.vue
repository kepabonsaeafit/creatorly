<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UserForm from '@/components/UserForm.vue'
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import type { UserInterface } from '@/interfaces/UserInterface'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { confirmDeletion } from '@/utils/confirmDeletion'

// non-reactive variables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userId = Number(route.params.id)

// reactive variables
const user = ref<UserInterface | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)

// computed variables
const currentUser = computed(() => AuthService.getCurrentUser())

// functions
onMounted(async () => {
  try {
    user.value = await UserService.getById(userId)
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the user'))
  } finally {
    loading.value = false
  }
})

async function onSubmit(userData: CreateUserDTO): Promise<void> {
  error.value = ''
  saving.value = true

  // The API never returns the password, so an empty field means "keep the
  // current one" and is left out of the payload instead of being sent blank.
  const changes: Partial<CreateUserDTO> = { ...userData }

  if (!changes.password) delete changes.password

  try {
    await UserService.update(userId, changes)
    toast.success('User updated successfully')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value = AuthService.getErrorMessage(caughtError, 'It was not possible to update the user')
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

function onCancel(): void {
  router.push({ name: 'users' })
}

async function onDelete(): Promise<void> {
  if (!confirmDeletion('user')) return

  try {
    await UserService.remove(userId)
    toast.success('User deleted successfully')
    router.push({ name: 'users' })
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to delete the user'))
  }
}
</script>

<template>
  <main class="Panel">
    <p v-if="loading" class="edit-user__loading">Loading user…</p>
    <template v-else-if="user">
      <h1>Edit user</h1>
      <UserForm
        edit-mode
        :initial="user"
        :saving="saving"
        :error="error"
        @submit="onSubmit"
        @cancel="onCancel"
      />
      <button
        v-if="user.id !== currentUser?.id"
        type="button"
        class="edit-user__delete"
        @click="onDelete"
      >
        Delete user
      </button>
    </template>
    <p v-else class="edit-user__not-found">
      No user was found with that id.
      <RouterLink :to="{ name: 'users' }">Go back</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-user__loading {
  color: var(--color-text);
  opacity: 0.75;
}

.edit-user__delete {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-user__not-found {
  color: var(--color-text);
}
</style>
