import type { ReactElement } from 'react'

import { useLobbyForm } from '@/hooks/use-lobby-form'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

const LobbyForm = (): ReactElement => {
  const form = useLobbyForm()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="code"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.length === 0) {
              return 'Lobby code is required'
            }
            if (value.length !== 4) {
              return 'Lobby code must be 4 characters'
            }
            return undefined
          },
        }}
        children={(field) => (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1.5">
              Lobby Code
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={String(field.state.value)}
              onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
              onBlur={field.handleBlur}
              placeholder="ABCD"
              type="text"
              maxLength={4}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <span className="block mt-1.5 text-xs text-destructive">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.length === 0) {
              return 'Name is required'
            }
            if (value.length < 2) {
              return 'Name must be at least 2 characters'
            }
            return undefined
          },
        }}
        children={(field) => (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1.5">
              Name
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={String(field.state.value)}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter your name"
              type="text"
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <span className="block mt-1.5 text-xs text-destructive">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          values: state.values,
          fieldMeta: state.fieldMeta,
        })}
        children={(state) => {
          const code = state.values.code ?? ''
          const name = state.values.name ?? ''

          const isDisabled = !code || !name || !state.canSubmit || state.isSubmitting

          return (
            <Button type="submit" variant="default" disabled={isDisabled}>
              {state.isSubmitting ? 'Joining...' : 'Join Lobby'}
            </Button>
          )
        }}
      />
    </form>
  )
}

export { LobbyForm }
