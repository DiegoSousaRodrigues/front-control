const LOCAL_API_CONTROL_BASE_URL = 'http://localhost:3001'

export function getApiControlBaseUrl() {
  const rawBaseUrl = process.env.API_CONTROL_BASE_URL

  if (!rawBaseUrl) {
    return LOCAL_API_CONTROL_BASE_URL
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
