// Kevin Pabón

// internal imports
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import type { LoginDTO } from '@/dtos/LoginDTO'
import type { UsuarioFiltroDTO } from '@/dtos/UsuarioFiltroDTO'
import { ROLES, type RolUsuario, type UserInterface } from '@/interfaces/UserInterface'
import { useUserStore } from '@/stores/UserStore'
import { isValidEmail, normalizeEmail } from '@/utils/email'
import { generateId } from '@/utils/generateId'

export class UserService {
  private static validate(datos: CreateUserDTO): void {
    if (!datos.nombre || typeof datos.nombre !== 'string') {
      throw new Error('User: el nombre es obligatorio')
    }
    if (!isValidEmail(datos.email ?? '')) {
      throw new Error('User: el email no tiene un formato válido')
    }
    if (!datos.password || typeof datos.password !== 'string') {
      throw new Error('User: la contraseña es obligatoria')
    }
    if (!ROLES.includes(datos.rol)) {
      throw new Error(`User: el rol debe ser uno de ${ROLES.join(' | ')}`)
    }
  }

  static getAll(): UserInterface[] {
    return useUserStore().users
  }

  /** Usuarios con rol coordinador, para el select de coordinador de PedidoForm. */
  static getCoordinadores(): UserInterface[] {
    return this.getAll().filter((usuario) => usuario.rol === 'coordinador')
  }

  /** Devuelve undefined si no existe, a propósito: el llamador decide cómo manejar la ausencia. */
  static getById(id: string): UserInterface | undefined {
    return useUserStore().users.find((usuario) => usuario.id === id)
  }

  static findByCredentials(credenciales: LoginDTO): UserInterface | undefined {
    const emailNormalizado = normalizeEmail(credenciales.email ?? '')
    return useUserStore().users.find(
      (usuario) => usuario.email === emailNormalizado && usuario.password === credenciales.password,
    )
  }

  static create(datos: CreateUserDTO): UserInterface {
    const normalizado: CreateUserDTO = {
      ...datos,
      rol: datos.rol ?? 'coordinador',
      email: normalizeEmail(datos.email),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoUsuario: UserInterface = {
      ...normalizado,
      id: generateId(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useUserStore().users.push(nuevoUsuario)
    return nuevoUsuario
  }

  static update(id: string, cambios: Partial<CreateUserDTO>): UserInterface | undefined {
    const usuarios = useUserStore().users
    const indice = usuarios.findIndex((usuario) => usuario.id === id)
    if (indice === -1) return undefined
    const combinado: CreateUserDTO = {
      nombre: cambios.nombre ?? usuarios[indice].nombre,
      email: cambios.email ?? usuarios[indice].email,
      password: cambios.password ?? usuarios[indice].password,
      rol: cambios.rol ?? usuarios[indice].rol,
    }
    this.validate(combinado)
    const actualizado: UserInterface = {
      ...usuarios[indice],
      ...combinado,
      email: normalizeEmail(combinado.email),
      updatedAt: new Date().toISOString(),
    }
    usuarios[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const usuarios = useUserStore().users
    const indice = usuarios.findIndex((usuario) => usuario.id === id)
    if (indice === -1) return false
    usuarios.splice(indice, 1)
    return true
  }

  /**
   * Aplica un UsuarioFiltroDTO sobre una lista de usuarios y ordena el
   * resultado por nombre. Usado por UsuariosIndexView.
   */
  static filtrar(usuarios: UserInterface[], filtro: UsuarioFiltroDTO): UserInterface[] {
    return usuarios
      .filter((usuario) => {
        if (filtro.rol && usuario.rol !== filtro.rol) return false
        if (filtro.texto) {
          const texto = filtro.texto.trim().toLowerCase()
          if (
            texto &&
            !usuario.nombre.toLowerCase().includes(texto) &&
            !usuario.email.toLowerCase().includes(texto)
          ) {
            return false
          }
        }
        return true
      })
      .sort((primero, segundo) => primero.nombre.localeCompare(segundo.nombre))
  }

  /**
   * La siembra trae un solo admin: si se quitara el rol a sí mismo perdería el
   * acceso a esta página y no habría forma de devolvérselo desde la interfaz.
   */
  static validarCambioDeRolPropio(
    usuarioActualId: string | undefined,
    id: string,
    rolNuevo: RolUsuario,
  ): void {
    if (id === usuarioActualId && rolNuevo !== 'admin') {
      throw new Error('User: no puedes quitarte el rol de admin mientras es tu propia sesión')
    }
  }

  static validarEliminacion(usuarioActualId: string | undefined, id: string): void {
    if (id === usuarioActualId) {
      throw new Error('User: no puedes eliminar el usuario con el que iniciaste sesión')
    }
  }
}
