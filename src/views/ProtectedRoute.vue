<!-- src/views/ProtectedRoute.vue -->
<template>
  <div class="protected-route-page">
    <div class="container">
      <div class="header">
        <h1>🔐 Protected Route</h1>
        <p class="subtitle">This page requires authentication and demonstrates protected content.</p>
      </div>

      <div class="content-grid">
        <div class="user-info-card">
          <div class="card-header">
            <h2>👤 User Information</h2>
            <div class="verification-badge" :class="verificationClass">
              {{ verificationText }}
            </div>
          </div>

          <div class="user-details">
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">{{ user?.name }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{{ user?.email }}</span>
            </div>

            <div class="detail-item">
              <span class="label">User ID:</span>
              <span class="value">{{ user?.id }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Account Created:</span>
              <span class="value">{{ formatDate(user?.created_at) }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Last Updated:</span>
              <span class="value">{{ formatDate(user?.updated_at) }}</span>
            </div>
          </div>

          <div class="user-actions">
            <button @click="copyUserId" class="action-btn">
              <span class="icon">📋</span> Copy User ID
            </button>
            <button @click="refreshUserData" class="action-btn" :disabled="refreshing">
              <span class="icon" v-if="!refreshing">🔄</span>
              <span class="spinner-small" v-else></span>
              {{ refreshing ? 'Refreshing...' : 'Refresh Data' }}
            </button>
          </div>
        </div>

        <div class="api-test-card">
          <div class="card-header">
            <h2>🛡️ API Security Test</h2>
          </div>

          <div class="api-test-content">
            <p>Test your authentication by calling protected API endpoints:</p>

            <div class="api-endpoints">
              <div class="endpoint" v-for="(endpoint, index) in endpoints" :key="index">
                <div class="endpoint-info">
                  <span class="method">{{ endpoint.method }}</span>
                  <span class="path">{{ endpoint.path }}</span>
                  <span class="description">{{ endpoint.description }}</span>
                </div>
                <button
                  @click="testEndpoint(endpoint)"
                  :disabled="endpoint.testing"
                  class="test-btn"
                >
                  <span v-if="endpoint.testing" class="spinner-small"></span>
                  {{ endpoint.testing ? 'Testing...' : 'Test' }}
                </button>
              </div>
            </div>

            <div class="test-results">
              <h3>Test Results</h3>
              <div v-if="currentTest" class="result-item">
                <div class="result-header">
                  <span class="endpoint">{{ currentTest.method }} {{ currentTest.path }}</span>
                  <span class="status" :class="currentTest.success ? 'success' : 'error'">
                    {{ currentTest.success ? '✅ Success' : '❌ Failed' }}
                  </span>
                </div>
                <div v-if="currentTest.response" class="response-data">
                  <pre>{{ formatResponse(currentTest.response) }}</pre>
                </div>
                <div v-if="currentTest.error" class="error-message">
                  {{ currentTest.error }}
                </div>
              </div>
              <div v-else class="no-results">
                No tests run yet. Click a "Test" button above.
              </div>
            </div>
          </div>
        </div>

        <div class="session-card">
          <div class="card-header">
            <h2>⚙️ Session Management</h2>
          </div>

          <div class="session-content">
            <div class="session-info">
              <div class="info-item">
                <span class="label">Login Status:</span>
                <span class="value status-active">Active</span>
              </div>
              <div class="info-item">
                <span class="label">Session Duration:</span>
                <span class="value">{{ sessionDuration }}</span>
              </div>
              <div class="info-item">
                <span class="label">Token Type:</span>
                <span class="value">HttpOnly Cookie</span>
              </div>
            </div>

            <div class="session-actions">
              <button @click="refreshToken" class="session-btn" :disabled="refreshingToken">
                <span class="icon">🔄</span>
                {{ refreshingToken ? 'Refreshing...' : 'Refresh Token' }}
              </button>
              <button @click="validateSession" class="session-btn">
                <span class="icon">✅</span> Validate Session
              </button>
              <button @click="logout" class="session-btn logout">
                <span class="icon">🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="security-notes">
        <h3>🔒 Security Features Demonstrated:</h3>
        <ul>
          <li><strong>HttpOnly Cookies:</strong> Tokens stored securely, inaccessible to JavaScript</li>
          <li><strong>Protected Routes:</strong> Client-side and server-side protection</li>
          <li><strong>Auto Token Refresh:</strong> Automatic refresh on 401 errors</li>
          <li><strong>CSRF Protection:</strong> Built-in Laravel Sanctum protection</li>
          <li><strong>Secure Headers:</strong> CORS and security headers configured</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const refreshing = ref(false)
const refreshingToken = ref(false)
const sessionStartTime = ref(Date.now())
const sessionDuration = ref('0s')

const endpoints = ref([
  {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current user data',
    testing: false
  },
  {
    method: 'GET',
    path: '/api/protected',
    description: 'Test protected endpoint',
    testing: false
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Logout endpoint (will redirect)',
    testing: false
  }
])

interface TestResult {
  method: string
  path: string
  success: boolean
  response?: any
  error?: string
}

const currentTest = ref<TestResult | null>(null)

const user = computed(() => authStore.user)

const verificationClass = computed(() => {
  return user.value?.email_verified_at ? 'verified' : 'not-verified'
})

const verificationText = computed(() => {
  return user.value?.email_verified_at ? 'Email Verified' : 'Email Not Verified'
})

onMounted(() => {
  updateSessionDuration()
  const timer = setInterval(updateSessionDuration, 1000)
  onUnmounted(() => clearInterval(timer))
})

const updateSessionDuration = () => {
  const duration = Math.floor((Date.now() - sessionStartTime.value) / 1000)
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  if (hours > 0) {
    sessionDuration.value = `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    sessionDuration.value = `${minutes}m ${seconds}s`
  } else {
    sessionDuration.value = `${seconds}s`
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyUserId = () => {
  if (user.value?.id) {
    navigator.clipboard.writeText(user.value.id.toString())
    alert('User ID copied to clipboard!')
  }
}

const refreshUserData = async () => {
  refreshing.value = true
  try {
    await authStore.fetchUser()
    alert('User data refreshed successfully!')
  } catch (error) {
    alert('Failed to refresh user data')
  } finally {
    refreshing.value = false
  }
}

const testEndpoint = async (endpoint: any) => {
  endpoint.testing = true
  currentTest.value = null

  try {
    let response
    if (endpoint.path === '/api/auth/me') {
      response = await AuthService.getCurrentUser()
    } else if (endpoint.path === '/api/protected') {
      response = await AuthService.testProtectedRoute()
    } else if (endpoint.path === '/api/auth/logout') {
      // Special handling for logout
      if (confirm('This will log you out. Continue?')) {
        await AuthService.logout()
        router.push('/login')
        return
      } else {
        endpoint.testing = false
        return
      }
    }

    currentTest.value = {
      method: endpoint.method,
      path: endpoint.path,
      success: true,
      response
    }

  } catch (error: any) {
    currentTest.value = {
      method: endpoint.method,
      path: endpoint.path,
      success: false,
      error: error.response?.data?.error ||
             error.response?.data?.message ||
             'Request failed'
    }
  } finally {
    endpoint.testing = false
  }
}

const formatResponse = (response: any) => {
  return JSON.stringify(response, null, 2)
}

const refreshToken = async () => {
  refreshingToken.value = true
  try {
    await AuthService.refreshToken()
    alert('Token refreshed successfully!')
  } catch (error) {
    alert('Failed to refresh token')
  } finally {
    refreshingToken.value = false
  }
}

const validateSession = () => {
  if (authStore.isAuthenticated) {
    alert('✅ Session is valid!')
  } else {
    alert('❌ Session is invalid. Redirecting to login...')
    router.push('/login')
  }
}

const logout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.protected-route-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 36px;
}

.subtitle {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.user-info-card,
.api-test-card,
.session-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f4ff;
}

.card-header h2 {
  color: #333;
  font-size: 20px;
  margin: 0;
}

.verification-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.verification-badge.verified {
  background: #d4edda;
  color: #155724;
}

.verification-badge.not-verified {
  background: #f8d7da;
  color: #721c24;
}

.user-details {
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.status-active {
  color: #28a745;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.action-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  font-size: 16px;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.api-test-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.api-endpoints {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.endpoint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.endpoint-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.method {
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.path {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #333;
}

.description {
  color: #666;
  font-size: 13px;
}

.test-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  min-width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.3s;
}

.test-btn:hover:not(:disabled) {
  background: #218838;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-results {
  margin-top: 10px;
}

.test-results h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.result-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e9ecef;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.endpoint {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #333;
}

.status {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
}

.status.success {
  background: #d4edda;
  color: #155724;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

.response-data {
  background: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
  overflow-x: auto;
}

.response-data pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
}

.error-message {
  color: #dc3545;
  font-size: 13px;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.session-info {
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
}

.session-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.session-btn {
  padding: 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.session-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.session-btn.logout {
  background: #dc3545;
}

.security-notes {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-top: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.security-notes h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
}

.security-notes ul {
  list-style: none;
  padding-left: 0;
}

.security-notes li {
  padding: 10px 0;
  color: #666;
  border-bottom: 1px solid #f8f9fa;
  padding-left: 25px;
  position: relative;
}

.security-notes li:before {
  content: "✓";
  color: #28a745;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.security-notes li strong {
  color: #333;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .api-endpoints {
    flex-direction: column;
  }

  .endpoint {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .endpoint-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .test-btn {
    align-self: flex-end;
  }
}
</style>
