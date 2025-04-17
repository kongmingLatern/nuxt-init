<script setup lang="ts">
import { DownloadOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

// 按钮尺寸
const size = ref < 'large' | 'middle' | 'small' > ('middle')

// 加载状态
const loading = ref(false)
const loadingIcon = ref(LoadingOutlined)

// 切换加载状态
function toggleLoading() {
  loading.value = !loading.value
}
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8">
      Ant Design Vue 组件示例
    </h1>

    <!-- 按钮示例 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">
        按钮类型
      </h2>
      <div class="flex flex-wrap gap-4">
        <a-button type="primary">
          Primary Button
        </a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">
          Dashed Button
        </a-button>
        <a-button type="text">
          Text Button
        </a-button>
        <a-button type="link">
          Link Button
        </a-button>
      </div>
    </section>

    <!-- 按钮危险类型 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">
        危险按钮
      </h2>
      <div class="flex flex-wrap gap-4">
        <a-button type="primary" danger>
          Primary
        </a-button>
        <a-button danger>
          Default
        </a-button>
        <a-button type="dashed" danger>
          Dashed
        </a-button>
        <a-button type="text" danger>
          Text
        </a-button>
        <a-button type="link" danger>
          Link
        </a-button>
      </div>
    </section>

    <!-- 按钮尺寸 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">
        按钮尺寸
      </h2>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm text-gray-500 w-20">Size:</span>
          <a-radio-group v-model:value="size">
            <a-radio-button value="large">
              Large
            </a-radio-button>
            <a-radio-button value="middle">
              Default
            </a-radio-button>
            <a-radio-button value="small">
              Small
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="flex flex-wrap gap-2">
          <a-button type="primary" :size="size">
            Primary
          </a-button>
          <a-button :size="size">
            Default
          </a-button>
          <a-button type="dashed" :size="size">
            Dashed
          </a-button>
          <a-button type="link" :size="size">
            Link
          </a-button>
        </div>
      </div>
    </section>

    <!-- 加载状态 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">
        加载状态
      </h2>
      <div class="flex flex-wrap gap-4">
        <a-button type="primary" loading>
          Loading
        </a-button>
        <a-button type="primary" loading :loading-icon="loadingIcon">
          Custom Loading Icon
        </a-button>
        <a-button :loading="loading" @click="toggleLoading">
          {{ loading ? 'Click to stop loading' : 'Click to load' }}
        </a-button>
      </div>
    </section>

    <!-- 图标按钮 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">
        图标按钮
      </h2>
      <div class="flex flex-wrap gap-4">
        <a-button type="primary">
          <template #icon>
            <SearchOutlined />
          </template>
          Search
        </a-button>
        <a-button>
          <template #icon>
            <DownloadOutlined />
          </template>
          Download
        </a-button>
        <a-button shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
        <a-button type="primary" shape="circle">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </div>
    </section>
  </div>
</template>
