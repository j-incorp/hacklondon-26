import { createLazyFileRoute } from '@tanstack/react-router'

import { LobbyForms } from '@/components/lobby/lobby-forms'
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
      <LobbyForms />
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
