import { describe, expect, it, vi } from 'vitest'
vi.mock('@/utils/api', () => ({ apiControl: { get: vi.fn() } }))
import { apiControl } from '@/utils/api'
import { getAccountStatement, getAccountSummary } from './account'

describe('account service', () => {
  it('forwards account summary client ID', () => {
    getAccountSummary(7, 'token')
    expect(apiControl.get).toHaveBeenCalledWith('client/7/account', { headers: { Authorization: 'Bearer token' } })
  })

  it('forwards statement pagination unchanged', () => {
    const filters = { cursor: 'opaque', limit: 50, dateTo: '2026-08-11' }
    getAccountStatement(7, filters, 'token')
    expect(apiControl.get).toHaveBeenCalledWith('client/7/account/statement', {
      headers: { Authorization: 'Bearer token' },
      params: filters,
    })
  })
})
