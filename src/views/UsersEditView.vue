<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UserForm from '@/components/UserForm.vue'
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { confirmDeletion } from '@/utils/confirmDeletion'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// state
const error = ref('')
const saving = ref(false)

// computed variables
const user = computed(() => UserService.getById(String(route.params.id)))
const currentUser = computed(() => AuthService.getCurrentUser())

// functions
function onSubmit(userData: CreateUserDTO): void {
  if (!user.value) return
  error.value = ''
  saving.value = true
  try {
    UserService.validateOwnRoleChange(currentUser.value?.id, user.value.id, userData.role)
    UserService.update(user.value.id, userData)
    toast.success('User updated successfully')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'It was not possible to update the user'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

function onCancel(): void {
  router.push({ name: 'users' })
}

function onDelete(): void {
  if (!user.value) return
  if (!confirmDeletion('user')) return
  try {
    UserService.validateDeletion(currentUser.value?.id, user.value.id)
    const removed = UserService.remove(user.value.id)
    if (removed) {
      toast.success('User deleted successfully')
      router.push({ name: 'users' })
    } else {
      toast.error('It was not possible to delete the user')
    }
  } catch (caughtError) {
    toast.error(
      caughtError instanceof Error ? caughtError.message : 'It was not possible to delete the user',
    )
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="user">
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
