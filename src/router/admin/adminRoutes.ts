// Author: Kevin Pabón

// external imports
import type { RouteRecordRaw } from 'vue-router'

// internal imports
import CreatorsCreateView from '@/views/CreatorsCreateView.vue'
import CreatorsEditView from '@/views/CreatorsEditView.vue'
import CreatorsIndexView from '@/views/CreatorsIndexView.vue'
import UsersCreateView from '@/views/UsersCreateView.vue'
import UsersEditView from '@/views/UsersEditView.vue'
import UsersIndexView from '@/views/UsersIndexView.vue'

/** Admin-only routes, grouped by access level (not by feature). */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/creators',
    name: 'creators',
    component: CreatorsIndexView,
    meta: { admin: true },
  },
  {
    path: '/creators/create',
    name: 'creators.create',
    component: CreatorsCreateView,
    meta: { admin: true },
  },
  {
    path: '/creators/:id',
    name: 'creators.edit',
    component: CreatorsEditView,
    meta: { admin: true },
  },
  {
    path: '/users',
    name: 'users',
    component: UsersIndexView,
    meta: { admin: true },
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: UsersCreateView,
    meta: { admin: true },
  },
  {
    path: '/users/:id',
    name: 'users.edit',
    component: UsersEditView,
    meta: { admin: true },
  },
]
