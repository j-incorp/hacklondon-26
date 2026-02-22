import { createLazyFileRoute } from '@tanstack/react-router'

import { LobbyForm } from '@/components/lobby/lobby-form'
import { Location } from '@/components/location/location'
import { MainMap } from '@/components/maps/main-map'
import { Tools } from '@/components/tools/tools'

const Page = () => {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Tools type="seeker" />
      <Tools type="hider" />
      <Location />
      <LobbyForm />
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
