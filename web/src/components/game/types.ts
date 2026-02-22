import * as z from 'zod'

const lobby = z.object({
  code: z.string(),
  name: z.string(),
})

type Lobby = z.infer<typeof lobby>

const game = z.object({
  playerId: z.string(),
  lobby: lobby,
})

type Game = z.infer<typeof game>

export type { Game, Lobby }

export { game, lobby }
