import { createLazyFileRoute } from '@tanstack/react-router'
import { MainMap } from '../components/maps/main-map'
const Route = createLazyFileRoute('/')({
  component: Page,
})

function Page() {
  return (
    <div className="p-2">
      <div className="h-screen">
        {' '}
        {/* or whatever height you want */}
        <MainMap />
      </div>
      <h3>Welcome Home!</h3>
    </div>
  )
}

export { Route }
