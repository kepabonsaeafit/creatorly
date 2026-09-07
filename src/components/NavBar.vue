<script setup lang="ts">
// Kevin Pabón

// external imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// internal imports
import { AuthService } from '@/services/AuthService'

const router = useRouter()

interface NavLink {
  name: string
  label: string
  admin: boolean
}

// selectors
/** Catálogo completo de links; `admin` marca los que exigen el rol de administrador. */
const LINKS: NavLink[] = [
  { name: 'home', label: 'Home', admin: false },
  { name: 'pedidos', label: 'Pedidos', admin: false },
  { name: 'reportes', label: 'Reportes', admin: false },
  { name: 'creadores', label: 'Creadores', admin: true },
  { name: 'usuarios', label: 'Usuarios', admin: true },
]

// computed variables
// El rol sale de AuthService y no del SessionStore: las views y los componentes
// solo hablan con services (regla 5 de AGENTS.md).
const currentUser = computed(() => AuthService.getCurrentUser())

const iniciales = computed(() => {
  const nombre = currentUser.value?.nombre ?? ''
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')
})

const esAdmin = computed(() => currentUser.value?.rol === 'admin')

/** Un coordinador no ve los links solo-admin; el guard del router los sigue bloqueando igual. */
const links = computed(() => LINKS.filter((link) => !link.admin || esAdmin.value))

// functions
function logout(): void {
  AuthService.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <RouterLink :to="{ name: 'home' }" class="navbar__brand">
      <svg class="navbar__logo" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="navbar-logo-gradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stop-color="var(--brand-primary)" />
            <stop offset="1" stop-color="var(--brand-primary-dark)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#navbar-logo-gradient)" />
        <g transform="scale(0.228571) translate(-47.875,10.125)">
          <path
            d="M 84.6 30.7 A 42 42 0 1 1 84.6 89.3"
            stroke="#ffffff"
            stroke-width="15"
            stroke-linecap="round"
            fill="none"
          />
          <rect
            x="76"
            y="51"
            width="24"
            height="24"
            rx="2"
            transform="rotate(45 88 63)"
            fill="#ffffff"
          />
        </g>
      </svg>
      <span class="navbar__wordmark">Creatorly</span>
    </RouterLink>

    <nav v-if="currentUser" class="navbar__links">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="navbar__link"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <div v-if="currentUser" class="navbar__session">
      <span class="navbar__avatar" aria-hidden="true">{{ iniciales }}</span>
      <span class="navbar__user-info">
        <span class="navbar__user-name">{{ currentUser.nombre }}</span>
        <span class="navbar__user-role">{{ currentUser.rol }}</span>
      </span>
      <button type="button" class="navbar__logout" @click="logout">
        <svg class="navbar__logout-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M6.5 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h2.5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            fill="none"
          />
          <path
            d="M10.5 11 14 8l-3.5-3M14 8H6"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
        Salir
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 1rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 0.65rem 1.1rem;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 16px 32px -22px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.2rem;
  border-radius: 10px;
  transition: opacity 0.2s ease;
}

.navbar__brand:hover {
  background: transparent;
  opacity: 0.85;
}

.navbar__logo {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.navbar__wordmark {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  color: var(--color-heading);
}

.navbar__links {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.navbar__link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navbar__link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.navbar__link.router-link-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}

.navbar__session {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.navbar__user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.navbar__user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-heading);
}

.navbar__user-role {
  font-size: 0.72rem;
  color: var(--color-text);
  opacity: 0.65;
  text-transform: capitalize;
}

.navbar__logout {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-danger);
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.navbar__logout:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: #ffffff;
}

.navbar__logout-icon {
  width: 14px;
  height: 14px;
}
</style>
