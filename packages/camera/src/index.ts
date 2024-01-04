import { Camera, InitFn, Vec2 } from '@sim-v3/core'

export const initCamera: InitFn<Camera> = async () => {
  const position: Vec2 = { x: 0, y: 0 }
  const zoom: number = 0.5
  return { position, zoom }
}
