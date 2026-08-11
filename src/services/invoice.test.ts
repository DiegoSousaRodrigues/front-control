import { beforeEach, describe, expect, it, vi } from 'vitest'
vi.mock('@/utils/api', () => ({ apiControl: { post: vi.fn(), get: vi.fn() } }))
import { apiControl } from '@/utils/api'
import { getInvoices, postInvoice, postInvoiceCancellation } from './invoice'

describe('invoice service', () => {
  beforeEach(() => vi.clearAllMocks())
  it('forwards numeric issue contract without legacy payment fields', () => {
    const body = { clientId: 7, year: 2026, month: 8, observation: null, products: [{ productId: 3, quantity: 2 }] }
    postInvoice(body, 'token')
    expect(apiControl.post).toHaveBeenCalledWith('invoice', body, { headers: { Authorization: 'Bearer token' } })
  })
  it('forwards list pagination and cancellation', () => {
    getInvoices({ year: 2026, month: 8, clientId: 7, cursor: 'opaque', limit: 50 }, 'token')
    expect(apiControl.get).toHaveBeenCalledWith('invoice/list', {
      headers: { Authorization: 'Bearer token' },
      params: { year: 2026, month: 8, clientId: 7, cursor: 'opaque', limit: 50 },
    })
    postInvoiceCancellation(9, { reason: 'Correção' }, 'token')
    expect(apiControl.post).toHaveBeenCalledWith(
      'invoice/9/cancel',
      { reason: 'Correção' },
      { headers: { Authorization: 'Bearer token' } }
    )
  })
})
