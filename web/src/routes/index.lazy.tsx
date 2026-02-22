import { createLazyFileRoute } from '@tanstack/react-router'

import { CameraCapture } from '@/components/camera/camera-capture'
import { LobbyForms } from '@/components/lobby/lobby-forms'
import { Location } from '@/components/location/location'
import { useImageUpload } from '@/hooks/use-image-upload'
import { useLocation } from '@/hooks/use-location'

const Page = () => {
  const uploadImage = useImageUpload()

  const handleCapture = async (file: File) => {
    await uploadImage(file)
  }
  const { location } = useLocation()
  const lat = location?.latitude ?? 51.505
  const long = location?.longitude ?? -0.09
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <CameraCapture onCapture={handleCapture} />
      <Location />
      <LobbyForms />
      <div className="h-100">
        <MainMap lat={lat} lng={long} zoom={9} />
      </div>
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
