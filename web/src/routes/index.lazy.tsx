import { createLazyFileRoute } from '@tanstack/react-router'

import { Tools } from '@/components/drawer/drawer'
import { Location } from '@/components/location/location'

const Page = () => {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Tools />
      <Location />
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
