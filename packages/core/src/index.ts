import * as z from 'zod'

export const vec2 = z.strictObject({
  x: z.number(),
  y: z.number(),
})

export type Vec2 = z.infer<typeof vec2>

export interface Camera {
  position: Vec2
  zoom: number
}

export async function initCamera(): Promise<Camera> {
  const position: Vec2 = { x: 0, y: 0 }
  const zoom: number = 0.5
  return { position, zoom }
}

export interface Viewport {
  size: Vec2
}
