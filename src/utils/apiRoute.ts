import { AxiosError } from 'axios'
import { NextApiResponse } from 'next'

export function rejectWithoutToken(res: NextApiResponse, token?: string) {
  if (token) return false

  res.status(401).json({ error: 'Missing control-token cookie' })
  return true
}

export function handleBackendError(error: unknown, res: NextApiResponse) {
  const axiosError = error as AxiosError
  if (axiosError.response) {
    res.status(axiosError.response.status).json(axiosError.response.data)
    return
  }

  res.status(500).json({ error: 'Error connecting to backend' })
}
