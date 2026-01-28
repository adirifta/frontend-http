import apiClient from './axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<{ user: User; message: string }> {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    }

    async register(data: RegisterData): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    }

    async logout(): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/logout');
        localStorage.removeItem('access_token');
        return response.data;
    }

    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        const response = await apiClient.get(`/auth/verify-email/${token}`);
        return response.data;
    }

    async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/forgot-password', data);
        return response.data;
    }

    async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    }

    async refreshToken(): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    }

    // Test protected route
    async testProtectedRoute(): Promise<{ message: string }> {
        const response = await apiClient.get('/protected');
        return response.data;
    }
}

export default new AuthService();
