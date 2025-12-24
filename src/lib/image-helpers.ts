/* Image upload and optimization helpers */

export interface ImageUploadOptions {
  maxSize?: number // bytes
  maxWidth?: number // pixels
  maxHeight?: number // pixels
  quality?: number // 0-1
}

export function getImageUrl(path: string, width?: number, height?: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
  if (!width && !height) return `${baseUrl}/${path}`
  return `${baseUrl}/${path}?w=${width || 'auto'}&h=${height || 'auto'}&fit=cover`
}

export async function compressImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<Blob> {
  const { quality = 0.8 } = options

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => resolve(blob!), 'image/webp', quality)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function validateImage(file: File, options: ImageUploadOptions = {}): string | null {
  const { maxSize = 5 * 1024 * 1024 } = options
  if (file.size > maxSize) return `File too large. Max ${maxSize / 1024 / 1024}MB`
  if (!file.type.startsWith('image/')) return 'File must be an image'
  return null
}
