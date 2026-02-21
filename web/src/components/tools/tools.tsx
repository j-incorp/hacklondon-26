import { type ReactElement } from 'react'

import { Drawer } from '@/ui/drawer'

import { SeekerTools } from './seeker-tools'

interface ToolsProps {
  type?: 'seeker' | 'hider'
}

const Tools = ({ type = 'seeker' }: ToolsProps): ReactElement => {
  return <Drawer>{type === 'seeker' ? <SeekerTools /> : undefined}</Drawer>
}

export { Tools }
