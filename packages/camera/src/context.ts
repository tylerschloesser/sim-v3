import { Camera, Viewport } from '@sim-v3/core'
import { CameraMomentum } from './momentum.js'

export interface Context {
  camera: Camera
  viewport: Viewport
  signal: AbortSignal
  momentum: CameraMomentum
}
