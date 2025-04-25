<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import {
  UploadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { uploadFile, listFiles, deleteFile, getFileUrl } from '~/utils/cos'
import type { ColumnType } from 'ant-design-vue/es/table'

const authStore = useAuthStore()
const router = useRouter()

// Handle authentication
if (!authStore.isLoggedIn) {
  router.push('/login')
}

const files = ref<Array<{ Key: string, LastModified: string, Size: number, Url: string }>>([])
const loading = ref(false)
const uploadLoading = ref(false)
const fileList = ref<any[]>([])
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')

const columns: ColumnType<any> = [
  {
    title: '文件名', dataIndex: 'Key', key: 'key',
  },
  { title: '大小', key: 'size', customRender: ({ record }) => formatSize(record.Size) },
  { title: '修改时间', key: 'date', align: 'right', customRender: ({ record }) => formatDate(record.LastModified) },
  { title: '操作', key: 'action', align: 'center' }
]

// Load file list on component mount
onMounted(async () => {
  await fetchFiles()
})

// Fetch file list from COS
const fetchFiles = async () => {
  loading.value = true
  message.value = ''

  try {
    files.value = await listFiles()
  } catch (error) {
    console.error('Error loading files:', error)
    message.value = '加载文件列表失败'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Handle file upload
const handleUpload = async (info: any) => {
  const file = info.file
  if (!file) return

  uploadLoading.value = true
  message.value = ''

  try {
    await uploadFile(file)
    message.value = '文件上传成功'
    messageType.value = 'success'

    // Reload file list
    await fetchFiles()

    // Clear upload list
    fileList.value = []
  } catch (error) {
    console.error('Upload error:', error)
    message.value = '上传文件失败'
    messageType.value = 'error'
  } finally {
    uploadLoading.value = false
  }
}

// Format bytes to human-readable size
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Handle file delete
const handleDelete = async (key: string) => {
  loading.value = true
  message.value = ''

  try {
    await deleteFile(key)
    message.value = '文件删除成功'
    messageType.value = 'success'

    // Reload file list
    await fetchFiles()
  } catch (error) {
    console.error('Delete error:', error)
    message.value = '删除文件失败'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Handle file download
const handleDownload = (key: string, filename: string) => {
  const url = getFileUrl(key)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename || key)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Extract filename from key
const getFileName = (key: string) => {
  return key.split('/').pop() || key
}

// Handle logout
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <a-layout>
      <a-layout-header class="bg-white px-6 flex items-center justify-between shadow-sm">
        <h1 class="text-lg font-medium color-white mb-0">腾讯云COS文件管理系统</h1>
        <a-button type="link" class="color-white" @click="handleLogout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-button>
      </a-layout-header>

      <a-layout-content class="p-6">
        <a-card class="mb-6">
          <template #title>
            <div class="flex items-center">
              <UploadOutlined class="mr-2" />
              <span>文件上传</span>
            </div>
          </template>

          <a-upload :file-list="fileList" :custom-request="handleUpload" :multiple="true" list-type="picture">
            <a-button :loading="uploadLoading">
              <template #icon>
                <UploadOutlined />
              </template>
              选择文件
            </a-button>
          </a-upload>
        </a-card>

        <a-card>
          <template #title>
            <div class="flex items-center">
              <span>文件列表</span>
              <a-button type="link" :loading="loading" @click="fetchFiles" title="刷新列表">
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
            </div>
          </template>

          <a-alert v-if="message" :message="message" :type="messageType" show-icon class="mb-4" />

          <a-table :columns="columns" :data-source="files" :loading="loading" :pagination="{ pageSize: 10 }"
            :row-key="record => record.Key">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'key'">
                {{ getFileName(record.Key) }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="primary" @click="handleDownload(record.Key, getFileName(record.Key))">
                    <template #icon>
                      <DownloadOutlined />
                    </template>
                    下载
                  </a-button>
                  <a-button type="primary" danger @click="handleDelete(record.Key)">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                    删除
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>