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

  it('rejects missing API base URL outside tests', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('API_CONTROL_BASE_URL', '')

    expect(() => getApiControlBaseUrl()).toThrow('API_CONTROL_BASE_URL is required')
  })

  it('rejects non-http protocols', () => {
    process.env.API_CONTROL_BASE_URL = 'ftp://api-control.example.com'

    expect(() => getApiControlBaseUrl()).toThrow('API_CONTROL_BASE_URL must use http or https')
  })
})
