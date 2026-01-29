// src/router/index.ts
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

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Coba fetch user jika belum ada
  if (!authStore.user && localStorage.getItem('access_token')) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Auto-login failed:', error)
      localStorage.removeItem('access_token')
    }
  }

  // Cek jika route memerlukan autentikasi
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Cek jika route hanya untuk guest
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
