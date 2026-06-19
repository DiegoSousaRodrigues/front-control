export function getAuthHeader(token?: string | null) {
  if (!token) return {}

  return {
    Authorization: token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`,
  }
}
