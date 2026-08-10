import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/order', () => ({ findAll: vi.fn(), findOpenBalance: vi.fn() }))
vi.mock('@/utils/serverAuth', () => ({ getRequestToken: vi.fn(() => 'test-token') }))

import listHandler from '../pages/api/order/list'
import balanceHandler from '../pages/api/order/open-balance'
import { findAll, findOpenBalance } from '@/services/order'

function createResponse() {
  const response = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() }
  response.status.mockReturnValue(response)
  response.json.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('monthly order BFF routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(findAll).mockResolvedValue({ status: 200, data: [] } as never)
    vi.mocked(findOpenBalance).mockResolvedValue({ status: 200, data: { balance: 25 } } as never)
  })

  it('forwards the validated order list period', async () => {
    const request = { method: 'GET', query: { year: '2026', month: '7' } } as unknown as NextApiRequest
    const response = createResponse()
    await listHandler(request, response)
    expect(findAll).toHaveBeenCalledWith(2026, 7, 'test-token')
    expect(response.status).toHaveBeenCalledWith(200)
  })

  it('forwards client and period to open balance', async () => {
    const request = { method: 'GET', query: { clientId: '9', year: '2026', month: '7' } } as unknown as NextApiRequest
    const response = createResponse()
    await balanceHandler(request, response)
    expect(findOpenBalance).toHaveBeenCalledWith(9, 2026, 7, 'test-token')
    expect(response.json).toHaveBeenCalledWith({ balance: 25 })
  })

  it.each([
    [{ year: '2026', month: '13' }, listHandler, findAll],
    [{ year: '9999', month: '1' }, listHandler, findAll],
    [{ clientId: '0', year: '2026', month: '7' }, balanceHandler, findOpenBalance],
    [{ clientId: '9', year: '2026', month: '13' }, balanceHandler, findOpenBalance],
  ])('rejects invalid params %#', async (query, handler, service) => {
    const request = { method: 'GET', query } as unknown as NextApiRequest
    const response = createResponse()
    await handler(request, response)
    expect(service).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
  })

  it('rejects unsupported balance methods', async () => {
    const request = { method: 'POST', query: {} } as unknown as NextApiRequest
    const response = createResponse()
    await balanceHandler(request, response)
    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['GET'])
    expect(response.status).toHaveBeenCalledWith(405)
  })
})
