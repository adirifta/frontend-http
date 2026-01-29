<template>
  <div id="app">
    <nav v-if="showNavbar">
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
      <template v-if="isAuthenticated">
        <router-link to="/dashboard">Dashboard</router-link> |
        <a href="#" @click.prevent="logout">Logout</a>
      </template>
      <span v-else>
        | <router-link to="/register">Register</router-link>
      </span>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showNavbar = computed(() => {
  const route = router.currentRoute.value
  return !['login', 'register', 'verify-email', 'reset-password', 'forgot-password'].includes(route.name as string)
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #f5c6cb;
  background: #f8d7da;
  border-radius: 4px;
}

.success {
  color: #28a745;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #c3e6cb;
  background: #d4edda;
  border-radius: 4px;
}

.links {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.links a {
  color: #007bff;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.verify-container,
.reset-container,
.forgot-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.verify-container h2,
.reset-container h2,
.forgot-container h2 {
  margin-bottom: 20px;
}
</style>
