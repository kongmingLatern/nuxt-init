<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref('')

const authStore = useAuthStore()
const router = useRouter()

// Redirect if already logged in
if (authStore.isLoggedIn) {
  router.push('/dashboard')
}

async function handleLogin() {
  if (!username.value || !password.value) {
    loginError.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  loginError.value = ''

  try {
    const success = authStore.login(username.value, password.value)

    if (success) {
      router.push('/dashboard')
    }
    else {
      loginError.value = '登录失败，请检查用户名和密码'
    }
  }
  catch (error) {
    console.error('Login error:', error)
    loginError.value = '登录时发生错误，请稍后重试'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <a-card title="登录" class="w-full max-w-md">
      <a-form layout="vertical" @submit.prevent="handleLogin">
        <a-form-item label="用户名" required>
          <a-input v-model:value="username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="密码" required>
          <a-input-password v-model:value="password" placeholder="请输入密码" />
        </a-form-item>

        <div v-if="loginError" class="text-red-500 mb-4">
          {{ loginError }}
        </div>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            登录
          </a-button>
        </a-form-item>

        <div class="text-center text-gray-500 text-sm">
          用户名: admin, 密码: admin (测试用)
        </div>
      </a-form>
    </a-card>
  </div>
</template>
