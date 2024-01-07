import { Camera } from '@sim-v3/core'
import { Graphics } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'
import { iterateCells } from './iterate-cells.js'

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
      for (const cell of iterateCells()) {
        graphics.drawRect(cell.x, cell.y, 1, 1, cell.color)
      }
      graphics.flush(camera)
    },
  }
}

export { routes } from './routes.js'
