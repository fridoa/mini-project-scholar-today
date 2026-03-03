import { create } from "zustand";
import authService from "@/services/auth.service";
import type { IUser } from "@/types/auth.type";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    await authService.login({ email, password });
    const profileRes = await authService.getProfile();
    localStorage.setItem("hasLoggedIn", "true");
    set({
      user: profileRes.data.data,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const profileRes = await authService.getProfile();
      set({
        user: profileRes.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
