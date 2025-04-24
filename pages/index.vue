<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Redirect to dashboard if logged in, otherwise to login page
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
  else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <a-spin tip="Loading..." />
  </div>
</template>
