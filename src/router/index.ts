// Kevin Pabón

// external imports
import { createRouter, createWebHistory } from 'vue-router'

// internal imports
import { accessControlGuard } from '@/router/accessControl'
import { adminRoutes } from '@/router/admin/adminRoutes'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PedidosCreateView from '@/views/PedidosCreateView.vue'
import PedidosEditView from '@/views/PedidosEditView.vue'
import PedidosIndexView from '@/views/PedidosIndexView.vue'
import ReportesView from '@/views/ReportesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/pedidos', name: 'pedidos', component: PedidosIndexView },
    { path: '/pedidos/crear', name: 'pedidos.create', component: PedidosCreateView },
    { path: '/pedidos/:id', name: 'pedidos.edit', component: PedidosEditView },
    { path: '/reportes', name: 'reportes', component: ReportesView },
    ...adminRoutes,
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
})

router.beforeEach(accessControlGuard)

export default router
