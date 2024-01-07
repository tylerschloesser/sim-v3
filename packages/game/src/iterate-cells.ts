import { Camera, Viewport } from '@sim-v3/core'

const cell = { x: 0, y: 0 }

export function* iterateCells(
  viewport: Pick<Viewport, 'size'>,
  camera: Camera,
  cellSize: number,
) {
  const xCellCount = viewport.size.x / cellSize
  const yCellCount = viewport.size.y / cellSize

  const x0 = camera.position.x - Math.floor(xCellCount / 2)
  const y0 = camera.position.y - Math.floor(yCellCount / 2)

  for (let x = 0; x < Math.ceil(xCellCount); x++) {
    for (let y = 0; y < Math.ceil(yCellCount); y++) {
      cell.x = x0 + x
      cell.y = y0 + y
      yield cell
    }
  }
}
