import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import User from '@/models/User'
import { readSession, writeSession, clearSession } from '@/services/storage'

/**
 * Store de la sesión activa (login/logout/usuario actual).
 * El guard del router y la navbar leen de aquí; la persistencia
 * real vive en services/storage.js.
 */
export const useSessionStore = defineStore('session', () => {
  /** @type {import('vue').Ref<string | null>} */
  const userId = ref(readSession()?.userId ?? null)

  /** Usuario actual resuelto, o null si no hay sesión válida.
   * @type {import('vue').ComputedRef<User | null>}
   */
  const current = computed(() => (userId.value ? User.getById(userId.value) : null))

  /** @type {import('vue').ComputedRef<boolean>} */
  const isLoggedIn = computed(() => current.value !== null)

  /** @type {import('vue').ComputedRef<boolean>} */
  const isAdmin = computed(() => current.value?.rol === 'admin')

  /**
   * Inicia sesión con credenciales de la "base de datos" local.
   * @param {string} email
   * @param {string} password
   * @returns {{ ok: boolean, error?: string }}
   */
  function login(email, password) {
    const user = User.findByCredentials(email, password)
    if (!user) return { ok: false, error: 'Credenciales inválidas' }
    userId.value = user.id
    writeSession(user.id)
    return { ok: true }
  }

  /**
   * Cierra la sesión y limpia la persistencia.
   * @returns {void}
   */
  function logout() {
    userId.value = null
    clearSession()
  }

  return { userId, current, isLoggedIn, isAdmin, login, logout }
})
