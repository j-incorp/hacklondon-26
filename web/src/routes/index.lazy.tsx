import { createLazyFileRoute } from '@tanstack/react-router'

import { CameraCapture } from '@/components/camera/camera-capture'
import { HandProvider } from '@/components/cards/hand-provider'
import { LobbyForms } from '@/components/lobby/lobby-forms'
import { Location } from '@/components/location/location'
import { MainMap } from '@/components/maps/main-map'
import { Tools } from '@/components/tools/tools'
import { useImageUpload } from '@/hooks/use-image-upload'

const Page = () => {
  const uploadImage = useImageUpload()

  const handleCapture = async (file: File) => {
    await uploadImage(file)
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <CameraCapture onCapture={handleCapture} />
      <Tools type="seeker" />
      <HandProvider>
        <Tools type="hider" />
      </HandProvider>
      <Location />
      <LobbyForms />
      <div className="h-100">
        <MainMap center={[51.505, -0.09]} zoom={11} />
      </div>
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
