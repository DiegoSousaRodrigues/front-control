import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/client', () => ({
  create: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/utils/serverAuth', () => ({
  getRequestToken: vi.fn(() => 'test-token'),
}))

import { update } from '@/services/client'
import handler from '../pages/api/client'

function createResponse() {
  const response = {
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  }
  response.status.mockReturnValue(response)
  response.json.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('client update API route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(update).mockResolvedValue({ data: { updated: true } } as never)
  })

  it.each(['1', '2'])('forwards client ID %s to the Go API service', async (id) => {
    const body = { name: `Client ${id}` }
    const request = { method: 'PUT', query: { id }, body } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(update).toHaveBeenCalledWith(body, id, 'test-token')
    expect(response.status).toHaveBeenCalledWith(200)
  })

  it.each([undefined, ['2'], '0', '-1', '1.5', 'abc', '9007199254740992'])(
    'rejects invalid client ID %s without calling the service',
    async (id) => {
      const request = { method: 'PUT', query: { id }, body: {} } as unknown as NextApiRequest
      const response = createResponse()

      await handler(request, response)

      expect(update).not.toHaveBeenCalled()
      expect(response.status).toHaveBeenCalledWith(400)
    }
  )
})
