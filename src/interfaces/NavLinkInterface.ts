// Kevin Pabón

/**
 * Un link del NavBar. Si la ruta exige el rol de administrador lo decide el
 * router (meta.admin de cada ruta): es la única fuente de esa información.
 */
export interface NavLink {
  name: string
  label: string
}
