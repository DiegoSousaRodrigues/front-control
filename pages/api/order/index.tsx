import { create } from '@/services/order'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = getRequestToken(req)
    if (rejectWithoutToken(res, token)) return
    const data = req.body

    try {
      const response = await create(data, token)
      res.status(200).json(response.data)
    } catch (error) {
      handleBackendError(error, res)
    }
  }
}
