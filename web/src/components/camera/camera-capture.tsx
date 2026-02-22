import { Camera } from 'lucide-react'
import { type ChangeEvent, type ReactElement, useCallback, useRef, useState } from 'react'

import { Button } from '@/ui/button'

interface CameraCaptureProps {
  /** Called with the captured image file once the user takes a photo. */
  onCapture: (file: File) => void | Promise<void>
  className?: string
}

const CameraCapture = ({ onCapture, className }: CameraCaptureProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
          try {
            setLoading(true)
            await onCapture(file)
          } finally {
            setLoading(false)
    
            // Reset so the same file can be re-selected if needed
            if (inputRef.current) {
              inputRef.current.value = ''
            }
        }
      }
    },
    [onCapture],
  )

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void handleChange(e)}
      />
      <Button className={className} onClick={handleClick} disabled={loading} size="lg">
        <Camera className="size-5" />
        {loading ? 'Uploading…' : 'Take Photo'}
      </Button>
    </>
  )
}

export { CameraCapture }
