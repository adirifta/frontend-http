import { defineStore } from 'pinia';
import AuthService, { type User, type LoginCredentials, type RegisterData } from '@/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
      user: null,
      isAuthenticated: false,
      authChecked: false,
      loading: false,
      error: null
    }),

    actions: {
        async login(credentials: LoginCredentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await AuthService.login(credentials);
                this.user = response.user;
                this.isAuthenticated = true;
                this.authChecked = true;
                return { success: true, data: response };
            } catch (error: any) {
                this.error = error.response?.data?.error || 'Login failed';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async register(data: RegisterData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await AuthService.register(data);
                return { success: true, data: response };
            } catch (error: any) {
                this.error = error.response?.data?.errors || 'Registration failed';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async logout() {
          try {
            await AuthService.logout();
          } finally {
            this.$reset();
          }
        },

        async fetchUser() {
          if (this.loading) return;

          this.loading = true;

          try {
            const user = await AuthService.getCurrentUser();
            this.user = user;
            this.isAuthenticated = true;
          } catch (error: any) {
            console.log('Failed to fetch user:', error);
            this.user = null;
            this.isAuthenticated = false;

            if (error.response?.status !== 401) {
              this.error = error.response?.data?.message || 'Failed to fetch user';
            }
          } finally {
            this.authChecked = true;
            this.loading = false;
          }
        },

        setError(error: string | null) {
            this.error = error;
        },

        clearError() {
            this.error = null;
        }
    },

    getters: {
        getUser: (state) => state.user,
        getIsAuthenticated: (state) => state.isAuthenticated,
        getLoading: (state) => state.loading,
        getError: (state) => state.error
    },

    persist: {
      enabled: true,
      strategies: [
        {
          key: 'auth-storage',
          storage: localStorage,
          paths: ['user', 'isAuthenticated', 'authChecked']
        }
      ]
    }
});
