const TEST_API_CONTROL_BASE_URL = 'http://127.0.0.1:3001'

export function getApiControlBaseUrl() {
  const rawBaseUrl = process.env.API_CONTROL_BASE_URL

  if (!rawBaseUrl) {
    if (process.env.NODE_ENV === 'test') {
      return TEST_API_CONTROL_BASE_URL
    }

    throw new Error('API_CONTROL_BASE_URL is required')
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawBaseUrl)
  } catch {
    throw new Error('API_CONTROL_BASE_URL must be a valid URL')
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('API_CONTROL_BASE_URL must use http or https')
  }

  return parsedUrl.toString().replace(/\/$/, '')
}
