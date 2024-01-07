import { Camera, Viewport } from '@sim-v3/core'

const cell = { x: 0, y: 0 }

export function* iterateCells(
  viewport: Pick<Viewport, 'size'>,
  camera: Pick<Camera, 'position'>,
  cellSize: number,
) {
  const xCellCount = viewport.size.x / cellSize
  const yCellCount = viewport.size.y / cellSize

  const x0 = Math.floor(camera.position.x - xCellCount / 2)
  const y0 = Math.floor(camera.position.y - yCellCount / 2)

  const xN = Math.ceil(camera.position.x + xCellCount / 2)
  const yN = Math.ceil(camera.position.y + yCellCount / 2)

  for (let x = x0; x < xN; x++) {
    for (let y = y0; y < yN; y++) {
      cell.x = x
      cell.y = y
      yield cell
    }
  }
}
