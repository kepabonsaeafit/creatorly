// Kevin Pabón

/**
 * AuthService no sigue el patrón `throw new Error(...)` del resto de services
 * (UserService, CreadorService, MarcaService, PedidoService). login() devuelve
 * { ok, error } porque "credenciales inválidas" no es un dato malformado del
 * programador (como un presupuesto negativo) sino una respuesta legítima y
 * esperada de un formulario de login: la view necesita mostrar el error sin
 * un try/catch, igual que ya hacía session.js antes de esta migración
 * (session.js:32-38). Las validaciones de forma de los otros services SÍ
 * lanzan, porque ahí un dato inválido es un error de programación (DTO mal
 * construido), no una interacción normal del usuario.
 */

// internal imports
import type { LoginDTO } from '@/dtos/LoginDTO'
import { StorageService } from '@/services/StorageService'
import { UserService } from '@/services/UserService'
import type { UserInterface } from '@/interfaces/UserInterface'
import { useSessionStore } from '@/stores/SessionStore'

interface LoginResult {
  ok: boolean
  error?: string
}

export class AuthService {
  static login(credenciales: LoginDTO): LoginResult {
    const usuario = UserService.findByCredentials(credenciales)
    if (!usuario) return { ok: false, error: 'Credenciales inválidas' }
    useSessionStore().userId = usuario.id
    StorageService.setSession(usuario.id)
    return { ok: true }
  }

  static logout(): void {
    useSessionStore().userId = null
    StorageService.clearSession()
  }

  static getCurrentUser(): UserInterface | undefined {
    return useSessionStore().current
  }
}
