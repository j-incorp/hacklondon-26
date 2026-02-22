import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { gameStore } from '@/components/game/game-store'
import type { Lobby } from '@/components/game/types'
import { defaultCreateLobbyFormMeta } from '@/components/lobby/meta'
import { createLobbyFormResponse, createLobbyFormSchema } from '@/components/lobby/types'

import { useLocalStorage } from './use-local-storage'

const useCreateLobbyForm = () => {
  const navigate = useNavigate()

  const [_, setLobby] = useLocalStorage<Lobby | undefined>('lobby', undefined)

  return useForm({
    ...defaultCreateLobbyFormMeta,
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('Submitted value:', value)

      const response = await fetch(`${import.meta.env.VITE_HTTP_PREFIX}://${import.meta.env.VITE_API_URL}/lobby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: value.name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create lobby')
      }

      const json = await response.json()

      const lobby = createLobbyFormResponse.safeParse(json)

      if (!lobby.success) {
        throw new Error('Invalid lobby data')
      }

      gameStore.setState((prev) => ({
        ...prev,
        lobby: {
          code: lobby.data.code,
          name: value.name,
          players: [],
        },
      }))

      setLobby({
        code: lobby.data.code,
        name: value.name,
        players: [],
      })

      await navigate({ to: '/game' })
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = createLobbyFormSchema.safeParse(value)

        if (!result.success) {
          const { fieldErrors, formErrors } = result.error.flatten()

          return {
            ...fieldErrors,
            _form: formErrors,
          }
        }

        return undefined
      },
    },
  })
}

export { useCreateLobbyForm }
