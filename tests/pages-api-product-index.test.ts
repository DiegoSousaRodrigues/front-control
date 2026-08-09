import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({
  default: vi.fn(),
}))

vi.mock('@/utils/serverAuth', () => ({
  getRequestToken: vi.fn(() => 'test-token'),
}))

import handler from '../pages/api/product'

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

describe('product API route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each(['1', '2'])('forwards PUT for product ID %s to /sku/:id', async (id) => {
    const pipe = vi.fn()
    vi.mocked(axios).mockResolvedValue({ status: 200, data: { pipe } } as never)
    const request = {
      method: 'PUT',
      query: { id },
      headers: { 'content-type': 'multipart/form-data; boundary=test' },
    } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: `http://localhost:3001/sku/${id}`,
        data: request,
      })
    )
    expect(pipe).toHaveBeenCalledWith(response)
  })

  it('keeps product creation on POST /sku', async () => {
    const pipe = vi.fn()
    vi.mocked(axios).mockResolvedValue({ status: 200, data: { pipe } } as never)
    const request = {
      method: 'POST',
      query: {},
      headers: { 'content-type': 'multipart/form-data; boundary=test' },
    } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'http://localhost:3001/sku',
        data: request,
      })
    )
    expect(pipe).toHaveBeenCalledWith(response)
  })

  it.each([undefined, ['2'], '0', '-1', '1.5', 'abc', '9007199254740992'])(
    'rejects invalid product ID %s without calling the Go API',
    async (id) => {
      const request = { method: 'PUT', query: { id }, headers: {} } as unknown as NextApiRequest
      const response = createResponse()

      await handler(request, response)

      expect(axios).not.toHaveBeenCalled()
      expect(response.status).toHaveBeenCalledWith(400)
    }
  )

  it('rejects unsupported methods without calling the Go API', async () => {
    const request = { method: 'DELETE', query: {}, headers: {} } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(axios).not.toHaveBeenCalled()
    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['POST', 'PUT'])
    expect(response.status).toHaveBeenCalledWith(405)
  })
})
