// Kevin Pabón

// external imports
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

// internal imports
// Store viejo (sin tocar) a propósito: NavBar.vue y LoginView.vue siguen
// leyendo/escribiendo esta misma instancia hasta el paso 7, cuando la
// capa nueva (SessionStore.ts + AuthService.ts) se completa y el guard,
// NavBar y LoginView migran juntos, atómicamente.
import { useSessionStore } from '@/stores/session'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    admin?: boolean
  }
}

/** Mismas 3 ramas que el guard viejo de router/index.js. */
export function accessControlGuard(to: RouteLocationNormalized): boolean | RouteLocationRaw {
  const session = useSessionStore()

  if (to.meta.public) {
    return session.isLoggedIn ? { name: 'home' } : true
  }
  if (!session.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.admin && !session.isAdmin) {
    return { name: 'home' }
  }
  return true
}
