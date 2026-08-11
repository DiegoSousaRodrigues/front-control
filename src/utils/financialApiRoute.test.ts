import { describe, expect, it, vi } from 'vitest'
import {
  allowMethod,
  hasJSONContentType,
  isSameOriginMutation,
  parsePaymentCreateBody,
  parsePaymentListQuery,
  parseStatementQuery,
} from './financialApiRoute'

describe('financial BFF validation', () => {
  it('accepts only exact same-origin mutations', () => {
    expect(isSameOriginMutation({ headers: { host: 'control.local', origin: 'https://control.local' } } as never)).toBe(
      true
    )
    expect(isSameOriginMutation({ headers: { host: 'control.local', origin: 'https://evil.local' } } as never)).toBe(
      false
    )
    expect(
      isSameOriginMutation({
        headers: { host: 'control.local', 'x-forwarded-host': 'evil.local', origin: 'https://evil.local' },
      } as never)
    ).toBe(false)
    expect(hasJSONContentType({ headers: { 'content-type': 'application/json; charset=utf-8' } } as never)).toBe(true)
    expect(hasJSONContentType({ headers: { 'content-type': 'text/plain' } } as never)).toBe(false)
  })

  it('returns 405 and Allow for unsupported methods', () => {
    const response = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() }
    response.status.mockReturnValue(response)
    expect(allowMethod({ method: 'PUT' } as never, response as never, 'POST')).toBe(false)
    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['POST'])
    expect(response.status).toHaveBeenCalledWith(405)
  })
  it('builds numeric payments and rejects unknown or future data', () => {
    expect(parsePaymentCreateBody({ clientId: 7, amount: 10.5, effectiveDate: '2026-08-11' }, '2026-08-11')).toEqual({
      clientId: 7,
      amount: 10.5,
      effectiveDate: '2026-08-11',
      observation: null,
    })
    expect(
      parsePaymentCreateBody({ clientId: 7, amount: '10.50', effectiveDate: '2026-08-11' }, '2026-08-11')
    ).toBeNull()
    expect(parsePaymentCreateBody({ clientId: 7, amount: 10, effectiveDate: '2026-08-12' }, '2026-08-11')).toBeNull()
    expect(
      parsePaymentCreateBody({ clientId: 7, amount: 10, effectiveDate: '2026-08-11', balance: 0 }, '2026-08-11')
    ).toBeNull()
  })
  it('validates list filters and ordered dates', () => {
    expect(
      parsePaymentListQuery({
        clientId: '7',
        dateFrom: '2026-08-01',
        dateTo: '2026-08-31',
        status: 'posted',
        limit: '50',
      })
    ).toEqual({ clientId: 7, dateFrom: '2026-08-01', dateTo: '2026-08-31', status: 'posted', limit: 50 })
    expect(parsePaymentListQuery({ dateFrom: '2026-09-01', dateTo: '2026-08-31' })).toBeNull()
    expect(parsePaymentListQuery({ status: ['posted'] })).toBeNull()
    expect(parsePaymentListQuery({ cursor: 'not a cursor' })).toBeNull()
    expect(parsePaymentListQuery({ unexpected: 'value' })).toBeNull()
  })
  it('binds statement pagination to a valid client', () => {
    expect(parseStatementQuery({ id: '7', cursor: 'opaque', limit: '50', dateTo: '2026-08-11' })).toEqual({
      id: 7,
      filters: { cursor: 'opaque', limit: 50, dateTo: '2026-08-11' },
    })
    expect(parseStatementQuery({ id: '0' })).toBeNull()
    expect(parseStatementQuery({ id: '7', cursor: 'not a cursor' })).toBeNull()
    expect(parseStatementQuery({ id: '7', unexpected: 'value' })).toBeNull()
  })
})
