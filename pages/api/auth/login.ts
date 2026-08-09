import type { NextApiRequest, NextApiResponse } from 'next'
import { apiControl } from '@/utils/api'
import { handleBackendError } from '@/utils/apiRoute'
import { clearLegacyUserCookie, setSessionCookie } from '@/utils/sessionCookie'
import type { User } from '@/types/login'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await apiControl.post<User>('/auth/login', req.body)
    const { token, user } = response.data

    setSessionCookie(res, token)
    clearLegacyUserCookie(res)

    return res.status(200).json({ user })
  } catch (error) {
    return handleBackendError(error, res)
  }
}
