import * as z from 'zod'

const actionTypes = z.literal(['ASK_QUESTION', 'ANSWER_QUESTION', 'VETO_QUESTION', 'SEND_CURSE'])

type ActionType = z.infer<typeof actionTypes>

export type { ActionType }

export { actionTypes }
