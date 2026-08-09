import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiControl } from './api'

describe('apiControl logging policy', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not log request or response data', async () => {
    const consoleSpies = [
      vi.spyOn(console, 'debug').mockImplementation(() => undefined),
      vi.spyOn(console, 'error').mockImplementation(() => undefined),
      vi.spyOn(console, 'info').mockImplementation(() => undefined),
      vi.spyOn(console, 'log').mockImplementation(() => undefined),
      vi.spyOn(console, 'warn').mockImplementation(() => undefined),
    ]

    await apiControl.post(
      '/auth/login',
      { login: 'test-login', password: 'test-password' },
      {
        headers: { Authorization: 'Bearer test-token' },
        adapter: async (config) => ({
          config,
          data: { token: 'test-token' },
          headers: {},
          status: 200,
          statusText: 'OK',
        }),
      }
    )

    for (const spy of consoleSpies) {
      expect(spy).not.toHaveBeenCalled()
    }
  })
})
