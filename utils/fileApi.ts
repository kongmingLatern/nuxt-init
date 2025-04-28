import axios from 'axios'

export interface FileItem {
  Key: string
  LastModified: string
  Size: number
  Url: string
  note?: string
  uploadProgress?: number
}

const API_BASE_URL = 'http://localhost:31234'

// Upload file to the API
export async function uploadFile(file: File, onProgress?: (percent: number, loaded: number) => void): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await axios.post(`${API_BASE_URL}/files/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
          onProgress(percent, progressEvent.loaded)
        }
      }
    })
    
    return response.data.url
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// List all files from the API
export async function listFiles() {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/list`)
    return response?.data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// Get download URL for a file
export function getFileUrl(filename: string): string {
  return `${API_BASE_URL}/files/download/${filename}`
}

// Delete a file
export async function deleteFile(filename: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/files/delete/${filename}`)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
} 