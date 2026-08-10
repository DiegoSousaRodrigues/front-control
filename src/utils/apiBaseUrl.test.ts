import { afterEach, describe, expect, it, vi } from 'vitest'
import { getApiControlBaseUrl } from './apiBaseUrl'

describe('getApiControlBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the configured API base URL without trailing slash', () => {
    process.env.API_CONTROL_BASE_URL = 'https://api-control.example.com/'

    expect(getApiControlBaseUrl()).toBe('https://api-control.example.com')
  })

  it('falls back to localhost when API base URL is not configured', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('API_CONTROL_BASE_URL', '')

    expect(getApiControlBaseUrl()).toBe('http://localhost:3001')
  })

  it('rejects non-http protocols', () => {
    process.env.API_CONTROL_BASE_URL = 'ftp://api-control.example.com'

    expect(() => getApiControlBaseUrl()).toThrow('API_CONTROL_BASE_URL must use http or https')
  })
})
