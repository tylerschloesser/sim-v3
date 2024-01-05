import {
  Camera,
  Viewport,
  zoomToCellSize,
} from '@sim-v3/core'
import { clampZoom } from './zoom.js'

export function handleWheel(
  camera: Camera,
  viewport: Viewport,
  ev: WheelEvent,
): void {
  const prevZoom = camera.zoom
  const vx = viewport.size.x
  const vy = viewport.size.y
  const scale = vy * (1 + (1 - camera.zoom))
  const nextZoom = clampZoom(
    camera.zoom + -ev.deltaY / scale,
  )

  if (prevZoom === nextZoom) return

  const rx = ev.offsetX - vx / 2
  const ry = ev.offsetY - vy / 2

  const prevCellSize = zoomToCellSize(prevZoom, vx, vy)
  const nextCellSize = zoomToCellSize(nextZoom, vx, vy)

  const dx = rx / prevCellSize - rx / nextCellSize
  const dy = ry / prevCellSize - ry / nextCellSize

  camera.position.x += dx
  camera.position.y += dy
  camera.zoom = nextZoom
}
