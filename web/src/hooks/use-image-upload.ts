import { useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface PresignResponse {
  url: string
  key: string
}

/**
 * Hook that returns a handler for uploading an image file via the presigned URL
 * endpoint exposed by the API.
 *
 * Usage:
 * ```tsx
 * const uploadImage = useImageUpload()
 * // later…
 * const key = await uploadImage(file)
 * ```
 */
const useImageUpload = () => {
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    // 1. Obtain a presigned upload URL from the API
    const presignRes = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filetype: file.type,
        size: file.size,
      }),
    })

    if (!presignRes.ok) {
      throw new Error(`Failed to get presigned URL: ${presignRes.statusText}`)
    }

    const { url, key } = (await presignRes.json()) as PresignResponse

    // 2. Upload the file directly to S3 via the presigned URL
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload image: ${uploadRes.statusText}`)
    }

    return key
  }, [])

  return uploadImage
}

export { useImageUpload }
