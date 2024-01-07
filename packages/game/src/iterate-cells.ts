import { Camera, Viewport } from '@sim-v3/core'

const cell = { x: 0, y: 0 }

export function* iterateCells(
  viewport: Viewport,
  camera: Camera,
) {
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      cell.x = x
      cell.y = y
      yield cell
    }
  }
}
