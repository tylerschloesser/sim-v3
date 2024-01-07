import { describe, expect, test } from '@jest/globals'
import { iterateCells } from './iterate-cells.js'

describe('iterate-cells', () => {
  describe('iterateCells', () => {
    test('base', () => {
      const cells = Array.from(iterateCells())
      expect(cells.length).toBe(4)
      // TODO seed random
      // expect(cells).toMatchSnapshot()
    })
  })
})
