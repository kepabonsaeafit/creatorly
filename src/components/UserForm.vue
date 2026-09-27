<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, ref } from 'vue'

// internal imports
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import type { UserRole } from '@/interfaces/UserInterface'
import { normalizeEmail } from '@/utils/email'
import { ROLE_LABELS, toSelectOptions } from '@/utils/labels'

interface Props {
  initial?: Partial<CreateUserDTO>
  editMode?: boolean
  saving?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  initial: () => ({}),
  editMode: false,
  saving: false,
  error: '',
})

const emit = defineEmits<{ submit: [userData: CreateUserDTO]; cancel: [] }>()

// selectors
const role = ref<UserRole>(props.initial.role ?? 'coordinator')

// state
const name = ref(props.initial.name ?? '')
const email = ref(props.initial.email ?? '')
// La contraseña se guarda en texto plano por diseño del proyecto (UserInterface),
// así que en edición se precarga y se reenvía completa, igual que el resto de campos.
const password = ref(props.initial.password ?? '')

// computed variables
const roleOptions = computed(() => toSelectOptions(ROLE_LABELS))

// functions
function onSubmit(): void {
  emit('submit', {
    name: name.value.trim(),
    email: normalizeEmail(email.value),
    password: password.value,
    role: role.value,
  })
}
</script>

<template>
  <form class="usuario-form" @submit.prevent="onSubmit">
    <div class="usuario-form__field">
      <label class="usuario-form__label" for="usuario-nombre">Nombre</label>
      <input id="usuario-nombre" v-model="name" class="usuario-form__input" type="text" required />
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
      <select id="usuario-rol" v-model="role" class="usuario-form__input">
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <p v-if="error" class="usuario-form__error">{{ error }}</p>

    <div class="usuario-form__acciones">
      <button class="usuario-form__submit" type="submit" :disabled="saving">
        {{ saving ? 'Guardando…' : editMode ? 'Guardar cambios' : 'Crear usuario' }}
      </button>
      <button v-if="editMode" class="usuario-form__cancelar" type="button" @click="emit('cancel')">
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
  color: var(--brand-white);
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
