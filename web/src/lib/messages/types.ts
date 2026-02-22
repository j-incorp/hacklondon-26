import * as z from 'zod'

const messageTypes = z.literal([
  'PLAYER_INFO',
  'PLAYER_JOINED',
  'PLAYER_LEFT',
  'GAME_STATE_CHANGE',
  'HIDING_PHASE_START',
  'PLAYER_POSITION',
  'PLAYER_ACTION',
  'PLAYER_LIST_UPDATE',
])

type MessageType = z.infer<typeof messageTypes>

export type { MessageType }

export { messageTypes }
