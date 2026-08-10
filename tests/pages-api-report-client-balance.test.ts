import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/report', () => ({ findClientBalance: vi.fn() }))
vi.mock('@/utils/serverAuth', () => ({ getRequestToken: vi.fn() }))

import handler from '../pages/api/report/client-balance'
import { findClientBalance } from '@/services/report'
import { getRequestToken } from '@/utils/serverAuth'

function createResponse() {
  const response = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() }
  response.status.mockReturnValue(response)
  response.json.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('client balance report BFF', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getRequestToken).mockReturnValue('test-token')
    vi.mocked(findClientBalance).mockResolvedValue({ status: 200, data: { months: [] } } as never)
  })

  it('forwards a validated client ID and the session token', async () => {
    const request = { method: 'GET', query: { clientId: '7' } } as unknown as NextApiRequest
    const response = createResponse()
    await handler(request, response)
    expect(findClientBalance).toHaveBeenCalledWith(7, 'test-token')
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ months: [] })
  })

  it.each([undefined, ['7'], '0', '-1', '1.5', 'client', '9007199254740992'])(
    'rejects invalid client ID %s before calling the service',
    async (clientId) => {
      const request = { method: 'GET', query: { clientId } } as unknown as NextApiRequest
      const response = createResponse()
      await handler(request, response)
      expect(findClientBalance).not.toHaveBeenCalled()
      expect(response.status).toHaveBeenCalledWith(400)
    }
  )

  it('rejects requests without authentication', async () => {
    vi.mocked(getRequestToken).mockReturnValue(undefined)
    const request = { method: 'GET', query: { clientId: '7' } } as unknown as NextApiRequest
    const response = createResponse()
    await handler(request, response)
    expect(findClientBalance).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(401)
  })

  it('rejects unsupported methods with an Allow header', async () => {
    const request = { method: 'POST', query: { clientId: '7' } } as unknown as NextApiRequest
    const response = createResponse()
    await handler(request, response)
    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['GET'])
    expect(response.status).toHaveBeenCalledWith(405)
    expect(findClientBalance).not.toHaveBeenCalled()
  })
})
