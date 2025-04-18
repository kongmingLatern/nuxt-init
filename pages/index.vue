<script setup lang="tsx">
import { ref } from 'vue'

const count = ref(0)
const dom = <a class="color-blue-600">I'm custom jsx element</a>
</script>

<template>
  <component :is="dom" />
  <div class="min-h-screen bg-gray-100 py-10 px-5">
    <div class="container mx-auto max-w-3xl">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
        首页
      </h1>

      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <p class="mb-4 text-gray-600">
          这是使用Nuxt 3、UnoCSS、Vitest和Playwright构建的应用程序。
        </p>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold">
            动态路由示例：
          </h2>
          <ul class="space-y-2 pl-4">
            <li v-for="id in 5" :key="id" class="list-disc">
              <NuxtLink :to="`/user/${id}`" class="text-blue-500 hover:underline">
                用户 {{ id }}
              </NuxtLink>
            </li>
          </ul>

          <Button @click="count++">
            点击了 {{ count }} 次
          </Button>
          <Button block class="mt-4" @click="count = 0">
            重置计数器
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
