<template>
  <div>
    <nav class="bg-blue-500 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">Nuxt 动态路由示例</NuxtLink>
        <div class="flex space-x-4">
          <NuxtLink to="/" class="hover:text-blue-200">首页</NuxtLink>
          <NuxtLink to="/api-example" class="hover:text-blue-200">API 示例</NuxtLink>
          <NuxtLink to="/buttons" class="hover:text-blue-200">按钮组件</NuxtLink>
          <NuxtLink to="/antd-demo" class="hover:text-blue-200">Ant Design</NuxtLink>
          <a href="https://github.com/nuxt/nuxt" target="_blank" class="hover:text-blue-200 flex items-center">
            <div class="i-mdi-github mr-1"></div>
            GitHub
          </a>
        </div>
      </div>
    </nav>
    
    <main>
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white py-4 mt-10">
      <div class="container mx-auto text-center">
        <p>Nuxt 3 + UnoCSS + Vitest + Playwright + Axios 示例</p>
      </div>
    </footer>
  </div>
</template> 