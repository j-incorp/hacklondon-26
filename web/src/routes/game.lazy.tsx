import { createLazyFileRoute } from '@tanstack/react-router'
import { type ReactElement } from 'react'

const Page = (): ReactElement => {
  return <div>Hello "/game"!</div>
}

const Route = createLazyFileRoute('/game')({
  component: Page,
})

export { Route }
