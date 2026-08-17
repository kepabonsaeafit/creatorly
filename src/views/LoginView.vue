<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

const email = ref('')
const password = ref('')
const error = ref('')

function onSubmit() {
  const result = session.login(email.value, password.value)
  if (result.ok) {
    router.push({ name: 'home' })
  } else {
    error.value = result.error ?? 'No fue posible iniciar sesión'
  }
}
</script>

<template>
  <main class="Panel login">
    <h1>Iniciar sesión</h1>
    <p class="login__intro">Herramienta interna de la agencia. Ingresa tus credenciales.</p>

    <form class="login__form" @submit.prevent="onSubmit">
      <label class="login__label" for="email">Email</label>
      <input
        id="email"
        v-model="email"
        class="login__input"
        type="email"
        autocomplete="username"
        required
      />

      <label class="login__label" for="password">Contraseña</label>
      <input
        id="password"
        v-model="password"
        class="login__input"
        type="password"
        autocomplete="current-password"
        required
      />

      <p v-if="error" class="login__error">{{ error }}</p>

      <button class="login__submit" type="submit">Entrar</button>
    </form>

    <aside class="login__demo">
      <p>Usuarios demo (datos semilla):</p>
      <ul>
        <li>admin@creatorly.com — administradora</li>
        <li>laura@creatorly.com — coordinadora</li>
        <li>sara@creatorly.com — coordinadora</li>
      </ul>
      <p>Contraseña de los tres: <code>1234</code></p>
    </aside>
  </main>
</template>

<style scoped>
.login {
  max-width: 420px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.login__intro {
  color: var(--color-text);
  opacity: 0.75;
  margin: 0.5rem 0 1.5rem;
}

.login__form {
  display: grid;
  gap: 0.5rem;
}

.login__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.login__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.login__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.login__submit {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.login__demo {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.8;
  border: 1px dashed var(--color-border-hover);
  border-radius: 8px;
  padding: 1rem;
}
</style>
