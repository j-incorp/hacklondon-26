import { createFileRoute } from '@tanstack/react-router'
import { type ReactElement } from 'react'

const Page = (): ReactElement => {
  return <div>Hello "/rule"!</div>
}

const Route = createFileRoute('/rule')({
  component: Page,
})

export { Route }
