<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UsuariosTable from '@/components/UsuariosTable.vue'
import type { UsuarioFiltroDTO } from '@/dtos/UsuarioFiltroDTO'
import type { RolUsuario } from '@/interfaces/UserInterface'
import { resetDemoData } from '@/PiniaConfig'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'

const router = useRouter()
const toast = useToast()

const ROLES: RolUsuario[] = ['admin', 'coordinador']

// selectors
const filtro = reactive<UsuarioFiltroDTO>({ rol: undefined, texto: '' })

// computed variables
const usuarioActual = computed(() => AuthService.getCurrentUser())

const usuarios = computed(() => {
  const todos = UserService.getAll()
  return UserService.filtrar(todos, filtro)
})

// functions
function limpiarFiltros(): void {
  filtro.rol = undefined
  filtro.texto = ''
}

function onEliminar(id: string): void {
  try {
    UserService.validarEliminacion(usuarioActual.value?.id, id)
    const eliminado = UserService.remove(id)
    if (eliminado) {
      toast.success('Usuario eliminado correctamente')
    } else {
      toast.error('No fue posible eliminar el usuario')
    }
  } catch (excepcion) {
    toast.error(
      excepcion instanceof Error ? excepcion.message : 'No fue posible eliminar el usuario',
    )
  }
}

function onRestablecerDemo(): void {
  const mensaje =
    '¿Restablecer los datos demo? Se borran creadores, marcas, pedidos y usuarios, ' +
    'se vuelve a sembrar y se cierra la sesión.'
  if (!confirm(mensaje)) return
  resetDemoData()
  AuthService.logout()
  toast.success('Datos demo restablecidos: inicia sesión de nuevo')
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="Panel usuarios">
    <div class="usuarios__header">
      <h1>Usuarios</h1>
      <RouterLink class="usuarios__crear" :to="{ name: 'usuarios.create' }">
        Nuevo usuario
      </RouterLink>
    </div>

    <div class="usuarios__filtros">
      <input
        v-model="filtro.texto"
        class="usuarios__filtro-input"
        type="search"
        placeholder="Buscar por nombre o email…"
      />

      <select v-model="filtro.rol" class="usuarios__filtro-input">
        <option :value="undefined">Todos los roles</option>
        <option v-for="opcion in ROLES" :key="opcion" :value="opcion">{{ opcion }}</option>
      </select>

      <button type="button" class="usuarios__limpiar" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </div>

    <UsuariosTable
      :usuarios="usuarios"
      :usuario-actual-id="usuarioActual?.id ?? ''"
      @eliminar="onEliminar"
    />

    <section class="usuarios__seccion">
      <h2 class="usuarios__titulo">Datos demo</h2>
      <p class="usuarios__demo-texto">
        Borra todo lo guardado en el navegador y vuelve a sembrar los datos ficticios iniciales.
        Cierra la sesión, porque la siembra genera usuarios nuevos.
      </p>
      <button type="button" class="usuarios__demo-boton" @click="onRestablecerDemo">
        Restablecer datos demo
      </button>
    </section>
  </main>
</template>

<style scoped>
.usuarios__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.usuarios__crear {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
}

.usuarios__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.usuarios__filtro-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.usuarios__limpiar {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.usuarios__seccion {
  margin-top: 2rem;
}

.usuarios__titulo {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.usuarios__demo-texto {
  color: var(--color-text);
  opacity: 0.8;
  max-width: 52ch;
  margin-bottom: 1rem;
}

.usuarios__demo-boton {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
}
</style>
