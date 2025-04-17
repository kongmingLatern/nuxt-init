<template>
  <div class="min-h-screen bg-gray-100 py-10 px-5">
    <div class="container mx-auto max-w-3xl">
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-800">
            用户详情 #{{ id }}
          </h1>
          <NuxtLink to="/" class="text-blue-500 hover:underline flex items-center">
            <div class="i-mdi-arrow-left mr-1 text-lg"></div>
            返回首页
          </NuxtLink>
        </div>

        <div v-if="loading" class="py-10 text-center">
          <div class="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
          <p class="text-red-500">{{ error }}</p>
          <Button class="mt-4" @click="fetchUser">重试</Button>
        </div>
        
        <div v-else-if="user" class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">姓名</p>
                <p class="font-medium">{{ user.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">用户名</p>
                <p class="font-medium">{{ user.username }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">邮箱</p>
                <p class="font-medium">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">电话</p>
                <p class="font-medium">{{ user.phone }}</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-2">地址</h3>
            <p>{{ user.address.street }}, {{ user.address.suite }}</p>
            <p>{{ user.address.city }}, {{ user.address.zipcode }}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-2">公司</h3>
            <p class="font-medium">{{ user.company.name }}</p>
            <p class="text-sm text-gray-600">{{ user.company.catchPhrase }}</p>
            <p class="text-sm italic">{{ user.company.bs }}</p>
          </div>
          
          <div v-if="posts.length > 0" class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-2">最近的帖子</h3>
            <ul class="space-y-2">
              <li v-for="post in posts" :key="post.id" class="border-b pb-2 last:border-0">
                <p class="font-medium">{{ post.title }}</p>
                <p class="text-sm text-gray-600 line-clamp-2">{{ post.body }}</p>
              </li>
            </ul>
          </div>
          
          <div class="flex justify-between mt-6">
            <Button 
              v-if="Number(id) > 1" 
              @click="navigateTo(`/user/${Number(id) - 1}`)"
            >
              上一个用户
            </Button>
            <div v-else></div>
            
            <Button 
              @click="navigateTo(`/user/${Number(id) + 1}`)"
            >
              下一个用户
            </Button>
          </div>
        </div>
        <div v-else class="py-10 text-center text-gray-500">
          未找到用户数据
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User, Post } from '~/composables/useApi'

const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const user = ref<User | null>(null)
const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const api = useApi()

// 获取用户数据
const fetchUser = async () => {
  loading.value = true
  error.value = null
  
  try {
    user.value = await api.users.getById(id)
    
    // 获取用户的帖子
    try {
      posts.value = await api.posts.getByUserId(id)
    } catch (err) {
      console.error('获取帖子失败:', err)
      posts.value = []
    }
  } catch (err: any) {
    console.error('获取用户数据失败:', err)
    error.value = err.message || '获取用户数据失败'
    user.value = null
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchUser()
})

// 监听路由参数变化，重新获取数据
watch(() => route.params.id, (newId) => {
  const newIdValue = Array.isArray(newId) ? newId[0] : newId
  if (newIdValue !== id) {
    fetchUser()
  }
})
</script> 