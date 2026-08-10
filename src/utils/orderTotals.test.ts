import { describe, expect, it } from 'vitest'
import { calculateCurrentOrderTotal, calculateOrderLineTotal } from './orderTotals'

const products = [
  { value: '7', label: 'Batata', salePrice: 15 },
  { value: '8', label: 'Cenoura', salePrice: 10 },
]

describe('order totals', () => {
  it('matches a string Select value and multiplies quantity by sale price', () => {
    expect(calculateOrderLineTotal('7', '20', products)).toBe(300)
  })

  it('normalizes a numeric product id at the calculation boundary', () => {
    expect(calculateOrderLineTotal(7, 20, products)).toBe(300)
  })

  it('uses the same line calculation for the current order total', () => {
    expect(calculateCurrentOrderTotal([{ productId: '7', quantity: '20' }], products)).toBe(300)
  })

  it('recalculates the aggregate after adding a line and changing quantity or product', () => {
    const firstLine = [{ productId: '7', quantity: '2' }]
    expect(calculateCurrentOrderTotal(firstLine, products)).toBe(30)

    const withSecondLine = [...firstLine, { productId: '8', quantity: '3' }]
    expect(calculateCurrentOrderTotal(withSecondLine, products)).toBe(60)

    const changedQuantity = [firstLine[0], { productId: '8', quantity: '5' }]
    expect(calculateCurrentOrderTotal(changedQuantity, products)).toBe(80)

    const changedProduct = [firstLine[0], { productId: '7', quantity: '5' }]
    expect(calculateCurrentOrderTotal(changedProduct, products)).toBe(105)
  })

  it('returns zero until product and a positive integer quantity are valid', () => {
    expect(calculateOrderLineTotal('', '20', products)).toBe(0)
    expect(calculateOrderLineTotal('7', '0', products)).toBe(0)
  })
})
