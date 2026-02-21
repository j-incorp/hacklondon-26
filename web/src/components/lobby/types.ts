import * as z from 'zod'

const lobbyFormSchema = z.object({
  code: z.string().length(4, 'Lobby code must be 4 characters long'),
  name: z.string(),
})

type LobbyFormSchema = z.infer<typeof lobbyFormSchema>

export type { LobbyFormSchema }

export { lobbyFormSchema }
