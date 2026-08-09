import type { NextApiRequest, NextApiResponse } from 'next'
import { describe, expect, it, vi } from 'vitest'

import handler from '../pages/api/auth/logout'

function createResponse() {
  const response = {
    getHeader: vi.fn(() => []),
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
    end: vi.fn(),
  }
  response.status.mockReturnValue(response)
  response.json.mockReturnValue(response)
  response.end.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('auth logout API route', () => {
  it('expires the HttpOnly session cookie using the root path', () => {
    const request = { method: 'POST' } as unknown as NextApiRequest
    const response = createResponse()

    handler(request, response)

    const sessionCookie = (vi.mocked(response.setHeader).mock.calls[0][1] as string[])[0]
    const legacyUserCookie = (vi.mocked(response.setHeader).mock.calls[1][1] as string[])[0]
    expect(sessionCookie).toContain('HttpOnly')
    expect(sessionCookie).toContain('SameSite=Lax')
    expect(sessionCookie).toContain('Path=/')
    expect(sessionCookie).toContain('Max-Age=0')
    expect(legacyUserCookie).toContain('Max-Age=0')
    expect(response.status).toHaveBeenCalledWith(204)
    expect(response.end).toHaveBeenCalled()
  })

  it('rejects unsupported methods', () => {
    const request = { method: 'GET' } as unknown as NextApiRequest
    const response = createResponse()

    handler(request, response)

    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['POST'])
    expect(response.status).toHaveBeenCalledWith(405)
  })
})
