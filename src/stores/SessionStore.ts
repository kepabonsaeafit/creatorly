// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import { StorageService } from '@/services/StorageService'

// La sesión no se hidrata vía PiniaConfig: se autohidrata una sola vez al
// crearse, igual que el store viejo (services/session.js). Su persistencia
// es imperativa (login/logout), no un deep watch — eso llega con AuthService
// en el paso 4.
export const useSessionStore = defineStore('session', () => {
  const userId = ref<string | null>(StorageService.getSession()?.userId ?? null)
  return { userId }
})
