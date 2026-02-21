import { CircleQuestionMark, Toolbox } from 'lucide-react'
import { type ReactElement } from 'react'

import { Button } from '@/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'

import { Questions } from '../questions/question'

const Tools = (): ReactElement => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-primary text-white hover:bg-orange-600 focus-visible:ring-orange-400"
        >
          <CircleQuestionMark className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[60dvh]">
        <DrawerHeader className="mb-4">
          <DrawerTitle className="inline-flex items-center justify-center gap-2">
            <Toolbox className="size-5" />
            Toolbox
          </DrawerTitle>
          <DrawerDescription>Use these tools to find the hider!</DrawerDescription>
        </DrawerHeader>
        <div className="w-[90%] justify-center text-center mx-auto">
          <Questions />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export { Tools }
