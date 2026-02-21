import * as z from 'zod'

import { location } from '@/components/types'

const pictureType = z.literal(['five-buildings', 'tallest-building', 'body-of-water', 'train-station', 'sky'])

type PictureType = z.infer<typeof pictureType>

const pictureResponseSchema = z.object({
  position: location,
  pictureType: z.string(),
  href: z.url(),
})

type PictureResponseSchema = z.infer<typeof pictureResponseSchema>

const pictureRequestSchema = z.object({
  position: location,
  pictureType: z.string(),
})

type PictureRequestSchema = z.infer<typeof pictureRequestSchema>

export type { PictureRequestSchema, PictureResponseSchema, PictureType }

export { pictureRequestSchema, pictureResponseSchema, pictureType }
