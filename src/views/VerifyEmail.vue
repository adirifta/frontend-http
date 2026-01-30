<template>
  <div class="verify-email-page">
    <div class="container">
      <div class="card">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <h3>Verifying your email...</h3>
          <p>Please wait while we verify your email address.</p>
        </div>

        <div v-else-if="success" class="success-state">
          <div class="success-icon">✓</div>
          <h2>Email Verified Successfully!</h2>
          <p class="success-message">
            Your email address <strong>{{ email }}</strong> has been verified.
            You can now access all features of your account.
          </p>
          <div class="actions">
            <router-link to="/login" class="btn btn-primary">
              Proceed to Login
            </router-link>
            <router-link to="/" class="btn btn-secondary">
              Go to Home
            </router-link>
          </div>
        </div>

        <div v-else class="error-state">
          <div class="error-icon">✗</div>
          <h2>Verification Failed</h2>
          <p class="error-message">{{ errorMessage }}</p>
          <div class="suggestions">
            <p>Possible reasons:</p>
            <ul>
              <li>The verification link has expired</li>
              <li>The link has already been used</li>
              <li>The link is invalid</li>
            </ul>
          </div>
          <div class="actions">
            <!-- <button @click="resendVerification" class="btn btn-primary" :disabled="resending">
              {{ resending ? 'Sending...' : 'Resend Verification Email' }}
            </button> -->
            <router-link to="/login" class="btn btn-secondary">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthService from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')
const email = ref('')
const resending = ref(false)

onMounted(async () => {
  const token = route.params.token as string

  if (!token) {
    errorMessage.value = 'No verification token provided'
    loading.value = false
    return
  }

  try {
    const response = await AuthService.verifyEmail(token)
    success.value = true
    // Try to get email from response or store
    email.value = authStore.user?.email || 'your email'
  } catch (error: any) {
    console.error('Verification error:', error)
    errorMessage.value = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to verify email. Please try again.'
  } finally {
    loading.value = false
  }
})

const resendVerification = async () => {
  if (!email.value) {
    errorMessage.value = 'Email address is required to resend verification'
    return
  }

  resending.value = true
  try {
    // Implement resend verification logic here
    // You would need to create this endpoint in your API
    // For now, we'll show a message
    alert(`Verification email would be resent to ${email.value}`)

    // Example implementation:
    // await axios.post('/api/auth/resend-verification', { email: email.value })
    // alert('Verification email sent! Please check your inbox.')

  } catch (error: any) {
    errorMessage.value = error.response?.data?.error ||
                        'Failed to resend verification email'
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.verify-email-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.loading-state {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state h3 {
  color: #333;
  margin-bottom: 10px;
}

.loading-state p {
  color: #666;
}

.success-state {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  font-size: 40px;
  line-height: 80px;
  margin: 0 auto 20px;
}

.success-state h2 {
  color: #333;
  margin-bottom: 15px;
}

.success-message {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.error-state {
  text-align: center;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  font-size: 40px;
  line-height: 80px;
  margin: 0 auto 20px;
}

.error-state h2 {
  color: #333;
  margin-bottom: 15px;
}

.error-message {
  color: #f44336;
  font-weight: 500;
  margin-bottom: 20px;
  padding: 15px;
  background: #ffebee;
  border-radius: 6px;
  border-left: 4px solid #f44336;
}

.suggestions {
  text-align: left;
  margin: 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
}

.suggestions p {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.suggestions ul {
  list-style: none;
  padding-left: 0;
}

.suggestions li {
  padding: 8px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.suggestions li:before {
  content: "•";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  flex: 1;
  min-width: 150px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #e9ecef;
  color: #495057;
}

.btn-secondary:hover {
  background: #dee2e6;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 576px) {
  .card {
    padding: 30px 20px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
