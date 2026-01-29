<template>
  <div class="reset-password-page">
    <div class="container">
      <div class="card">
        <div class="header">
          <h1>Create New Password</h1>
          <p class="subtitle">Please enter your new password below.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="reset-form">
          <input type="hidden" v-model="form.token">

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              disabled
              class="disabled-input"
            >
          </div>

          <div class="form-group">
            <label for="password">New Password</label>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Enter new password"
              required
              :disabled="loading || success"
              :class="{ 'error-input': errors.password }"
            >
            <div class="password-actions">
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="toggle-password"
              >
                {{ showPassword ? '🙈 Hide' : '👁️ Show' }}
              </button>
            </div>
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
            <div class="password-requirements">
              <p>Password must:</p>
              <ul>
                <li :class="{ 'met': form.password.length >= 8 }">
                  Be at least 8 characters long
                </li>
                <li :class="{ 'met': /[A-Z]/.test(form.password) }">
                  Contain at least one uppercase letter
                </li>
                <li :class="{ 'met': /[a-z]/.test(form.password) }">
                  Contain at least one lowercase letter
                </li>
                <li :class="{ 'met': /\d/.test(form.password) }">
                  Contain at least one number
                </li>
              </ul>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              v-model="form.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              placeholder="Confirm new password"
              required
              :disabled="loading || success"
              :class="{ 'error-input': errors.confirmPassword }"
            >
            <div class="password-actions">
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="toggle-password"
              >
                {{ showConfirmPassword ? '🙈 Hide' : '👁️ Show' }}
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="loading || success"
          >
            <span v-if="loading" class="button-content">
              <span class="spinner-small"></span>
              Updating password...
            </span>
            <span v-else class="button-content">
              Reset Password
            </span>
          </button>

          <div v-if="success" class="success-message">
            <div class="success-icon">✓</div>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been updated successfully.</p>
            <p>You will be redirected to login in <strong>{{ countdown }}</strong> seconds...</p>
          </div>

          <div v-if="errorMessage" class="error-alert">
            <div class="error-icon">!</div>
            <div class="error-content">
              <strong>Error:</strong> {{ errorMessage }}
            </div>
          </div>

          <div class="links">
            <router-link to="/login" class="link">
              ← Back to Login
            </router-link>
            <router-link to="/forgot-password" class="link">
              Request new reset link
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthService from '@/api/auth'

const route = useRoute()
const router = useRouter()

const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(5)

const errors = reactive({
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  // Get token from URL params and email from query
  form.token = route.params.token as string || ''
  form.email = route.query.email as string || ''

  if (!form.token || !form.email) {
    errorMessage.value = 'Invalid or expired reset link. Please request a new one.'
  }
})

const validateForm = () => {
  let valid = true
  errors.password = ''
  errors.confirmPassword = ''

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    valid = false
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter'
    valid = false
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = 'Password must contain at least one lowercase letter'
    valid = false
  } else if (!/\d/.test(form.password)) {
    errors.password = 'Password must contain at least one number'
    valid = false
  }

  // Confirm password validation
  if (!form.password_confirmation) {
    errors.confirmPassword = 'Please confirm your password'
    valid = false
  } else if (form.password !== form.password_confirmation) {
    errors.confirmPassword = 'Passwords do not match'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await AuthService.resetPassword(form)
    success.value = true

    // Start countdown to redirect
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(timer)
        router.push('/login')
      }
    }, 1000)

  } catch (error: any) {
    console.error('Reset password error:', error)
    errorMessage.value = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for password changes to clear errors
watch(() => form.password, () => {
  if (errors.password && form.password.length >= 8) {
    errors.password = ''
  }
})

watch(() => form.password_confirmation, () => {
  if (errors.confirmPassword && form.password === form.password_confirmation) {
    errors.confirmPassword = ''
  }
})
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 500px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #666;
  line-height: 1.6;
  font-size: 15px;
}

.reset-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.disabled-input {
  background-color: #f8f9fa;
  color: #666;
  cursor: not-allowed;
}

.form-group input:focus:not(.disabled-input) {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error-input {
  border-color: #f44336;
  background-color: #fff5f5;
}

.password-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.toggle-password {
  background: none;
  border: none;
  color: #667eea;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.toggle-password:hover {
  background-color: #f0f4ff;
}

.error-message {
  color: #f44336;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.password-requirements {
  margin-top: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 13px;
}

.password-requirements p {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.password-requirements ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.password-requirements li {
  padding: 4px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
  transition: color 0.3s;
}

.password-requirements li:before {
  content: "○";
  position: absolute;
  left: 0;
  color: #ccc;
}

.password-requirements li.met {
  color: #4CAF50;
}

.password-requirements li.met:before {
  content: "✓";
  color: #4CAF50;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-message {
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: #48bb78;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  line-height: 40px;
  margin: 0 auto 15px;
}

.success-message h3 {
  color: #2f855a;
  margin-bottom: 10px;
}

.success-message p {
  color: #38a169;
  margin-bottom: 5px;
  line-height: 1.5;
}

.error-alert {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-icon {
  width: 24px;
  height: 24px;
  background: #f56565;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
  flex-shrink: 0;
}

.error-content {
  color: #c53030;
  line-height: 1.5;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .card {
    padding: 30px 20px;
  }

  .links {
    flex-direction: column;
    gap: 15px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>
