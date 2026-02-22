import { createLazyFileRoute } from '@tanstack/react-router'
import { Binary } from 'lucide-react'

import { LobbyForms } from '@/components/lobby/lobby-forms'

const Page = () => {
  return (
    <div className="relative min-h-screen p-2 text-center">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpeg')" }}
      />
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-4 inline-flex items-center gap-2 justify-center">
          <Binary className="inline" /> Hack & Seek
        </h2>
        <div className="px-4">
          <LobbyForms />
        </div>
        <div className="mt-12 text-sm text-muted-foreground">
          <a href="https://github.com/j-incorp/hacklondon-26" className="underline" target="_blank">
            Check out the project on GitHub here!
          </a>
        </div>
      </div>
    </div>
  )
}

const Route = createLazyFileRoute('/')({
  component: Page,
})

export { Route }
