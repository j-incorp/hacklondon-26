import type { ReactElement } from 'react'

import type { Player } from './types'

const PlayerList = ({ players }: { players: Player[] }): ReactElement => (
  <ul className="p-4 space-y-2 text-center">
    {players ? (
      players.map((p) => (
        <li key={p.id} className="text-lg">
          {p.name}
        </li>
      ))
    ) : (
      <li className="text-gray-500">No players yet</li>
    )}
  </ul>
)

export { PlayerList }
