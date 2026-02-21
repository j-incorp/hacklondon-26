import * as z from 'zod'

import { position } from '@/components/types'

const pictureType = z.literal(['5-builds', 'tallest-building', 'body-of-water', 'train-station', 'sky'])

const pictureResponseSchema = z.object({
  position,
  pictureType: z.string(),
  href: z.url(),
})

type PictureType = z.infer<typeof pictureType>
type PictureResponseSchema = z.infer<typeof pictureResponseSchema>

export type { PictureResponseSchema, PictureType }

export { pictureResponseSchema, pictureType }
