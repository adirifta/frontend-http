// src/services/auth-init.ts
import { useAuthStore } from '@/stores/auth';

export const initializeAuth = async (): Promise<boolean> => {
  try {
    const authStore = useAuthStore();

    // Hanya coba auto-login jika ada cookie
    if (document.cookie.includes('jwt_token')) {
      console.log('Cookie found, attempting auto-login...');
      await authStore.fetchUser();
      console.log('Auto-login successful');
      return true;
    } else {
      console.log('No auth cookie found');
      return false;
    }
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return false;
  }
};
