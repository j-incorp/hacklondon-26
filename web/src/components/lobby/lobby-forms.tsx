import type { ReactElement } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'

import { CreateLobbyForm } from './create-lobby-form'
import { JoinLobbyForm } from './join-lobby-form'

const LobbyForms = (): ReactElement => {
  return (
    <Tabs defaultValue="create" className="">
      <TabsList>
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="join">Join</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateLobbyForm />
      </TabsContent>
      <TabsContent value="join">
        <JoinLobbyForm />
      </TabsContent>
    </Tabs>
  )
}

export { LobbyForms }
