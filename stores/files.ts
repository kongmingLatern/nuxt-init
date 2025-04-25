import { defineStore } from 'pinia'
import { uploadFile as cosUploadFile, listFiles as cosListFiles, deleteFile as cosDeleteFile, getFileUrl, getCosInstance, COS_CONFIG } from '~/utils/cos'
import COS from 'cos-js-sdk-v5'

export interface FileItem {
  Key: string
  LastModified: string
  Size: number
  Url: string
  note?: string
  uploadProgress?: number
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  speed: number
  lastLoaded: number
  lastTime: number
}

export const useFileStore = defineStore('files', {
  state: () => ({
    files: [] as FileItem[],
    loading: false,
    uploadingFiles: [] as UploadingFile[]
  }),
  
  getters: {
    getFiles: (state) => state.files,
    getFilesByNote: (state) => (searchText: string) => {
      if (!searchText) return state.files
      return state.files.filter(file => 
        file.note && file.note.toLowerCase().includes(searchText.toLowerCase())
      )
    },
    isLoading: (state) => state.loading
  },
  
  actions: {
    async fetchFiles() {
      this.loading = true
      try {
        const files = await cosListFiles()
        
        // Retrieve notes from localStorage
        const savedNotes = localStorage.getItem('fileNotes')
        const notesMap = savedNotes ? JSON.parse(savedNotes) : {}
        
        // Merge files with saved notes
        this.files = files.map(file => ({
          ...file,
          note: notesMap[file.Key] || ''
        }))
      } catch (error) {
        console.error('Error fetching files:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async uploadFile(file: File) {
      const uploadId = Date.now().toString()
      const uploadingFile = {
        id: uploadId,
        file,
        progress: 0,
        speed: 0,
        lastLoaded: 0,
        lastTime: Date.now()
      }
      
      // Add to uploading files
      this.uploadingFiles.push(uploadingFile)
      
      try {
        // Use the cosUploadFile function with a progress callback
        const url = await cosUploadFile(file, (progress, loaded) => {
          // Update progress and calculate speed
          const index = this.uploadingFiles.findIndex(f => f.id === uploadId)
          if (index !== -1) {
            const now = Date.now()
            const timeDiff = now - this.uploadingFiles[index].lastTime
            
            // Only update speed if enough time has passed (to make calculation more stable)
            if (timeDiff > 500) {
              const loadedDiff = loaded - this.uploadingFiles[index].lastLoaded
              // Calculate speed in KB/s
              const speedKBps = (loadedDiff / 1024) / (timeDiff / 1000)
              
              this.uploadingFiles[index].speed = Math.round(speedKBps * 10) / 10
              this.uploadingFiles[index].lastLoaded = loaded
              this.uploadingFiles[index].lastTime = now
            }
            
            this.uploadingFiles[index].progress = progress
          }
        })
        
        // Remove from uploading files
        this.uploadingFiles = this.uploadingFiles.filter(f => f.id !== uploadId)
        
        // Refresh file list
        await this.fetchFiles()
        
        return url
      } catch (error) {
        // Remove from uploading files on error
        this.uploadingFiles = this.uploadingFiles.filter(f => f.id !== uploadId)
        console.error('Error uploading file:', error)
        throw error
      }
    },
    
    async deleteFile(key: string) {
      try {
        await cosDeleteFile(key)
        
        // Also remove the note if it exists
        const savedNotes = localStorage.getItem('fileNotes')
        if (savedNotes) {
          const notesMap = JSON.parse(savedNotes)
          if (notesMap[key]) {
            delete notesMap[key]
            localStorage.setItem('fileNotes', JSON.stringify(notesMap))
          }
        }
        
        // Update local state
        this.files = this.files.filter(file => file.Key !== key)
      } catch (error) {
        console.error('Error deleting file:', error)
        throw error
      }
    },
    
    saveFileNote(key: string, note: string) {
      // Update in local state
      const fileIndex = this.files.findIndex(file => file.Key === key)
      if (fileIndex !== -1) {
        this.files[fileIndex].note = note
      }
      
      // Save to localStorage
      const savedNotes = localStorage.getItem('fileNotes')
      const notesMap = savedNotes ? JSON.parse(savedNotes) : {}
      notesMap[key] = note
      localStorage.setItem('fileNotes', JSON.stringify(notesMap))
    }
  }
}) 