import { Camera, InitFn, Vec2 } from '@sim-v3/core'
import { Context } from './context.js'
import { handlePointer } from './pointer.js'
import { CameraTaper } from './taper.js'
import { handleWheel } from './wheel.js'

export const initCamera: InitFn<Camera> = async ({
  viewport,
  signal,
}) => {
  const position: Vec2 = { x: 0, y: 0 }
  const zoom: number = 0.5
  const camera: Camera = { position, zoom }
  const { canvas } = viewport
  const taper = new CameraTaper(
    100,
    camera,
    viewport,
    signal,
  )
  const context: Context = {
    camera,
    viewport,
    signal,
    taper,
  }
  const options: AddEventListenerOptions = {
    signal,
    passive: true,
  }

  // prettier-ignore
  {
    canvas.addEventListener('pointerup', handlePointer(context), options)
    canvas.addEventListener('pointerdown', handlePointer(context), options)
    canvas.addEventListener('pointerenter', handlePointer(context), options)
    canvas.addEventListener('pointerleave', handlePointer(context), options)
    canvas.addEventListener('pointercancel', handlePointer(context), options)
    canvas.addEventListener('pointermove', handlePointer(context), options)

    canvas.addEventListener('wheel', handleWheel(context), options)
  }

  return camera
}
