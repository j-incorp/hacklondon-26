import { createLazyFileRoute } from '@tanstack/react-router'

import { CameraCapture } from '@/components/camera/camera-capture'
import { LobbyForm } from '@/components/lobby/lobby-form'
import { Location } from '@/components/location/location'
import { MainMap } from '@/components/maps/main-map'
import { Tools } from '@/components/tools/tools'
import { useImageUpload } from '@/hooks/use-image-upload'

const Page = () => {
  const uploadImage = useImageUpload()

  const handleCapture = async (file: File) => {
    const key = await uploadImage(file)
    
    console.log('Uploaded image key:', key)
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <CameraCapture onCapture={handleCapture} />
      <Tools type="seeker" />
      <Tools type="hider" />
      <Location />
      <LobbyForm />
      <div className="h-100">
        <MainMap />
      </div>
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
