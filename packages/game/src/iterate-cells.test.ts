import { describe, expect, test } from '@jest/globals'
import { Camera, Viewport } from '@sim-v3/core'
import { iterateCells } from './iterate-cells.js'

describe('iterate-cells', () => {
  describe('iterateCells', () => {
    test('base', () => {
      const viewport: Pick<Viewport, 'size'> = {
        size: { x: 100, y: 100 },
      }

      const camera: Camera = {
        position: { x: 0, y: 0 },
        zoom: 0.5,
      }

      const cells = Array.from(
        iterateCells(viewport, camera),
      )
      expect(cells.length).toBe(4)
      // TODO seed random
      // expect(cells).toMatchSnapshot()
    })
  })
})
