import { describe, expect, it } from 'vitest'
import { inputMask } from './mask'

describe('currency input mask', () => {
  it.each([
    ['1', 'R$ 0,01'],
    ['10', 'R$ 0,10'],
    ['100', 'R$ 1,00'],
    ['123456', 'R$ 1.234,56'],
  ])('formats %s as %s', (input, expected) => {
    expect(inputMask(input, 'currency')).toBe(expected)
  })

  it('keeps only monetary digits', () => {
    expect(inputMask('R$ 1.234,56', 'currency')).toBe('R$ 1.234,56')
  })
})
