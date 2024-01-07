import { Camera } from '@sim-v3/core'
import { Graphics, rgb } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'

export interface Game {
  render(): void
}

export function initGame(
  world: World,
  camera: Camera,
  graphics: Graphics,
): Game {
  return {
    render() {
      graphics.clear()
      graphics.drawGrid(camera)
      graphics.drawRect(0, 0, 1, 1, rgb(255, 0, 0))
      graphics.flush(camera)
    },
  }
}

export { routes } from './routes.js'
