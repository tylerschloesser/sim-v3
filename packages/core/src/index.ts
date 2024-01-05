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

export const MIN_CELL_SIZE_FACTOR = 1 / 256
export const MAX_CELL_SIZE_FACTOR = 1 / 8

export const MIN_ZOOM = 0
export const MAX_ZOOM = 1

export function clamp(
  v: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(v, min))
}

function getMinCellSize(vx: number, vy: number): number {
  return Math.max(vx, vy) * MIN_CELL_SIZE_FACTOR
}

function getMaxCellSize(vx: number, vy: number): number {
  return Math.max(vx, vy) * MAX_CELL_SIZE_FACTOR
}

export function zoomToCellSize(
  zoom: number,
  vx: number,
  vy: number,
): number {
  const minCellSize = getMinCellSize(vx, vy)
  const maxCellSize = getMaxCellSize(vx, vy)
  invariant(zoom >= MIN_ZOOM)
  invariant(zoom <= MAX_ZOOM)
  return minCellSize + (maxCellSize - minCellSize) * zoom
}

export function clampCellSize(
  cellSize: number,
  vx: number,
  vy: number,
) {
  const minCellSize = getMinCellSize(vx, vy)
  const maxCellSize = getMaxCellSize(vx, vy)
  return clamp(cellSize, minCellSize, maxCellSize)
}

export function cellSizeToZoom(
  cellSize: number,
  vx: number,
  vy: number,
): number {
  const minCellSize = getMinCellSize(vx, vy)
  const maxCellSize = getMaxCellSize(vx, vy)
  const zoom =
    (cellSize - minCellSize) / (maxCellSize - minCellSize)
  return clamp(zoom, MIN_ZOOM, MAX_ZOOM)
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
