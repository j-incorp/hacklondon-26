import { CircleQuestionMark } from 'lucide-react'
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

const Tools = (): ReactElement => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-400"
        >
          <CircleQuestionMark className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[60dvh]">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="justify-center text-center">blah</div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export { Tools }
