import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side to avoid hydration issues
  if (process.server) return
  
  const authStore = useAuthStore()
  
  // If user is not logged in and trying to access a protected route
  if (!authStore.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  // If user is logged in and trying to access login page
  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/dashboard')
  }
}) 