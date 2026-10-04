<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed, ref } from 'vue'

// internal imports
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import type { UserRole } from '@/interfaces/UserInterface'
import { normalizeEmail } from '@/utils/email'
import { ROLE_LABELS, toSelectOptions } from '@/utils/labels'

// props
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

// emits
const emit = defineEmits<{ submit: [userData: CreateUserDTO]; cancel: [] }>()

// selectors
const role = ref<UserRole>(props.initial.role ?? 'coordinator')

// reactive variables
const name = ref(props.initial.name ?? '')
const email = ref(props.initial.email ?? '')
// The API never returns the password, so it cannot be preloaded: on edit an
// empty field means "keep the current one" and the view leaves it out of the
// payload. It is only required when creating.
const password = ref('')

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
  <form class="user-form" @submit.prevent="onSubmit">
    <div class="user-form__field">
      <label class="user-form__label" for="user-name">Name</label>
      <input id="user-name" v-model="name" class="user-form__input" type="text" required />
    </div>

    <div class="user-form__field">
      <label class="user-form__label" for="user-email">Email</label>
      <input id="user-email" v-model="email" class="user-form__input" type="email" required />
    </div>

    <div class="user-form__field">
      <label class="user-form__label" for="user-password">Password</label>
      <input
        id="user-password"
        v-model="password"
        class="user-form__input"
        type="password"
        :required="!editMode"
        :placeholder="editMode ? 'Leave empty to keep the current one' : ''"
      />
    </div>

    <div class="user-form__field">
      <label class="user-form__label" for="user-role">Role</label>
      <select id="user-role" v-model="role" class="user-form__input">
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <p v-if="error" class="user-form__error">{{ error }}</p>

    <div class="user-form__actions">
      <button class="user-form__submit" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : editMode ? 'Save changes' : 'Create user' }}
      </button>
      <button v-if="editMode" class="user-form__cancel" type="button" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped>
.user-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.user-form__field {
  display: grid;
  gap: 0.35rem;
}

.user-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.user-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.user-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.user-form__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
}

.user-form__submit {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
  cursor: pointer;
}

.user-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-form__cancel {
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
