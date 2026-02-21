import * as z from 'zod'

const boroughDataType = z.object({
  type: z.string(),
  features: z.array(
    z.object({
      type: z.string(),
      properties: z.object({
        name: z.string(),
        colour: z.string().optional(),
      }),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.array(z.array(z.number()))),
      }),
    }),
  ),
})

type BoroughDataType = z.infer<typeof boroughDataType>

export type { BoroughDataType }

export { boroughDataType }
