import { describe, expect, test } from '@jest/globals'
import { Camera, Vec2, Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'
import { iterateCells } from './iterate-cells.js'

describe('iterate-cells', () => {
  describe('iterateCells', () => {
    const testCases: {
      cameraPosition: Vec2
      expected: Vec2[]
    }[] = [
      {
        cameraPosition: { x: 0, y: 0 },
        expected: [
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: 0, y: -1 },
          { x: 0, y: 0 },
        ],
      },
      {
        cameraPosition: { x: 0.5, y: 0.5 },
        expected: [
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
          { x: 0, y: -1 },
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: -1 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ],
      },
    ]

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      invariant(testCase)
      const { cameraPosition, expected } = testCase
      test(`test case ${i}`, () => {
        const viewport: Pick<Viewport, 'size'> = {
          size: { x: 10, y: 10 },
        }

        const camera: Pick<Camera, 'position'> = {
          position: cameraPosition,
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
        expect(cells.length).toBe(expected.length)
        expect(cells).toEqual(expected)
      })
    }
  })
})
