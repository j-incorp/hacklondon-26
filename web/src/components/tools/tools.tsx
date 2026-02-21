import { type ReactElement } from 'react'

import { Drawer } from '@/ui/drawer'

import { HiderTools } from './hider-tools'
import { SeekerTools } from './seeker-tools'

interface ToolsProps {
  type?: 'seeker' | 'hider'
}

const Tools = ({ type = 'seeker' }: ToolsProps): ReactElement => {
  return <Drawer>{type === 'seeker' ? <SeekerTools /> : <HiderTools />}</Drawer>
}

export { Tools }
