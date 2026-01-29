import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://backend-laravel-http-only-cookie.test/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Tambah token ke header jika diperlukan
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Jika error 401 (Unauthorized) dan belum pernah coba refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Coba refresh token
                await axios.post(
                    'http://localhost:8000/api/auth/refresh',
                    {},
                    { withCredentials: true }
                );

                // Coba request lagi
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Jika refresh gagal, redirect ke login
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
