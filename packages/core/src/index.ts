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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCellSize(camera: Camera): number {
  return 100
}

export interface Viewport {
  size: Vec2
}

// https://stackoverflow.com/a/17323608
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export interface InitArgs {
  worldId: string
  container: HTMLDivElement
  canvas: HTMLCanvasElement
  signal: AbortSignal
}

export type InitFn<T> = (args: InitArgs) => Promise<T>
