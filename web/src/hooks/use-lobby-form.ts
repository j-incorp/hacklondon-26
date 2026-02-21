import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { gameStore } from '@/components/game/game-store'
import { defaultLobbyFormMeta } from '@/components/lobby/meta'
import { lobbyFormSchema } from '@/components/lobby/types'

const useLobbyForm = () => {
  const navigate = useNavigate()

  return useForm({
    ...defaultLobbyFormMeta,
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('Submitted value:', value)

      gameStore.setState((prev) => ({
        ...prev,
        lobby: {
          code: value.code,
          name: value.name,
        },
      }))

      await navigate({ to: '/game' })
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = lobbyFormSchema.safeParse(value)

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

export { useLobbyForm }
