import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem("authToken", token);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  },
}));

export default useAuthStore;
