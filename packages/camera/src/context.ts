import { Camera, Viewport } from '@sim-v3/core'
import { CameraTaper } from './taper.js'

export interface Context {
  camera: Camera
  viewport: Viewport
  signal: AbortSignal
  taper: CameraTaper
}
