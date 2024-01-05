import { Camera, Viewport } from '@sim-v3/core'

export interface Context {
  camera: Camera
  viewport: Viewport
  signal: AbortSignal
}
