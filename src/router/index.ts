import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/verify-email/:token',
    name: 'verify-email',
    component: () => import('@/views/VerifyEmail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/protected',
    name: 'protected',
    component: () => import('@/views/ProtectedRoute.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const publicRoutes = ['login', 'register', 'forgot-password']

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isPublicRoute = publicRoutes.includes(to.name as string)

  if (isPublicRoute) {
    next()
    return
  }

  if (!authStore.authChecked) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
