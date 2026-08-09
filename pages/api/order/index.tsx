import { create } from '@/services/order'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  try {
    const response = await create(req.body, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
