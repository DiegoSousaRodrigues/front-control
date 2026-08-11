import { beforeEach, describe, expect, it, vi } from 'vitest'
vi.mock('@/utils/api', () => ({ apiControl: { post: vi.fn(), get: vi.fn() } }))
import { apiControl } from '@/utils/api'
import { getPayments, postPayment, postPaymentReversal } from './payment'

describe('payment service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('forwards numeric payment data and auth', () => {
    const body = { clientId: 7, amount: 10.5, effectiveDate: '2026-08-11', observation: null }
    postPayment(body, 'token')
    expect(apiControl.post).toHaveBeenCalledWith('payment', body, { headers: { Authorization: 'Bearer token' } })
  })

  it('forwards all canonical list filters', () => {
    const filters = { clientId: 7, dateFrom: '2026-08-01', dateTo: '2026-08-31', status: 'posted' as const, limit: 50 }
    getPayments(filters, 'token')
    expect(apiControl.get).toHaveBeenCalledWith('payment/list', {
      headers: { Authorization: 'Bearer token' },
      params: filters,
    })
  })

  it('uses the real reversal endpoint', () => {
    postPaymentReversal(9, { reason: 'Lançamento duplicado' }, 'token')
    expect(apiControl.post).toHaveBeenCalledWith(
      'payment/9/reverse',
      { reason: 'Lançamento duplicado' },
      {
        headers: { Authorization: 'Bearer token' },
      }
    )
  })
})
