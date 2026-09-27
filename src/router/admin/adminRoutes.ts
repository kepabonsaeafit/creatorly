// Kevin Pabón

// external imports
import type { RouteRecordRaw } from 'vue-router'

// internal imports
import CreatorsCreateView from '@/views/CreatorsCreateView.vue'
import CreatorsEditView from '@/views/CreatorsEditView.vue'
import CreatorsIndexView from '@/views/CreatorsIndexView.vue'
import UsersCreateView from '@/views/UsersCreateView.vue'
import UsersEditView from '@/views/UsersEditView.vue'
import UsersIndexView from '@/views/UsersIndexView.vue'

/** Rutas solo-admin, agrupadas por nivel de acceso (no por feature). */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/creadores',
    name: 'creadores',
    component: CreatorsIndexView,
    meta: { admin: true },
  },
  {
    path: '/creadores/crear',
    name: 'creadores.create',
    component: CreatorsCreateView,
    meta: { admin: true },
  },
  {
    path: '/creadores/:id',
    name: 'creadores.edit',
    component: CreatorsEditView,
    meta: { admin: true },
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsersIndexView,
    meta: { admin: true },
  },
  {
    path: '/usuarios/crear',
    name: 'usuarios.create',
    component: UsersCreateView,
    meta: { admin: true },
  },
  {
    path: '/usuarios/:id',
    name: 'usuarios.edit',
    component: UsersEditView,
    meta: { admin: true },
  },
]
