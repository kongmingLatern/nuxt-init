import COS from 'cos-js-sdk-v5'

// Tencent Cloud COS configuration
// In a real application, these values should be stored securely in environment variables
const COS_CONFIG = {
  SecretId: 'AKIDqVxA8vfDh6I6kALxMWSAdu53mNktmRs3', // Replace with your Tencent Cloud SecretId
  SecretKey: '6xazA5mERP8dtufCVaQ1OYTAdrqa5MOA', // Replace with your Tencent Cloud SecretKey
  Bucket: 'zmgs-1306001379', // Replace with your COS bucket name
  Region: 'ap-nanjing', // Replace with your COS bucket region
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
export async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const cos = getCosInstance()
    const key = `${Date.now()}-${file.name}` // Create a unique file key
    
    cos.putObject({
      Bucket: COS_CONFIG.Bucket,
      Region: COS_CONFIG.Region,
      Key: key,
      Body: file,
      onProgress: function(progressData) {
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
          Size: item.Size,
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