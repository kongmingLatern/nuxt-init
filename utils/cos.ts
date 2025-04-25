import COS from 'cos-js-sdk-v5'

// Tencent Cloud COS configuration
// In a real application, these values should be stored securely in environment variables
export const COS_CONFIG = {
  SecretId: '', // Replace with your Tencent Cloud SecretId
  SecretKey: '', // Replace with your Tencent Cloud SecretKey
  Bucket: '', // Replace with your COS bucket name
  Region: '', // Replace with your COS bucket region
}

// Initialize COS SDK instance
let cosInstance: COS | null = null

export function getCosInstance(): COS {
  if (!cosInstance) {
    cosInstance = new COS({
      SecretId: COS_CONFIG.SecretId,
      SecretKey: COS_CONFIG.SecretKey,
    })
  }
  return cosInstance
}

// Upload file to COS
export async function uploadFile(file: File, onProgress?: (percent: number, loaded: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const cos = getCosInstance()
    const key = `${Date.now()}-${file.name}` // Create a unique file key
    
    cos.putObject({
      Bucket: COS_CONFIG.Bucket,
      Region: COS_CONFIG.Region,
      Key: key,
      Body: file,
      onProgress: function(progressData) {
        if (onProgress) {
          const percent = Math.floor(progressData.percent * 100)
          const loaded = progressData.loaded
          onProgress(percent, loaded)
        }
        console.log(progressData)
      }
    }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        // Return the file URL
        const fileUrl = `https://${COS_CONFIG.Bucket}.cos.${COS_CONFIG.Region}.myqcloud.com/${key}`
        resolve(fileUrl)
      }
    })
  })
}

// List all files in the bucket
export async function listFiles(): Promise<Array<{ Key: string, LastModified: string, Size: number, Url: string }>> {
  return new Promise((resolve, reject) => {
    const cos = getCosInstance()
    
    cos.getBucket({
      Bucket: COS_CONFIG.Bucket,
      Region: COS_CONFIG.Region,
      // Prefix: '', // Can filter by prefix if needed
    }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        // Transform and return the file list with URLs
        const files = (data.Contents || []).map(item => ({
          Key: item.Key,
          LastModified: item.LastModified,
          Size: Number(item.Size), // Ensure Size is a number
          Url: `https://${COS_CONFIG.Bucket}.cos.${COS_CONFIG.Region}.myqcloud.com/${item.Key}`
        }))
        resolve(files)
      }
    })
  })
}

// Get download URL for a file
export function getFileUrl(key: string): string {
  return `https://${COS_CONFIG.Bucket}.cos.${COS_CONFIG.Region}.myqcloud.com/${key}`
}

// Delete a file from COS
export async function deleteFile(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cos = getCosInstance()
    
    cos.deleteObject({
      Bucket: COS_CONFIG.Bucket,
      Region: COS_CONFIG.Region,
      Key: key
    }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
} 