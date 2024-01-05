import { Camera, getCellSize } from '@sim-v3/core'
import invariant from 'tiny-invariant'

type PointerId = number
const pointerCache = new Map<PointerId, PointerEvent>()

export function handlePointer(
  camera: Camera,
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
          handleOneFingerDrag(camera, prev, ev)
          break
        }
        case 2: {
          const other = getLastEventForOtherPointer(ev)
          invariant(other.buttons)
          handleTwoFingerDrag(camera, prev, ev, other)
          break
        }
      }
      break
    }
  }
}

function handleOneFingerDrag(
  camera: Camera,
  prev: PointerEvent,
  next: PointerEvent,
): void {
  const dx = next.offsetX - prev.offsetX
  const dy = next.offsetY - prev.offsetY

  const cellSize = getCellSize(camera)

  camera.position.x += -dx / cellSize
  camera.position.y += -dy / cellSize
}

function handleTwoFingerDrag(
  camera: Camera,
  prev: PointerEvent,
  next: PointerEvent,
  other: PointerEvent,
): void {
  console.log(
    'TODO handleTwoFingerDrag',
    camera,
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
