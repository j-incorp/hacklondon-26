import { createLazyFileRoute } from '@tanstack/react-router'
import { type ReactElement } from 'react'

import { HandProvider } from '@/components/cards/hand-provider'
import { Game } from '@/components/game/game'
import { QuestionsProvider } from '@/components/questions/questions-provider'

const Page = (): ReactElement => {
  return (
    <HandProvider>
      <QuestionsProvider>
        <Game />
      </QuestionsProvider>
    </HandProvider>
  )
}

const Route = createLazyFileRoute('/game')({
  component: Page,
})

export { Route }
