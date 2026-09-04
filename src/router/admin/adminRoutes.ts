// Kevin Pabón

// external imports
import type { RouteRecordRaw } from 'vue-router'

// internal imports
import CreadoresCreateView from '@/views/CreadoresCreateView.vue'
import CreadoresEditView from '@/views/CreadoresEditView.vue'
import CreadoresIndexView from '@/views/CreadoresIndexView.vue'
import UsuariosView from '@/views/UsuariosView.vue'

/** Rutas solo-admin, agrupadas por nivel de acceso (no por feature). */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/creadores',
    name: 'creadores',
    component: CreadoresIndexView,
    meta: { admin: true },
  },
  {
    path: '/creadores/crear',
    name: 'creadores.create',
    component: CreadoresCreateView,
    meta: { admin: true },
  },
  {
    path: '/creadores/:id',
    name: 'creadores.edit',
    component: CreadoresEditView,
    meta: { admin: true },
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosView,
    meta: { admin: true },
  },
]
