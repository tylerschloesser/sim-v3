import * as z from 'zod'

export const vec2 = z.strictObject({
  x: z.number(),
  y: z.number(),
})

export type Vec2 = z.infer<typeof vec2>
