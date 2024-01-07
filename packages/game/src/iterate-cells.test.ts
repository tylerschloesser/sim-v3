import { describe, expect, test } from '@jest/globals'
import { Camera, Vec2, Viewport } from '@sim-v3/core'
import { iterateCells } from './iterate-cells.js'

describe('iterate-cells', () => {
  describe('iterateCells', () => {
    test('base', () => {
      const viewport: Pick<Viewport, 'size'> = {
        size: { x: 10, y: 10 },
      }

      const camera: Camera = {
        position: { x: 0, y: 0 },
        zoom: 0.5,
      }

      const cellSize = 5

      const cells: Vec2[] = []

      for (const cell of iterateCells(
        viewport,
        camera,
        cellSize,
      )) {
        cells.push({ ...cell })
      }
      expect(cells.length).toBe(4)
      expect(cells).toEqual([
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 0 },
      ])
    })
  })
})
