import { describe, expect, it } from 'vitest'
import { parsePositiveId } from './positiveId'

describe('parsePositiveId', () => {
  it.each([1, 2, '1', '2'] as const)('accepts the positive ID %s', (value) => {
    expect(parsePositiveId(value)).toBe(Number(value))
  })

  it.each([undefined, null, '', '0', '-1', '1.5', 'abc', ['2'], 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    'rejects the invalid ID %s',
    (value) => {
      expect(parsePositiveId(value)).toBeNull()
    }
  )
})
