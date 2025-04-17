<template>
  <div class="min-h-screen bg-gray-100 py-10 px-5">
    <div class="container mx-auto max-w-3xl">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
        API 示例
      </h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-semibold mb-4">创建一个新帖子</h2>
        
        <form @submit.prevent="createPost" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">标题</label>
            <input 
              v-model="newPost.title" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-gray-700 mb-1">内容</label>
            <textarea 
              v-model="newPost.body" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-1">用户ID</label>
            <input 
              v-model.number="newPost.userId" 
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <Button type="submit" class="w-full">创建帖子</Button>
        </form>
        
        <div v-if="createdPost" class="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 class="text-lg font-medium text-green-800 mb-2">帖子创建成功!</h3>
          <div class="bg-white p-3 rounded border border-green-200">
            <p class="font-medium">{{ createdPost.title }}</p>
            <p class="text-gray-600">{{ createdPost.body }}</p>
            <p class="text-gray-500 text-sm mt-2">ID: {{ createdPost.id }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">帖子列表</h2>
          <Button @click="fetchPosts" size="sm">刷新</Button>
        </div>
        
        <div v-if="loading" class="py-10 text-center">
          <div class="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
          <p class="text-red-500">{{ error }}</p>
          <Button class="mt-4" @click="fetchPosts">重试</Button>
        </div>
        
        <div v-else-if="posts.length === 0" class="py-10 text-center text-gray-500">
          没有帖子数据
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="post in posts.slice(0, 5)" :key="post.id" class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium">{{ post.title }}</h3>
            <p class="text-gray-600 mt-2">{{ post.body }}</p>
            <div class="mt-2 text-sm text-gray-500">
              用户ID: {{ post.userId }} | 帖子ID: {{ post.id }}
            </div>
            
            <div class="flex mt-3 space-x-2">
              <Button 
                @click="deletePost(post.id)" 
                variant="danger" 
                size="sm"
              >
                删除
              </Button>
            </div>
          </div>
          
          <div class="text-center text-gray-500 mt-2">
            仅显示前5条记录...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post } from '~/composables/useApi'

const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const newPost = ref<Partial<Post>>({
  title: '',
  body: '',
  userId: 1
})

const createdPost = ref<Post | null>(null)

const api = useApi()

// 获取帖子列表
const fetchPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    posts.value = await api.posts.getAll()
  } catch (err: any) {
    console.error('获取帖子列表失败:', err)
    error.value = err.message || '获取帖子列表失败'
    posts.value = []
  } finally {
    loading.value = false
  }
}

// 创建帖子
const createPost = async () => {
  try {
    const post = await api.posts.create(newPost.value)
    createdPost.value = post
    
    // 清空表单
    newPost.value = {
      title: '',
      body: '',
      userId: 1
    }
    
    // 重新获取帖子列表
    await fetchPosts()
    
    // 5秒后清除创建成功的消息
    setTimeout(() => {
      createdPost.value = null
    }, 5000)
  } catch (err: any) {
    console.error('创建帖子失败:', err)
    alert(`创建帖子失败: ${err.message || '未知错误'}`)
  }
}

// 删除帖子
const deletePost = async (id: number) => {
  if (!confirm('确定要删除这篇帖子吗？')) return
  
  try {
    await api.posts.delete(id)
    alert('帖子已删除')
    
    // 更新本地数据
    posts.value = posts.value.filter(post => post.id !== id)
  } catch (err: any) {
    console.error('删除帖子失败:', err)
    alert(`删除帖子失败: ${err.message || '未知错误'}`)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchPosts()
})
</script> 