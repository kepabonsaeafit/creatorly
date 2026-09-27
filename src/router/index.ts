// Kevin Pabón

// external imports
import { createRouter, createWebHistory } from 'vue-router'

// internal imports
import { accessControlGuard } from '@/router/accessControl'
import { adminRoutes } from '@/router/admin/adminRoutes'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import OrdersCreateView from '@/views/OrdersCreateView.vue'
import OrdersEditView from '@/views/OrdersEditView.vue'
import OrdersIndexView from '@/views/OrdersIndexView.vue'
import ReportsView from '@/views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/pedidos', name: 'pedidos', component: OrdersIndexView },
    { path: '/pedidos/crear', name: 'pedidos.create', component: OrdersCreateView },
    { path: '/pedidos/:id', name: 'pedidos.edit', component: OrdersEditView },
    { path: '/reportes', name: 'reportes', component: ReportsView },
    ...adminRoutes,
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
})

router.beforeEach(accessControlGuard)

export default router
