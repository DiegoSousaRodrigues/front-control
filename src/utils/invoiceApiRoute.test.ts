import { describe, expect, it } from 'vitest'
import {
  hasEmptyInvoiceQuery,
  parseInvoiceCancelBody,
  parseInvoiceIDQuery,
  parseInvoiceIssueBody,
  parseInvoiceListQuery,
} from './invoiceApiRoute'

describe('invoice BFF validation', () => {
  it('accepts only numeric canonical issue bodies', () => {
    expect(
      parseInvoiceIssueBody({
        clientId: 7,
        year: 2026,
        month: 8,
        observation: null,
        products: [{ productId: 3, quantity: 2 }],
      })
    ).toEqual({ clientId: 7, year: 2026, month: 8, observation: null, products: [{ productId: 3, quantity: 2 }] })
    expect(
      parseInvoiceIssueBody({
        clientId: 7,
        year: 2026,
        month: 8,
        previousMonthPayment: 0,
        products: [{ productId: 3, quantity: 2 }],
      })
    ).toBeNull()
    expect(
      parseInvoiceIssueBody({
        clientId: '7',
        year: '2026',
        month: '8',
        products: [{ productId: '3', quantity: '2' }],
      })
    ).toBeNull()
    expect(
      parseInvoiceIssueBody({
        clientId: 7,
        year: 2026,
        month: 8,
        products: [
          { productId: 3, quantity: 1 },
          { productId: 3, quantity: 1 },
        ],
      })
    ).toBeNull()
  })
  it('validates list and cancellation contracts', () => {
    expect(parseInvoiceListQuery({ year: '2026', month: '8', clientId: '7', limit: '50' })).toEqual({
      year: 2026,
      month: 8,
      clientId: 7,
      limit: 50,
    })
    expect(parseInvoiceListQuery({ year: ['2026'], month: '8' })).toBeNull()
    expect(parseInvoiceListQuery({ year: '2026', month: '8', unexpected: 'value' })).toBeNull()
    expect(parseInvoiceListQuery({ year: '2026', month: '8', cursor: 'not a cursor' })).toBeNull()
    expect(parseInvoiceCancelBody({ reason: ' correção ' })).toEqual({ reason: 'correção' })
    expect(parseInvoiceCancelBody({ reason: '' })).toBeNull()
    expect(parseInvoiceIDQuery({ id: '9' })).toBe(9)
    expect(parseInvoiceIDQuery({ id: '9', unexpected: 'value' })).toBeNull()
    expect(hasEmptyInvoiceQuery({})).toBe(true)
    expect(hasEmptyInvoiceQuery({ unexpected: 'value' })).toBe(false)
  })
})
