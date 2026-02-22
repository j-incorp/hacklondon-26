import { type ReactElement } from 'react'

import { Drawer } from '@/ui/drawer'

import { HiderTools } from './hider-tools'
import { SeekerTools } from './seeker-tools'

interface ToolsProps {
  type?: 'HIDER' | 'SEEKER' | ''
}

const Tools = ({ type = 'SEEKER' }: ToolsProps): ReactElement => {
  return <Drawer>{type === 'SEEKER' ? <SeekerTools /> : <HiderTools />}</Drawer>
}

export { Tools }
