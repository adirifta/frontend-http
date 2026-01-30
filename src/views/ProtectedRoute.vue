<!-- src/views/ProtectedRoute.vue -->
<template>
  <div class="protected-route-page">
    <div class="container">
      <div class="header">
        <h1>Protected Route</h1>
        <p class="subtitle">This page requires authentication and demonstrates protected content.</p>
      </div>

      <div class="content-grid">
        <div class="user-info-card">
          <div class="card-header">
            <h2>User Information</h2>
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
          </div>
        </div>

        <div class="api-test-card">
          <div class="card-header">
            <h2>API Security Test</h2>
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
            <h2>Session Management</h2>
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
                <span v-if="!refreshingToken" class="icon"></span>
                <span v-if="refreshingToken" class="spinner-small"></span>
                {{ refreshingToken ? 'Refreshing...' : 'Refresh Token' }}
              </button>
              <button @click="validateSession" class="session-btn">
                <span class="icon"></span> Validate Session
              </button>
              <button @click="showLogoutConfirm" class="session-btn logout">
                <span class="icon"></span> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon" :class="modalType">
            <span v-if="modalType === 'success'">✓</span>
            <span v-else-if="modalType === 'error'">✗</span>
            <span v-else-if="modalType === 'warning'">⚠</span>
            <span v-else>ℹ</span>
          </div>
          <p>{{ modalMessage }}</p>
          <div v-if="modalDetails" class="modal-details">
            <pre>{{ modalDetails }}</pre>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="modal-btn"
            :class="{
              'btn-success': modalType === 'success',
              'btn-error': modalType === 'error',
              'btn-warning': modalType === 'warning',
              'btn-info': modalType === 'info'
            }"
            @click="closeModal"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="cancelConfirm">
      <div class="modal-content confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ confirmTitle }}</h3>
          <button class="modal-close" @click="cancelConfirm">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <span>⚠</span>
          </div>
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn btn-secondary" @click="cancelConfirm">
            Cancel
          </button>
          <button class="modal-btn" :class="confirmButtonClass" @click="confirmAction">
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Logout Confirm Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="cancelLogout">
      <div class="modal-content confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="modal-close" @click="cancelLogout">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <span>⚠</span>
          </div>
          <p>Are you sure you want to logout? You'll need to log in again to access protected pages.</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn btn-secondary" @click="cancelLogout">
            Stay Logged In
          </button>
          <button class="modal-btn btn-logout-confirm" @click="confirmLogout">
            Yes, Logout
          </button>
        </div>
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

// Modal state
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalDetails = ref('')
const modalType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Confirm modal state
const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
const confirmButtonClass = ref('')
const confirmAction = ref(() => {})

// Logout modal state
const showLogoutModal = ref(false)

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

const showPopup = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  details?: string
) => {
  modalTitle.value = title
  modalMessage.value = message
  modalType.value = type
  modalDetails.value = details || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalDetails.value = ''
}

const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  buttonText: string = 'Confirm',
  buttonClass: string = 'btn-error'
) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmButtonText.value = buttonText
  confirmButtonClass.value = buttonClass
  confirmAction.value = onConfirm
  showConfirmModal.value = true
}

const cancelConfirm = () => {
  showConfirmModal.value = false
}

const copyUserId = () => {
  if (user.value?.id) {
    navigator.clipboard.writeText(user.value.id.toString())
    showPopup('Copied!', 'User ID copied to clipboard', 'success')
  }
}

const refreshUserData = async () => {
  refreshing.value = true
  try {
    await authStore.fetchUser()
    showPopup('Success', 'User data refreshed successfully!', 'success')
  } catch (error) {
    showPopup('Error', 'Failed to refresh user data', 'error')
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
      showPopup(
        'API Test Success',
        `Successfully fetched user data from ${endpoint.path}`,
        'success',
        JSON.stringify(response, null, 2)
      )
    } else if (endpoint.path === '/api/protected') {
      response = await AuthService.testProtectedRoute()
      showPopup(
        'Protected API Test',
        `Successfully accessed protected endpoint: ${endpoint.path}`,
        'success',
        JSON.stringify(response, null, 2)
      )
    } else if (endpoint.path === '/api/auth/logout') {
      showConfirm(
        'Test Logout Endpoint',
        'This will test the logout API endpoint. You will be logged out and redirected to login page.',
        async () => {
          try {
            await AuthService.logout()
            showPopup('Logout Successful', 'You have been logged out', 'success')
            setTimeout(() => {
              router.push('/login')
            }, 1500)
          } catch (error) {
            showPopup('Logout Failed', 'Failed to logout via API', 'error')
          }
        },
        'Test Logout',
        'btn-logout-confirm'
      )
      endpoint.testing = false
      return
    }

    currentTest.value = {
      method: endpoint.method,
      path: endpoint.path,
      success: true,
      response
    }

  } catch (error: any) {
    const errorMsg = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Request failed'

    currentTest.value = {
      method: endpoint.method,
      path: endpoint.path,
      success: false,
      error: errorMsg
    }

    showPopup(
      'API Test Failed',
      `Failed to access ${endpoint.path}: ${errorMsg}`,
      'error'
    )
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
    showPopup('Token Refreshed', 'Access token has been refreshed successfully!', 'success')
  } catch (error) {
    showPopup('Refresh Failed', 'Failed to refresh token', 'error')
  } finally {
    refreshingToken.value = false
  }
}

const validateSession = () => {
  if (authStore.isAuthenticated) {
    showPopup(
      'Session Valid',
      '✅ Your session is active and valid. You are authenticated.',
      'success'
    )
  } else {
    showPopup(
      'Session Invalid',
      '❌ Your session is invalid or expired. Redirecting to login...',
      'error'
    )
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}

const showLogoutConfirm = () => {
  showLogoutModal.value = true
}

const cancelLogout = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  showLogoutModal.value = false
  await authStore.logout()
  showPopup('Logged Out', 'You have been successfully logged out', 'success')
  setTimeout(() => {
    router.push('/login')
  }, 1500)
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

/* Modal Styles - Enhanced */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.confirm-modal {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
  text-align: center;
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.modal-icon.success {
  background: #d4edda;
  color: #155724;
  border: 3px solid #28a745;
}

.modal-icon.error {
  background: #f8d7da;
  color: #721c24;
  border: 3px solid #dc3545;
}

.modal-icon.warning {
  background: #fff3cd;
  color: #856404;
  border: 3px solid #ffc107;
}

.modal-icon.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 3px solid #17a2b8;
}

.modal-body p {
  margin: 0;
  color: #495057;
  font-size: 16px;
  line-height: 1.6;
}

.modal-details {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
}

.modal-details pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 100px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-error {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-error:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

.btn-logout-confirm {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-logout-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
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

  .modal-content {
    width: 95%;
    margin: 0 10px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
  }
}
</style>
