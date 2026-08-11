import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utils/api', () => ({ apiControl: { get: vi.fn() } }))
vi.mock('@/utils/auth', () => ({ getAuthHeader: vi.fn(() => ({ Authorization: 'Bearer test-token' })) }))

import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'
import { findClientBalance, findClientBalanceV2 } from './report'

describe('report service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('forwards client ID and authentication to the Go API', async () => {
    vi.mocked(apiControl.get).mockResolvedValue({ status: 200, data: { months: [] } })
    await findClientBalance(7, 'test-token')
    expect(getAuthHeader).toHaveBeenCalledWith('test-token')
    expect(apiControl.get).toHaveBeenCalledWith('report/client-balance', {
      headers: { Authorization: 'Bearer test-token' },
      params: { clientId: 7 },
    })
  })

  it('uses the coordinated endpoint for the v2 invoice report contract', async () => {
    vi.mocked(apiControl.get).mockResolvedValue({ status: 200, data: { months: [] } })
    await findClientBalanceV2(9, 'test-token')
    expect(apiControl.get).toHaveBeenCalledWith('report/client-balance', {
      headers: { Authorization: 'Bearer test-token' },
      params: { clientId: 9 },
    })
  })
})
