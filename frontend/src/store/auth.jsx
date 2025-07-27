import { create } from 'zustand';
import { useCartStore } from './cart.jsx';


const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Clear error
    clearError: () => set({ error: null }),

    // Set loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // Login function
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                set({
                    user: data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                // Load user's cart after successful login
                setTimeout(() => {
                    useCartStore.getState().loadCart();
                }, 100);
                return { success: true, message: data.message };
            } else {
                set({ isLoading: false, error: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set({ isLoading: false, error: errorMessage });
            return { success: false, message: errorMessage };
        }
    },

    // Signup function
    signup: async (username, email, password, role = "user") => {
        set({ isLoading: true, error: null });
        
        try {
            const res = await fetch(`${baseUrl}/api/auth/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, role })
            });

            const data = await res.json();

            if (data.success) {
                set({
                    user: data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                // Load user's cart after successful signup
                setTimeout(() => {
                    useCartStore.getState().loadCart();
                }, 100);
                return { success: true, message: data.message };
            } else {
                set({ isLoading: false, error: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set({ isLoading: false, error: errorMessage });
            return { success: false, message: errorMessage };
        }
    },

    // Logout function
    logout: async () => {
        set({ isLoading: true });
        
        try {
            const res = await fetch(`${baseUrl}/api/auth/logout`, {
                method: "POST",
                credentials: 'include'
            });

            const data = await res.json();

            if (data.success) {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
                return { success: true, message: data.message };
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
        
        // Always clear auth state on logout, even if request fails
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
        return { success: true, message: "Logged out successfully" };
    },

    // Check authentication status
    checkAuth: async () => {
        set({ isLoading: true });
        
        try {
            const res = await fetch(`${baseUrl}/api/auth/me`,
                            {
                method: "GET",
                credentials: "include", // important for sending cookies
            }
                        );
            const data = await res.json();

            if (data.success) {
                set({
                    user: data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                // Load user's cart after successful auth check
                setTimeout(() => {
                    useCartStore.getState().loadCart();
                }, 100);
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
            }
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    },

    // Helper function to check if user is admin
    isAdmin: () => {
        const { user } = get();
        return user && user.role === "admin";
    }
}));
