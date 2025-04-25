<script setup>
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useFileStore } from '~/stores/files'
import { deleteFile, getFileUrl, listFiles, uploadFile } from '~/utils/cos'

const authStore = useAuthStore()
const fileStore = useFileStore()
const router = useRouter()

// Handle authentication
if (!authStore.isLoggedIn) {
  router.push('/login')
}

const loading = ref(false)
const uploadLoading = ref(false)
const fileList = ref([])
const message = ref('')
const messageType = ref('info')
const searchText = ref('')
const editingNote = ref(null)
const modalVisible = ref(false)

// Define table columns
const columns = [
  {
    title: '文件名',
    dataIndex: 'Key',
    key: 'key',
  },
  {
    title: '大小',
    key: 'size',
    customRender: ({ record }) => formatSize(record.Size),
  },
  {
    title: '修改时间',
    key: 'date',
    align: 'center',
    customRender: ({ record }) => formatDate(record.LastModified),
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]

// Filter files based on search text
const filteredFiles = computed(() => {
  const files = fileStore.getFilesByNote(searchText.value)
  return [...files].sort((a, b) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime())
})

// Load file list on component mount
onMounted(async () => {
  await fetchFiles()
})

// Fetch file list
async function fetchFiles() {
  loading.value = true
  message.value = ''

  try {
    await fileStore.fetchFiles()
  }
  catch (error) {
    console.error('Error loading files:', error)
    message.value = '加载文件列表失败'
    messageType.value = 'error'
  }
  finally {
    loading.value = false
  }
}

// Handle file upload
async function handleUpload(info) {
  const file = info.file
  if (!file)
    return

  uploadLoading.value = true
  message.value = ''

  try {
    await fileStore.uploadFile(file)
    message.value = '文件上传成功'
    messageType.value = 'success'

    // Clear upload list
    fileList.value = []
  }
  catch (error) {
    console.error('Upload error:', error)
    message.value = '上传文件失败'
    messageType.value = 'error'
  }
  finally {
    uploadLoading.value = false
  }
}

// Format bytes to human-readable size
function formatSize(bytes) {
  if (bytes === 0)
    return '0 Bytes'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${Number.parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Handle file delete
async function handleDelete(key) {
  loading.value = true
  message.value = ''

  try {
    await fileStore.deleteFile(key)
    message.value = '文件删除成功'
    messageType.value = 'success'
  }
  catch (error) {
    console.error('Delete error:', error)
    message.value = '删除文件失败'
    messageType.value = 'error'
  }
  finally {
    loading.value = false
  }
}

// Handle file download
function handleDownload(key, filename) {
  const url = getFileUrl(key)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename || key)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Extract filename from key
function getFileName(key) {
  const [, ...rest] = key.split('-')
  return rest.join('.') || key
}

// Handle logout
function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Edit note for a file
function openEditNote(key, currentNote) {
  editingNote.value = { key, note: currentNote || '' }
  modalVisible.value = true
}

// Save note for a file
function saveNote() {
  if (editingNote.value) {
    fileStore.saveFileNote(
      editingNote.value.key,
      editingNote.value.note,
    )
    editingNote.value = null
    modalVisible.value = false
  }
}

// Clear search
function clearSearch() {
  searchText.value = ''
}

// Format speed with units
function formatSpeed(speed) {
  if (speed < 1024) {
    return `${speed} KB/s`
  }
  else {
    return `${(speed / 1024).toFixed(2)} MB/s`
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <a-layout>
      <a-layout-header class="bg-white px-6 flex items-center justify-between shadow-sm">
        <h1 class="text-lg font-medium color-white mb-0">
          致命公司mod合集
        </h1>
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

          <!-- Upload Progress Section -->
          <div v-if="fileStore.uploadingFiles.length > 0" class="mt-4">
            <div v-for="file in fileStore.uploadingFiles" :key="file.id" class="mb-4 border p-3 rounded bg-white">
              <div class="flex justify-between mb-1">
                <span class="font-medium">{{ file.file.name }}</span>
                <div class="flex items-center">
                  <span class="mr-4">{{ file.progress }}%</span>
                  <span class="text-blue-600">{{ formatSpeed(file.speed) }}</span>
                </div>
              </div>
              <a-progress :percent="file.progress" :status="file.progress === 100 ? 'success' : 'active'" />
              <div class="text-xs text-gray-500 mt-1">
                <span>文件大小: {{ formatSize(file.file.size) }}</span>
                <span class="ml-3">已上传: {{ formatSize(file.lastLoaded) }}</span>
              </div>
            </div>
          </div>
        </a-card>

        <a-card>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span>文件列表</span>
                <a-button type="link" :loading="loading" title="刷新列表" @click="fetchFiles">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </a-button>
              </div>

              <!-- Search Component -->
              <!-- <div class="flex items-center">
                <a-input-search
                  v-model:value="searchText"
                  placeholder="搜索文件备注"
                  style="width: 200px"
                  @search="() => {}"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                </a-input-search>
                <a-button v-if="searchText" type="link" @click="clearSearch">
                  清除
                </a-button>
              </div>
            </div> -->
            </div>
          </template>

          <a-alert v-if="message" :message="message" :type="messageType" show-icon class="mb-4" />

          <a-table
            :columns="columns" :data-source="filteredFiles" :loading="loading" :pagination="{ pageSize: 10 }"
            :row-key="record => record.Key"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'key'">
                {{ getFileName(record.Key) }}
              </template>
              <template v-if="column.key === 'note'">
                <div>{{ record.note || '-' }}</div>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="primary" @click="handleDownload(record.Key, getFileName(record.Key))">
                    <template #icon>
                      <DownloadOutlined />
                    </template>
                    下载
                  </a-button>

                  <!-- <a-button type="primary" danger @click="handleDelete(record.Key)">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                    删除
                  </a-button> -->
                  <a-popconfirm
                    title="是否删除该文件？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDelete(record.Key)"
                  >
                    <a-button danger>
                      <template #icon>
                        <DeleteOutlined />
                      </template>
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>

    <!-- Note Edit Modal -->
    <a-modal
      v-model:visible="modalVisible"
      title="编辑文件备注"
      ok-text="保存"
      cancel-text="取消"
      @ok="saveNote"
    >
      <a-textarea
        v-if="editingNote"
        v-model:value="editingNote.note"
        placeholder="输入文件备注"
        :rows="4"
      />
    </a-modal>
  </div>
</template>
