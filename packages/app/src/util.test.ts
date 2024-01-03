import { describe, expect, test } from '@jest/globals'
import { add } from './util.js'

describe('add', () => {
  test('works', () => {
    expect(add(1, 2)).toBe(3)
  })
})
