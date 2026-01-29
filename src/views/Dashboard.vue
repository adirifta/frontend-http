<template>
    <div class="dashboard">
        <h2>Welcome, {{ user?.name }}!</h2>
        <p>Email: {{ user?.email }}</p>
        <p>Email Verified: {{ user?.email_verified_at ? 'Yes' : 'No' }}</p>

        <div class="actions">
            <button @click="testProtectedRoute">Test Protected Route</button>
            <button @click="handleLogout" class="logout">Logout</button>
        </div>
    </div>
</template>

<!-- src/views/Dashboard.vue - Perbaiki script section -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const refreshing = ref(false)
const resending = ref(false)
const message = ref('')
const error = ref('')

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
  if (!confirm('Refresh token akan memperpanjang sesi Anda. Lanjutkan?')) {
    return
  }

  refreshing.value = true
  error.value = ''
  message.value = ''

  try {
    await AuthService.refreshToken()
    message.value = '✅ Token berhasil di-refresh!'

    // Refresh user data
    await authStore.fetchUser()

  } catch (err: any) {
    console.error('Refresh token error:', err)
    error.value = err.response?.data?.error || 'Gagal refresh token. Silakan login kembali.'

    if (err.response?.status === 401) {
      await authStore.logout()
      router.push('/login')
    }
  } finally {
    refreshing.value = false
  }
}

const resendVerification = async () => {
  if (!user.value?.email) {
    error.value = 'Email tidak tersedia'
    return
  }

  if (!confirm(`Kirim ulang email verifikasi ke ${user.value.email}?`)) {
    return
  }

  resending.value = true
  error.value = ''
  message.value = ''

  try {
    // Kirim request ke API untuk resend verification
    await AuthService.resendVerification({ email: user.value.email })
    message.value = '📧 Email verifikasi telah dikirim ulang. Silakan cek inbox Anda.'

  } catch (err: any) {
    console.error('Resend verification error:', err)
    error.value = err.response?.data?.error || 'Gagal mengirim ulang email verifikasi.'
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
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.actions {
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.logout {
    background: #dc3545;
    color: white;
}
</style>
