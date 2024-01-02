import { describe, expect, test } from '@jest/globals'
import { add } from './index.js'

describe('add', () => {
  test('works', () => {
    expect(add(1, 2)).toBe(3)
  })
})
