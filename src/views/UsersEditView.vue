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
    toast.success('Usuario actualizado correctamente')
    router.push({ name: 'users' })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'No fue posible actualizar el usuario'
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
  if (!confirmDeletion('usuario')) return
  try {
    UserService.validateDeletion(currentUser.value?.id, user.value.id)
    const removed = UserService.remove(user.value.id)
    if (removed) {
      toast.success('Usuario eliminado correctamente')
      router.push({ name: 'users' })
    } else {
      toast.error('No fue posible eliminar el usuario')
    }
  } catch (caughtError) {
    toast.error(
      caughtError instanceof Error ? caughtError.message : 'No fue posible eliminar el usuario',
    )
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="user">
      <h1>Editar usuario</h1>
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
        Eliminar usuario
      </button>
    </template>
    <p v-else class="edit-user__not-found">
      No se encontró un usuario con ese id.
      <RouterLink :to="{ name: 'users' }">Volver</RouterLink>
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
