import { Camera, Viewport } from '@sim-v3/core'
import { Graphics } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'

export function initGame(
  world: World,
  camera: Camera,
  graphics: Graphics,
) {
  return {
    render() {
      graphics.clear()
      graphics.drawGrid(camera)
    },
  }
}

export type Game = ReturnType<typeof initGame>
