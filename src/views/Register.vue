<template>
  <div class="form-container">
    <h2>Create New Account</h2>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="Enter your full name"
          required
          :disabled="loading"
        >
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Enter your email"
          required
          :disabled="loading"
        >
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Create a password (min. 8 characters)"
          required
          :disabled="loading"
        >
        <small class="hint">Must be at least 8 characters long</small>
      </div>

      <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input
          v-model="form.password_confirmation"
          type="password"
          id="password_confirmation"
          placeholder="Confirm your password"
          required
          :disabled="loading"
        >
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Creating account...</span>
        <span v-else>Register</span>
      </button>

      <div v-if="authStore.error" class="error">
        <template v-if="typeof authStore.error === 'object'">
          <div v-for="(errors, field) in authStore.error" :key="field">
            <strong>{{ field }}:</strong>
            <span v-for="error in errors" :key="error">{{ error }}</span>
          </div>
        </template>
        <template v-else>
          {{ authStore.error }}
        </template>
      </div>

      <div class="links">
        <router-link to="/login">Already have an account? Login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const loading = ref(false)

onMounted(() => {
  authStore.clearError()
})

const handleRegister = async () => {
  // Validate password match
  if (form.value.password !== form.value.password_confirmation) {
    authStore.setError('Passwords do not match')
    return
  }

  // Validate password length
  if (form.value.password.length < 8) {
    authStore.setError('Password must be at least 8 characters long')
    return
  }

  loading.value = true
  authStore.clearError()

  const result = await authStore.register(form.value)

  if (result.success) {
    alert('Registration successful! Please check your email for verification instructions.')
    router.push('/login')
  }

  loading.value = false
}
</script>

<style scoped>
.hint {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.875em;
}
</style>
