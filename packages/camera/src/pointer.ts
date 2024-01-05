import {
  Camera,
  Viewport,
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
  console.log(
    'TODO handleTwoFingerDrag',
    camera,
    viewport,
    prev,
    next,
    other,
  )
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
