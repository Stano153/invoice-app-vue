import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InvoiceView from '@/views/InvoiceView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AddInvoiceView from '@/views/AddInvoiceView.vue'
import EditInvoiceView from '@/views/EditInvoiceView.vue'
import UserAuth from '@/views/UserAuth.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import store from '@/store'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/invoices/:id',
      name: 'invoice',
      component: InvoiceView,
      props:true,
      meta: { requiresAuth: true }
    },
    {
      path: '/invoices/add',
      name: 'invoice-add',
      component: AddInvoiceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/invoices/edit/:id',
      name: 'edit-invoice',
      component: EditInvoiceView,
      props:true,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login-signup',
      component: UserAuth,
      meta: { requiresUnauth: true }
    },
    {
      path: '/analytics',
      name: 'analytic-charts',
      component: AnalyticsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:notFound(.*)',
      component: NotFoundView
    }
    
  ],
})
router.beforeEach(function(to, _, next) {
  if(to.meta.requiresAuth && !store.getters.isAuthenticated) {
      next('/login');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
      next('/');
  } else {
      next();
  }
})

export default router
