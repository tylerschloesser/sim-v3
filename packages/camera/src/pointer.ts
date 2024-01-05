import {
  cellSizeToZoom,
  clampCellSize,
  dist,
  zoomToCellSize,
} from '@sim-v3/core'
import curry from 'lodash/fp/curry.js'
import invariant from 'tiny-invariant'
import { Context } from './context.js'

type PointerId = number
const pointerCache = new Map<PointerId, PointerEvent>()

export const handlePointer = curry<
  Context,
  PointerEvent,
  void
>((context: Context, ev: PointerEvent) => {
  const { taper } = context
  switch (ev.type) {
    case 'pointerup': {
      pointerCache.delete(ev.pointerId)
      taper.start(100, ev.timeStamp)
      break
    }
    case 'pointerout':
    case 'pointerleave':
    case 'pointercancel': {
      pointerCache.delete(ev.pointerId)
      break
    }
    case 'pointerdown':
    case 'pointermove': {
      const prev = pointerCache.get(ev.pointerId)
      pointerCache.set(ev.pointerId, ev)
      if (!ev.buttons || !prev?.buttons) {
        break
      }
      switch (pointerCache.size) {
        case 1: {
          handleOneFingerDrag(context, prev, ev)
          break
        }
        case 2: {
          const other = getLastEventForOtherPointer(ev)
          invariant(other.buttons)
          handleTwoFingerDrag(context, prev, ev, other)
          break
        }
      }
      break
    }
  }
})

function handleOneFingerDrag(
  context: Context,
  prev: PointerEvent,
  next: PointerEvent,
): void {
  const { camera, viewport, taper } = context
  const cellSize = zoomToCellSize(
    camera.zoom,
    viewport.size.x,
    viewport.size.y,
  )

  const dx = -(next.offsetX - prev.offsetX) / cellSize
  const dy = -(next.offsetY - prev.offsetY) / cellSize

  camera.position.x += dx
  camera.position.y += dy

  taper.record(dx, dy, prev.timeStamp, next.timeStamp)
}

function handleTwoFingerDrag(
  context: Context,
  prev: PointerEvent,
  next: PointerEvent,
  other: PointerEvent,
): void {
  const { camera, viewport } = context
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
