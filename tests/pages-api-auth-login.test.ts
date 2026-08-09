import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utils/api', () => ({
  apiControl: {
    post: vi.fn(),
  },
}))

import handler from '../pages/api/auth/login'
import { apiControl } from '@/utils/api'

function createResponse() {
  const response = {
    getHeader: vi.fn(() => []),
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  }
  response.status.mockReturnValue(response)
  response.json.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('auth login API route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.mocked(apiControl.post).mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: 1, name: 'Test User', login: 'test' },
      },
    })
  })

  it('authenticates through the Go API and sets an HttpOnly same-site session cookie', async () => {
    const body = { login: 'test', password: 'secret' }
    const request = { method: 'POST', body } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(apiControl.post).toHaveBeenCalledWith('/auth/login', body)
    const sessionCookie = (vi.mocked(response.setHeader).mock.calls[0][1] as string[])[0]
    const legacyUserCookie = (vi.mocked(response.setHeader).mock.calls[1][1] as string[])[0]
    expect(sessionCookie).toContain('control-token=test-token')
    expect(sessionCookie).toContain('HttpOnly')
    expect(sessionCookie).toContain('SameSite=Lax')
    expect(sessionCookie).toContain('Path=/')
    expect(sessionCookie).toContain('Max-Age=86400')
    expect(legacyUserCookie).toContain('Max-Age=0')
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ user: { id: 1, name: 'Test User', login: 'test' } })
  })

  it('sets Secure on the session cookie in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const request = { method: 'POST', body: {} } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    const cookie = (vi.mocked(response.setHeader).mock.calls[0][1] as string[])[0]
    expect(cookie).toContain('Secure')
  })

  it('rejects unsupported methods', async () => {
    const request = { method: 'GET', body: {} } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(apiControl.post).not.toHaveBeenCalled()
    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['POST'])
    expect(response.status).toHaveBeenCalledWith(405)
  })
})
