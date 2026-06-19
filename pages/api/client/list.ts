import { findAll } from '@/services/client'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = getRequestToken(req)
    if (rejectWithoutToken(res, token)) return

    try {
      const response = await findAll(token)
      res.status(200).json(response.data)
    } catch (error) {
      handleBackendError(error, res)
    }
  }
}
