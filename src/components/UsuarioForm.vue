<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import type { RolUsuario } from '@/interfaces/UserInterface'

interface Props {
  initial?: Partial<CreateUserDTO>
  modoEdicion?: boolean
  guardando?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  initial: () => ({}),
  modoEdicion: false,
  guardando: false,
  error: '',
})

const emit = defineEmits<{ submit: [datos: CreateUserDTO]; cancelar: [] }>()

const ROLES: RolUsuario[] = ['admin', 'coordinador']

// selectors
const nombre = ref(props.initial.nombre ?? '')
const email = ref(props.initial.email ?? '')
// La contraseña se guarda en texto plano por diseño del proyecto (UserInterface),
// así que en edición se precarga y se reenvía completa, igual que el resto de campos.
const password = ref(props.initial.password ?? '')
const rol = ref<RolUsuario>(props.initial.rol ?? 'coordinador')

// functions
function onSubmit(): void {
  emit('submit', {
    nombre: nombre.value.trim(),
    email: email.value.trim().toLowerCase(),
    password: password.value,
    rol: rol.value,
  })
}
</script>

<template>
  <form class="usuario-form" @submit.prevent="onSubmit">
    <div class="usuario-form__field">
      <label class="usuario-form__label" for="usuario-nombre">Nombre</label>
      <input
        id="usuario-nombre"
        v-model="nombre"
        class="usuario-form__input"
        type="text"
        required
      />
    </div>

    <div class="usuario-form__field">
      <label class="usuario-form__label" for="usuario-email">Email</label>
      <input id="usuario-email" v-model="email" class="usuario-form__input" type="email" required />
    </div>

    <div class="usuario-form__field">
      <label class="usuario-form__label" for="usuario-password">Contraseña</label>
      <input
        id="usuario-password"
        v-model="password"
        class="usuario-form__input"
        type="password"
        required
      />
    </div>

    <div class="usuario-form__field">
      <label class="usuario-form__label" for="usuario-rol">Rol</label>
      <select id="usuario-rol" v-model="rol" class="usuario-form__input">
        <option v-for="opcion in ROLES" :key="opcion" :value="opcion">{{ opcion }}</option>
      </select>
    </div>

    <p v-if="error" class="usuario-form__error">{{ error }}</p>

    <div class="usuario-form__acciones">
      <button class="usuario-form__submit" type="submit" :disabled="guardando">
        {{ guardando ? 'Guardando…' : modoEdicion ? 'Guardar cambios' : 'Crear usuario' }}
      </button>
      <button
        v-if="modoEdicion"
        class="usuario-form__cancelar"
        type="button"
        @click="emit('cancelar')"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
.usuario-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.usuario-form__field {
  display: grid;
  gap: 0.35rem;
}

.usuario-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.usuario-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.usuario-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.usuario-form__acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
}

.usuario-form__submit {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.usuario-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.usuario-form__cancelar {
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
