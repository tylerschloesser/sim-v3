import {
  Camera,
  Viewport,
  zoomToCellSize,
} from '@sim-v3/core'
import { Graphics, rgb } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'
import { iterateCells } from './iterate-cells.js'

export interface Game {
  render(): void
}

export function initGame(
  world: World,
  viewport: Viewport,
  camera: Camera,
  graphics: Graphics,
): Game {
  return {
    render() {
      graphics.clear()
      graphics.drawGrid(camera)

      const cellSize = zoomToCellSize(
        camera.zoom,
        viewport.size.x,
        viewport.size.y,
      )

      for (const cell of iterateCells(
        viewport,
        camera,
        cellSize,
      )) {
        const color = rgb(Math.random() * 255, 0, 0)
        graphics.drawRect(cell.x, cell.y, 1, 1, color)
      }
      graphics.flush(camera)
    },
  }
}

export { routes } from './routes.js'
