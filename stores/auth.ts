import { defineStore } from 'pinia'

interface User {
  username: string
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    getToken: (state) => state.user?.token,
    getUsername: (state) => state.user?.username,
  },
  
  actions: {
    login(username: string, password: string) {
      // In a real app, this would make an API call
      // For demo purposes, we'll just simulate a successful login
      if (username && password) {
        // Mock token for demo
        const token = `demo-token-${Math.random().toString(36).substring(2, 15)}`
        this.user = { username, token }
        // Save to localStorage for persistence
        localStorage.setItem('auth', JSON.stringify(this.user))
        return true
      }
      return false
    },
    
    logout() {
      this.user = null
      localStorage.removeItem('auth')
    },
    
    initAuth() {
      // Initialize auth state from localStorage
      const savedAuth = localStorage.getItem('auth')
      if (savedAuth) {
        try {
          this.user = JSON.parse(savedAuth)
        } catch (e) {
          localStorage.removeItem('auth')
        }
      }
    }
  }
}) 