import { createLazyFileRoute } from '@tanstack/react-router'

import { Location } from '@/components/location/location'
import { Tools } from '@/components/tools/tools'

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
