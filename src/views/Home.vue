<template>
  <div class="home">
    <div class="hero">
      <h1>🔐 JWT Authentication with HttpOnly Cookies</h1>
      <p class="subtitle">Secure, modern authentication system built with Laravel 12 and Vue.js 3</p>

      <div class="hero-buttons">
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-primary">
          <span class="btn-icon">🚀</span> Get Started - Login
        </router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" class="btn btn-primary">
          <span class="btn-icon">📊</span> Go to Dashboard
        </router-link>
        <router-link to="/register" class="btn btn-secondary">
          <span class="btn-icon">📝</span> Create Account
        </router-link>
      </div>
    </div>

    <div class="features">
      <h2>🌟 Key Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Secure HttpOnly Cookies</h3>
          <p>JWT tokens stored in HttpOnly cookies for enhanced security against XSS attacks</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📧</div>
          <h3>Email Verification</h3>
          <p>Secure email verification system with token-based confirmation links</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h3>Auto Token Refresh</h3>
          <p>Automatic JWT token refresh using Axios interceptors for seamless user experience</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔑</div>
          <h3>Password Reset</h3>
          <p>Forgot password functionality with secure token-based reset process</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Protected Routes</h3>
          <p>Vue Router navigation guards to protect sensitive routes</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>TypeScript Support</h3>
          <p>Full TypeScript implementation for better type safety and developer experience</p>
        </div>
      </div>
    </div>

    <div class="tech-stack">
      <h2>🛠 Technology Stack</h2>
      <div class="stack-grid">
        <div class="stack-item">
          <h3>Frontend</h3>
          <ul>
            <li>Vue.js 3 (Composition API)</li>
            <li>TypeScript</li>
            <li>Vue Router</li>
            <li>Pinia (State Management)</li>
            <li>Axios (HTTP Client)</li>
          </ul>
        </div>

        <div class="stack-item">
          <h3>Backend</h3>
          <ul>
            <li>Laravel 12</li>
            <li>Sanctum (API Authentication)</li>
            <li>JWT Auth (tymon/jwt-auth)</li>
            <li>MySQL Database</li>
            <li>Mail (Email Services)</li>
          </ul>
        </div>

        <div class="stack-item">
          <h3>Security</h3>
          <ul>
            <li>HttpOnly Cookies</li>
            <li>CSRF Protection</li>
            <li>CORS Configuration</li>
            <li>Password Hashing (bcrypt)</li>
            <li>Email Verification</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>🚀 Quick Demo</h2>
      <div class="demo-cards">
        <div class="demo-card">
          <h3>1. Register</h3>
          <p>Create a new account with email and password</p>
          <router-link to="/register" class="demo-link">Try Registration →</router-link>
        </div>

        <div class="demo-card">
          <h3>2. Verify Email</h3>
          <p>Check your email and click verification link</p>
          <span class="demo-note">(Check Laravel logs for email content)</span>
        </div>

        <div class="demo-card">
          <h3>3. Login</h3>
          <p>Access your account with secure authentication</p>
          <router-link to="/login" class="demo-link">Try Login →</router-link>
        </div>

        <div class="demo-card">
          <h3>4. Dashboard</h3>
          <p>Access protected content and user information</p>
          <router-link v-if="isAuthenticated" to="/dashboard" class="demo-link">Go to Dashboard →</router-link>
          <span v-else class="demo-note">Login required</span>
        </div>
      </div>
    </div>

    <div class="api-test" v-if="isAuthenticated">
      <h2>🔧 API Testing</h2>
      <div class="api-test-container">
        <button @click="testProtectedAPI" :disabled="testingAPI" class="api-test-btn">
          {{ testingAPI ? 'Testing...' : 'Test Protected API Route' }}
        </button>

        <div v-if="apiResult" class="api-result">
          <h4>API Response:</h4>
          <pre>{{ apiResult }}</pre>
        </div>

        <div v-if="apiError" class="api-error">
          <h4>Error:</h4>
          <p>{{ apiError }}</p>
        </div>
      </div>
    </div>

    <div class="current-status">
      <h2>📊 Current Session Status</h2>
      <div class="status-card">
        <div class="status-item">
          <span class="status-label">Authentication Status:</span>
          <span class="status-value" :class="{ 'status-authenticated': isAuthenticated, 'status-unauthenticated': !isAuthenticated }">
            {{ isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated' }}
          </span>
        </div>

        <div v-if="isAuthenticated" class="status-item">
          <span class="status-label">Logged in as:</span>
          <span class="status-value">{{ authStore.user?.name }}</span>
        </div>

        <div v-if="isAuthenticated" class="status-item">
          <span class="status-label">Email:</span>
          <span class="status-value">{{ authStore.user?.email }}</span>
        </div>

        <div v-if="isAuthenticated" class="status-item">
          <span class="status-label">Email Verified:</span>
          <span class="status-value" :class="{ 'status-verified': authStore.user?.email_verified_at, 'status-not-verified': !authStore.user?.email_verified_at }">
            {{ authStore.user?.email_verified_at ? '✅ Verified' : '❌ Not Verified' }}
          </span>
        </div>
      </div>
    </div>

    <div class="instructions">
      <h2>📖 Setup Instructions</h2>
      <div class="instructions-content">
        <h3>Backend Setup (Laravel):</h3>
        <pre class="code-block">
<code># Clone and setup Laravel
composer create-project laravel/laravel jwt-backend
cd jwt-backend

# Install required packages
composer require laravel/sanctum tymon/jwt-auth

# Configure .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jwt_auth
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Generate JWT secret
php artisan jwt:secret

# Start server
php artisan serve</code>
        </pre>

        <h3>Frontend Setup (Vue.js):</h3>
        <pre class="code-block">
<code># Create Vue.js project
npm create vue@latest vue-frontend

# Install dependencies
npm install axios vue-axios

# Configure .env
VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev</code>
        </pre>
      </div>
    </div>

    <footer class="footer">
      <p>JWT Authentication Demo &copy; 2024</p>
      <p>Built with ❤️ using Laravel 12, Vue.js 3, and TypeScript</p>
      <div class="footer-links">
        <a href="#" @click.prevent="scrollToTop">Back to Top</a>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/forgot-password">Forgot Password</router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/api/auth'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const testingAPI = ref(false)
const apiResult = ref('')
const apiError = ref('')

const testProtectedAPI = async () => {
  testingAPI.value = true
  apiResult.value = ''
  apiError.value = ''

  try {
    const result = await AuthService.testProtectedRoute()
    apiResult.value = JSON.stringify(result, null, 2)
  } catch (error: any) {
    apiError.value = error.response?.data?.error || 'API request failed'
  } finally {
    testingAPI.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // Fetch user data if token exists
  if (localStorage.getItem('access_token') && !authStore.user) {
    authStore.fetchUser().catch(() => {
      // Silently fail if token is invalid
    })
  }
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  margin-bottom: 50px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: white;
  color: #764ba2;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

.features {
  margin: 60px 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.tech-stack {
  margin: 60px 0;
}

.tech-stack h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.stack-item {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stack-item h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.stack-item ul {
  list-style: none;
  padding: 0;
}

.stack-item li {
  padding: 8px 0;
  color: #666;
  border-bottom: 1px solid #f8f9fa;
}

.stack-item li:last-child {
  border-bottom: none;
}

.demo-section {
  margin: 60px 0;
}

.demo-section h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.demo-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}

.demo-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.demo-card p {
  color: #666;
  margin-bottom: 15px;
}

.demo-link {
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.demo-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.demo-note {
  color: #6c757d;
  font-style: italic;
  font-size: 0.9rem;
}

.api-test {
  margin: 60px 0;
  background: #f8f9fa;
  padding: 40px;
  border-radius: 10px;
}

.api-test h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.api-test-container {
  max-width: 600px;
  margin: 0 auto;
}

.api-test-btn {
  display: block;
  width: 100%;
  padding: 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.api-test-btn:hover:not(:disabled) {
  background: #218838;
}

.api-test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.api-result, .api-error {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.api-result {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.api-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.api-result h4, .api-error h4 {
  margin-bottom: 10px;
}

.api-result pre {
  background: white;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.current-status {
  margin: 60px 0;
}

.current-status h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.status-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 600;
  color: #333;
}

.status-value {
  color: #666;
}

.status-authenticated {
  color: #28a745 !important;
  font-weight: 600;
}

.status-unauthenticated {
  color: #dc3545 !important;
  font-weight: 600;
}

.status-verified {
  color: #28a745 !important;
  font-weight: 600;
}

.status-not-verified {
  color: #dc3545 !important;
  font-weight: 600;
}

.instructions {
  margin: 60px 0;
  background: #f8f9fa;
  padding: 40px;
  border-radius: 10px;
}

.instructions h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.instructions-content {
  max-width: 800px;
  margin: 0 auto;
}

.instructions h3 {
  margin-top: 25px;
  margin-bottom: 15px;
  color: #333;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.footer {
  text-align: center;
  padding: 40px 20px;
  margin-top: 60px;
  border-top: 1px solid #dee2e6;
  color: #6c757d;
}

.footer-links {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-links a {
  color: #007bff;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .feature-grid,
  .stack-grid,
  .demo-cards {
    grid-template-columns: 1fr;
  }

  .status-item {
    flex-direction: column;
    gap: 5px;
  }

  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
