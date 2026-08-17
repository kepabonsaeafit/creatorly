<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

// Stub de navegación: faltan los links condicionados por rol (tarea de Gerónimo).
const links = [
  { name: 'home', label: 'Home' },
  { name: 'pedidos', label: 'Pedidos' },
  { name: 'reportes', label: 'Reportes' },
  { name: 'creadores', label: 'Creadores' },
  { name: 'usuarios', label: 'Usuarios' },
]

function logout() {
  session.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <span class="navbar__brand">Creatorly</span>
    <nav class="navbar__links">
      <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }">
        {{ link.label }}
      </RouterLink>
    </nav>
    <div v-if="session.current" class="navbar__session">
      <span class="navbar__user">{{ session.current.nombre }} ({{ session.current.rol }})</span>
      <button type="button" class="navbar__logout" @click="logout">Salir</button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.navbar__brand {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.navbar__links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.navbar__links a.router-link-active {
  font-weight: 600;
}

.navbar__session {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar__user {
  font-size: 0.85rem;
  color: var(--color-text);
}

.navbar__logout {
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-danger);
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
}

.navbar__logout:hover {
  border-color: var(--color-danger);
}
</style>
