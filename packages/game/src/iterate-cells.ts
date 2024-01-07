import { rgba } from '@sim-v3/graphics'

const cell = { x: 0, y: 0, color: rgba(0, 0, 0, 1) }

export function* iterateCells() {
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      cell.x = x
      cell.y = y
      cell.color.r = Math.random()
      yield cell
    }
  }
}
