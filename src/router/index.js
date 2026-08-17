import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PedidosView from '../views/PedidosView.vue'
import PedidoFormView from '../views/PedidoFormView.vue'
import CreadoresView from '../views/CreadoresView.vue'
import ReportesView from '../views/ReportesView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/pedidos', name: 'pedidos', component: PedidosView },
    { path: '/pedidos/nuevo', name: 'pedido-nuevo', component: PedidoFormView },
    { path: '/pedidos/:id/editar', name: 'pedido-editar', component: PedidoFormView },
    {
      path: '/creadores',
      name: 'creadores',
      component: CreadoresView,
      meta: { admin: true },
    },
    { path: '/reportes', name: 'reportes', component: ReportesView },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: { admin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
})

// Solo /login es pública; /creadores y /usuarios exigen rol admin.
router.beforeEach((to) => {
  const session = useSessionStore()

  if (to.meta.public) {
    return session.isLoggedIn ? { name: 'home' } : true
  }
  if (!session.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.admin && !session.isAdmin) {
    return { name: 'home' }
  }
  return true
})

export default router
