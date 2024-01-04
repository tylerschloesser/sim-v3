import { Camera, Viewport } from '@sim-v3/core'
import { Graphics } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'

export function initGame(
  world: World,
  camera: Camera,
  graphics: Graphics,
  viewport: Viewport,
) {
  return {
    render() {
      graphics.clear()
      graphics.drawGrid(camera.position, 20, viewport)
    },
  }
}

export type Game = ReturnType<typeof initGame>
