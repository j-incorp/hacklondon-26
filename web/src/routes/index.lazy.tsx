import { createLazyFileRoute } from '@tanstack/react-router'

import { LobbyForm } from '@/components/lobby/lobby-form'
import { Location } from '@/components/location/location'
import { Tools } from '@/components/tools/tools'

const Page = () => {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Tools type="seeker" />
      <Tools type="hider" />
      <Location />
      <LobbyForm />
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
