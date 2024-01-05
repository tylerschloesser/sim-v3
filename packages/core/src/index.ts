import invariant from 'tiny-invariant'
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

export const MIN_TILE_SIZE_FACTOR = 1 / 256
export const MAX_TILE_SIZE_FACTOR = 1 / 8

export const MIN_ZOOM = 0
export const MAX_ZOOM = 1

export function zoomToCellSize(
  zoom: number,
  vx: number,
  vy: number,
): number {
  const minTileSize =
    Math.min(vx, vy) * MIN_TILE_SIZE_FACTOR
  const maxTileSize =
    Math.min(vx, vy) * MAX_TILE_SIZE_FACTOR
  invariant(zoom >= MIN_ZOOM)
  invariant(zoom <= MAX_ZOOM)
  return minTileSize + (maxTileSize - minTileSize) * zoom
}

type ViewportListenerFn = (viewport: Viewport) => void

export interface Viewport {
  container: HTMLDivElement
  canvas: HTMLCanvasElement
  size: Vec2
  pixelRatio: number

  addListener(listener: ViewportListenerFn): void
  removeListener(listener: ViewportListenerFn): void
}

// https://stackoverflow.com/a/17323608
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export interface InitArgs {
  worldId: string
  viewport: Viewport
  signal: AbortSignal
}

export type InitFn<T> = (args: InitArgs) => Promise<T>
