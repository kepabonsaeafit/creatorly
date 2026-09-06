<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import UsuarioForm from '@/components/UsuarioForm.vue'
import UsuariosTable from '@/components/UsuariosTable.vue'
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'

const toast = useToast()

// selectors
// /usuarios es una ruta única (no hay /usuarios/:id), así que crear y editar
// se resuelven en esta misma vista: este id decide en qué modo está el formulario.
const usuarioEditandoId = ref<string | null>(null)
const error = ref('')
const guardando = ref(false)

// computed variables
const usuarios = computed(() =>
  [...UserService.getAll()].sort((primero, segundo) =>
    primero.nombre.localeCompare(segundo.nombre),
  ),
)

const usuarioEnEdicion = computed(() =>
  usuarioEditandoId.value ? UserService.getById(usuarioEditandoId.value) : undefined,
)

const usuarioActual = computed(() => AuthService.getCurrentUser())

const editandoSesionActual = computed(
  () =>
    usuarioEnEdicion.value !== undefined && usuarioEnEdicion.value.id === usuarioActual.value?.id,
)

// functions
function onEditar(id: string): void {
  error.value = ''
  usuarioEditandoId.value = id
}

function onCancelar(): void {
  error.value = ''
  usuarioEditandoId.value = null
}

function onSubmit(datos: CreateUserDTO): void {
  error.value = ''

  // La siembra trae un solo admin: si se quitara el rol a sí mismo perdería el
  // acceso a esta página y no habría forma de devolvérselo desde la interfaz.
  if (editandoSesionActual.value && datos.rol !== 'admin') {
    error.value = 'No puedes quitarte el rol de admin mientras es tu propia sesión'
    toast.error(error.value)
    return
  }

  guardando.value = true
  try {
    if (usuarioEnEdicion.value) {
      UserService.update(usuarioEnEdicion.value.id, datos)
      toast.success('Usuario actualizado correctamente')
    } else {
      UserService.create(datos)
      toast.success('Usuario creado correctamente')
    }
    usuarioEditandoId.value = null
  } catch (excepcion) {
    error.value =
      excepcion instanceof Error ? excepcion.message : 'No fue posible guardar el usuario'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}

function onEliminar(id: string): void {
  if (id === usuarioActual.value?.id) {
    toast.error('No puedes eliminar el usuario con el que iniciaste sesión')
    return
  }
  const eliminado = UserService.remove(id)
  if (eliminado) {
    if (usuarioEditandoId.value === id) usuarioEditandoId.value = null
    toast.success('Usuario eliminado correctamente')
  } else {
    toast.error('No fue posible eliminar el usuario')
  }
}
</script>

<template>
  <main class="Panel usuarios">
    <h1>Usuarios</h1>

    <section class="usuarios__seccion">
      <h2 class="usuarios__titulo">
        {{ usuarioEnEdicion ? `Editar a ${usuarioEnEdicion.nombre}` : 'Nuevo usuario' }}
      </h2>
      <!-- El key remonta el formulario al cambiar de usuario: sus campos se
           inicializan desde `initial` una sola vez, igual que PedidoForm. -->
      <UsuarioForm
        :key="usuarioEditandoId ?? 'nuevo'"
        :initial="usuarioEnEdicion ?? {}"
        :modo-edicion="usuarioEnEdicion !== undefined"
        :guardando="guardando"
        :error="error"
        @submit="onSubmit"
        @cancelar="onCancelar"
      />
    </section>

    <section class="usuarios__seccion">
      <h2 class="usuarios__titulo">Usuarios registrados</h2>
      <UsuariosTable
        :usuarios="usuarios"
        :usuario-actual-id="usuarioActual?.id ?? ''"
        @editar="onEditar"
        @eliminar="onEliminar"
      />
    </section>
  </main>
</template>

<style scoped>
.usuarios__seccion {
  margin-top: 2rem;
}

.usuarios__titulo {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}
</style>
