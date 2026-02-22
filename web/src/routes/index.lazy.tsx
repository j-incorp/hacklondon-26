import { createLazyFileRoute } from '@tanstack/react-router'

import { PictureAlert } from '@/components/alert/picture-alert'
import { CameraCapture } from '@/components/camera/camera-capture'
import { LobbyForms } from '@/components/lobby/lobby-forms'
import { Location } from '@/components/location/location'
import { useImageUpload } from '@/hooks/use-image-upload'

const Page = () => {
  const uploadImage = useImageUpload()

  const handleCapture = async (file: File) => {
    await uploadImage(file)
  }

  return (
    <div className="p-2">
      <CameraCapture onCapture={handleCapture} />
      <Location />
      <LobbyForms />
      <PictureAlert onCapture={handleCapture} question={{ type: 'sky' }} />
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
