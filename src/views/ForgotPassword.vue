<template>
  <div class="forgot-password-page">
    <div class="container">
      <div class="card">
        <div class="header">
          <h1>Reset Your Password</h1>
          <p class="subtitle">Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="forgot-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Enter your registered email"
              required
              :disabled="loading || success"
              :class="{ 'error-input': errors.email }"
            >
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="loading || success"
          >
            <span v-if="loading" class="button-content">
              <span class="spinner-small"></span>
              Sending reset link...
            </span>
            <span v-else class="button-content">
              Send Reset Instructions
            </span>
          </button>

          <div v-if="success" class="success-message">
            <div class="success-icon">✓</div>
            <h3>Check Your Email!</h3>
            <p>We've sent password reset instructions to <strong>{{ email }}</strong>.</p>
            <p class="note">If you don't see the email, check your spam folder.</p>
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
            <router-link to="/register" class="link">
              Need an account? Sign up
            </router-link>
          </div>
        </form>

        <div class="instructions">
          <h4>How it works:</h4>
          <ol>
            <li>Enter your email address above</li>
            <li>Check your email for reset instructions</li>
            <li>Click the link in the email</li>
            <li>Create a new password</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/api/auth'

const router = useRouter()

const email = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

const errors = reactive({
  email: ''
})

const validateForm = () => {
  let valid = true
  errors.email = ''

  if (!email.value.trim()) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address'
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
    const response = await AuthService.forgotPassword({ email: email.value })
    success.value = true
    errorMessage.value = ''
  } catch (error: any) {
    console.error('Forgot password error:', error)

    // Even if error, we show success for security (don't reveal if email exists)
    if (error.response?.status === 200 || error.response?.status === 201) {
      success.value = true
    } else {
      errorMessage.value = error.response?.data?.error ||
                          error.response?.data?.message ||
                          'Failed to send reset instructions. Please try again.'
      success.value = false
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  email.value = ''
  success.value = false
  errorMessage.value = ''
  errors.email = ''
}
</script>

<style scoped>
.forgot-password-page {
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

.forgot-form {
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

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error-input {
  border-color: #f44336;
  background-color: #fff5f5;
}

.error-message {
  color: #f44336;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
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

.note {
  font-size: 14px;
  color: #68d391 !important;
  font-style: italic;
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

.instructions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.instructions h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.instructions ol {
  margin: 0;
  padding-left: 20px;
}

.instructions li {
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
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
