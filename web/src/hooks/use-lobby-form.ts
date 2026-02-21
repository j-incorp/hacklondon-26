import { useForm } from '@tanstack/react-form'

import { defaultLobbyFormMeta } from '@/components/lobby/meta'
import { lobbyFormSchema } from '@/components/lobby/types'

const useLobbyForm = () => {
  return useForm({
    ...defaultLobbyFormMeta,
    onSubmit: ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('Submitted value:', value)
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
