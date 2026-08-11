import { describe, expect, it } from 'vitest'
import { buildInvoiceRequest, calculateInvoicePreview } from './invoice'

describe('invoice helpers', () => {
  it('builds the numeric contract without payment, price or balance', () => {
    expect(
      buildInvoiceRequest({
        clientId: '7',
        period: '2026-08',
        observation: ' teste ',
        products: [{ productId: '3', quantity: '2' }],
      })
    ).toEqual({ clientId: 7, year: 2026, month: 8, observation: 'teste', products: [{ productId: 3, quantity: 2 }] })
  })
  it('rejects duplicate or invalid products', () => {
    expect(
      buildInvoiceRequest({
        clientId: '7',
        period: '2026-08',
        observation: '',
        products: [
          { productId: '3', quantity: '1' },
          { productId: '3', quantity: '2' },
        ],
      })
    ).toBeNull()
    expect(
      buildInvoiceRequest({
        clientId: '7',
        period: '2999-01',
        observation: '',
        products: [{ productId: '3', quantity: '1' }],
      })
    ).toBeNull()
  })
  it('previews credit consumption and resulting debt', () => {
    const credit = { position: 'credit' as const, netBalance: -100, debtAmount: 0, creditAmount: 100 }
    expect(calculateInvoicePreview(credit, 50)).toMatchObject({ position: 'credit', creditAmount: 50 })
    expect(calculateInvoicePreview(credit, 150)).toMatchObject({ position: 'debt', debtAmount: 50 })
  })
})
