<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input v-model="form.password" type="password" required>
            </div>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            <div v-if="error" class="error">{{ error }}</div>
            <div class="links">
                <router-link to="/forgot-password">Forgot Password?</router-link>
                <router-link to="/register">Register</router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
    email: '',
    password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    const result = await authStore.login(form.value);

    if (result.success) {
        router.push('/dashboard');
    } else {
        error.value = result.error as string;
    }

    loading.value = false;
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error {
    color: red;
    margin-top: 10px;
}

.links {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
}
</style>
