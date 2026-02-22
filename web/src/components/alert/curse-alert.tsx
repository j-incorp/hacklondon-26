import type { ReactElement } from 'react'

import type { Curse } from '../cards/types'

interface CurseAlertProps {
  curse: Curse
}

const CurseAlert = ({ curse }: CurseAlertProps): ReactElement => {
  console.log(curse)

  return <div></div>
}

export { CurseAlert }
