// Author: Kevin Pabón

// external imports
import { createRouter, createWebHistory } from 'vue-router'

// internal imports
import { AuthService } from '@/services/AuthService'
import CreatorsCreateView from '@/views/Creators/CreatorsCreateView.vue'
import CreatorsEditView from '@/views/Creators/CreatorsEditView.vue'
import CreatorsIndexView from '@/views/Creators/CreatorsIndexView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import OrdersCreateView from '@/views/Orders/OrdersCreateView.vue'
import OrdersEditView from '@/views/Orders/OrdersEditView.vue'
import OrdersIndexView from '@/views/Orders/OrdersIndexView.vue'
import ReportsView from '@/views/Reports/ReportsView.vue'
import UsersCreateView from '@/views/Users/UsersCreateView.vue'
import UsersEditView from '@/views/Users/UsersEditView.vue'
import UsersIndexView from '@/views/Users/UsersIndexView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    admin?: boolean
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/orders', name: 'orders', component: OrdersIndexView },
    { path: '/orders/create', name: 'orders.create', component: OrdersCreateView },
    { path: '/orders/:id', name: 'orders.edit', component: OrdersEditView },
    { path: '/reports', name: 'reports', component: ReportsView },
    { path: '/creators', name: 'creators', component: CreatorsIndexView, meta: { admin: true } },
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
    { path: '/users', name: 'users', component: UsersIndexView, meta: { admin: true } },
    {
      path: '/users/create',
      name: 'users.create',
      component: UsersCreateView,
      meta: { admin: true },
    },
    { path: '/users/:id', name: 'users.edit', component: UsersEditView, meta: { admin: true } },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
})

// after a reload the session only exists as a token in LocalStorage, so the
// guard asks AuthService to restore it (GET /api/auth/profile) before deciding
router.beforeEach(async (to) => {
  const isLoggedIn = await AuthService.restoreSession()

  if (to.meta.public) {
    return isLoggedIn ? { name: 'home' } : true
  }
  if (!isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.admin && !AuthService.isAdmin()) {
    return { name: 'home' }
  }

  return true
})
