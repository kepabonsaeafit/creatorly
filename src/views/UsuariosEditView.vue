<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UsuarioForm from '@/components/UsuarioForm.vue'
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// computed variables
const usuario = computed(() => UserService.getById(String(route.params.id)))
const usuarioActual = computed(() => AuthService.getCurrentUser())

// functions
function onSubmit(datos: CreateUserDTO): void {
  if (!usuario.value) return
  error.value = ''
  guardando.value = true
  try {
    UserService.validarCambioDeRolPropio(usuarioActual.value?.id, usuario.value.id, datos.rol)
    UserService.update(usuario.value.id, datos)
    toast.success('Usuario actualizado correctamente')
    router.push({ name: 'usuarios' })
  } catch (excepcion) {
    error.value =
      excepcion instanceof Error ? excepcion.message : 'No fue posible actualizar el usuario'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}

function onCancelar(): void {
  router.push({ name: 'usuarios' })
}

function onEliminar(): void {
  if (!usuario.value) return
  if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
  try {
    UserService.validarEliminacion(usuarioActual.value?.id, usuario.value.id)
    const eliminado = UserService.remove(usuario.value.id)
    if (eliminado) {
      toast.success('Usuario eliminado correctamente')
      router.push({ name: 'usuarios' })
    } else {
      toast.error('No fue posible eliminar el usuario')
    }
  } catch (excepcion) {
    toast.error(
      excepcion instanceof Error ? excepcion.message : 'No fue posible eliminar el usuario',
    )
  }
}
</script>

<template>
  <main class="Panel">
    <template v-if="usuario">
      <h1>Editar usuario</h1>
      <UsuarioForm
        modo-edicion
        :initial="usuario"
        :guardando="guardando"
        :error="error"
        @submit="onSubmit"
        @cancelar="onCancelar"
      />
      <button type="button" class="edit-usuario__eliminar" @click="onEliminar">
        Eliminar usuario
      </button>
    </template>
    <p v-else class="edit-usuario__no-encontrado">
      No se encontró un usuario con ese id.
      <RouterLink :to="{ name: 'usuarios' }">Volver</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.edit-usuario__eliminar {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}

.edit-usuario__no-encontrado {
  color: var(--color-text);
}
</style>
