import * as z from 'zod'

const joinLobbyFormSchema = z.object({
  code: z.string().length(4, 'Lobby code must be 4 characters long'),
  name: z.string(),
})

type JoinLobbyFormSchema = z.infer<typeof joinLobbyFormSchema>

const createLobbyFormSchema = z.object({
  name: z.string(),
})

type CreateLobbyFormSchema = z.infer<typeof createLobbyFormSchema>

const createLobbyFormResponse = z.object({
  code: z.string().length(4, 'Lobby code must be 4 characters long'),
})

type CreateLobbyFormResponse = z.infer<typeof createLobbyFormResponse>

export type { CreateLobbyFormResponse, CreateLobbyFormSchema, JoinLobbyFormSchema }

export { createLobbyFormResponse, createLobbyFormSchema, joinLobbyFormSchema }
