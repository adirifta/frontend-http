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
      </div>
    </div>

    <div class="actions">
      <div class="action-grid">
        <div class="action-card">
          <h3>Protected Route</h3>
          <p>Test accessing a protected API route</p>
          <router-link to="/protected" class="btn">Test Protected Route</router-link>
        </div>

        <div class="action-card">
          <h3>Session</h3>
          <p>Manage your current session</p>
          <button @click="refreshToken" :disabled="refreshing" class="btn">
            {{ refreshing ? 'Refreshing...' : 'Refresh Token' }}
          </button>
        </div>

        <!-- <div class="action-card">
          <h3>Email</h3>
          <p>Resend verification email</p>
          <button @click="resendVerification" :disabled="resending" class="btn">
            {{ resending ? 'Sending...' : 'Resend Verification' }}
          </button>
        </div> -->
      </div>
    </div>

    <div class="logout-section">
      <button @click="handleLogout" class="btn-logout">Logout</button>
    </div>

    <!-- Modal Popup -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
        </div>
        <div class="modal-footer">
          <button
            class="modal-btn"
            :class="{ 'btn-success': modalType === 'success', 'btn-error': modalType === 'error' }"
            @click="closeModal"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Logout Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click="cancelLogout">
      <div class="modal-content confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="modal-close" @click="cancelLogout">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to logout?</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn btn-secondary" @click="cancelLogout">
            Cancel
          </button>
          <button class="modal-btn btn-logout-confirm" @click="confirmLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const refreshing = ref(false)
const resending = ref(false)
const refreshingToken = ref(false)

// Modal state
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'success' | 'error'>('success')
const showLogoutConfirm = ref(false)

const user = computed(() => authStore.user)

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showPopup = (title: string, message: string, type: 'success' | 'error' = 'success') => {
  modalTitle.value = title
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const refreshToken = async () => {
  refreshing.value = true
  try {
    await AuthService.refreshToken()
    showPopup('Success', 'Token refreshed successfully!', 'success')
  } catch (error) {
    showPopup('Error', 'Failed to refresh token', 'error')
  } finally {
    refreshing.value = false
  }
}

const resendVerification = async () => {
  resending.value = true
  try {
    // Implement resend verification logic here
    showPopup('Info', 'Resend verification would be implemented here', 'success')
  } finally {
    resending.value = false
  }
}

const handleLogout = () => {
  showLogoutConfirm.value = true
}

const cancelLogout = () => {
  showLogoutConfirm.value = false
}

const confirmLogout = async () => {
  showLogoutConfirm.value = false
  await authStore.logout()
  router.push('/login')
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

/* Modal Styles */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.confirm-modal {
  max-width: 350px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #e9ecef;
  color: #343a40;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  color: #495057;
  font-size: 16px;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-error {
  background: #dc3545;
  color: white;
}

.btn-error:hover {
  background: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-logout-confirm {
  background: #dc3545;
  color: white;
}

.btn-logout-confirm:hover {
  background: #c82333;
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
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 0 10px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
