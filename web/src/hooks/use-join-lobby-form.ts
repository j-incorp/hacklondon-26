import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { gameStore } from '@/components/game/game-store'
import type { Lobby } from '@/components/game/types'
import { defaultJoinLobbyFormMeta } from '@/components/lobby/meta'
import { joinLobbyFormSchema } from '@/components/lobby/types'

import { useLocalStorage } from './use-local-storage'

const useJoinLobbyForm = () => {
  const navigate = useNavigate()

  const [_, setLobby] = useLocalStorage<Lobby | undefined>('lobby', undefined)

  return useForm({
    ...defaultJoinLobbyFormMeta,
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('Submitted value:', value)

      gameStore.setState((prev) => ({
        ...prev,
        lobby: {
          code: value.code,
          name: value.name,
          players: [],
        },
      }))

      setLobby({
        code: value.code,
        name: value.name,
        players: [],
      })

      await navigate({ to: '/game' })
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = joinLobbyFormSchema.safeParse(value)

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

export { useJoinLobbyForm }
