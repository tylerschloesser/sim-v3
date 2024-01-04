import { Camera, InitFn, Vec2 } from '@sim-v3/core'

export const initCamera: InitFn<Camera> = async ({
  canvas,
  signal,
}) => {
  const position: Vec2 = { x: 0, y: 0 }
  const zoom: number = 0.5

  canvas.addEventListener(
    'pointermove',
    (ev) => {
      console.log('pointermove', ev.clientX, ev.clientY)
    },
    { signal },
  )

  return { position, zoom }
}
