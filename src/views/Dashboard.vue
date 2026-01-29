<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="header">
      <h1>Dashboard</h1>
      <p>Welcome back, {{ user?.name }}!</p>
    </div>

    <div class="user-info">
      <div class="info-card">
        <h3>👤 User Information</h3>
        <div class="info-item">
          <span class="label">Name:</span>
          <span class="value">{{ user?.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Email:</span>
          <span class="value">{{ user?.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Email Verified:</span>
          <span class="value" :class="{ verified: user?.email_verified_at, 'not-verified': !user?.email_verified_at }">
            {{ user?.email_verified_at ? '✅ Verified' : '❌ Not Verified' }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">Member Since:</span>
          <span class="value">{{ formatDate(user?.created_at) }}</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="action-grid">
        <div class="action-card">
          <h3>🛡️ Protected Route</h3>
          <p>Test accessing a protected API route</p>
          <router-link to="/protected" class="btn">Test Protected Route</router-link>
        </div>

        <div class="action-card">
          <h3>🔐 Session</h3>
          <p>Manage your current session</p>
          <button @click="refreshToken" :disabled="refreshing" class="btn">
            {{ refreshing ? 'Refreshing...' : 'Refresh Token' }}
          </button>
        </div>

        <div class="action-card">
          <h3>📧 Email</h3>
          <p>Resend verification email</p>
          <button @click="resendVerification" :disabled="resending" class="btn">
            {{ resending ? 'Sending...' : 'Resend Verification' }}
          </button>
        </div>
      </div>
    </div>

    <div class="logout-section">
      <button @click="handleLogout" class="btn-logout">🚪 Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const refreshing = ref(false)
const resending = ref(false)

const user = computed(() => authStore.user)

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const refreshToken = async () => {
  refreshing.value = true
  try {
    // Implement token refresh logic here
    alert('Token refresh would be implemented here')
  } finally {
    refreshing.value = false
  }
}

const resendVerification = async () => {
  resending.value = true
  try {
    // Implement resend verification logic here
    alert('Resend verification would be implemented here')
  } finally {
    resending.value = false
  }
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.header h1 {
  margin-bottom: 10px;
}

.user-info {
  margin-bottom: 40px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-card h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.verified {
  color: #28a745;
}

.not-verified {
  color: #dc3545;
}

.actions {
  margin-bottom: 40px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.action-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.action-card p {
  color: #666;
  margin-bottom: 20px;
  min-height: 40px;
}

.action-card .btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.action-card .btn:hover:not(:disabled) {
  background: #0056b3;
}

.action-card .btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.logout-section {
  text-align: center;
}

.btn-logout {
  padding: 12px 30px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}
</style>
