import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage (client-side only)
  authStore.initAuth()
}) 