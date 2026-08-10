import { describe, expect, it } from 'vitest'
import {
  addCurrency,
  BRLStringToNumber,
  multiplyCurrency,
  nullableNumberToBRLString,
  numberToBRLString,
  subtractCurrency,
} from './currency'

describe('currency utilities', () => {
  it('parses localized BRL without returning a localized payload', () => {
    expect(BRLStringToNumber('R$ 1.234,56')).toBe(1234.56)
  })

  it('formats numeric values in BRL', () => {
    expect(numberToBRLString(1234.56)).toBe('R$ 1.234,56')
  })

  it('does not present an unknown legacy purchase price as zero', () => {
    expect(nullableNumberToBRLString(null)).toBe('—')
    expect(nullableNumberToBRLString(0)).toBe('R$ 0,00')
  })

  it('uses monetary multiplication for an order line total', () => {
    expect(multiplyCurrency(10.1, 3)).toBe(30.3)
  })

  it('calculates residual and amount due with monetary operations', () => {
    expect(subtractCurrency(100.1, 20.05)).toBe(80.05)
    expect(addCurrency(80.05, 19.95)).toBe(100)
  })

  it('rejects invalid multiplication inputs', () => {
    expect(multiplyCurrency(10, -1)).toBeNaN()
    expect(multiplyCurrency(10, 1.5)).toBeNaN()
  })
})
