import { Camera, InitFn, Vec2 } from '@sim-v3/core'
import { handlePointer } from './pointer.js'
import { handleWheel } from './wheel.js'

export const initCamera: InitFn<Camera> = async ({
  viewport,
  signal,
}) => {
  const position: Vec2 = { x: 0, y: 0 }
  const zoom: number = 0.5
  const camera: Camera = { position, zoom }
  const { canvas } = viewport

  {
    canvas.addEventListener(
      'pointerup',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )
    canvas.addEventListener(
      'pointerdown',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )
    canvas.addEventListener(
      'pointerenter',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )
    canvas.addEventListener(
      'pointerleave',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )
    canvas.addEventListener(
      'pointercancel',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )
    canvas.addEventListener(
      'pointermove',
      (ev) => {
        handlePointer(camera, viewport, ev)
      },
      { signal },
    )

    canvas.addEventListener(
      'wheel',
      (ev) => {
        handleWheel(camera, viewport, ev)
      },
      { signal },
    )
  }

  return camera
}
