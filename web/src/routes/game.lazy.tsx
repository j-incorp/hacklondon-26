import { createLazyFileRoute } from '@tanstack/react-router'
import { type ReactElement } from 'react'

import { Game } from '@/components/game/game'
import { QuestionsProvider } from '@/components/questions/questions-provider'

const Page = (): ReactElement => {
  return (
    <QuestionsProvider>
      <Game />
    </QuestionsProvider>
  )
}

const Route = createLazyFileRoute('/game')({
  component: Page,
})

export { Route }
