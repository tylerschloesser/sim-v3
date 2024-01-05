import {
  Camera,
  Viewport,
  cellSizeToZoom,
  clampCellSize,
  zoomToCellSize,
} from '@sim-v3/core'
import invariant from 'tiny-invariant'

type PointerId = number
const pointerCache = new Map<PointerId, PointerEvent>()

export function handlePointer(
  camera: Camera,
  viewport: Viewport,
  ev: PointerEvent,
): void {
  switch (ev.type) {
    case 'pointerup':
    case 'pointerout':
    case 'pointerleave':
    case 'pointercancel': {
      pointerCache.delete(ev.pointerId)
      break
    }
    case 'pointermove': {
      const prev = pointerCache.get(ev.pointerId)
      pointerCache.set(ev.pointerId, ev)
      if (!ev.buttons || !prev?.buttons) {
        break
      }
      switch (pointerCache.size) {
        case 1: {
          handleOneFingerDrag(camera, viewport, prev, ev)
          break
        }
        case 2: {
          const other = getLastEventForOtherPointer(ev)
          invariant(other.buttons)
          handleTwoFingerDrag(
            camera,
            viewport,
            prev,
            ev,
            other,
          )
          break
        }
      }
      break
    }
  }
}

function handleOneFingerDrag(
  camera: Camera,
  viewport: Viewport,
  prev: PointerEvent,
  next: PointerEvent,
): void {
  const dx = next.offsetX - prev.offsetX
  const dy = next.offsetY - prev.offsetY

  const cellSize = zoomToCellSize(
    camera.zoom,
    viewport.size.x,
    viewport.size.y,
  )

  camera.position.x += -dx / cellSize
  camera.position.y += -dy / cellSize
}

function handleTwoFingerDrag(
  camera: Camera,
  viewport: Viewport,
  prev: PointerEvent,
  next: PointerEvent,
  other: PointerEvent,
): void {
  const ox = other.offsetX
  const oy = other.offsetY
  const px = prev.offsetX
  const py = prev.offsetY
  const nx = next.offsetX
  const ny = next.offsetY

  // center of the line between both pointers
  const pcx = ox + (px - ox) / 2
  const pcy = oy + (py - oy) / 2
  const ncx = ox + (nx - ox) / 2
  const ncy = oy + (ny - oy) / 2

  // distance between both pointers
  const pd = dist(px, py, ox, oy)
  const nd = dist(nx, ny, ox, oy)

  const vx = viewport.size.x
  const vy = viewport.size.y

  const prevCellSize = zoomToCellSize(camera.zoom, vx, vy)
  // prettier-ignore
  const nextCellSize = clampCellSize(prevCellSize * (nd / pd), vx, vy)

  // how far did the center move, aka how much to move
  // the camera in addition to the change in tile size
  const dcx = ncx - pcx
  const dcy = ncy - pcy

  // the point, relative to the center of the screen,
  // at which the change in position due to change
  // in tile size
  const rx = ncx - vx / 2
  const ry = ncy - vy / 2

  // final camera movement
  const dx = rx / prevCellSize - (rx + dcx) / nextCellSize
  const dy = ry / prevCellSize - (ry + dcy) / nextCellSize

  camera.position.x += dx
  camera.position.y += dy
  camera.zoom = cellSizeToZoom(nextCellSize, vx, vy)
}

function getLastEventForOtherPointer(
  ev: PointerEvent,
): PointerEvent {
  invariant(pointerCache.size === 2)
  for (const other of pointerCache.values()) {
    if (other.pointerId !== ev.pointerId) {
      return other
    }
  }
  invariant(false)
}

function dist(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}
