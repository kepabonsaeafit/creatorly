// Author: Kevin Pabón

// external imports
import type { RouteRecordRaw } from 'vue-router'

// internal imports
import CreatorsCreateView from '@/views/Creators/CreatorsCreateView.vue'
import CreatorsEditView from '@/views/Creators/CreatorsEditView.vue'
import CreatorsIndexView from '@/views/Creators/CreatorsIndexView.vue'
import UsersCreateView from '@/views/Users/UsersCreateView.vue'
import UsersEditView from '@/views/Users/UsersEditView.vue'
import UsersIndexView from '@/views/Users/UsersIndexView.vue'

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
